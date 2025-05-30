<template>
  <div class="waterfall-tabs-root-css" :clipChildren="false" :clipPadding="false">
    <!--    背景图-->
    <bg-animation ref="waterfallBgRef" style="position: absolute" :focusable="false" />
    <!--    4k图标-->
    <bg-animation
      ref="waterfallLogo4kRef"
      class="waterfall-tabs-4k-logo"
      :bgStyle="{ width: '240px', height: '84px' }"
      :focusable="false"
      :transitionTime="200"
    />
    <!-- 背景播放及小窗播放组件 -->
    <bg-player class="waterfall-tabs-bg-player" ref="waterfallBgPlayerRef" :clipChildren="false" sid="waterfallBgPlayerSid" />
    <!--顶部按钮组-->
    <div
      ref="waterfallTopRef"
      name="waterfallTopView"
      sid="waterfallTopSid"
      class="waterfall-top-view"
      :clipChildren="false"
      :blockFocusDirections="['left', 'right', 'up']"
    >
      <slot name="topView" />
    </div>
    <qt-tabs
      ref="tabRef"
      sid="homeTabsSid"
      tabNavBarSid="tabNavBarSid"
      nextFocusUpSID="topMyBtnSid"
      class="waterfall-qt-tabs-css"
      tabNavBarClass="waterfall-tab-bar-css"
      tabPageClass="waterfall-content-css"
      :tabContentBlockFocusDirections="['left', 'right', 'down', 'top']"
      :autoHandleBackKey="true"
      :useDiff="false"
      :horizontalFadingEdgeEnabled="true"
      :customPool="{ name: 'home' }"
      :customItemPool="{ name: 'homeItems' }"
      :fadingEdgeLength="400"
      :outOfDateTime="5 * 60 * 1000"
      :tabContentSwitchDelay="100"
      :tabContentResumeDelay="300"
      :resumePlayerTaskDelay="1000"
      :triggerTask="tabsTriggerTask"
      :qtTabSectionEnable="qtTabSectionEnable"
      @onTabClick="onTabClick"
      @onTabEvent="onTabEvent"
      @onTabPageChanged="onTabPageChanged"
      @onTabMoveToTopStart="onTabMoveToTopStart"
      @onTabMoveToBottomEnd="onTabMoveToBottomEnd"
      @onTabPageItemClick="onTabPageItemClick"
      @onTabPageItemFocused="onTabPageItemFocused"
      @onTabPageLoadData="onTabPageLoadData"
    >
      <!--      @onTabPageSectionAttached='onTabPageSectionAttached'-->
      <template v-slot:tab-item>
        <!--文字Tab导航-->
        <bar-text-item :type="TabBarItemType.BAR_TEXT_TYPE" />
        <!--图片Tab导航-->
        <bar-img-item :type="TabBarItemType.BAR_IMG_TYPE" />
        <!--文字 带角标Tab导航-->
        <bar-text-item :type="TabBarItemType.BAR_CORNER_TYPE" :showCorner="true" cornerRight />
      </template>
      <template v-slot:waterfall-shared-item>
        <!-- 带边框无标题格子-->
        <no-title-item :type="TabContentType.TYPE_ITEM_SECTION_NO_TITLE" />
        <!-- 带标题格子(图片上/图片下)-->
        <inner-out-title-item :type="TabContentType.TYPE_ITEM_SECTION_HAS_TITLE" />
        <!-- 占位格子-->
        <placeholder-item :type="TabContentType.TYPE_ITEM_SECTION_PLACEHOLDER" />
        <!-- 焦点变图格子-->
        <focus-change-img-item :type="TabContentType.TYPE_ITEM_SECTION_FOCUS_CHANGE_IMG" />
        <!-- 小窗播放格子-->
        <cell-player-item :type="TabContentType.TYPE_ITEM_SECTION_CELL_PLAYER" />
        <!-- 历史记录格子-->
        <history-item :type="TabContentType.TYPE_ITEM_HISTORY_TEXT" />
      </template>
      <template v-slot:waterfall-section>
        <!-- 4K 模板-->
        <world-four-section :type="TabContentType.TYPE_WATERFALL_SECTION_4K" @loadMore="load4KData" :getTabRef="getTabRef" />
        <!-- 小 4K-->
        <small-four-section :type="TabContentType.TYPE_WATERFALL_SECTION_SMALL_4K" />
        <!-- 短视频全屏背景播放-->
        <short-video-section :type="TabContentType.TYPE_WATERFALL_SECTION_SHORT_SCREEN" @loadMore="loadShortData" :getTabRef="getTabRef" />
      </template>
    </qt-tabs>
  </div>
</template>

<script lang="ts" setup name="waterfall-tabs">
import { ESKeyCode, ESKeyEvent, ESLogLevel, useESLog, useESToast } from '@extscreen/es3-core'

import { EventBus, Native } from '@extscreen/es3-vue'
import { QTITab, QTTab, QTTabItem, QTTabPageData, QTTabPageState, QTWaterfallItem, VirtualView } from '@quicktvui/quicktvui3'
import { ref, nextTick } from 'vue'
import homeManager from '../api/index'
import ic_4k_logo from '../../../assets/home/ic_4k_logo.png'
import BgAnimation from '../../../components/bg-animation.vue'
import { IMediaList } from '../../../components/media/build-data/media-imp'
import launch from '../../../tools/launch'
import { HomePlayData, HomePlayType, PlayerState } from '../adapter/media/home-media-imp'
import barsDataManager, { buildTabBarAdapter } from '../adapter/tab-bar/tab-bar-adapter'
import TabBarConfig from '../adapter/tab-bar/tab-bar-config'
import TabBarItemType from '../adapter/tab-bar/tab-bar-item-type'
import tabsContent, { buildTabContentAdapter } from '../adapter/tab-content/tab-content-adapter'
import TabContentConfig from '../adapter/tab-content/tab-content-config'
import TabContentType from '../adapter/tab-content/tab-content-item-type'
import BgPlayer from './media/bg-player.vue'
import BarImgItem from './nav-bar/bar-img-item.vue'
import BarTextItem from './nav-bar/bar-text-item.vue'
import CellPlayerItem from './tab-content/cell-player-item.vue'
import FocusChangeImgItem from './tab-content/focus-change-img-item.vue'
import HistoryItem from './tab-content/history-item.vue'
import InnerOutTitleItem from './tab-content/inner-out-title-item.vue'
import NoTitleItem from './tab-content/no-title-item.vue'
import ShortVideoSection from './tab-content/short-video/short-video-section.vue'
import PlaceholderItem from './tab-content/placeholder-item.vue'
import SmallFourSection from './tab-content/small-4k/small-four-section.vue'
import WorldFourSection from './tab-content/world-4k/world-four-section.vue'

const log = useESLog()
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

const toast = useESToast()
const waterfallBgRef = ref()
const waterfallLogo4kRef = ref()
const waterfallBgPlayerRef = ref()
const tabRef = ref<QTITab>()
const recordPlayerMap = new Map<string, HomePlayData>()
//当前播放数据
let curBgPlayData: Array<IMediaList>
//当前播放类型
let curPlayerType = HomePlayType.TYPE_UNDEFINED
//当前 Tab index
let curTabPageIndex = 0
//短视频播放 index
// let curShortPlayerIndex = 0
let isMoreFront = false
let isMoreFrontTimer: any = -1
let bgTimer: any = -1
let resumePlayTimer: any = -1
//焦点背景播放 Timer
let typeBgFocusTimer: any = -1
//4k 焦点播放 Timer
let delay4KFocusTimer: any = -1
//小4K
let small4KTimer: any = -1
let small4KSetChildSIdTimer: any = -1
//short
let shortVideoTimer: any = -1

//当前背景图地址
let curBg = ''
//当前首屏图地址
let curFirstScreenBg = ''
//记录播放位置
let recordPlayerData = {
  tabPageIndex: -1,
  sectionItemIndex: 0
}
// 播放控制 是否吸顶
let isCeiling = false
// 是否执行生命周期 onESStop
let isOnEsStop = false
//控制 4K 图标
let is4kSectionItemFocused = false
//当前 4K sid
let cur4KSid = ''
let isSwitchTabSmall4KFlag: boolean = false
const getTabRef = () => {
  return tabRef.value!
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
  if (eventName === 'onPageBringToFront') {
    const tabPageIndex = params.page
    curTabPageIndex = tabPageIndex
    let sectionData = tabRef.value?.getPageSection(tabPageIndex, 0)
    let obj: HomePlayData | undefined = recordPlayerMap.get('_' + tabPageIndex)
    if (obj) {
      const playType = barsDataManager.barsData.itemList[tabPageIndex]?.playType
      VirtualView.call('waterfallBgPlayerSid', 'changeAlpha', [1])
      if (playType === HomePlayType.TYPE_SMALL_4K) {
        return
      }
      clearTimeout(isMoreFrontTimer)
      if (isMoreFront) {
        return
      }
      isMoreFrontTimer = setTimeout(() => {
        isMoreFront = false
      }, 2000)
      isMoreFront = true
      if (playType === HomePlayType.TYPE_SHORT_SCREEN) {
        //列表恢复原位置
        //todo  记得来修改成动态的sid getPageSection bug修复后
        let listSID = sectionData!.shortList.sid
        VirtualView.call(listSID, 'scrollToPosition', [0])
        VirtualView.call(listSID, 'setSelectChildPosition', [0, true])
      } else if (playType === HomePlayType.TYPE_4K) {
        const _4KListSid = sectionData!.list4KSid
        //初始化位置
        VirtualView.call(_4KListSid, 'scrollToPositionWithOffsetInfiniteMode', [0, 253, false])
        VirtualView.call(_4KListSid, 'setSelectChildPosition', [1000000000, true])
      }
      recordPlayerData.tabPageIndex = tabPageIndex
      recordPlayerData.sectionItemIndex = obj.sectionItemIndex
      doBgPlayItem(obj)
    } else if (sectionData && sectionData.itemList && sectionData.itemList.length > 0 && sectionData.itemList[0]?.imageFocusBackground) {
      const firstBgUrl = sectionData.itemList[0]?.imageFocusBackground
      setFirstScreenImg('', '1', firstBgUrl, true)
    }
  } else if (eventName === 'onTabFocusChange') {
    if (curPlayerType === HomePlayType.TYPE_SMALL_4K && waterfallBgPlayerRef) {
      waterfallBgPlayerRef.value?.pause()
      waterfallBgPlayerRef.value?.stop()
    }
  }
}
/**
 * 播放开始
 * @param hpd
 */
const doBgPlayItem = (hpd: HomePlayData) => {
  curBgPlayData = hpd.playerData
  curPlayerType = hpd.type
  waterfallBgPlayerRef.value?.setPlayState(PlayerState.STATE_WAIT)
  if (curPlayerType === HomePlayType.TYPE_4K) {
    cur4KSid = curBgPlayData[0].sid
    VirtualView.call(cur4KSid, 'changeVisibility', [`visible`])
  }
  waterfallBgPlayerRef.value?.initPlay(hpd)
}
/**
 * tab切换回调
 * @param pageIndex
 * @param data
 */
const onTabPageChanged = (pageIndex: number) => {
  //隐藏播放器
  VirtualView.call('waterfallBgPlayerSid', 'changeAlpha', [0])
  if (cur4KSid) {
    VirtualView.call(cur4KSid, 'changeVisibility', [`visible`])
  }
  isSwitchTabSmall4KFlag = true
  isMoreFront = false
  curFirstScreenBg = ''
  cur4KSid = ''
  // curShortPlayerIndex = 0
  waterfallBgPlayerRef.value?.pause()
  waterfallBgPlayerRef.value?.stop()
  waterfallBgPlayerRef.value?.setBgImage('')
  curPlayerType = HomePlayType.TYPE_UNDEFINED
  clearTimeout(isMoreFrontTimer)
  //设置首屏图
  setFirstScreenImg(barsDataManager.barsData.itemList[pageIndex]._id ?? '', '0', '', true)
}
/**
 * 吸顶开始
 * @param pageIndex
 * @param eventName
 * @param params
 */
const onTabMoveToTopStart = () => {
  isCeiling = true
  if (curPlayerType !== HomePlayType.TYPE_UNDEFINED && curPlayerType !== HomePlayType.TYPE_SMALL_4K) {
    //隐藏播放器
    VirtualView.call('waterfallBgPlayerSid', 'changeAlpha', [0])
    waterfallBgPlayerRef.value?.pause()
    waterfallBgPlayerRef.value?.stop()
  }
  //设置二屏图
  set2ScreenImg(barsDataManager.barsData.itemList[curTabPageIndex]._id ?? '')
}
/**
 * 恢复吸顶结束
 */
const onTabMoveToBottomEnd = () => {
  isCeiling = false
  if (curPlayerType !== HomePlayType.TYPE_UNDEFINED && curPlayerType !== HomePlayType.TYPE_SMALL_4K) {
    //显示播放器
    VirtualView.call('waterfallBgPlayerSid', 'changeAlpha', [1])
    if (curPlayerType === HomePlayType.TYPE_BG) {
      waterfallBgPlayerRef?.value.setBgImage('', true)
    }
    waterfallBgPlayerRef.value?.setPlayState(PlayerState.STATE_WAIT)
    setTimeout(() => {
      waterfallBgPlayerRef?.value.play(curBgPlayData)
    }, 400)
  }
  //设置首屏图
  if (curFirstScreenBg) {
    setFirstScreenImg('', '1', curFirstScreenBg, true)
  } else {
    setFirstScreenImg(barsDataManager.barsData.itemList[curTabPageIndex]._id ?? '')
  }
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
  launch.launch(item.jumpParams)

  //4K内容跳转的时候 将图片设置回来
  if (cur4KSid) {
    VirtualView.call(cur4KSid, 'changeVisibility', [`visible`])
  }
}
/**
 * 格子item 焦点事件
 * @param pageIndex
 * @param sectionIndex
 * @param itemIndex
 * @param isFocused
 * @param item
 */
const onTabPageItemFocused = (
  tabPageIndex: number,
  sectionIndex: number,
  sectionItemIndex: number,
  isFocused: boolean,
  item: QTWaterfallItem
) => {
  if (isFocused) {
    //小 4K 的版块判断必须在第一个放 主要是 else 里面的逻辑需要首次加入
    if (item.name === TabContentConfig.worldSmall4kSectionItemName) {
      sectionItemIndex = sectionItemIndex - 1000000000
      dealSmall4KFocused(tabPageIndex, sectionItemIndex, item)
      return
    } else {
      if (curPlayerType === HomePlayType.TYPE_SMALL_4K && waterfallBgPlayerRef) {
        clearTimeout(small4KTimer)
        clearTimeout(small4KSetChildSIdTimer)
        waterfallBgPlayerRef.value.pause()
        waterfallBgPlayerRef.value.stop()
      }
    }
    //4K 判断
    if (item.name === TabContentConfig.world4kSectionItemName) {
      //首次隐藏顶部按钮，展示 4K logo
      if (!is4kSectionItemFocused) {
        waterfallLogo4kRef.value?.setImg(ic_4k_logo)
        VirtualView.call('tabNavBarSid', 'changeAlpha', [0])
        VirtualView.call('waterfallTopSid', 'changeVisibility', [`invisible`])
      }
      is4kSectionItemFocused = true
      sectionItemIndex = sectionItemIndex - 1000000000
      if (recordPlayerData.tabPageIndex !== tabPageIndex || recordPlayerData.sectionItemIndex !== sectionItemIndex) {
        deal4KFocused(tabPageIndex, sectionItemIndex, item)
      }
      return
    } else {
      is4kSectionItemFocused = false
    }
    if (item.name === TabContentConfig.shortVideoSectionItemName) {
      if (recordPlayerData.tabPageIndex !== tabPageIndex || recordPlayerData.sectionItemIndex !== sectionItemIndex) {
        dealShortFocused(tabPageIndex, sectionItemIndex, item)
      }
    }
    //背景播放
    if (curPlayerType === HomePlayType.TYPE_BG && sectionIndex === 0) {
      typeBgFocused(tabPageIndex, sectionIndex, sectionItemIndex, item)
    } else {
      //格子焦点切换背景
      if (sectionIndex === 0 && item.imageFocusBackground && !barsDataManager.barsData.itemList[tabPageIndex].isPlay) {
        setFirstScreenImg('', '1', item.imageFocusBackground)
      }
    }
  }
}
/**
 * 背景播放焦点事件
 * @param tabPageIndex
 * @param sectionIndex
 * @param sectionItemIndex
 * @param item
 */
const typeBgFocused = (tabPageIndex: number, sectionIndex: number, sectionItemIndex: number, item: QTWaterfallItem) => {
  //相同位置不再触发
  if (recordPlayerData.tabPageIndex === tabPageIndex && recordPlayerData.sectionItemIndex === sectionItemIndex) return
  clearTimeout(typeBgFocusTimer)
  curBgPlayData = item.play.playData
  if (curBgPlayData && curBgPlayData.length > 0) {
    const bgUrl = curBgPlayData[0].cover
    waterfallBgPlayerRef?.value?.setBgImage(bgUrl)
    waterfallBgPlayerRef?.value?.setPlayState(PlayerState.STATE_WAIT)
    recordPlayerData.tabPageIndex = tabPageIndex
    recordPlayerData.sectionItemIndex = sectionItemIndex
    typeBgFocusTimer = setTimeout(() => {
      waterfallBgPlayerRef?.value?.play(curBgPlayData)
    }, 300)
  }
}
/**
 * 4K 焦点
 * @param tabPageIndex
 * @param sectionItemIndex
 * @param item
 */
const deal4KFocused = (tabPageIndex: number, sectionItemIndex: number, item: QTWaterfallItem) => {
  clearTimeout(delay4KFocusTimer)
  waterfallBgPlayerRef?.value.pause()
  VirtualView.call(TabContentConfig.homeBgPlaySid, 'changeAlpha', [0])
  curBgPlayData = item.play.playData
  if (curBgPlayData && curBgPlayData.length > 0) {
    const beforeSid = curBgPlayData[0].beforeSid
    cur4KSid = curBgPlayData[0].sid
    const nextSid = curBgPlayData[0].nextSid
    VirtualView.call(beforeSid, 'changeVisibility', [`visible`])
    VirtualView.call(nextSid, 'changeVisibility', [`visible`])
    recordPlayerData.tabPageIndex = tabPageIndex
    recordPlayerData.sectionItemIndex = sectionItemIndex
    waterfallBgPlayerRef?.value?.setPlayState(PlayerState.STATE_WAIT)
    delay4KFocusTimer = setTimeout(() => {
      waterfallBgPlayerRef?.value?.play(curBgPlayData)
    }, 300)
  }
}
/**
 * short item 焦点
 * @param tabPageIndex
 * @param sectionItemIndex
 * @param item
 */
const dealShortFocused = (tabPageIndex: number, sectionItemIndex: number, item: QTWaterfallItem) => {
  clearTimeout(shortVideoTimer)
  waterfallBgPlayerRef?.value.pause()
  curBgPlayData = item.play.playData
  if (curBgPlayData && curBgPlayData.length > 0) {
    const bgUrl = curBgPlayData[0].cover
    waterfallBgPlayerRef?.value?.setBgImage(bgUrl)
    recordPlayerData.tabPageIndex = tabPageIndex
    recordPlayerData.sectionItemIndex = sectionItemIndex
    waterfallBgPlayerRef?.value?.setPlayState(PlayerState.STATE_WAIT)
    shortVideoTimer = setTimeout(() => {
      waterfallBgPlayerRef?.value?.play(curBgPlayData)
    }, 300)
  }
}

const dealSmall4KFocused = (tabPageIndex: number, sectionItemIndex: number, item: QTWaterfallItem) => {
  curBgPlayData = item.play.playData
  clearTimeout(small4KTimer)
  clearTimeout(small4KSetChildSIdTimer)
  waterfallBgPlayerRef.value.pause()
  VirtualView.call('waterfallBgPlayerSid', 'changeAlpha', [1])
  VirtualView.call(TabContentConfig.homeBgPlaySid, 'changeAlpha', [0])
  small4KTimer = setTimeout(() => {
    waterfallBgPlayerRef.value?.setPlayState(PlayerState.STATE_WAIT)
    waterfallBgPlayerRef?.value.setBgImage('', false)
    curPlayerType = HomePlayType.TYPE_SMALL_4K
    if (!waterfallBgPlayerRef.value.playerWindowInit || isSwitchTabSmall4KFlag) {
      if (curBgPlayData) {
        const obj: HomePlayData = {
          type: HomePlayType.TYPE_SMALL_4K,
          windowWidth: <number>item.style?.width,
          windowHeight: <number>item.style?.height,
          playerWidth: item.play.style.width,
          playerHeight: item.play.style.height,
          playerLeft: 0,
          playerTop: 0,
          playerData: item.play.playData
        }
        doBgPlayItem(obj)
      }
      isSwitchTabSmall4KFlag = false
    } else {
      waterfallBgPlayerRef.value.play(curBgPlayData)
    }
  }, 300)
  small4KSetChildSIdTimer = setTimeout(() => {
    VirtualView.call('sectionSmall4kReplaceChildSid', 'setChildSID', [TabContentConfig.homeBgPlaySid])
    VirtualView.call('bg-player', 'changeAlpha', [1])
  }, 800)
}

/**
 * 设置首屏图
 * @param tabId
 * @param isSwitchBg
 * @param switchBg
 * @param isLoad
 */
const setFirstScreenImg = (tabId: string | null, isSwitchBg: string = '0', firstScreenBg: string = '', isLoad: boolean = false) => {
  if (isSwitchBg === '1') {
    curFirstScreenBg = firstScreenBg
    setWTabBg(firstScreenBg, isLoad)
  } else {
    const bg = getFirstBg(tabId || '')
    setWTabBg(bg, isLoad)
  }
}
/**
 * 获取首屏图
 * @param tabId
 */
const getFirstBg = (tabId: string): string => {
  return <string>barsDataManager.barsBgUrls.get(tabId)
}
/**
 * 设置二屏图
 * @param tabId
 */
const set2ScreenImg = (tabId: string) => {
  const imgUrl = get2Bg(tabId)
  setWTabBg(imgUrl)
}
/**
 * 获取二屏图
 * @param tabId
 */
const get2Bg = (tabId: string): string => {
  return <string>tabsContent.tab2BackgroundUrls.get(tabId)
}
/**
 * 设置背景图
 * @param bg
 * @param isLoad
 */
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
/**
 * 获取导航数据
 */
const getTabList = () => {
  homeManager.getTabList().then((tabList: any) => {
    const tab: QTTab = buildTabBarAdapter(tabList)
    //关闭启动界面
    try {
      Native.callNative('EsNativeModule', 'unSuspendLoadingView')
    } catch (e) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e('EsNativeModule unSuspendLoadingView error >> ' + e)
      }
    }
    tabRef.value?.initTab(tab)
    // tabRef.value?.initPage()
    const id = barsDataManager.barsBgUrls.get('firstShowBg')
    if (id) {
      setFirstScreenImg(id)
    }
  })
}
/**
 * 加载界面数据
 * @param pageIndex
 * @param pageNo
 */
const onTabPageLoadData = (pageIndex: number, pageNo: number) => {
  if (pageIndex >= 0 && pageIndex < barsDataManager.barsData?.itemList?.length) {
    const curTab = barsDataManager.barsData.itemList[pageIndex]
    //添加我的 导航
    if (TabBarConfig.tab.id === curTab._id && pageNo === 0) {
      getTabContent(curTab._id, pageIndex, pageNo + 1)
    } else {
      getTabContent(curTab._id ?? '', pageIndex, pageNo + 1)
    }
  }
}
const getTabContent = (tabId: string, tabPageIndex: number, pageNo: number) => {
  homeManager.getTabContent(tabId, pageNo, TabContentConfig.sectionLoadLimit).then(
    async (tabContent: any) => {
      const tabPage: QTTabPageData = await buildTabContentAdapter(tabContent, pageNo, tabId, tabPageIndex)
      if (tabPage.data.length > 0) {
        if (pageNo <= 1) {
          const playerType = barsDataManager.barsData.itemList[tabPageIndex].playType
          let index = 0
          if (playerType === HomePlayType.TYPE_SMALL_4K) {
            index = barsDataManager.barsData.itemList[tabPageIndex].sectionIndex
          }
          buildPlayerData(tabPageIndex, tabPage.data[index].itemList, tabPage)
          //判断当前tab是否有历史格子
          let historyItemPos: any = tabsContent.historyItemPos.filter((item) => item.tabIndex == tabPageIndex)
          if (historyItemPos.length > 0) updateHistoryItem(tabPageIndex, tabPage, 1, historyItemPos[0])
          else tabRef.value?.setPageData(tabPageIndex, tabPage)
        } else {
          if (barsDataManager.barsData.itemList[tabPageIndex].playType === HomePlayType.TYPE_SMALL_4K) {
            const sectionIndex = barsDataManager.barsData.itemList[tabPageIndex].sectionIndex
            buildPlayerData(tabPageIndex, tabPage.data[sectionIndex].itemList, tabPage)
          }
          tabRef.value?.addPageData(tabPageIndex, tabPage, 0)
        }
      }
      if (tabPage.isLoadPageEnd || tabPage.data.length === 0) {
        tabRef.value?.setPageState(tabPageIndex, QTTabPageState.QT_TAB_PAGE_STATE_COMPLETE)
      }
    },
    () => {
      toast.showToast('加载数据失败，稍后重试！')
    }
  )
}

// 构建历史格子数据
const buildHistoryItem = async (item) => {
  // 获取历史记录
  const data = await homeManager.getRecords('xxx', 'history', 1, 2)
  if (data.items.length === 0) {
    //无历史
    item.historyList = [
      {
        type: 4001,
        style: { width: item.style.width, height: item.style.height },
        text: '暂无历史记录',
        jumpParams: { type: 1, options: { name: 'history', params: {} } }
      }
    ]
  } else {
    // 有历史
    item.historyList = []

    // 文字模式
    data.items.forEach((_item) => {
      const percentage = Math.floor((item.viewedDuration / item.totalDuration) * 100)

      item.historyList.push(
        {
          type: 4002,
          style: { width: item.style.width, height: 76 },
          text: _item.title,
          progress: item.totalDuration > 0 && percentage > 0 ? `${percentage}%` : '< 1%',
          jumpParams: { type: 1, options: { name: 'detail', params: { mediaId: _item.id, startPosition: _item.viewedDuration } } }
        },
        {
          type: 4004,
          style: { width: item.style.width, height: 1 }
        }
      )
    })

    // 图片模式
    // item.historyList.push({
    //   type: 4005,
    //   style: { width: 410, height: 161 },
    //   cover: 'https://extcdn.hsrc.tv/channelzero_image/2022/10/25/97a8b741-2475-46d1-81ee-e6611cad0390.jpg?imageMogr2/interlace/0|imageMogr2/gravity/center/crop/336x198"',
    //   text: '禁忌女孩',
    //   progress: '观看 70%',
    //   jumpParams: { type: 1, options: { name: 'detail', params: { mediaId: 'xxx', startPosition: 0 } } }
    // })

    item.historyList.push({
      type: 4003,
      style: { width: item.style.width, height: 76 },
      text: '全部历史记录',
      jumpParams: { type: 1, options: { name: 'history', params: {} } }
    })
  }
}

/**
 * 更新历史格子的数据
 * @param tabPageIndex
 * @param tabPage
 * @param type 1 build数据 2 更新
 * @param historyItemPos 格子位置
 */
const updateHistoryItem = async (tabPageIndex, tabPage, type, historyItemPos) => {
  //历史格子默认配在第一个板块
  if (type == 1) {
    let item = tabPage.data[0].itemList[historyItemPos.itemIndex]
    await buildHistoryItem(item)
    tabRef.value?.setPageData(tabPageIndex, tabPage)
  }
}

/**
 * 加载 4K 数据
 * @param tabPageIndex
 * @param content4kId
 */
const load4KData = async (tabPageIndex: number, content4kId: string) => {
  const world4kSection = await homeManager.get4KSection(content4kId, 6, TabContentType.TYPE_WATERFALL_SECTION_4K)

  if (world4kSection && world4kSection.length > 0) {
    const cacheList = tabsContent.homeSectionCacheList.get(content4kId)
    if (!cacheList || cacheList.length < 1) tabsContent.homeSectionCacheList.set(content4kId, world4kSection)
    tabRef.value!.addPageItemList(tabPageIndex, 0, world4kSection)
    const playType = barsDataManager.barsData.itemList[tabPageIndex].playType
    const section4kItem = world4kSection[0]
    buildRecordPlayerMap(
      tabPageIndex,
      0,
      playType,
      <number>section4kItem?.style?.width,
      <number>section4kItem?.style?.height,
      section4kItem?.play?.style?.width,
      section4kItem?.play?.style?.height,
      253.5,
      TabContentConfig.firstSectionTop,
      section4kItem.play.playData
    )
  }
}

/**
 * 加载 short 数据
 * @param tabPageIndex
 * @param shortVideoId
 * @param pageNo
 */
const loadShortData = async (tabPageIndex: number, shortVideoId: string, pageNo: number) => {
  const shortVideoSection = await homeManager.getShortVideoSection(
    shortVideoId,
    TabContentType.TYPE_WATERFALL_SECTION_SHORT_SCREEN,
    pageNo,
    30
  )
  if (shortVideoSection && shortVideoSection.length > 0) {
    if (pageNo === 1) {
      const cacheList = tabsContent.homeSectionCacheList.get(shortVideoId)
      if (!cacheList || cacheList.length < 1) tabsContent.homeSectionCacheList.set(shortVideoId, shortVideoSection)
      tabRef.value!.addPageItemList(tabPageIndex, 0, shortVideoSection)
      const playType = barsDataManager.barsData.itemList[tabPageIndex].playType
      const shortVideoItem = shortVideoSection[0]
      buildRecordPlayerMap(tabPageIndex, 0, playType, 1920, 1080, 1920, 1080, 0, 0, shortVideoItem.play.playData)
    } else {
      // todo 分页加载 看接口，当前接口无分页 有分页，放开下面三行加载代码
      // const shortSection = tabRef.value?.getPageSection(tabPageIndex,0)
      // const shortListSid = shortSection?.shortList?.sid
      // VirtualView.call(shortListSid,'addListData',shortVideoSection)
    }
  }
}

const buildRecordPlayerMap = (
  tabPageIndex: number,
  sectionItemIndex: number,
  playType: HomePlayType,
  windowWidth: number,
  windowHeight: number,
  playerWidth: number,
  playerHeight: number,
  left: number,
  top: number,
  playerData: Array<IMediaList>
): HomePlayData => {
  const obj: HomePlayData = {
    type: HomePlayType.TYPE_UNDEFINED,
    windowWidth: 0,
    windowHeight: 0,
    playerWidth: 0,
    playerHeight: 0,
    playerLeft: 0,
    playerTop: 0,
    playerData: []
  }
  obj.type = playType
  const key = '_' + tabPageIndex
  if (recordPlayerMap.get(key) === undefined) {
    obj.windowWidth = windowWidth
    obj.windowHeight = windowHeight
    obj.playerWidth = playerWidth
    obj.playerHeight = playerHeight
    obj.playerLeft = left
    obj.playerTop = top
    obj.playerData = playerData
    obj.sectionItemIndex = sectionItemIndex
    obj.tabPageIndex = tabPageIndex
    recordPlayerMap.set(key, obj)
  }
  return obj
}
/**
 * 界面加载之前数据处理
 * @param pageIndex
 * @param sectionList
 */
// const onTabPageSectionAttached = (pageIndex: number, sectionList: any) => {
//
// }

const buildPlayerData = (tabPageIndex: number, sectionItemList: Array<QTWaterfallItem>, tabPage: QTTabPageData) => {
  const isPlay = barsDataManager.barsData.itemList[tabPageIndex].isPlay
  if (isPlay) {
    const playType = barsDataManager.barsData.itemList[tabPageIndex].playType
    if (playType !== HomePlayType.TYPE_UNDEFINED) {
      if (playType === HomePlayType.TYPE_4K || playType === HomePlayType.TYPE_SHORT_SCREEN) {
        tabPage.bindingPlayer = 'bgPlayerReplaceChildSid'
        return
      } else if (playType === HomePlayType.TYPE_SMALL_4K) {
        tabPage.bindingPlayer = 'sectionSmall4kReplaceChildSid'
        return
      }
      const sectionItemIndex = barsDataManager.barsData.itemList[tabPageIndex].sectionItemIndex
      if (sectionItemList && sectionItemList.length > sectionItemIndex) {
        const sectionItem = sectionItemList[sectionItemIndex]
        //每次都必须给bindingPlayer绑定replaceChild 的sid
        if (playType === HomePlayType.TYPE_BG) {
          tabPage.bindingPlayer = 'bgPlayerReplaceChildSid'
        } else if (playType === HomePlayType.TYPE_CELL || playType === HomePlayType.TYPE_CELL_LIST) {
          tabPage.bindingPlayer = sectionItem.play.sid
        }
        if (playType === HomePlayType.TYPE_BG) {
          buildRecordPlayerMap(tabPageIndex, sectionItemIndex, playType, 1920, 1080, 1920, 1080, 0, 0, sectionItem.play.playData)
        } else if (playType === HomePlayType.TYPE_CELL || playType === HomePlayType.TYPE_CELL_LIST) {
          buildRecordPlayerMap(
            tabPageIndex,
            sectionItemIndex,
            playType,
            sectionItem.style.width!,
            sectionItem.style.height!,
            sectionItem?.play?.style?.width,
            sectionItem?.play?.style?.height,
            0,
            0,
            sectionItem.play.playData
          )
        }
      }
    }
  }
}
const onESCreate = () => {
  EventBus.$on('DispatchKeyEvent', dispatchKeyEventFn)
  getTabList()
}

const onESPause = () => {
  if (curPlayerType !== HomePlayType.TYPE_UNDEFINED) {
    waterfallBgPlayerRef?.value.pause()
  }
  if (cur4KSid) {
    VirtualView.call(cur4KSid, 'changeVisibility', [`visible`])
  }
}

const onESStop = () => {
  isOnEsStop = true
  if (curPlayerType !== HomePlayType.TYPE_UNDEFINED) {
    waterfallBgPlayerRef?.value.stop()
    //防止视频未播放出后 执行完stop导致视频还有声音播放
    setTimeout(() => {
      waterfallBgPlayerRef.value?.stop()
    }, 300)
  }
}

const onESResume = () => {
  if (isOnEsStop) {
    isOnEsStop = false

    // 更新历史格子数据
    if (curTabPageIndex === 1) {
      //判断当前tab是否有历史格子
      let historyItemPos: any = tabsContent.historyItemPos.filter((item) => item.tabIndex === curTabPageIndex)
      if (historyItemPos.length > 0) {
        let pageItem = tabRef.value?.getPageItem(curTabPageIndex, 0, historyItemPos[0].itemIndex)
        if (pageItem) {
          nextTick(async () => {
            await buildHistoryItem(pageItem)
            tabRef.value?.updatePageItem(curTabPageIndex, 0, historyItemPos[0].itemIndex, pageItem)
          })
        }
      }
    }

    if (curPlayerType !== HomePlayType.TYPE_UNDEFINED && !isCeiling) {
      waterfallBgPlayerRef?.value.setBgImage('', true)
      waterfallBgPlayerRef.value?.setPlayState(PlayerState.STATE_WAIT)
      clearTimeout(resumePlayTimer)
      resumePlayTimer = setTimeout(() => {
        if (curBgPlayData) {
          waterfallBgPlayerRef?.value.play(curBgPlayData)
        }
      }, 401)
    }
  }
}

const onESDestroy = () => {
  waterfallBgPlayerRef.value?.destroy()
  clearTimeout(isMoreFrontTimer)
  clearTimeout(bgTimer)
  clearTimeout(typeBgFocusTimer)
  clearTimeout(delay4KFocusTimer)
  clearTimeout(shortVideoTimer)
  clearTimeout(small4KTimer)
  clearTimeout(resumePlayTimer)
  clearTimeout(small4KSetChildSIdTimer)
  EventBus.$off('DispatchKeyEvent', dispatchKeyEventFn)
}
const dispatchKeyEventFn = (keyEvent: ESKeyEvent) => {
  if (curPlayerType === HomePlayType.TYPE_4K && is4kSectionItemFocused) {
    if (
      keyEvent &&
      keyEvent.action === 1 &&
      (keyEvent.keyCode === ESKeyCode.ES_KEYCODE_BACK || keyEvent.keyCode === ESKeyCode.ES_KEYCODE_DPAD_UP)
    ) {
      VirtualView.call('tabNavBarSid', 'changeAlpha', [1])
      waterfallLogo4kRef.value?.clearImg()
      if (keyEvent.keyCode === ESKeyCode.ES_KEYCODE_DPAD_UP) {
        VirtualView.call('waterfallTopSid', 'changeVisibility', [`visible`])
      }
      is4kSectionItemFocused = false
    }
  }
}
const onKeyDown = (keyEvent: ESKeyEvent) => {}

const onKeyUp = (keyEvent: ESKeyEvent) => {}
const onBackPressed = (): boolean => {
  return false
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

<style lang="scss" src="../scss/waterfall-tabs.scss"></style>
