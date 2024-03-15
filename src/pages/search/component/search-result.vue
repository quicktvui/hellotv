<template>
  <qt-view class="search_result" ref="search_result" :clipChildren="false" @childFocus="childFocus"
    :listenHasFocusChange="true" :descendantFocusability="descendantFocusability" :triggerTask="triggerTask"
    :nextFocusName="{ left: 'search_center_view_content_list' }">

    <qt-view class="search_result_title_root_top" :focusable="false" name="search_result_title_name"
      v-show="keyword && isShowTopTip">
      <qt-image :visible="showIsFullScreen" :src="ic_search_left_arrow" class="ic_search_left_arrow" :focusable="false" />
      <qt-view class="search_result_view_title" :focusable="false">
        <qt-text text="全部" class="search_result_view_title_size" />
        <span class="search_result_view_title_result">{{ `&nbsp;“${keyword}”&nbsp;` }}</span>
        <qt-text text="结果" class="search_result_view_title_size" />
      </qt-view>
    </qt-view>

    <qt-tabs ref="tabRef" :hideOnSingleTab="true" :tabContentBlockFocusDirections="tabContentBlockFocusDirections"
      tabNavBarClass="qt_tabs_waterfall_tab_css" tabPageClass="qt_tabs_waterfall_css"
      :contentNextFocus="{ left: 'search_center_view_list' }" :blockViewPager="['down', 'right']"
      :outOfDateTime="60 * 60 * 1000" @onTabClick="onTabClick" @onTabChanged="onTabChanged"
      @onTabMoveToTopStart="onTabMoveToTopStart" @onTabMoveToTopEnd="onTabMoveToTopEnd"
      @onTabMoveToBottomStart="onTabMoveToBottomStart" @onTabMoveToBottomEnd="onTabMoveToBottomEnd"
      @onTabPageScrollToEnd="onTabPageScrollToEnd" @onTabPageScrollToStart="onTabPageScrollToStart"
      @onTabPageItemClick="onTabPageItemClick" @onTabPageItemFocused="onTabPageItemFocused"
      @onTabPageLoadData="onTabPageLoadData" @onTabPageScroll="onTabPageScroll"
      @onTabPageSectionAttached="onTabPageSectionAttached" class="qt_tabs_css">
      <template v-slot:tab-item>
        <!-- 自定义tab类型 -->
        <qt-view class="waterfall_nav_item" :type="2" :clipChildren="false" :focusable="true" eventFocus autoWidth
          ref="waterfall_nav_item_text">
          <qt-text autoWidth gravity="center" :lines="1" :fontSize="36" :focusable="false"
            class="waterfall_nav_item_text" :duplicateParentState="true" text="${text}" />
        </qt-view>
      </template>
      <template v-slot:waterfall-item>
        <search-result-long-item :type="666" :focusScale="1.03" />
      </template>
      <template #waterfall-list-item></template>
    </qt-tabs>

    <!-- empty_view 空 提示-->
    <qt-view class="empty_view" v-if="isHasData">
      <qt-image :src="ic_data_empty" class="empty_view_image" />
      <qt-text class="empty_view_text" text="没有更多内容了" :ellipsizeMode="2" gravity="center" :fontSize="30" />
    </qt-view>

    <!-- 页面loading-->
    <qt-view v-if="isLoading" :focusable="false" class="search_result_loading"
      :gradientBackground="{ colors: ['#252930', '#2F3541'] }">
      <qt-loading-view style="width: 100px;height: 100px;margin-left: -1200px;" />
    </qt-view>
  </qt-view>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ref, watch } from "vue";
import { QTITab, QTTab, QTTabEventParams, QTTabItem, QTTabPageData, QTTabPageState, QTWaterfallItem,
    QTWaterfallSection, QTWaterfallSectionType} from "@quicktvui/quicktvui3";
import searchResultLongItem from "./search-result-long-item.vue";
import { useESToast } from "@extscreen/es3-core";
import { buildTabPageEndData } from "../build_data/useSearchData";
import {useGlobalApi} from "../../../api/UseApi";

export default defineComponent({
  name: "search_result",
  components: { searchResultLongItem },
  props: {
    keyword: {
      type: String,
      default: ""
    },
    showIsFullScreen: {
      type: Boolean,
      default: false
    },
  },
  emits: ['scroll-to-index'],
  setup(props, context) {
    const appApi = useGlobalApi()
    const search_result = ref()
    let descendantFocusability = ref(1)
    const ic_search_left_arrow = require('../../../assets/search/ic_search_left_arrow.png').default
    const ic_data_empty = require('../../../assets/search/ic_data_empty.png').default
    let showKeyword = ref('')
    let isShowTopTip = ref(true)
    let isHasData = ref(false)
    let isLoading = ref(false)
    let delaySearchByKeyword: any = -1
    let closeLoadingTimer: any = -1
    let delayHandleFocusChange: any = -1
    let triggerTask = [
      {
        event: 'onFocusLost',
        target: 'search_scroll_view',
        function: 'scrollToWithOptions',
        params: [{
          x: -1153,
          y: 0,
          duration: 300,
        }],
      },
      {
        event: 'onFocusAcquired',
        target: 'search_scroll_view',
        function: 'scrollToWithOptions',
        params: [{
          x: 1153,
          y: 0,
          duration: 300,
        }],
      },
    ]
    //tab
    let tabList: Array<QTTabItem> = []
    const tabRef = ref<QTITab>()
    const tabContentBlockFocusDirections = ref(['down', 'right'])
    const toast = useESToast()
    const initComponent = async () => {}

    const initTab = async () => {
      tabList = await appApi.getSearchResultTabList()
      tabRef.value?.initTab({ defaultIndex: 0, defaultFocusIndex: -1, itemList: tabList })
      tabRef.value?.initPage({ width: 1920, height: 1080 })
    }

    watch(() => props.keyword, (newVal, oldVal) => {
      if (newVal) {
        if (delaySearchByKeyword) clearTimeout(delaySearchByKeyword)
        isLoading.value = true
        descendantFocusability.value = 2
        delaySearchByKeyword = setTimeout(() => {
          initTab()
          if (closeLoadingTimer) clearTimeout(closeLoadingTimer)
          isLoading.value = false
          closeLoadingTimer = setTimeout(() => {
            descendantFocusability.value = 1
          }, 1000)
        }, 600)
      }
    })

    // qt-tabs 填充数据 回调
    const onTabPageLoadData = async (pageIndex: number, pageNo: number, useDiff: boolean) => {
      // 搜索数据
      console.log(pageIndex, pageNo, '88888888888888888888')
      let tabPage = await appApi.getSearchResultPageData(pageNo, 18, '', '')
      if(tabPage.data[0].itemList.length > 0){
        if (pageNo == 0) tabRef.value?.setPageData(pageIndex, tabPage)
        else tabRef.value?.addPageData(pageIndex, tabPage, 0)
      }else{ //停止分页
        tabRef.value?.addPageData(pageIndex, buildTabPageEndData(), 0)
        tabRef.value?.setPageState(pageIndex, QTTabPageState.QT_TAB_PAGE_STATE_COMPLETE)
      }
    }
    const onTabClick = () => { }
    const onTabChanged = () => { }
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
    const onTabPageScrollToEnd = () => { }
    const onTabPageScrollToStart = () => { }
    const onTabPageItemClick = () => { }
    const onTabPageItemFocused = () => { }

    const onTabPageScroll = () => { }
    const onTabPageSectionAttached = () => { }
    const childFocus = (e) => {
      if (delayHandleFocusChange) clearTimeout(delayHandleFocusChange)
      delayHandleFocusChange = setTimeout(() => {
        if (e.child) {
          context.emit('scroll-to-index', 2)
        }
      }, 100)
    }
    return {
      initComponent,
      search_result, descendantFocusability, showKeyword, ic_search_left_arrow, ic_data_empty,
      isHasData, isLoading,
      isShowTopTip,
      tabRef, tabContentBlockFocusDirections, childFocus, triggerTask,
      onTabClick, onTabChanged, onTabMoveToTopStart, onTabMoveToTopEnd, onTabMoveToBottomStart, onTabMoveToBottomEnd,
      onTabPageScrollToEnd, onTabPageScrollToStart, onTabPageItemClick, onTabPageItemFocused, onTabPageLoadData,
      onTabPageScroll, onTabPageSectionAttached
    }
  }
})
</script>
<style src="../css/search-result.css"></style>
