<template>
  <div class='waterfall-tabs-root-css' :clipChildren='false' :clipPadding='false'>
    <!--    背景图-->
    <bg-animation ref='waterfallBgRef' style='position: absolute' :focusable='false' />
    <!--    4k图标-->
    <bg-animation ref='waterfallLogo4kRef' class='waterfall-tabs-4k-logo'
                  :bgStyle='{width:"240px",height:"84px"}' :focusable='false'
                  :transitionTime='200' />
    <!-- 背景播放及小窗播放组件 -->
    <bg-player class='waterfall-tabs-bg-player' ref='waterfallBgPlayerRef' :clipChildren='false'
               sid='waterfallBgPlayerSid' />
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
        <!-- 小窗播放格子-->
        <cell-player-item :type='TabContentType.TYPE_ITEM_SECTION_CELL_PLAYER' />
      </template>

    </qt-tabs>


  </div>

</template>

<script lang='ts' setup name='waterfall-tabs'>

import { ESKeyEvent, ESLogLevel, useESLog, useESToast } from '@extscreen/es3-core'
import { useESRouter } from '@extscreen/es3-router'
import { Native } from '@extscreen/es3-vue'
import {
  QTITab,
  QTTab,
  QTTabEventParams,
  QTTabItem,
  QTTabPageData,
  QTTabPageState,
  QTWaterfallItem,
  VirtualView
} from '@quicktvui/quicktvui3'
import { ref } from 'vue'
import homeManager from '../../../api/home/home-manager'
import BgAnimation from '../../../components/bg-animation.vue'
import { IMediaList } from '../../../components/media/build-data/media-imp'
import { HomePlayData, HomePlayType, PlayerState } from '../build-data/media/home-media-imp'
import barsDataManager from '../build-data/nav-bar/nav-bar-adapter'
import NavBarConfig from '../build-data/nav-bar/nav-bar-config'
import NavBarItemType from '../build-data/nav-bar/nav-bar-item-type'
import tabsContent from '../build-data/tab-content/tab-content-adapter'
import TabContentConfig from '../build-data/tab-content/tab-content-config'
import TabContentType from '../build-data/tab-content/tab-content-item-type'
import BgPlayer from './media/bg-player.vue'
import BarImgItem from './nav-bar/bar-img-item.vue'
import BarTextItem from './nav-bar/bar-text-item.vue'
import CellPlayerItem from './tab-content/cell-player-item.vue'
import FocusChangeImgItem from './tab-content/focus-change-img-item.vue'
import InnerOutTitleItem from './tab-content/inner-out-title-item.vue'
import NoTitleItem from './tab-content/no-title-item.vue'
import PlaceHolderItem from './tab-content/place-holder-item.vue'
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
const router = useESRouter()
const toast = useESToast()
const waterfallBgRef = ref()
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
let curShortPlayerIndex = 0
let isMoreFront = false
let isMoreFrontTimer: any = -1
let bgTimer: any = -1
let resumePlayTimer: any = -1
//焦点背景播放 Timer
let typeBgFocusTimer:any = -1
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
      if (playType === HomePlayType.TYPE_SHORT) {
        //列表恢复原位置
        //todo  记得来修改成动态的sid getPageSection bug修复后
        // let listSID = sectionData!.listSID


        // let listSID = "shortVideoListSID"
        // VirtualView.call(listSID,'scrollToPosition',[0])
        // VirtualView.call(listSID,'setSelectChildPosition',[0,true])
      } else if (playType === HomePlayType.TYPE_4K) {
        // const _4KListSid = sectionData!.list4KSid
        // VirtualView.call(_4KListSid, 'scrollToPositionWithOffsetInfiniteMode', [0, 253, false])
        // VirtualView.call(_4KListSid, 'setSelectChildPosition', [1000000000, true])
      }
      recordPlayerData.tabPageIndex = tabPageIndex
      recordPlayerData.sectionItemIndex = obj.sectionItemIndex
      doBgPlayItem(obj)
    }else if (sectionData && sectionData.itemList && sectionData.itemList.length>0 && sectionData.itemList[0]?.imageFocusBackground){
      const firstBgUrl = sectionData.itemList[0]?.imageFocusBackground
      setFirstScreenImg("",'1',firstBgUrl,true)
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
    //todo 4k逻辑
  }
  waterfallBgPlayerRef.value?.initPlay(hpd)
}
/**
 * tab切换回调
 * @param pageIndex
 * @param data
 */
const onTabPageChanged = (pageIndex: number, data: any) => {
  //隐藏播放器
  VirtualView.call("waterfallBgPlayerSid",'changeAlpha',[0])
  isMoreFront = false
  curFirstScreenBg = ""
  curShortPlayerIndex = 0
  waterfallBgPlayerRef.value?.pause()
  waterfallBgPlayerRef.value?.stop()
  waterfallBgPlayerRef.value?.setBgImage("")
  curPlayerType = HomePlayType.TYPE_UNDEFINED
  clearTimeout(isMoreFrontTimer)
  //设置首屏图
  setFirstScreenImg(barsDataManager.barsData.itemList[pageIndex]._id,"0","",true)
}
/**
 * 吸顶开始
 * @param pageIndex
 * @param eventName
 * @param params
 */
const onTabMoveToTopStart = (pageIndex: number, eventName: string, params: QTTabEventParams) => {
  isCeiling = true
  if (curPlayerType !== HomePlayType.TYPE_UNDEFINED && curPlayerType !== HomePlayType.TYPE_SMALL_4K) {
      //隐藏播放器
      VirtualView.call('waterfallBgPlayerSid', 'changeAlpha', [0])
      waterfallBgPlayerRef.value?.pause()
      waterfallBgPlayerRef.value?.stop()
  }
  //设置二屏图
  set2ScreenImg(barsDataManager.barsData.itemList[curTabPageIndex]._id)
}
/**
 * 恢复吸顶结束
 * @param pageIndex
 * @param eventName
 * @param params
 */
const onTabMoveToBottomEnd = (pageIndex: number, eventName: string, params: QTTabEventParams) => {
  isCeiling = false
  if (curPlayerType !== HomePlayType.TYPE_UNDEFINED && curPlayerType !== HomePlayType.TYPE_SMALL_4K){
    //显示播放器
    VirtualView.call('waterfallBgPlayerSid', 'changeAlpha', [1])
    if (curPlayerType === HomePlayType.TYPE_BG){
      waterfallBgPlayerRef?.value.setBgImage("",true)
    }
    waterfallBgPlayerRef.value?.setPlayState(PlayerState.STATE_WAIT)
    setTimeout(()=>{
      waterfallBgPlayerRef?.value.play(curBgPlayData)
    },400)
  }
  //设置首屏图
  if (curFirstScreenBg){
    setFirstScreenImg("",'1',curFirstScreenBg,true)
  }else{
    setFirstScreenImg(barsDataManager.barsData.itemList[curTabPageIndex]._id)
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

}
/**
 * 格子item 焦点事件
 * @param pageIndex
 * @param sectionIndex
 * @param itemIndex
 * @param isFocused
 * @param item
 */
const onTabPageItemFocused = (tabPageIndex: number, sectionIndex: number, sectionItemIndex: number, isFocused: boolean, item: QTWaterfallItem) => {

  if (isFocused){
    //背景播放
    if (curPlayerType === HomePlayType.TYPE_BG && sectionIndex === 0){
      typeBgFocused(tabPageIndex,sectionIndex,sectionItemIndex,item)
    }else{
      //格子焦点切换背景
      if (sectionIndex === 0 && item.imageFocusBackground){
        setFirstScreenImg("",'1',item.imageFocusBackground)
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
const typeBgFocused = (tabPageIndex: number, sectionIndex: number, sectionItemIndex: number,item: QTWaterfallItem) =>{
  //相同位置不再触发
  if (recordPlayerData.tabPageIndex === tabPageIndex && recordPlayerData.sectionItemIndex === sectionItemIndex)return
  clearTimeout(typeBgFocusTimer)
  curBgPlayData = item.play.playData
  if (curBgPlayData && curBgPlayData.length > 0){
    const bgUrl = curBgPlayData[0].cover
    waterfallBgPlayerRef?.value?.setBgImage(bgUrl)
    waterfallBgPlayerRef?.value?.setPlayState(PlayerState.STATE_WAIT)
    recordPlayerData.tabPageIndex = tabPageIndex
    recordPlayerData.sectionItemIndex = sectionItemIndex
    typeBgFocusTimer = setTimeout(()=>{
      waterfallBgPlayerRef?.value?.play(curBgPlayData)
    },300)
  }
}

/**
 * 设置首屏图
 * @param tabId
 * @param isSwitchBg
 * @param switchBg
 * @param isLoad
 */
const setFirstScreenImg = (tabId:string,isSwitchBg:string = '0',firstScreenBg:string='',isLoad:boolean=false)=>{
  if (isSwitchBg === '1'){
    curFirstScreenBg = firstScreenBg
    setWTabBg(firstScreenBg, isLoad)
  }else{
    const bg = getFirstBg(tabId)
    setWTabBg(bg,isLoad)
  }
}
/**
 * 获取首屏图
 * @param tabId
 */
const getFirstBg = (tabId: string): string=>{
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
  homeManager.getTabList().then((tab: QTTab) => {
    //关闭启动界面
    try {
      Native.callNative('EsNativeModule', 'unSuspendLoadingView')
    }catch (e) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e("EsNativeModule unSuspendLoadingView error >> "+e)
      }
    }
    tabRef.value?.initTab(tab)
    // tabRef.value?.initPage()
    const id = barsDataManager.barsBgUrls.get("firstShowBg")
    if (id){
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
        if (pageNo <= 1) {
          buildPlayerData(tabPageIndex, tabPage.data[0].itemList, tabPage, tabId)
          tabRef.value?.setPageData(tabPageIndex, tabPage)
        } else {
          tabRef.value?.addPageData(tabPageIndex, tabPage, 0)
        }
      }
      if (tabPage.isLoadPageEnd || tabPage.data.length === 0) {
        tabRef.value?.setPageState(tabPageIndex, QTTabPageState.QT_TAB_PAGE_STATE_COMPLETE)
      }
    }, () => {
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

const buildPlayerData = (tabPageIndex: number, sectionItemList: Array<QTWaterfallItem>, tabPage: QTTabPageData, tabId: string) => {
  const isPlay = barsDataManager.barsData.itemList[tabPageIndex].isPlay
  if (isPlay) {
    const playType = barsDataManager.barsData.itemList[tabPageIndex].playType
    if (playType === HomePlayType.TYPE_CELL || playType === HomePlayType.TYPE_CELL_LIST || playType === HomePlayType.TYPE_BG) {
      const sectionItemIndex = barsDataManager.barsData.itemList[tabPageIndex].sectionItemIndex
      if (sectionItemList && sectionItemList.length > sectionItemIndex) {
        const sectionItem = sectionItemList[sectionItemIndex]
        let obj: HomePlayData = {
          type: HomePlayType.TYPE_UNDEFINED,
          windowWidth: 0,
          windowHeight: 0,
          playerWidth: 0,
          playerHeight: 0,
          playerLeft: 0,
          playerTop: 0,
          playerData: []
        }
        let key = '_' + tabPageIndex
        obj.type = playType
        //每次都必须给bindingPlayer绑定replaceChild 的sid
        if (obj.type === HomePlayType.TYPE_BG) {
          tabPage.bindingPlayer = 'bgPlayerReplaceChildSid'
        } else if (obj.type === HomePlayType.TYPE_CELL || obj.type === HomePlayType.TYPE_CELL_LIST) {
          tabPage.bindingPlayer = sectionItem.play.sid
        }
        if (recordPlayerMap.get(key) == undefined) {
          if (obj.type === HomePlayType.TYPE_BG) {
            obj.windowWidth = 1920
            obj.windowHeight = 1080
            obj.playerWidth = 1920
            obj.playerHeight = 1080
            obj.playerLeft = 0
            obj.playerTop = 0
            obj.playerData = sectionItem.play.playData
          } else if (obj.type === HomePlayType.TYPE_CELL
            || obj.type === HomePlayType.TYPE_CELL_LIST) {
            obj.windowWidth = sectionItem.style.width
            obj.windowHeight = sectionItem.style.height
            obj.playerWidth = sectionItem?.play?.style?.width
            obj.playerHeight = sectionItem?.play?.style?.height
            obj.playerLeft = 0
            obj.playerTop = 0
            obj.playerData = sectionItem.play.playData
          }
          obj.sectionItemIndex = sectionItemIndex
          obj.tabPageIndex = tabPageIndex
          recordPlayerMap.set(key, obj)
        }
      }
    }
  }

}
const onESCreate = () => {
  getTabList()
}
const onESRestart = () => {
}

const onESPause = () => {
  if (curPlayerType !== HomePlayType.TYPE_UNDEFINED){
    waterfallBgPlayerRef?.value.pause()
  }

}

const onESStop = () => {
  isOnEsStop = true
  if (curPlayerType !== HomePlayType.TYPE_UNDEFINED){
    waterfallBgPlayerRef?.value.stop()
    //防止视频未播放出后 执行完stop导致视频还有声音播放
    setTimeout(()=>{waterfallBgPlayerRef.value?.stop()},300)
  }
}

const onESResume = () => {
  if (isOnEsStop){
    isOnEsStop = false
    if (curPlayerType !== HomePlayType.TYPE_UNDEFINED && !isCeiling){
      waterfallBgPlayerRef?.value.setBgImage("",true)
      waterfallBgPlayerRef.value?.setPlayState(PlayerState.STATE_WAIT)
      clearTimeout(resumePlayTimer)
      resumePlayTimer = setTimeout(()=>{
        if (curBgPlayData){
          waterfallBgPlayerRef?.value.play(curBgPlayData)
        }
      },401)

    }
  }
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
