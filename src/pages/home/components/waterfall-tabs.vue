<template>
  <div class='waterfall-tabs-root-css' :clipChildren='false' :clipPadding='false'>
    <!--    背景图-->
    <bg-animation ref='waterfallBg' style='position: absolute' :focusable='false' />
    <!--    4k图标-->
    <bg-animation ref='waterfallLogo4kRef' class='waterfall-tabs-4k-logo'
                  :bgStyle='{width:"240px",height:"84px"}' :focusable='false'
                  :transitionTime='200' />
    <!--顶部按钮组-->
    <div ref='waterfallTopRef' name='waterfallTopView' sid='waterfallTopSid'
         class='waterfall-top-view' :clipChildren='false'
         :blockFocusDirections='["left", "right", "up"]'>
      <slot name='topView' />
    </div>
    <qt-tabs
      ref='tabRef'
      sid='homeTabsSid'
      tabNavBarSid='tabNavBarSid'
      nextFocusUpSID='topMyBtnSid'
      class='waterfall-qt-tabs-css'
      tabNavBarClass='waterfall-nav-bar-css'
      tabPageClass='waterfall-content-css'
      :tabContentBlockFocusDirections='["left", "right", "down", "top"]'
      :autoHandleBackKey='true'
      :useDiff=false
      :horizontalFadingEdgeEnabled='true'
      :customPool="{ name: 'home' }"
      :customItemPool="{ name: 'homeItems' }"
      :fadingEdgeLength='400'
      :outOfDateTime='5 * 60 * 1000'
      :tabContentSwitchDelay='100'
      :tabContentResumeDelay='300'
      :resumePlayerTaskDelay='1000'
      :triggerTask='tabsTriggerTask'
      :qtTabSectionEnable='qtTabSectionEnable'
      @onTabClick='onTabClick'
      @onTabEvent='onTabEvent'
      @onTabPageChanged='onTabPageChanged'
      @onTabMoveToTopStart='onTabMoveToTopStart'
      @onTabMoveToBottomEnd='onTabMoveToBottomEnd'
      @onTabPageItemClick='onTabPageItemClick'
      @onTabPageItemFocused='onTabPageItemFocused'
      @onTabPageLoadData='onTabPageLoadData'
      @onTabPageSectionAttached='onTabPageSectionAttached'>
      <template v-slot:tab-item>
        <!--文字Tab导航-->
        <bar-text-item :type='NavBarItemType.BAR_TEXT_TYPE' />
        <!--图片Tab导航-->
        <bar-img-item :type='NavBarItemType.BAR_IMG_TYPE' />
        <!--文字 带角标Tab导航-->
        <!-- <bar-text-item :type='NavBarItemType.BAR_CORNER_TYPE' :showCorner='true' cornerRight/>-->
      </template>
      <template v-slot:waterfall-shared-item>
        <!-- 带边框无标题格子-->
        <no-title-item :type='TabContentType.TYPE_ITEM_SECTION_NO_TITLE' />
        <!-- 带标题格子(图片上/图片下)-->
        <inner-out-title-item :type='TabContentType.TYPE_ITEM_SECTION_HAS_TITLE' />
        <!-- 占位格子-->
        <place-holder-item :type='TabContentType.TYPE_ITEM_SECTION_PLACE_HOLDER' />
        <!-- 焦点变图格子-->
        <focus-change-img-item :type='TabContentType.TYPE_ITEM_SECTION_FOCUS_CHANGE_IMG' />
      </template>

    </qt-tabs>


  </div>

</template>

<script lang='ts' setup name='WaterfallTabs'>

import { ESKeyEvent, useESToast } from '@extscreen/es3-core'
import { useESRouter } from '@extscreen/es3-router'
import {
  QTITab,
  QTTab,
  QTTabEventParams,
  QTTabItem,
  QTTabPageData, QTTabPageState,
  QTWaterfallItem
} from '@quicktvui/quicktvui3'
import { ref } from 'vue'
import homeManager from '../../../api/home/home-manager'
import BgAnimation from '../../../components/bg-animation.vue'
import barsDataManager from '../build-data/nav-bar/nav-bar-adapter'
import BarImgItem from './nav-bar/bar-img-item.vue'
import BarTextItem from './nav-bar/bar-text-item.vue'
import NavBarItemType from '../build-data/nav-bar/nav-bar-item-type'
import NavBarConfig from '../build-data/nav-bar/nav-bar-config'
import TabContentConfig from '../build-data/tab-content/tab-content-config'
import FocusChangeImgItem from './tab-content/focus-change-img-item.vue'
import InnerOutTitleItem from './tab-content/inner-out-title-item.vue'
import NoTitleItem from './tab-content/no-title-item.vue'
import TabContentType from '../build-data/tab-content/tab-content-item-type'
import PlaceHolderItem from './tab-content/place-holder-item.vue'
//控制顶部吸顶
const tabsTriggerTask = [
  {
    event: 'onContentScrollYGreater',
    target: 'waterfallTopView',
    function: 'changeVisibility',
    params: ['invisible']
  },
  {
    event: 'onContentScrollYLesser',
    target: 'waterfallTopView',
    function: 'changeVisibility',
    params: ['visible']
  }
  // {
  //     event: 'onPageChange',
  //     target: 'home_player',
  //     function: 'changeAlpha',
  //     params: [0],
  // },
]

//控制qt-tabs  section是否初始化
const qtTabSectionEnable = {
  tabEnable: false,
  flexSectionEnable: true,
  flexSection: {
    qtPosterEnable: false,
    qtPluginItemEnable: false,
    cardItemEnable: false
  },
  listSectionEnable: true,
  listSection: {
    qtPosterEnable: true,
    cardItemEnable: true
  },
  loadingSectionEnable: true,
  endSectionEnable: true,
  blankSectionEnable: false,
  cardSectionEnable: false,
  pluginSectionEnable: false,
  vueSectionEnable: false,
  //共享功能waterfall-shared-item使用需设置 itemStoreEnable 为true
  itemStoreEnable: true
}
const router = useESRouter()
const toast = useESToast()
const tabRef = ref<QTITab>()
/**
 * nav bar item 点击跳转
 * @param item
 */
const onTabClick = (item: QTTabItem) => {
  //launch.launch()
}
/**
 * 瀑布流event事件集合回调
 * @param tabIndex
 * @param eventName
 * @param params
 */
const onTabEvent = (tabIndex: number, eventName: string, params: any) => {

}
/**
 * tab切换回调
 * @param pageIndex
 * @param data
 */
const onTabPageChanged = (pageIndex: number, data: any) => {

}
/**
 * 吸顶开始
 * @param pageIndex
 * @param eventName
 * @param params
 */
const onTabMoveToTopStart = (pageIndex: number, eventName: string, params: QTTabEventParams) => {

}
/**
 * 恢复吸顶结束
 * @param pageIndex
 * @param eventName
 * @param params
 */
const onTabMoveToBottomEnd = (pageIndex: number, eventName: string, params: QTTabEventParams) => {

}
/**
 * 格子item 点击事件
 * @param pageIndex 当前导航tab index
 * @param sectionIndex 当前板块 index
 * @param itemIndex 板块中格子 index
 * @param item
 * @param e
 */
const onTabPageItemClick = (pageIndex: number, sectionIndex: number, itemIndex: number, item: QTWaterfallItem, e) => {

}
/**
 * 格子item 焦点事件
 * @param pageIndex
 * @param sectionIndex
 * @param itemIndex
 * @param isFocused
 * @param item
 */
const onTabPageItemFocused = (pageIndex: number, sectionIndex: number, itemIndex: number, isFocused: boolean, item: QTWaterfallItem) => {

}
/**
 * 加载界面数据
 * @param pageIndex
 * @param pageNo
 * @param useDiff
 */
const onTabPageLoadData = (pageIndex: number, pageNo: number, useDiff: boolean) => {
  if (pageIndex >= 0 && pageIndex < barsDataManager.barsData?.itemList?.length) {
    const curTab = barsDataManager.barsData.itemList[pageIndex]
    //添加我的 导航
    if (NavBarConfig.tab.id === curTab._id && pageNo === 0) {
      getTabContent(curTab._id, pageIndex, pageNo + 1)
    } else {
      getTabContent(curTab._id, pageIndex, pageNo + 1)
    }
  }

}
const getTabContent = (tabId: string, tabPageIndex: number, pageNo: number) => {
  homeManager.getTabContent(tabId, pageNo, TabContentConfig.sectionLoadLimit, tabPageIndex)
    .then((tabPage: QTTabPageData) => {
      if (tabPage.data.length > 0) {
        if (pageNo <=1){
          tabRef.value?.setPageData(tabPageIndex, tabPage)
        }else{
          tabRef.value?.addPageData(tabPageIndex, tabPage, 0)
        }
      }
      if (tabPage.isLoadPageEnd || tabPage.data.length === 0){
        tabRef.value?.setPageState(tabPageIndex,QTTabPageState.QT_TAB_PAGE_STATE_COMPLETE)
      }
    },error =>{
      toast.showToast('加载数据失败，稍后重试！')
    })
}
/**
 * 界面加载之前数据处理
 * @param pageIndex
 * @param sectionList
 */
const onTabPageSectionAttached = (pageIndex: number, sectionList: any) => {

}
/**
 * 获取导航数据
 */
const getTabList = () => {
  homeManager.getTabList().then((tab: QTTab) => {
    tabRef.value?.initTab(tab)
    // tabRef.value?.initPage()
  })
}
const onESCreate = () => {
  getTabList()
}
const onESRestart = () => {
}

const onESPause = () => {
}

const onESStop = () => {
}

const onESResume = () => {
}

const onESDestroy = () => {
}

const onKeyDown = (keyEvent: ESKeyEvent) => {

}

const onKeyUp = (keyEvent: ESKeyEvent) => {

}
const onBackPressed = () => {
  router.back()
}
defineExpose({
  onESCreate,
  onESRestart,
  onESPause,
  onESStop,
  onESResume,
  onESDestroy,
  onKeyDown,
  onKeyUp,
  onBackPressed
})

</script>

<style lang='scss' src='../scss/waterfall-tabs.scss'>
</style>
