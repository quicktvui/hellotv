<template>
  <qt-view class="search_result" ref="search_result" :clipChildren="false" @childFocus="childFocus"
    :listenHasFocusChange="true" :descendantFocusability="descendantFocusability" :triggerTask="triggerTask"
    :nextFocusName="{ left: 'search_center_view_content_list' }">

    <qt-view class="search_result_title_root_top" :focusable="false" name="search_result_title_name"
      v-show="(keyword || recommendTitle === '热门推荐') && isShowTopTip">
      <qt-image :visible="showIsFullScreen" :src="ic_search_left_arrow" class="ic_search_left_arrow"
        :focusable="false" />
      <span class="search_result_view_title_result" v-if="keyword" :focusable="false">{{ `全部&nbsp;“${keyword}”&nbsp;结果
        `}}</span>
      <span class="search_result_view_title_result" v-else-if="recommendTitle" :focusable="false">{{ recommendTitle
        }}</span>
    </qt-view>

    <qt-tabs ref="tabRef" :tabContentBlockFocusDirections="tabContentBlockFocusDirections" :visible="!isLoading"
      tabNavBarClass="qt_tabs_waterfall_tab_css" tabPageClass="qt_tabs_waterfall_css" :tabContentResumeDelay="200"
      :tabContentSwitchDelay='0'
      :contentNextFocus="{ left: isShowCenterSearch ? 'search_center_view_list' : 'grid_view', up: 'tabList' }"
      :blockViewPager="['down', 'right']" :outOfDateTime="2 * 60 * 1000" @onTabClick="onTabClick"
      @onTabPageChanged="onTabPageChanged" @onTabMoveToTopStart="onTabMoveToTopStart"
      @onTabMoveToTopEnd="onTabMoveToTopEnd" @onTabMoveToBottomStart="onTabMoveToBottomStart"
      @onTabMoveToBottomEnd="onTabMoveToBottomEnd" @onTabPageScrollToEnd="onTabPageScrollToEnd"
      @onTabPageScrollToStart="onTabPageScrollToStart" @onTabPageItemClick="onTabPageItemClick"
      @onTabPageItemFocused="onTabPageItemFocused" @onTabPageLoadData="onTabPageLoadData"
      @onTabPageScroll="onTabPageScroll" :enablePlaceholder="false" @onTabPageSectionAttached="onTabPageSectionAttached"
      class="qt_tabs_css">
      <template v-slot:tab-item>
        <!-- 自定义tab类型 -->
        <qt-view class="waterfall_nav_item" :type="2" :clipChildren="false" :focusable="true" eventFocus autoWidth
          sid="${sid}" name="waterfall_nav_item_text" ref="waterfall_nav_item_text">
          <qt-text autoWidth gravity="center" :lines="1" :fontSize="36" :focusable="false"
            class="waterfall_nav_item_text" :duplicateParentState="true" text="${text}" />
        </qt-view>
      </template>
      <template v-slot:waterfall-item>
        <qt-poster :type="20" sid="${sid}" />
      </template>
    </qt-tabs>

    <!-- empty_view 空 提示-->
    <qt-view class="empty_view" v-if="isHasData">
      <qt-image :src="ic_data_empty" class="empty_view_image" />
      <qt-text class="empty_view_text" text="没有更多内容了" :ellipsizeMode="2" gravity="center" :fontSize="30" />
    </qt-view>

    <!-- 页面loading-->
    <qt-view v-if="isLoading && isShowResultLoading" :focusable="false" class="search_result_loading"
      :gradientBackground="{ colors: ['#252930', '#2F3541'] }">
      <qt-loading-view style="width: 100px;height: 100px;margin-left: -1200px;" />
    </qt-view>
  </qt-view>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/runtime-core"
import { ref, watch } from "vue"
import {
  QTITab, QTTab, QTTabEventParams, QTTabItem, QTTabPageData, QTTabPageState, QTWaterfallItem,
  QTWaterfallSection, QTWaterfallSectionType
} from "@quicktvui/quicktvui3"
import { useESToast } from "@extscreen/es3-core"
import { buildTabPageEndData } from "../build_data/useSearchData"
import { useGlobalApi } from "../../../api/UseApi"
import SearchConfig from "../build_data/SearchConfig"
import { useLaunch } from "../../../tools/launch/useApi"

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
    },
    isShowResultLoading: {
      type: Boolean,
      default: true
    }
  },
  emits: ["scroll-to-index", "curItemSid", "defaultTabItemSid", 'close-loading'],
  setup(props, context) {
    const isShowCenterSearch = computed(() => SearchConfig.isShowCenterSearch)
    const appApi = useGlobalApi()
    const search_result = ref()
    let descendantFocusability = ref(1)
    const ic_search_left_arrow = require("../../../assets/search/ic_search_left_arrow.png").default
    const ic_data_empty = require("../../../assets/search/ic_data_empty.png").default
    let showKeyword = ref("")
    let isShowTopTip = ref(true)
    let isHasData = ref(false)
    let isLoading = ref(false)
    let recommendTitle = ref("热门推荐")
    let delaySearchByKeyword: any = -1
    let closeLoadingTimer: any = -1
    let tabIndex0Sid: string = ""
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
    //tab
    let tabList: Array<QTTabItem> = []
    const tabRef = ref<QTITab>()
    const tabContentBlockFocusDirections = ref(["down", "right"])
    const launch = useLaunch()
    let isRecommendRequest = false
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
        recommendTitle.value = ""
        if (delaySearchByKeyword) clearTimeout(delaySearchByKeyword)
        isLoading.value = true
        descendantFocusability.value = 2
        delaySearchByKeyword = setTimeout(() => {
          initTab(isRecommendRequest)
          if (closeLoadingTimer) clearTimeout(closeLoadingTimer)
          closeLoadingTimer = setTimeout(() => {
            isLoading.value = false
            descendantFocusability.value = 1
          }, 1000)
        }, 600)
      } else {
        isRecommendRequest = true
        recommendTitle.value = "热门推荐"
      }
      context.emit("close-loading")
    })

    // qt-tabs 填充数据 回调
    const onTabPageLoadData = async (pageIndex: number, pageNo: number, useDiff: boolean) => {
      // 搜索数据
      if (tabList && pageIndex >= 0 && pageIndex < tabList.length) {
        const tabItem = tabList[pageIndex]
        if (tabItem._id !== null && tabItem._id !== undefined) {
          let tabPage
          if (isRecommendRequest) {
            tabPage = await appApi.getRecommendPageData(tabItem._id, (pageNo + 1), SearchConfig.screenResultPageSize, tabList.length === 1)
          } else {
            tabPage = await appApi.getSearchResultPageData(props.keyword, (pageNo + 1), SearchConfig.screenResultPageSize, tabList.length === 1)
          }
          const length = tabPage.data[0].itemList.length
          if (length > 0) {
            if (pageNo <= 0) {
              tabRef.value?.setPageData(pageIndex, tabPage)
            } else {
              tabRef.value?.addPageData(pageIndex, tabPage, 0)
            }
          } else { //停止分页
            setTimeout(() => {
              // tabRef.value?.addPageData(pageIndex, buildTabPageEndData(), 0)
              tabRef.value?.setPageState(pageIndex, QTTabPageState.QT_TAB_PAGE_STATE_COMPLETE)
            }, 2000)

          }
        }
      }
    }

    const onTabClick = () => {
    }
    const onTabPageChanged = (pageIndex: number, data: any) => {
      if (tabList && pageIndex == 0 && pageIndex < tabList.length && tabList.length > 1) {
        const sid = tabList[pageIndex].sid
        tabIndex0Sid = sid
        context.emit("curItemSid", sid)
        context.emit("defaultTabItemSid", sid)
      }
    }
    const onTabMoveToTopStart = () => { // 吸顶开始
      isShowTopTip.value = false
    }
    const onTabMoveToTopEnd = () => { // 吸顶结束

    }
    const onTabMoveToBottomStart = () => { //恢复吸顶开始

    }
    const onTabMoveToBottomEnd = () => { //恢复吸顶结束
      isShowTopTip.value = true
    }
    const onTabPageScrollToEnd = () => {
    }
    const onTabPageScrollToStart = () => {
    }
    const onTabPageItemClick = (pageIndex: number, sectionIndex: number, itemIndex: number, item: QTWaterfallItem) => {
      const { actionRedirect } = item.item
      const mItem = { item: { ...actionRedirect } }
      launch.launch(mItem)
    }
    const onTabPageItemFocused = (pageIndex: number, sectionIndex: number, itemIndex: number, isFocused: boolean, item: QTWaterfallItem) => {
      if (itemIndex % 6 === 0 && isFocused) {
        //获取当前的 sid
        // console.log("XRG=onTabPageItemFocused==sid==",item.sid,"===itemIndex==",itemIndex)
        context.emit("curItemSid", item.sid)
      }
    }

    const onTabPageScroll = () => {
    }
    const onTabPageSectionAttached = (pageIndex: number, sectionList: any) => {
      if (pageIndex === 0 && tabList.length === 1) {
        const defaultSid = sectionList[0]?.itemList[0]?.sid ?? ""
        // console.log("XRG==onTabPageSectionAttached=","单 TAB 获取到的 sid == ",defaultSid)
        context.emit("defaultTabItemSid", defaultSid)
      }
    }
    const childFocus = (e) => {
      if (e.child) {
        context.emit("scroll-to-index", 2, 100)
      }
    }
    return {
      cancelAll,
      search_result,
      descendantFocusability,
      showKeyword,
      ic_search_left_arrow,
      ic_data_empty,
      isHasData,
      isLoading,
      isShowTopTip,
      tabRef,
      tabContentBlockFocusDirections,
      isShowCenterSearch,
      recommendTitle,
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
<style src="../css/search-result.css"></style>
