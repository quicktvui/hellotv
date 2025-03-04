<template>
  <div class='activity-root-css' 
    ref='activityRef' 
    :clipChildren='false' 
    :clipPadding='false'>
    <!-- 背景图 -->
    <bg-animation ref='waterfallBgRef' style='position: absolute' :focusable='false' />
    <!-- waterfall -->
    <qt-tabs
      ref='tabRef'
      sid='homeTabsSid'
      class='waterfall-qt-tabs-css'
      tabNavBarClass='waterfall-tab-bar-css'
      tabPageClass='waterfall-content-css'
      :tabContentBlockFocusDirections='["left", "right", "down", "top"]'
      :autoHandleBackKey='true'
      :useDiff=false
      :customPool="{ name: 'home' }"
      :customItemPool="{ name: 'homeItems' }"
      :outOfDateTime='5 * 60 * 1000'
      :qtTabSectionEnable='qtTabSectionEnable'
      @onTabEvent='onTabEvent'
      @onTabPageItemClick='onTabPageItemClick'
      @onTabPageItemFocused='onTabPageItemFocused'
      @onTabPageLoadData='onTabPageLoadData'
      @onTabMoveToTopStart='onTabMoveToTopStart'
      @onTabMoveToBottomEnd='onTabMoveToBottomEnd'>
      <template v-slot:waterfall-shared-item>
        <!-- 带边框无标题格子-->
        <no-title-item :type='TabContentItemType.TYPE_ITEM_SECTION_NO_TITLE' />
        <!-- 带标题格子(图片上/图片下)-->
        <inner-out-title-item :type='TabContentItemType.TYPE_ITEM_SECTION_HAS_TITLE' />
        <!-- 占位格子-->
        <place-holder-item :type='TabContentItemType.TYPE_ITEM_SECTION_PLACEHOLDER' />
        <!-- 焦点变图格子-->
        <focus-change-img-item :type='TabContentItemType.TYPE_ITEM_SECTION_FOCUS_CHANGE_IMG' />
      </template>
    </qt-tabs>
  </div>
</template>

<script setup lang='ts' name='index'>
import { ref } from 'vue'
import { useESRouter } from '@extscreen/es3-router'
import {  ESKeyEvent} from '@extscreen/es3-core'
import {QTITab,QTTabPageData,QTTabPageState,QTWaterfallItem,} from '@quicktvui/quicktvui3'
import ActivityManager from './api/index'
import {buildTab, buildTabContentAdapter} from './adapter/index'
import {TabContentConfig, TabContentItemType} from './adapter/config'
import launch from '../../tools/launch'
import BgAnimation from '../../components/bg-animation.vue'
import NoTitleItem from './components/item/no-title-item.vue'
import InnerOutTitleItem from './components/item/inner-out-title-item.vue'
import FocusChangeImgItem from './components/item/place-holder-item.vue'
import PlaceHolderItem from './components/item/focus-change-img-item.vue'

  const router = useESRouter()
  const activityRef = ref()
  const waterfallBgRef = ref()
  const tabRef = ref<QTITab>()
  let curBg = ''
  let bgTimer: any = -1
  //控制qt-tabs  section是否初始化
  const qtTabSectionEnable = {
    tabEnable: true,
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

  const onESCreate = (params) => {
    tabRef.value?.initTab(buildTab())
  }
  
  const onTabPageLoadData = (pageIndex: number, pageNo: number) => {
    let tabId = '35d2f5pg'
    ActivityManager.getTabContent(tabId, pageNo, TabContentConfig.sectionLoadLimit)
    .then(async (tabContent: any) => {
      const tabPage: QTTabPageData = await buildTabContentAdapter(tabContent, pageNo, tabId, pageIndex)
      if (tabPage.data.length > 0) {
        if (pageNo <= 1) {
          tabRef.value?.setPageData(pageIndex, tabPage)
        } else {
          tabRef.value?.addPageData(pageIndex, tabPage, 0)
        }
      }
      if (tabPage.isLoadPageEnd || tabPage.data.length === 0) {
        tabRef.value?.setPageState(pageIndex, QTTabPageState.QT_TAB_PAGE_STATE_COMPLETE)
      }
    }, () => {
      qt.toast.showToast('加载数据失败，稍后重试！')
    })
  }
  const onTabPageItemClick = (pageIndex: number, sectionIndex: number, itemIndex: number, item: QTWaterfallItem, e) => {
    launch.launch(item.jumpParams)
  }
  const onTabEvent = (tabIndex: number, eventName: string, params: any) => {
    if (eventName === 'onPageBringToFront') {
      let sectionData = tabRef.value?.getPageSection(0, 0)
      if (sectionData && sectionData.itemList && sectionData.itemList.length > 0 && sectionData.itemList[0]?.imageFocusBackground) {
        const firstBgUrl = sectionData.itemList[0]?.imageFocusBackground
        setWTabBg(firstBgUrl)
      }
    }else if (eventName === "onTabFocusChange"){
      
    }
  }
  //吸顶开始
  const onTabMoveToTopStart = () => {
  }
  //恢复吸顶结束
  const onTabMoveToBottomEnd = () => {
    setWTabBg(curBg)
  }
  //设置背景图
  const setWTabBg = (bg: string, isLoad: boolean = false) => {
    clearTimeout(bgTimer)
    if (curBg == bg && !isLoad) return
    bgTimer = setTimeout(() => {
      if (curBg == bg) return
      curBg = bg
      if (bg) {
        waterfallBgRef.value?.setImg(bg)
      } else {
        waterfallBgRef.value?.clearImg()
      }
    }, 400)
  }

  const onTabPageItemFocused = (tabPageIndex: number, sectionIndex: number, sectionItemIndex: number, isFocused: boolean, item: QTWaterfallItem) => {
    if (sectionIndex === 0 && item.imageFocusBackground) {
      setWTabBg(item.imageFocusBackground)
    }
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
    onESPause,
    onESStop,
    onESResume,
    onESDestroy,
    onKeyDown,
    onKeyUp,
    onBackPressed
  })
</script>

<style lang='scss' src='./scss/index.scss'>

</style>
