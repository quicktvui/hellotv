<template>
  <qt-view class="waterfall-tab-root-css" :clipChildren="false" ref="waterfall_tab_root" :descendantFocusability="descendantFocusability"
      :clipPadding="false">
      <waterfall-background ref="wTabBg"/>
      <!-- 背景播放及小窗播放组件 -->
    <bg-player class="bg_player" ref="bg_player" :clipChildren="false" style="position: absolute;" />

    <div ref="buttonsHeaderDiv" name="buttonsHeaderDiv" class="buttons-header-css" :clipChildren="false"
      v-if="isShowTop" :blockFocusDirections="['left', 'right', 'up']">
      <slot name="buttonsHeader"/>
    </div>

    <qt-tabs
      ref="tabRef" :visible="!isBgPlayerFront"
      :tabContentBlockFocusDirections="['left', 'right', 'down', 'top']"
      tabNavBarClass="qt-tabs-waterfall-tab-css"
      tabPageClass="qt-tabs-waterfall-css"
      :horizontalFadingEdgeEnabled="true"
      :fadingEdgeLength="400"
      tabNavBarSid="tabNavBarSid"
      :triggerTask="tabsTriggerTask"
      :outOfDateTime="5 * 60 * 1000"
      @onTabClick="onTabClick"
      :tabContentSwitchDelay="300"
      :tabContentResumeDelay="300"
      :useDiff=false
      sid='homeTabs'
      :autoHandleBackKey="autoHandleBackKey"
      :custom-pool="{ name: 'home' }"
      :custom-item-pool="{ name: 'homeItems' }"
      @onTabPageChanged="onTabPageChanged"
      @onTabMoveToTopStart="onTabMoveToTopStart"
      @onTabMoveToTopEnd="onTabMoveToTopEnd"
      @onTabMoveToBottomStart="onTabMoveToBottomStart"
      @onTabMoveToBottomEnd="onTabMoveToBottomEnd"
      @onTabPageScrollToEnd="onTabPageScrollToEnd"
      @onTabPageScrollToStart="onTabPageScrollToStart"
      @onTabPageItemClick="onTabPageItemClick"
      @onTabPageItemFocused="onTabPageItemFocused"
      @onTabPageLoadData="onTabPageLoadData"
      @onTabPageScroll="onTabPageScroll"
      @onTabEvent='onTabEvent'
      @onTabPageSectionAttached="onTabPageSectionAttached"
      class="qt-tabs-css">
      <template v-slot:tab-item>
        <tab-image-item :type="1"/>
        <tab-icon-item :type="2" cornerIconLeft/>
        <tab-text-icon-item :type="3" cornerIconLeft textIconLeft/>
      </template>
      <template v-slot:waterfall-item>
        <qt-poster :type="10001" :borderRadius="20" :rippleColor="'#157AFC'"
                    :focusTitleColor="focusTextColor"
                    :focusSubTitleColor="focusTextColor"
                    :floatTitleBgColor="floatTitleBgColor"
                    :focusBgColor="{ colors: focusBgColor, cornerRadii4: [0, 0, 20, 20] }">
        </qt-poster>
        <page-state-image-item :type="1"/>
        <page-no-frame-item :type="2"/>
        <page-place-holder-item :type="3"/>
        <item-cell-player :type="10008" ref="item_cell_player" :clipChildren="false"/>
        <my-item-history :type="121" />
        <my-item-history-img :type="122" />
        <MyTemplates :focusable="false"/>
      </template>
      <template v-slot:waterfall-list-item>
        <qt-poster :type="10001" :borderRadius="20" :rippleColor="'#157AFC'"
                    :focusTitleColor="focusTextColor"
                    :focusSubTitleColor="focusTextColor"
                    :floatTitleBgColor="floatTitleBgColor"
                    :focusBgColor="{ colors: focusBgColor, cornerRadii4: [0, 0, 20, 20] }">

        </qt-poster>
        <page-state-image-item :type="1"/>
        <page-no-frame-item :type="2"/>
        <page-place-holder-item :type="3"/>
        <my-item-history :type="121" />
        <my-item-history-img :type="122" />
      </template>
      <template v-slot:waterfall-vue-section>
        <!-- <loading :isFullScreen="true" :width="120" :height="120" /> -->
      </template>
      <template v-slot:waterfall-section>
        <short-video-section :type="1009" :isHorizontal="false" @loadMore="listSectionLoadMore"/>
        <short-video-section :type="1010" :isHorizontal="true" @loadMore="multilevelTabLoadMore"/>
        <world-4k-section :type="1020" />
      </template>
    </qt-tabs>
    <!-- <loading style="position: absolute;z-index: 999;" :is-full-screen="true"/> -->
  </qt-view>
</template>

<script lang="ts">
import { ESIPlayerInterceptor } from "@extscreen/es3-player"
import { defineComponent } from "@vue/runtime-core";
import { ref } from "vue";
import ThemeConfig from "../../../build/ThemeConfig"
import { createESHomeBGPlayerMediaInterceptor } from "../play_interceptor/createESHomeBGPlayerMediaInterceptor"
import World4kSection from "./tab/world-4k-section.vue"
import WaterfallBackground from "./waterfall-background.vue";
import {
  QTITab, QTIView, QTTab, QTTabEventParams, QTTabItem,
  QTTabPageData, QTTabPageState, QTWaterfallItem,
  QTWaterfallSection,
  QTWaterfallSectionType,VirtualView
} from '@quicktvui/quicktvui3'
import { ESLogLevel, useESDevice, useESLog, useESToast, ESKeyEvent, ESKeyCode } from '@extscreen/es3-core'
import { useLaunch } from "../../../tools/launch/useApi";
import { useGlobalApi } from "../../../api/UseApi";
import BuildConfig from "../../../build/BuildConfig";
import { buildTabPage } from "../build_data/tab/tabs";
import { tabContentTop } from "../build_data/tab_content/TabContentAdapter";
import TabImageItem from "./tab/tab-image-item.vue";
import PageStateImageItem from "./page/page-state-image-item.vue";
import TabIconItem from "./tab/tab-icon-item.vue";
import TabTextIconItem from "./tab/tab-text-icon-item.vue";
import PagePlaceHolderItem from "./page/page-place-holder-item.vue";
import PageNoFrameItem from "./page/page-no-frame-item.vue";
import itemCellPlayer from "./item-cell-player.vue"
import MyItemHistory from "./history/item-history.vue"
import MyItemHistoryImg from "./history/item-history-img.vue"
import bgPlayer, { CoveredPlayerType } from "../../../components/bg-player.vue"
import loading from "../../../components/Loading.vue"
import config from '../config'
import myHistory from './history/index'
import MyTemplates from '../../my/MyTemplates.vue'
// @ts-ignore
import myDataManager from '../../my/index.ts'
import shortVideoSection from "../../shortVideo/component/short_video_section.vue";
import { useESRouter } from "@extscreen/es3-router"

const TAG = "WATERFALL-TABS"

export default defineComponent({
  name: "waterfall-tabs",
  components: {
    World4kSection,
    PageNoFrameItem,MyItemHistory,MyItemHistoryImg,MyTemplates,
    PagePlaceHolderItem, itemCellPlayer, bgPlayer, loading,
    TabTextIconItem, TabIconItem, PageStateImageItem, TabImageItem, WaterfallBackground,
    shortVideoSection
  },
  props: {
    isShowTop: {
      type: Boolean,
      default: true
    }
  },
  emits: ["changeBgPlayerZindex"],
  setup(props, context) {
    const focusBgColor = ThemeConfig.tabContentBgGradientFocusColor
    const focusTextColor = ThemeConfig.tabContentFocusColor
    const floatTitleBgColor = ThemeConfig.tabContentFloatBgFocusColor
    let waterfall_tab_root = ref<QTIView>()
    const tabsTriggerTask = [
      {
        event: 'onContentScrollYGreater',
        target: 'buttonsHeaderDiv',
        function: 'changeVisibility',
        params: ['invisible'],
      },
      {
        event: 'onContentScrollYLesser',
        target: 'buttonsHeaderDiv',
        function: 'changeVisibility',
        params: ['visible'],
      },
      // {
      //     event: 'onPageChange',
      //     target: 'home_player',
      //     function: 'changeAlpha',
      //     params: [0],
      // },
    ]
    const log = useESLog()
    const launch = useLaunch()
    const toast = useESToast()
    const router = useESRouter()
    const deviceManager = useESDevice()
    const globalApi = useGlobalApi()
    const tabRef = ref<QTITab>()
    //播放背景组件相关
    const bg_player = ref()
    let bgPlayerType = ref(CoveredPlayerType.TYPE_UNDEFINED)
    let recordPlayerData = {
      pageIndex: -1,
      itemIndex: 0,
    }
    let recordPlayerDataMap = new Map()
    let isOneTime: boolean = false
    let isOneTimeStop: boolean = false
    let mediaInterceptor: ESIPlayerInterceptor
    //背景图
    const wTabBg = ref()
    //tab
    let tabItemList: Array<QTTabItem>
    let delayStopPlayerTimer: any = -1
    let currentShortVideoPlayUrl = ref('')
    let delayResumeTimer: any = -1
    let isCelling = ref(false)
    let isOnEsStop = ref(false)
    let isBgPlayerFront = ref(false)
    let autoHandleBackKey = ref(true)
    let currentPlayerIndex = ref(0)
    let descendantFocusability = ref(1)

    function onESCreate(params) {
      isOneTime = true
      mediaInterceptor = createESHomeBGPlayerMediaInterceptor(globalApi)
      getTabList()
    }

    function getTabList() {
      globalApi.getTabList().then((tab: QTTab) => {
        tabItemList = tab.itemList
        tabRef.value?.initTab(tab)
        tabRef.value?.initPage(buildTabPage())
      },
        error => {
          toast.showToast('加载数据失败，稍后重试！')
        })
    }


    function onESResume() {
      if (isOneTime) {
        isOneTime = false
        return
      } else {
        if (!isOnEsStop.value) {
          if (bgPlayerType.value != -1) bg_player?.value.start()
        }else{
          isOnEsStop.value = false
          if (bgPlayerType.value != -1 && !isCelling.value) {
            delayResumeTimer && clearTimeout(delayResumeTimer)
            bg_player?.value.setCurBg()
            delayResumeTimer = setTimeout(() => {
              bg_player.value?.resume()
              bg_player?.value.requestDismissCover()
            }, 601)
          }
        }
      }
      myDataManager.isShow = true
      myDataManager.updateData()
    }

    function onESStop() {
      changeBgPlayerZindex('after')
      isOnEsStop.value = true
      bg_player.value?.pause()
      bg_player.value?.stop()
      myDataManager.isShow = false
    }

    function onESPause() {
      bg_player?.value.pause()
      myDataManager.isShow = false
    }

    function onESDestroy() {
      changeBgPlayerZindex('after')
      bg_player.value?.reset()
      delayStopPlayer()
      myDataManager.clear()
    }

    function onTabPageLoadData(pageIndex: number, pageNo: number, useDiff: boolean): void {
      if (tabItemList && pageIndex >= 0 && pageIndex < tabItemList.length) {
        const tab = tabItemList[pageIndex]
        // 处理"我的"Tab展示
        if (config.tab.showMineTab && pageIndex === 0 && pageNo === 0) {
          myDataManager.setData(tabRef, pageIndex, tabContentTop)
        } else {
          if (tab._id == '0' || tab._id) getTabContent(tab._id, pageIndex, pageNo + 1)
        }
      }
    }

    function getTabContent(tabId: string, tabPageIndex: number, pageNo: number) {
      globalApi.getTabContent(tabId, pageNo, BuildConfig.tabContentPageSize, tabPageIndex)
        .then((tabPage: QTTabPageData) => {
          if (tabPage.data.length > 0) {
            setTabPagePageNo(tabPageIndex, pageNo)
            if (log.isLoggable(ESLogLevel.DEBUG)) {
              log.d(TAG, '---------getTabContent-----pageNo--->>>>' + pageNo +
                ' tabPageIndex:' + tabPageIndex +
                ' pageNo:' + pageNo +
                ' tabPage:', tabPage)
            }

            if (pageNo <= 1) {
              buildPlayerData(tabPageIndex, tabPage.data[0].itemList, tabPage, tabId)
              if(tabPageIndex === myHistory.tabPageIndex){
                myHistory.initData(tabPageIndex, tabPage).then((_tabPage)=>{
                  tabRef.value?.setPageData(tabPageIndex, _tabPage)
                })
              } else {
                tabRef.value?.setPageData(tabPageIndex, tabPage)
              }
              // tabRef.value?.setPageData(tabPageIndex, tabPage)
              //tabPage.bindingPlayer = 'CELL_LIST'
            } else {
              tabRef.value?.addPageData(tabPageIndex, tabPage, 0)
            }
          }
          if (tabPage.isEndPage) {
            tabRef.value?.setPageState(tabPageIndex, QTTabPageState.QT_TAB_PAGE_STATE_COMPLETE)
          }
        },
          error => {
            toast.showToast('加载数据失败，稍后重试！')
          })
    }

    function setTabPagePageNo(tabPageIndex: number, pageNo: number) {
      const tab: QTTabItem = tabItemList[tabPageIndex]
      tab.pageNo = pageNo
    }
    // 加载数据时获取小窗 小窗列表 背景播放数据
    async function buildPlayerData(pageIndex: number, itemList: any, tabPage: QTTabPageData, tabId: string) {
      if(tabId == 'short_video' || tabId == 'short_video2') {
        let obj: any = {}
        let key = '' + pageIndex
        obj.playerType = CoveredPlayerType.TYPE_BG
        tabPage.bindingPlayer = 'bg_player_replace_child_sid'
        if (recordPlayerDataMap.get(key) == undefined) {
          obj.data = []
          obj.pageIndex = pageIndex
          obj.sid = 'bg_player_replace_child_sid'
          obj.playerWidth = tabId == 'short_video2' ? 1920 : 1140
          obj.playerHeight = tabId == 'short_video2' ? 1080 : 640
          obj.playType = 2
          obj.itemIndex = 0
          for (let i = 0; i < itemList.length; i++) {
            const el = itemList[i];
            let objectt = {
              id: el.id,
              title: el.title,
              cover: el.poster,
              url: [{playUrl:el.url,definition:"1"}],
              isRequestUrl:false,
              tag: tabId == 'short_video2'? '' : el.videoInfo.tag ??'',
              score: tabId == 'short_video2'? '' : el.videoInfo.score ??'',
              sort: tabId == 'short_video2'? '' : el.videoInfo.sort ??'',
              desc: tabId == 'short_video2'? '' : el.videoInfo.desc ??'',
              isShow: true
            }
            obj.data.push(objectt)
          }
          currentShortVideoPlayUrl.value = itemList[0].url
          recordPlayerDataMap.set(key, obj)
        }
        return
      }
      for (let i = 0; i < itemList.length; i++) {
        const el = itemList[i];
        let obj: any = {}
        let key = '' + pageIndex
        if (el.isCellPlayer) {
          if (el.isCellPlayerList) obj.playerType = CoveredPlayerType.TYPE_CELL_LIST
          else obj.playerType = CoveredPlayerType.TYPE_CELL
          if (recordPlayerDataMap.get(key) == undefined) {
            obj.pageIndex = pageIndex
            obj.sid = el.sid
            obj.playerWidth = el.style.width
            obj.playerHeight = el.style.height
            obj.itemIndex = i
            obj.data = el.playData
            recordPlayerDataMap.set(key, obj)
          }
          //将每个tab与播放器绑定，供底层处理一些播放器相关优化逻辑，例如切换tab时，播放器会自动隐藏
          tabPage.bindingPlayer = el.sid
          if (el.sid) break;
        } else if (el.isBgPlayer) {
          obj.playerType = CoveredPlayerType.TYPE_BG
          //log.e("DebugReplaceChild",`set bg_player_replace_child_sid`)
          //将每个tab与播放器绑定，供底层处理一些播放器相关优化逻辑，例如切换tab时，播放器会自动隐藏
          tabPage.bindingPlayer = 'bg_player_replace_child_sid'
          if (recordPlayerDataMap.get(key) == undefined) {
            obj.pageIndex = pageIndex
            obj.sid = 'bg_player_replace_child_sid'
            obj.playerWidth = 1920
            obj.playerHeight = 1080
            obj.itemIndex = i
            obj.data = el.item.playData
            recordPlayerDataMap.set(key, obj)
          }
        }
      }
    }

    /**
     * tab 移至最顶上时
     * @param pageIndex
     * @param eventName
     * @param params
     */
    let delayPauseTimer: any = -1
    function onTabMoveToTopStart(pageIndex: number, eventName: string, params: QTTabEventParams) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-------onTabMoveToTopStart----------->>>',
          ' pageIndex:' + pageIndex +
          ' eventName:' + eventName +
          ' params:', params
        )
      }
      isCelling.value = true
      if (bgPlayerType.value == CoveredPlayerType.TYPE_BG) {
        bg_player?.value.pause()
        bg_player?.value.keepPlayerInvisible(false)
        bg_player.value.initPlayBg("")
      } else {
        bg_player?.value.pause()
        bg_player?.value.setCurBg()
        delayPauseTimer && clearTimeout(delayPauseTimer)
        delayPauseTimer = setTimeout(() => {
          bg_player?.value.stop()
          // bg_player?.value.setCurBg()
          bg_player?.value.showCoverImmediately(true)
        }, 900)
      }
    }
    function onTabMoveToTopEnd(pageIndex: number, eventName: string, params: QTTabEventParams) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-------onTabMoveToTopEnd----------->>>',
          ' pageIndex:' + pageIndex +
          ' eventName:' + eventName +
          ' params:', params
        )
      }
    }

    function onTabMoveToBottomStart(pageIndex: number, eventName: string, params: QTTabEventParams) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-------onTabMoveToBottomStart----------->>>',
          ' pageIndex:' + pageIndex +
          ' eventName:' + eventName +
          ' params:', params
        )
      }
    }

    /**
     * tab回到最初状态
     * @param pageIndex
     * @param eventName
     * @param params
     */
    function onTabMoveToBottomEnd(pageIndex: number, eventName: string, params: QTTabEventParams) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-------onTabMoveToBottomEnd----------->>>',
          ' pageIndex:' + pageIndex +
          ' eventName:' + eventName +
          ' params:', params
        )
      }
      isCelling.value = false
      if (bgPlayerType.value != -1) {
        if (bgPlayerType.value == CoveredPlayerType.TYPE_BG) {
          bg_player?.value.setCurBg()
          bg_player.value.delayShowPlayer(200)
        }
        bg_player?.value.resume()
        bg_player?.value.requestDismissCover(1300)
      }
    }
    function onTabPageScrollToEnd(pageIndex: number) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-------onTabPageScrollToEnd----------->>>',
          ' pageIndex:' + pageIndex
        )
      }
    }

    function onTabPageScrollToStart(pageIndex: number) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-------onTabPageScrollToStart----------->>>',
          ' pageIndex:' + pageIndex
        )
      }
    }

    // waterfall item 加载之前回调  处理小窗及背景播放逻辑
    let delayDealwithplayerTimer: any = -1
    function onTabPageSectionAttached(pageIndex: number, sectionList: any) {
      const isSwitchCellBg = sectionList[0].isSwitchCellBg
      if (!isSwitchCellBg || isSwitchCellBg === "0") {
        const bg = globalApi.getTabBg(tabItemList[pageIndex]._id)
        wTabBg.value?.setImg(bg, "", true, false)
      }
    }
    function onTabPageItemClick(pageIndex: number, sectionIndex: number, itemIndex: number, item: QTWaterfallItem, e) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '---------onTabPageItemClick-------->>>>' +
          " pageIndex: " + pageIndex +
          " sectionIndex: " + sectionIndex +
          " itemIndex: " + itemIndex +
          " item: ", item
        )
      }
      if(item.name == 'list_section_item'){
        let currentTabItem = tabItemList[pageIndex]
        if(currentTabItem._id == 'short_video'){
          let obj = {
            item: item
          }
          launch.launch(obj)
        }else if(currentTabItem._id == 'short_video2'){
          isBgPlayerFront.value = true
          clearTimeout(delayPlayerShowFrontTimer)
          context.emit("changeBgPlayerZindex", isBgPlayerFront.value)
          autoHandleBackKey.value = false
          bg_player.value.zIndex = 999
          
        }
        return
      }
      if(myHistory.checkName(e.name)){
        launch.launch({...item, item: { ...(item.item||{}), ...myHistory.getRouter(e.name) }})
      } else {
        if(item._router?.url==='logout'){
          myDataManager.logout()
        }else{
          launch.launch(item)
        }
      }
    }
    function onTabPageItemFocused(pageIndex: number, sectionIndex: number, itemIndex: number, isFocused: boolean, item: QTWaterfallItem) {
      if (isFocused) {
        if(item.name == 'tab_list_section_item' || item.name == 'list_section_item'){
          dealwithListSectionItemFocused(pageIndex, sectionIndex, itemIndex, isFocused, item)
          return
        }
        if (bgPlayerType.value == CoveredPlayerType.TYPE_BG && sectionIndex === 0) {
          if (recordPlayerData.pageIndex == pageIndex && recordPlayerData.itemIndex == itemIndex) {
            log.i("BG-PLAYER", `return on same item`)
          } else {
            clearTimeout(delayDealwithplayerTimer)
            bg_player.value.initPlayBg(item.item.playData[0].cover)
            bg_player.value.showCoverImmediately()
            bg_player.value.stopIfNeed()
            recordPlayerData.pageIndex = pageIndex
            recordPlayerData.itemIndex = itemIndex
            delayDealwithplayerTimer = setTimeout(async () => {
              bg_player.value.play(item.item.playData[0])
            }, 300)
          }
        } else {
          if (item.item?.focusScreenImage && sectionIndex === 0) {//第一个板块且是格子切换背景
            const cellBg = item.item.focusScreenImage
            wTabBg.value?.setImg(cellBg, "", true, false)
          } else {
            const bg = globalApi.getTabBg(tabItemList[pageIndex]._id)
            wTabBg.value?.setImg(bg, "", true, false)
          }
        }
      }
    }
    function onTabEvent(tabIndex: number, eventName: string, params: any) {
      if (eventName == 'onPageBringToFront') {
        let pageIndex = params.page
        let sectionData = tabRef.value?.getPageSection(pageIndex, 0)
        let obj: any = recordPlayerDataMap.get('' + pageIndex)
        if (obj) {
          recordPlayerData.pageIndex = pageIndex
          recordPlayerData.itemIndex = obj.itemIndex
          let playData = obj.data
          let flag = obj.playerType
          let width = obj.playerWidth
          let height = obj.playerHeight
          let parentSID: string = ''
          if (flag == CoveredPlayerType.TYPE_CELL) {
            bgPlayerType.value = flag
            bg_player.value?.doChangeParent(parentSID, flag,
              width, height, width, height,
              playData, 0, 15,10,1, mediaInterceptor
            )
          } else if (flag == CoveredPlayerType.TYPE_CELL_LIST) {
            bgPlayerType.value = flag
            bg_player.value?.doChangeParent(parentSID, flag,
              width, height, 860, height,
              playData, 0, 15,10,1,mediaInterceptor
            )
          } else if (flag == CoveredPlayerType.TYPE_BG) {
            bgPlayerType.value = flag
            bg_player.value?.doChangeParent(parentSID, flag,
              1920, 1080, width, height,
              playData, 0, width < 1920 ? 732 : 0,  width < 1920 ? 220 : 0, obj.playType??1, mediaInterceptor
            )
            bg_player.value?.delayShowPlayer()
            changeBgPlayerZindex('front')
          }
        }
        else if (sectionData && sectionData.isSwitchCellBg === '1') {
          const cellBg = sectionData.itemList[0]?.item.focusScreenImage
          wTabBg.value?.setImg(cellBg, "", true, false)
          delayStopPlayer()
        } else {
          delayStopPlayer()
        }
        bg_player.value?.delayShowPlayer(500)
      }
    }

    function onTabPageScroll(offsetX: number, scrollY: number) {}

    function onTabPageChanged(pageIndex: number, data: any) {
      log.d("BG-PLAYER", '-------onTabPageChanged----------->>>',
        ' pageIndex:' + pageIndex
      )
      bg_player.value.setVideoInfo({isShow:false})
      bgPlayerType.value = -1
      currentPlayerIndex.value = 0
      bg_player.value?.pause()
      bg_player?.value.keepPlayerInvisible(true)
      changeBgPlayerZindex('after')
      myDataManager.updateData()
      if(pageIndex === myHistory.tabPageIndex){
        myHistory.updateData(tabRef)
      }
    }

    function onTabClick(item: QTTabItem) {
      launch.launch(item)
    }

    function delayStopPlayer() { // 当第一个tab 为播放内容时  由于初始化播放器第一次初始化慢  判断是否第一个 延迟暂停播放器
      delayStopPlayerTimer && clearTimeout(delayStopPlayerTimer)
      bg_player.value?.pause()
      bg_player.value?.setBgImage("")
      delayStopPlayerTimer = setTimeout(() => {
        bg_player.value?.stop()
      }, 2100)
    }

    const listSectionLoadMore = async (pageNo: number, sectionIndex: number, tabIndex: number, pageIndex: number) => {
      let data = await globalApi.getShortVideoPageData('mock数据',pageNo,10)
      if(data.length > 0){
        let listSID = tabRef.value?.getPageSection(pageIndex,sectionIndex)!.listSID
        if(pageNo > 1) {
          VirtualView.call(listSID,'addListData',data)
          let currentTabItem = tabItemList[pageIndex]
          if(currentTabItem._id == 'short_video2'){
            let arr: Array<any> = []
            for (let i = 0; i < data.length; i++) {
              const el = data[i];
              let objectt = {
                id: el.id,
                title: el.title,
                cover: el.poster,
                url: [{playUrl:el.url,definition:"1"}],
                isRequestUrl:false,
              }
              arr.push(objectt)
            }
            bg_player.value.loadMoreMediaList(10,arr)
          }
        }
        else {
          VirtualView.call(listSID,'setListData',[])
          setTimeout(() => {
            VirtualView.call(listSID,'setListData',data)
          },500)
        }
      }
    }
    const multilevelTabLoadMore = async (pageNo: number, sectionIndex: number, tabIndex: number, pageIndex: number) => {
      let data = await globalApi.getMultilevelTabPageData('mock数据', pageNo, 5)
      if(data.length > 0){
        let listSID = tabRef.value?.getPageSection(pageIndex,sectionIndex)!.listSID
        if(pageNo > 1) VirtualView.call(listSID,'addListData',data)
        else {
          VirtualView.call(listSID,'setListData',[])
          setTimeout(() => {
            VirtualView.call(listSID,'setListData',data)
          },500)
        }
      }
    }
    const dealwithListSectionItemFocused = (pageIndex: number, sectionIndex: number, itemIndex: number, isFocused: boolean, item: QTWaterfallItem) => {
      let currentTabItem = tabItemList[pageIndex]
      if(item.name == 'list_section_item' && (currentTabItem._id == 'short_video' || currentTabItem._id == 'short_video2')){
        if(item.url == currentShortVideoPlayUrl.value || currentPlayerIndex.value == itemIndex) return
        currentPlayerIndex.value = itemIndex
        currentShortVideoPlayUrl.value = item.url
        clearTimeout(delayDealwithplayerTimer)
        bg_player.value.initPlayBg(item.poster)
        bg_player.value.showCoverImmediately()
        bg_player.value.stopIfNeed()
        if(currentTabItem._id == 'short_video'){
          bg_player.value.setVideoInfo({
            desc:  item.videoInfo.desc,
            score: item.videoInfo.score,
            sort: item.videoInfo.sort,
            tag: item.videoInfo.tag,
            isShow: true
          })
        }else if (currentTabItem._id == 'short_video2') {
          changeBgPlayerZindex('after')
        }
        delayDealwithplayerTimer = setTimeout( () => {
          bg_player.value.playMediaItemByIndex(itemIndex)
        }, 300)
      }
    }
    let delayPlayerShowFrontTimer: any = -1
    const changeBgPlayerZindex = (type: string) => {
      clearTimeout(delayPlayerShowFrontTimer)
      if(type == 'front'){
        let curTabIndex = tabRef.value?.getCurrentPageIndex()??0
        let currentTabItem = tabItemList[curTabIndex]
        if(currentTabItem._id == 'short_video2'){
          delayPlayerShowFrontTimer = setTimeout(() => {
            context.emit("changeBgPlayerZindex", isBgPlayerFront.value)
            autoHandleBackKey.value = false
            bg_player.value.zIndex = 999
            isBgPlayerFront.value = true
          },8000)
        }
      }else if(type == 'after'){
        bg_player.value.zIndex = 0
        isBgPlayerFront.value = false
        autoHandleBackKey.value = true
        changeBgPlayerZindex('front')
        context.emit("changeBgPlayerZindex", isBgPlayerFront.value)
      }
    }
    const onBackPressed = () => {
      if(isBgPlayerFront.value){
        let isMenuShow = bg_player.value.isMenuShow()
        if(isMenuShow){
          bg_player.value.onBackPressed()
          return
        }
        let curTabIndex = tabRef.value?.getCurrentPageIndex()??0
        let listSID = tabRef.value?.getPageSection(curTabIndex,0)!.listSID
        VirtualView.call(listSID,'requestChildFocus',[currentPlayerIndex.value])
        changeBgPlayerZindex('after')
        return
      }
      router.back()
    }
    const onKeyDown = (keyEvent :ESKeyEvent) => {
      if(isBgPlayerFront.value){
        let isMenuShow = bg_player.value.isMenuShow()
        if(keyEvent.keyCode == ESKeyCode.ES_KEYCODE_DPAD_UP && !isMenuShow){
          let index = bg_player.value.getPlayingMediaIndex()
          if(index > 0){
            let curTabIndex = tabRef.value?.getCurrentPageIndex()??0
            let listSID = tabRef.value?.getPageSection(curTabIndex,0)!.listSID
            VirtualView.call(listSID,'scrollToPosition',[index-1])
            bg_player.value.playMediaItemByIndex(index-1)
            currentPlayerIndex.value = index-1
          }else{
            currentPlayerIndex.value = 0
            toast.showToast('已经是第一个')
          }
          return
        }
        if(keyEvent.keyCode == ESKeyCode.ES_KEYCODE_DPAD_DOWN  && !isMenuShow){
          let index = bg_player.value.getPlayingMediaIndex()
          if(index < 19){
            let curTabIndex = tabRef.value?.getCurrentPageIndex()??0
            let listSID = tabRef.value?.getPageSection(curTabIndex,0)!.listSID
            VirtualView.call(listSID,'scrollToPosition',[index+1])
            bg_player.value.playMediaItemByIndex(index+1)
            currentPlayerIndex.value = index+1
          }else{
            currentPlayerIndex.value = 19
            toast.showToast('已经是最后一个')
          }
          return
        }
        if(keyEvent.keyCode == ESKeyCode.ES_KEYCODE_DPAD_LEFT || keyEvent.keyCode == ESKeyCode.ES_KEYCODE_DPAD_RIGHT || keyEvent.keyCode == ESKeyCode.ES_KEYCODE_DPAD_CENTER){
          if(bg_player.value.onKeyDown(keyEvent)){
            return true
          }
        }
      }
    }

    const onKeyUp = (keyEvent:ESKeyEvent)=>{
      if(isBgPlayerFront.value){
        if(keyEvent.keyCode === ESKeyCode.ES_KEYCODE_DPAD_LEFT || keyEvent.keyCode === ESKeyCode.ES_KEYCODE_DPAD_RIGHT || keyEvent.keyCode === ESKeyCode.ES_KEYCODE_DPAD_CENTER){
          if(bg_player.value.onKeyDown(keyEvent)){
            return true
          }
        }
      }
    }

    return {
      waterfall_tab_root,
      onESCreate,
      onESStop,
      onESResume,
      onESPause,
      onESDestroy,
      onESRestart(){
        myHistory.updateData(tabRef)
      },
      tabsTriggerTask,
      wTabBg,
      tabRef,
      bg_player, bgPlayerType,
      focusBgColor,
      focusTextColor,
      floatTitleBgColor,
      onTabPageLoadData,
      onTabPageChanged,
      onTabMoveToTopStart,
      onTabMoveToTopEnd,
      onTabMoveToBottomStart,
      onTabMoveToBottomEnd,

      onTabPageScrollToEnd,
      onTabPageScrollToStart,

      onTabPageItemClick,
      onTabPageItemFocused,
      onTabPageScroll,
      onTabEvent,
      onTabClick,
      onTabPageSectionAttached,
      delayStopPlayer,
      listSectionLoadMore, multilevelTabLoadMore, dealwithListSectionItemFocused,
      changeBgPlayerZindex,autoHandleBackKey,isBgPlayerFront,
      onBackPressed,onKeyDown,onKeyUp,descendantFocusability
    }
  }
})
</script>

<style src="./../css/home.css"></style>
