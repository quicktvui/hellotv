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
        <bar-text-item :type='1'/>
        <!--图片Tab导航-->
        <bar-img-item :type='2'/>
        <!--文字 带角标Tab导航-->
<!--        <bar-text-item :type='3' :showCorner='true' cornerRight/>-->
      </template>
    </qt-tabs>


  </div>

</template>

<script lang='ts' setup name='WaterfallTabs'>

import { ESKeyEvent } from '@extscreen/es3-core'
import { QTTab, QTTabEventParams, QTTabItem, QTWaterfallItem } from '@quicktvui/quicktvui3'
import homeManager from '../../../api/home/home-manager'
import BgAnimation from '../../../components/bg-animation.vue'
import BarImgItem from './nav-bar/bar-img-item.vue'
import BarTextItem from './nav-bar/bar-text-item.vue'
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
const onTabPageLoadData = (pageIndex: number, pageNo: number, useDiff: boolean)=>{

}
/**
 * 界面加载之前数据处理
 * @param pageIndex
 * @param sectionList
 */
const onTabPageSectionAttached = (pageIndex: number, sectionList: any)=>{

}
const getTabList = ()=>{
  console.log("XRG===","getTabList")
  homeManager.getTabList().then((tab:QTTab)=>{

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
