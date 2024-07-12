<template>
  <qt-view class="search_result_grid_section" flexStyle="{style}" :clipChildren="true">
    <qt-list-view ref="srgs_list" name="srgs_list" class="srgs_list" :focusable="false" :singleSelectPosition="singleSelectListPosition"
      :endHintEnabled="false" horizontal :clipChildren="false" :useDiff="true" :enableSelectOnFocus="false"
      @item-focused="onTabChange" :nextFocusName="{ left: isShowCenterSearch ? 'search_center_view_list' : 'grid_view'}"
      :focusMemory="true" :skipRequestFocus="true" :blockFocusDirections="['right']" :list-data="listData">
      <qt-view class="srgsl_item" :type="10011" :clipChildren="false" :focusable="true" eventFocus eventClick ref="srgsl_item">
        <qt-text autoWidth gravity="center" :lines="1" :fontSize="30" :focusable="false" 
          class="srgsl_item_text" :duplicateParentState="true" text="${title}" />
      </qt-view>    
    </qt-list-view>
    
    <!-- 搜索内容 -->
    <qt-grid-view class="content_view" ref='content_view' :list-data="contentlistData" name="content_view"
      :spanCount="spanCount" :padding="'50,30,90,10'" :skipRequestFocus="true" :resetOnDetach="true" :focusable="false"
      :loadMore="loadMore" :listenBoundEvent="true" :openPage="true" @item-focused="onItemFocus"
      :nextFocusName="{ left: isShowCenterSearch ? 'search_center_view_list' : 'grid_view'}">
      <!-- content_item type 10012  ps 暂时数据处理 type 20 :placeholderLayout="[0,0,396,222]"-->
      <qt-view :type="20" class="sr_item" name="sr_item" :clipChildren="false" :focusable="true"
        eventClick eventFocus  :focusScale="1"  :enableFocusBorder="false">
        <div class="sr_item_img" :focusable="false" :enableFocusBorder="true" :duplicateParentState="true">
          <img src="${poster}" :focusable="false" class="sr_item_img" :postDelay="300">
        </div>
        <qt-text gravity="left|centerVertical" :lines="1" :maxLines="2" :fontSize="24" :focusable="false"
          class="sr_item_title" :duplicateParentState="true" text="${title}" autoHeight :ellipsizeMode="2"/>
        <qt-text gravity="left|centerVertical" :lines="1" :maxLines="1" :fontSize="18" :focusable="false"
          class="sr_item_text" :duplicateParentState="true" text="2022年终盘点" autoHeight :ellipsizeMode="2"/>
        <qt-view :duplicateParentState="true" class="sr_item_end_box">
          <div class="sr_item_end_box_l_box" autoWidth>
            <qt-text gravity="center" :lines="1" :maxLines="1" :fontSize="16" :focusable="false"
              class="sr_item_end_box_l" :duplicateParentState="true" text="1千收藏" autoWidth :ellipsizeMode="2"/>
          </div>
          <qt-text gravity="center" :lines="1" :maxLines="1" :fontSize="18" :focusable="false"
            class="sr_item_end_box_r" :duplicateParentState="true" text="| 全8集" autoWidth :ellipsizeMode="2"/>
        </qt-view>
      </qt-view>
    </qt-grid-view>
  </qt-view>
</template>
  
  <script lang="ts">
  import { computed, defineComponent, toDisplayString } from "@vue/runtime-core"
  import { ref, watch} from "vue"
  import { ESLogLevel, useESDevice, useESLog, useESToast } from '@extscreen/es3-core'
  import { QTIGridView, QTIListView, qtRef, QTListViewItem, QTTabPageData } from "@quicktvui/quicktvui3"
  import { useGlobalApi } from "../../../api/UseApi"
  import { GridSection } from "../build_data/impl/SearchResult"

  
  export default defineComponent({
    name: "search-result-grid-section",
    props: {
      keyword: {
        type: String,
        default: ""
      },
      showIsFullScreen: {
        type: Boolean,
        default: false
      }
    },
    emits: ["onGridSectionScroll"],
    setup(props, context) {
      const content_view = ref<QTIGridView>()
      const toast = useESToast()
      const appApi = useGlobalApi()
      let singleSelectListPosition = ref(0)
      let listData = qtRef<QTListViewItem[]>()
      let contentlistData = qtRef<QTListViewItem[]>()
      const srgs_list = ref<QTIListView>()
      let currentNavIndex = ref(0)
      let myParams: GridSection
      let isShowCenterSearch = ref(false)
      let spanCount = ref(4)
      const initComponent = (params: GridSection) => {
        myParams = params
        isShowCenterSearch.value = params.isShowCenterSearch
        singleSelectListPosition.value = 0
        listData.value = [
          {type: 10011,title: '默认排序', decoration: {left: 70}},
          {type: 10011,title: '新发布', decoration: {}},
          {type: 10011,title: '播放多', decoration: {}},
        ]
        getData(params,1)
      }
      const getData = async (params: GridSection, pageNo: number) => {
        let tabPage:QTTabPageData
        if (params.isRecommendRequest) {
          tabPage = await appApi.getRecommendPageData(params.tabItemId, pageNo, 16, params.tabListLength === 1)
        } else {
          tabPage = await appApi.getSearchResultPageData(params.tabItemId, pageNo, 16, params.tabListLength === 1)
        }
        if(tabPage.data[0].itemList.length > 0){
          if(pageNo > 1) {
            contentlistData.value = contentlistData.value.concat(tabPage.data[0].itemList)
          }else{
            contentlistData.value = tabPage.data[0].itemList
          }
        }else{
          content_view.value!.stopPage(true)
        }
      }
      const onTabChange = (e) => {
        if(e.hasFocus) {
          if(e.position != singleSelectListPosition.value){
            singleSelectListPosition.value = e.position
            getData(myParams,1)
          }
        }
      }
      const loadMore = (num) => {
        getData(myParams,num)
      }
      const onItemFocus = (e) => {
        if(e.hasFocus){
          if(e.position < spanCount.value) context.emit('onGridSectionScroll',myParams.pageIndex,0)
          else context.emit('onGridSectionScroll',myParams.pageIndex,1)
        }
      }
      const scrllToTop = () => {
        content_view.value?.scrollToTop()
        content_view.value?.setItemSelected(0, true)
        srgs_list.value?.setItemFocused(singleSelectListPosition.value)
      }
      return {
        listData, srgs_list,contentlistData, singleSelectListPosition,content_view,isShowCenterSearch,
        spanCount,
        initComponent,onTabChange,loadMore,onItemFocus,scrllToTop
      }
    }
  })
  </script>
<style>
.search_result_grid_section{
  width: 1920px;
  background-color: transparent;
}
.srgs_list{
  width: 1920px;
  height: 50px;
  background-color: transparent;
}
.srgsl_item{
  height: 50px;
  padding-left: 20px;
  padding-right: 20px;
  focus-background-color: #157AFC;
  background-color: transparent;
  border-radius: 30px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.srgsl_item_text{
  height: 50px;
  color: rgba(255,255,255,0.7);
  select-color:#FF4e46;
  focus-color:white;
}
</style>
  