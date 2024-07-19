<template>
  <qt-view class="search_result" ref="search_result" :clipChildren="false" @childFocus="childFocus"
           :listenHasFocusChange="true" :descendantFocusability="descendantFocusability"
           :triggerTask="triggerTask"
           :nextFocusName="{ left: 'search_center_view_content_list' }">

    <qt-view class="search_result_title_root_top" :focusable="false" name="search_result_title_name"
             v-show="(keyword || recommendTitle) && isShowTopTip">
      <qt-image :visible="showIsFullScreen" :src="ic_search_left_arrow" class="ic_search_left_arrow"
                :focusable="false" />
      <span class="search_result_view_title_result" v-if="keyword"
            :focusable="false">{{ `全部&nbsp;“${keyword}”&nbsp;结果 ` }}</span>
      <span class="search_result_view_title_result" v-else-if="recommendTitle"
            :focusable="false">{{ recommendTitle }}</span>
    </qt-view>

    <qt-tabs ref="tabRef" :tabContentBlockFocusDirections="tabContentBlockFocusDirections"
             tabNavBarClass="qt_tabs_waterfall_tab_css" tabPageClass="qt_tabs_waterfall_css"
             :tabContentResumeDelay="200"
             :focusMemory="true"
             name="searchTabs"
             dataStrategy="always" :autoHandleBackKey="autoHandleBackKey"
             :qt-tab-section-enable="qtTabSectionEnable"
             :tabContentSwitchDelay="200"
             singleContent
             :custom-pool="{ name: 'search' }"
             :custom-item-pool="{ name: 'search_items' }"
             :contentNextFocus="{ left: isShowCenterSearch ? 'search_center_view_list' : 'grid_view', up: 'tabList' }"
             :blockViewPager="['down', 'right']"
             :outOfDateTime="2 * 60 * 1000" @onTabClick="onTabClick" @onTabPageChanged="onTabPageChanged"
             @onTabMoveToTopStart="onTabMoveToTopStart" @onTabMoveToTopEnd="onTabMoveToTopEnd"
             @onTabMoveToBottomStart="onTabMoveToBottomStart"
             @onTabMoveToBottomEnd="onTabMoveToBottomEnd"
             @onTabPageScrollToEnd="onTabPageScrollToEnd"
             @onTabPageScrollToStart="onTabPageScrollToStart"
             @onTabPageItemClick="onTabPageItemClick" @onTabPageItemFocused="onTabPageItemFocused"
             @onTabPageLoadData="onTabPageLoadData" @onTabPageScroll="onTabPageScroll"
             :enablePlaceholder="true"
             @onTabPageSectionAttached="onTabPageSectionAttached" class="qt_tabs_css">
      <template v-slot:tab-item>
        <!-- 自定义tab类型 -->
        <qt-view class="waterfall_nav_item"
                 :type="2" :clipChildren="false"
                 :focusable="true"
                 eventFocus
                 autoWidth
                 ref="waterfall_nav_item_text">
          <qt-text autoWidth gravity="center" :lines="1" :fontSize="36" :focusable="false"
                   class="waterfall_nav_item_text" :duplicateParentState="true" text="${text}" />
        </qt-view>
      </template>
      <template v-slot:waterfall-vue-section>
        <search-result-grid-section ref="gridSectionRef" @onGridSectionScroll="onGridSectionScroll" />
      </template>
      <template v-slot:waterfall-item>
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
      </template>
    </qt-tabs>

    <!-- empty_view 空 提示-->
    <qt-view class="empty_view" v-if="isHasData">
      <qt-image :src="ic_data_empty" class="empty_view_image" />
      <qt-text class="empty_view_text" text="没有更多内容了" :ellipsizeMode="2" gravity="center"
               :fontSize="30" />
    </qt-view>

  </qt-view>
</template>

<script lang="ts">
import { computed, defineComponent, toDisplayString } from "@vue/runtime-core"
import { ref, watch } from "vue"
import {
  QTITab, QTTabEventParams, QTTabItem, QTTabPageData, QTTabPageState, QTWaterfallItem,QTWaterfallSection,
  QTWaterfallSectionType
} from "@quicktvui/quicktvui3"
import { useESLog, useESToast } from "@extscreen/es3-core"
import { useGlobalApi } from "../../../api/UseApi"
import SearchConfig from "../build_data/SearchConfig"
import { useLaunch } from "../../../tools/launch/useApi"
import searchResultGridSection from "./search-result-grid-section.vue";
  import { GridSection } from "../build_data/impl/SearchResult"

export default defineComponent({
  name: "search_result",
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
  components: {searchResultGridSection},
  emits: ["scroll-to-index", "close-loading", "close-self-loading"],
  setup(props, context) {
    const isShowCenterSearch = computed(() => SearchConfig.isShowCenterSearch)
    const appApi = useGlobalApi()
    const log = useESLog()
    const toast = useESToast()
    const search_result = ref()
    let descendantFocusability = ref(1)
    const ic_search_left_arrow = require("../../../assets/search/ic_search_left_arrow.png").default
    const ic_data_empty = require("../../../assets/search/ic_data_empty.png").default
    let showKeyword = ref("")
    let isShowTopTip = ref(true)
    let isHasData = ref(false)
    let recommendTitle = ref("大家都在搜")
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
    const qtTabSectionEnable = {
      flexSectionEnable:true,
      flexSection:{
        qtPosterEnable:false,
        qtPluginItemEnable:false,
        cardItemEnable:false,
      },
      listSectionEnable:true,
      listSectionItem:{
        qtPosterEnable:false
      },
      loadingSectionEnable:true,
      endSectionEnable:true,
      blankSectionEnable:false,
      cardSectionEnable:false,
      pluginSectionEnable:false,
      vueSectionEnable:true
    }
    let autoHandleBackKey = ref(true)
    let gridSectionIsScroll = ref(0)
    //tab
    let tabList: Array<QTTabItem> = []
    const tabRef = ref<QTITab>()
    const tabContentBlockFocusDirections = ref(["down", "right"])
    const launch = useLaunch()
    let isRecommendRequest = false
    const gridSectionRef = ref()
    const cancelAll = () => {
      tabRef!.value!.cancelAll()
    }

    const initTab = async (isRecommend: boolean) => {
      isRecommendRequest = isRecommend
      tabList = await appApi.getSearchResultTabList(isRecommend)
      tabRef.value?.initTab({ defaultIndex: 0, defaultFocusIndex: -1, itemList: tabList })
      tabRef.value?.initPage({ width: 1920, height: 984 })
    }

    watch(() => props.keyword, (newVal, oldVal) => {
      if (newVal) {
        isRecommendRequest = false
        recommendTitle.value = ""
      } else {
        isRecommendRequest = true
        recommendTitle.value = "大家都在搜"
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

    // qt-tabs 填充数据 回调
    const onTabPageLoadData = (pageIndex: number, pageNo: number, useDiff: boolean) => {
      if (tabList && pageIndex >= 0 && pageIndex < tabList.length) {
        const tabItem = tabList[pageIndex]
        if (tabItem._id !== null && tabItem._id !== undefined) {
          dealData(pageIndex, pageNo, useDiff)
        }
      } else {
        if (isShowCenterSearch.value) {
          context.emit("close-self-loading")
        } else {
          context.emit("close-loading")
        }
      }
    }

    const dealData = (pageIndex: number, pageNo: number, useDiff: boolean) => {
      if(pageNo < 1){
        let section: QTWaterfallSection = {
          _id: 'vuesection1007'+pageIndex,
          type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_VUE,
          decoration: {top: 220, left: 0},
          style: {
            width: 1920,
            height: 860,
          },
          itemList: []
        }
        // let section1: QTWaterfallSection = {
        //   _id: 'vuesection10071'+pageIndex,
        //   type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_VUE,
        //   decoration: {top: 0, left: 0},
        //   style: {
        //     width: 1920,
        //     height: 860,
        //   },
        //   itemList: []
        // }
        let tabPage: QTTabPageData = {
          useDiff: false,
          data: [section]
        }
        tabRef.value?.addPageData(pageIndex, tabPage, 0)
        let params:GridSection = {
          pageIndex: pageIndex,
          tabItemId: tabList[pageIndex]._id??'',
          isRecommendRequest: isRecommendRequest,
          tabListLength: tabList.length,
          isShowCenterSearch: isShowCenterSearch.value
        }
        setTimeout(() => {
          gridSectionRef.value!.initComponent(params)
        },300)
      }
      if (isShowCenterSearch.value) {
        context.emit("close-self-loading")
      } else {
        context.emit("close-loading")
      }
    }
    // gridsection 相关事件
    const onGridSectionScroll = (pageIndex, isScroll) => {
      gridSectionIsScroll.value = isScroll
      if(isScroll > 0){
        autoHandleBackKey.value = false
      }
      else {
        autoHandleBackKey.value = true
      }
      // toast.showToast(autoHandleBackKey.value+''+isScroll)
    }
    const gridSectionScrollToTop = () => {
      autoHandleBackKey.value = true
      gridSectionIsScroll.value = 0
      gridSectionRef.value.scrllToTop()
    }
    const onTabClick = () => {}
    const onTabPageChanged = (pageIndex: number, data: any) => {}
    const onTabMoveToTopStart = (pageIndex: number, eventName: string, params: QTTabEventParams) => { // 吸顶开始
      isShowTopTip.value = false
    }
    const onTabMoveToTopEnd = (pageIndex: number, eventName: string, params: QTTabEventParams) => { // 吸顶结束
    }
    const onTabMoveToBottomStart = (pageIndex: number, eventName: string, params: QTTabEventParams) => { //恢复吸顶开始

    }
    const onTabMoveToBottomEnd = (pageIndex: number, eventName: string, params: QTTabEventParams) => { //恢复吸顶结束
      isShowTopTip.value = true
    }
    const onTabPageScrollToEnd = (pageIndex: number) => {}
    const onTabPageScrollToStart = (pageIndex: number) => {}
    const onTabPageItemClick = (pageIndex: number, sectionIndex: number, itemIndex: number, item: QTWaterfallItem) => {
      const { actionRedirect } = item.item
      const mItem = { item: { ...actionRedirect } }
      launch.launch(mItem)
    }
    const onTabPageItemFocused = (pageIndex: number, sectionIndex: number, itemIndex: number, isFocused: boolean, item: QTWaterfallItem) => {
      console.log(pageIndex,sectionIndex,itemIndex,isFocused,item,'onTabPageItemFocusedonTabPageItemFocusedonTabPageItemFocused')
    }
    const onTabPageScroll = () => {}
    const onTabPageSectionAttached = (pageIndex: number, sectionList: any) => {}
    const childFocus = (e) => {
      if (e.child) context.emit("scroll-to-index", 2, 100)
    }
    return {
      cancelAll,
      gridSectionRef,autoHandleBackKey,gridSectionIsScroll,
      onGridSectionScroll,gridSectionScrollToTop,
      search_result,
      descendantFocusability,
      showKeyword,
      ic_search_left_arrow,
      ic_data_empty,
      isHasData,
      isShowTopTip,
      tabRef,
      tabContentBlockFocusDirections,
      isShowCenterSearch,
      recommendTitle,
      qtTabSectionEnable,
      childFocus,
      triggerTask,
      onTabClick,
      onTabPageChanged,
      onTabMoveToTopStart,
      onTabMoveToTopEnd,
      onTabMoveToBottomStart,
      onTabMoveToBottomEnd,
      onTabPageScrollToEnd,
      onTabPageScrollToStart,
      onTabPageItemClick,
      onTabPageItemFocused,
      onTabPageLoadData,
      onTabPageScroll,
      onTabPageSectionAttached,
      initTab
    }
  }
})
</script>
<style src="../css/search-result-new.css"></style>
