<template>
    <qt-view class="search_result_new" ref="search_result_new" :clipChildren="false" @childFocus="childFocus"
      :listenHasFocusChange="true" :descendantFocusability="descendantFocusability"
      :triggerTask="triggerTask" :nextFocusName="{ left: 'search_center_view_content_list' }">
  
      <!-- 顶部导航分类 -->
      <qt-list-view class="tablist_view" ref='nav_list_view' :list-data="tablistData" horizontal name="searchTabs">
        <qt-view class="tv_item" :type="2" :clipChildren="false" :focusable="true" eventFocus autoWidth  ref="tv_item">
          <qt-text autoWidth gravity="center" :lines="1" :fontSize="36" :focusable="false"
            class="tv_item_text" :duplicateParentState="true" text="${title}" />
        </qt-view>
      </qt-list-view>
  
      <!-- 搜索内容 -->
      <qt-grid-view class="content_view" ref='content_view' :list-data="contentlistData" name="content_view"
        :spanCount="4" :padding="'50,0,90,10'" :skipRequestFocus="true" :resetOnDetach="true">
  
        <!-- type 多级tab -->
        <qt-list-view ref="second_tab_list" name="second_tab_list" class="second_tab_list" :type="1001"
          :endHintEnabled="false" horizontal :clipChildren="false" :useDiff="true" :enableSelectOnFocus="false"
          :focusMemory="false"  :blockFocusDirections="['right']">
          <!-- 多级tab item type 10011 -->
          <qt-view class="srl_item" :type="10011" :clipChildren="false" :focusable="true" eventFocus autoWidth  ref="srl_item">
            <qt-text autoWidth gravity="center" :lines="1" :fontSize="30" :focusable="false"
              class="srl_item_text" :duplicateParentState="true" text="${title}" />
          </qt-view>    
        </qt-list-view>
  
        <!-- content_item type 10012  ps 暂时数据处理 type 20-->
        <qt-view :type="20" class="sr_item" name="sr_item" :clipChildren="false" :focusable="true"
          eventClick eventFocus :enableFocusBorder="true" layout="${layout}" >
          <div class="sr_item_img" :focusable="false" :enableFocusBorder="true">
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
  import { computed, defineComponent } from "@vue/runtime-core"
  import { ref, watch } from "vue"
  import { qtRef, QTListViewItem } from "@quicktvui/quicktvui3"
  import { useGlobalApi } from "../../../api/UseApi"
  import SearchConfig from "../build_data/SearchConfig"
  import { useLaunch } from "../../../tools/launch/useApi"
  
  export default defineComponent({
    name: "search_result_new",
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
    emits: ["scroll-to-index", "close-loading", "close-self-loading"],
    setup(props, context) {
      const isShowCenterSearch = computed(() => SearchConfig.isShowCenterSearch)
      const appApi = useGlobalApi()
      const search_result_new = ref()
      let descendantFocusability = ref(1)
      let showKeyword = ref("")
      let delaySearchByKeyword: any = -1
      let closeLoadingTimer: any = -1
      let triggerTask = [
        {
          event: "onFocusLost",
          target: "search_scroll_view",
          function: "scrollToWithOptions",
          params: [{
            x: SearchConfig.isShowCenterSearch ? (SearchConfig.leftWidth + SearchConfig.centerWidth) * -1 : SearchConfig.leftWidth * -1,
            y: 0,
            duration: 300
          }]
        },
        {
          event: "onFocusAcquired",
          target: "search_scroll_view",
          function: "scrollToWithOptions",
          params: [{
            x: SearchConfig.isShowCenterSearch ? (SearchConfig.leftWidth + SearchConfig.centerWidth) : SearchConfig.leftWidth,
            y: 0,
            duration: 300
          }]
        }
      ]
      let isRecommendRequest = false
      let tabList: Array<QTListViewItem> = []
      let tablistData = qtRef<QTListViewItem[]>()
      let contentlistData = qtRef<QTListViewItem[]>()
  
      const initTab = async (isRecommend: boolean) => {
        isRecommendRequest = isRecommend
        tabList = await appApi.getSearchResultTabList(isRecommend)
        tablistData.value! = tabList
        setTimeout(() => {
          loadContentData()
        },300)
        context.emit("close-self-loading")
      }
  
      const loadContentData = async () => {
        let arr: any
        if (isRecommendRequest) {
          arr = await appApi.getRecommendPageData(tabList[0]._id!, 1, SearchConfig.searchResultPageSize, tabList.length == 1)
        } else {
          arr = await appApi.getSearchResultPageData(tabList[0]._id!, 1, SearchConfig.searchResultPageSize, tabList.length == 1)
        }
        console.log(arr,'123132132132132132132')
        contentlistData.value = arr.data[0].itemList
      }
  
      watch(() => props.keyword, (newVal, oldVal) => {
        if (newVal) {
          isRecommendRequest = false
        } else {
          isRecommendRequest = true
        }
        if (delaySearchByKeyword) clearTimeout(delaySearchByKeyword)
        descendantFocusability.value = 2
        delaySearchByKeyword = setTimeout(() => {
          initTab(isRecommendRequest)
          if (closeLoadingTimer) clearTimeout(closeLoadingTimer)
          closeLoadingTimer = setTimeout(() => {
            descendantFocusability.value = 1
          }, 1000)
        }, 600)
      })
  
     
      const childFocus = (e) => {
        if (e.child) {
          context.emit("scroll-to-index", 2, 100)
        }
      }
      return {
        search_result_new,tablistData,contentlistData,loadContentData,
        descendantFocusability,
        showKeyword,
        isShowCenterSearch,
        childFocus,
        triggerTask,
      }
    }
  })
  </script>
  <style src="../css/search-result-new.css"></style>
  