<template>
  <qt-view class="waterfall-tab-root-css" :clipChildren="false" ref="waterfall_tab_root"
       :clipPadding="false">
      <waterfall-background ref="wTabBg"/>
      <!-- 背景播放及小窗播放组件 -->
      <bg-player class="bg_player" ref="bg_player" :clipChildren="false" style="position: absolute;" />
      <div ref="buttonsHeaderDiv" name="buttonsHeaderDiv" class="buttons-header-css" :clipChildren="false"
        v-if="isShowTop" :blockFocusDirections="['left', 'right', 'up']">
        <slot name="buttonsHeader"/>
      </div>
      <qt-tabs
        ref="tabRef"
        :tabContentResumeDelay="200"
        :tabContentBlockFocusDirections="['left', 'right', 'down', 'top']"
        tabNavBarClass="qt-tabs-waterfall-tab-css"
        tabPageClass="qt-tabs-waterfall-css"
        :horizontalFadingEdgeEnabled="true"
        :fadingEdgeLength="400"
        :triggerTask="tabsTriggerTask"
        :outOfDateTime="5 * 60 * 1000"
        @onTabClick="onTabClick"
        :tabContentSwitchDelay='0'
        :playerBindingRelation='callbackFn(playerBindingRelationArrKey)'
        sid='homeTabs'
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
          <page-state-image-item :type="1"/>
          <page-no-frame-item :type="2"/>
          <page-place-holder-item :type="3"/>
          <item-cell-player :type="10008" ref="item_cell_player" :clipChildren="false"/>
        </template>
        <template v-slot:waterfall-list-item>
          <page-state-image-item :type="1"/>
          <page-no-frame-item :type="2"/>
          <page-place-holder-item :type="3"/>
        </template>
      </qt-tabs>
      <!-- <loading style="position: absolute;z-index: 999;" :is-full-screen="true"/> -->
  </qt-view>
</template>

<script lang="ts">
import { ESIPlayerInterceptor } from "@extscreen/es3-player"
import { defineComponent } from "@vue/runtime-core";
import { ref } from "vue";
import { createESHomeBGPlayerMediaInterceptor } from "../play_interceptor/createESHomeBGPlayerMediaInterceptor"
import WaterfallBackground from "./waterfall-background.vue";
import {
  QTITab, QTIView, QTTab, QTTabEventParams, QTTabItem,
  QTTabPageData, QTTabPageState, QTWaterfallItem
} from '@quicktvui/quicktvui3'
import { ESLogLevel, useESDevice, useESLog, useESToast } from '@extscreen/es3-core'
import { useLaunch } from "../../../tools/launch/useApi";
import { useGlobalApi } from "../../../api/UseApi";
import BuildConfig from "../../../build/BuildConfig";
import { buildTabPage } from "../build_data/tab/tabs";
import TabImageItem from "./tab/tab-image-item.vue";
import PageStateImageItem from "./page/page-state-image-item.vue";
import TabIconItem from "./tab/tab-icon-item.vue";
import TabTextIconItem from "./tab/tab-text-icon-item.vue";
import PagePlaceHolderItem from "./page/page-place-holder-item.vue";
import PageNoFrameItem from "./page/page-no-frame-item.vue";
import itemCellPlayer from "./item-cell-player.vue"
import bgPlayer, { CoveredPlayerType } from "../../../components/bg-player.vue"
import loading from "../../../components/Loading.vue"

const TAG = "WATERFALL-TABS"

export default defineComponent({
  name: "waterfall-tabs",
  components: {
    PageNoFrameItem,
    PagePlaceHolderItem, itemCellPlayer, bgPlayer, loading,
    TabTextIconItem, TabIconItem, PageStateImageItem, TabImageItem, WaterfallBackground
  },
  props: {
    isShowTop: {
      type: Boolean,
      default: true
    }
  },
  setup(props, context) {
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
    let delayStopPlaerTimer: any = -1
    let delayChangePlayerTimer: any = -1

    // let playerBindingRelation = {
    //   '1' : 'bg_player_replace_child_sid',
    //   '2' : 'CELL_LIST',
    //   '3' : 'CELL',
    //   '8' : 'bg_player_replace_child_sid_2',
    // }
    let playerBindingRelationArrKey = ref(0)
    const callbackFn = (arg: any) => {
      console.log(arg, 'argplayerBindingRelationArr', playerBindingRelation)
      return playerBindingRelation
    }

    let playerBindingRelation = new Map()
    //
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
    function onESStart() {

    }

    function onESResume() {
      if (isOneTime) {
        isOneTime = false
        return
      } else {
        if (bgPlayerType.value != -1) {
          bg_player.value?.resume()
        }
      }
    }

    function onESStop() {
      delayStopPlayer()
    }

    function onESPause() {
      bg_player.value?.stop()
    }

    function onESDestroy() {
      bg_player.value?.reset()
      delayStopPlayer()
    }

    function onTabPageLoadData(pageIndex: number, pageNo: number, useDiff: boolean): void {
      if (tabItemList && pageIndex >= 0 && pageIndex < tabItemList.length) {
        const tab = tabItemList[pageIndex]
        if (tab._id == '0' || tab._id) getTabContent(tab._id, pageIndex, pageNo + 1)
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
              buildPlayerData(tabPageIndex, tabPage.data[0].itemList, tabPage)
              //tabPage.bindingPlayer = 'CELL_LIST'
              tabRef.value?.setPageData(tabPageIndex, tabPage)

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
    async function buildPlayerData(pageIndex: number, itemList: any, tabPage: QTTabPageData) {
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
      playerBindingRelationArrKey.value++
    }

    /**
     * tab 移至最顶上时
     * @param pageIndex
     * @param eventName
     * @param params
     */
    function onTabMoveToTopStart(pageIndex: number, eventName: string, params: QTTabEventParams) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-------onTabMoveToTopStart----------->>>',
          ' pageIndex:' + pageIndex +
          ' eventName:' + eventName +
          ' params:', params
        )
      }
      if (bgPlayerType.value == CoveredPlayerType.TYPE_BG) {
        bg_player?.value.pause()
        bg_player?.value.keepPlayerInvisible(false)
        bg_player.value.initPlayBg("")
      } else {
        setTimeout(() => {
          bg_player?.value.pause()
          bg_player?.value.setCurBg()
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
      if (bgPlayerType.value != -1) {
        if (bgPlayerType.value == CoveredPlayerType.TYPE_BG) {
          bg_player?.value.setCurBg()
          // bg_player?.value.showCoverImmediately(true)
          bg_player.value.delayShowPlayer(200)
        } else {
          bg_player?.value.showCoverImmediately(false)
        }
        bg_player?.value.resume()
        bg_player?.value.requestDismissCover()
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
    let delayOnTabPageSectionAttachedTimer: any = -1
    let delayDealwithplayerTimer: any = -1
    let currentSectionAttachedIndex = ref(-1)
    function onTabPageSectionAttached(pageIndex: number, sectionList: any) {
      const isSwitchCellBg = sectionList[0].isSwitchCellBg
      if (isSwitchCellBg === "0") {
        const bg = globalApi.getTabBg(tabItemList[pageIndex]._id)
        wTabBg.value?.setImg(bg, "", true, false)
      }
    }
    function onTabPageItemClick(pageIndex: number, sectionIndex: number, itemIndex: number, item: QTWaterfallItem) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '---------onTabPageItemClick-------->>>>' +
          " pageIndex: " + pageIndex +
          " sectionIndex: " + sectionIndex +
          " itemIndex: " + itemIndex +
          " item: ", item
        )
      }
      launch.launch(item)
    }
    function onTabPageItemFocused(pageIndex: number, sectionIndex: number, itemIndex: number, isFocused: boolean, item: QTWaterfallItem) {
      if (isFocused) {
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
          if (item.item.focusScreenImage && sectionIndex === 0) {//第一个板块且是格子切换背景
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
          // bg_player.value.bgPlayerOpacity = 0

          let parentSID: string = ''
          if (flag == CoveredPlayerType.TYPE_CELL) {
            bgPlayerType.value = flag
            bg_player.value?.doChangeParent(parentSID, flag,
              width, height, width, height,
              playData, 0, mediaInterceptor
            )
          } else if (flag == CoveredPlayerType.TYPE_CELL_LIST) {
            bgPlayerType.value = flag
            bg_player.value?.doChangeParent(parentSID, flag,
              width, height, 860, height,
              playData, 0, mediaInterceptor
            )
          } else if (flag == CoveredPlayerType.TYPE_BG) {
            // clearTimeout(delayChangePlayerTimer)
            bgPlayerType.value = flag
            bg_player.value?.doChangeParent(parentSID, flag,
              1920, 1080, 1920, 1080,
              playData, 0, mediaInterceptor
            )
            bg_player.value?.delayShowPlayer()
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

    function onTabPageScroll(offsetX: number, scrollY: number) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '---------onTabPageScroll-------->>>>', offsetX, '---->>>', scrollY)
      }
      //如果有焦点播放需求时
      // if(Math.abs(scrollY) > 2) {
      //   bg_player.value?.showCoverImmediately(true)
      // }
      // if(scrollY == 0) {
      //   bg_player.value.requestDismissCellCover()
      // }
    }
    function onTabPageChanged(pageIndex: number, data: any) {
      log.d("BG-PLAYER", '-------onTabPageChanged----------->>>',
        ' pageIndex:' + pageIndex
      )
      bgPlayerType.value = -1
      currentSectionAttachedIndex.value = -1
      clearTimeout(delayChangePlayerTimer)
      delayOnTabPageSectionAttachedTimer && clearTimeout(delayOnTabPageSectionAttachedTimer)
      bg_player?.value.keepPlayerInvisible(true)
    }

    function onTabClick(item: QTTabItem) {
      launch.launch(item)
    }

    function delayStopPlayer() { // 当第一个tab 为播放内容时  由于初始化播放器第一次初始化慢  判断是否第一个 延迟暂停播放器
      delayStopPlaerTimer && clearTimeout(delayStopPlaerTimer)
      bg_player.value?.stop()
      bg_player.value?.setBgImage("")
      if (!isOneTimeStop) {
        delayStopPlaerTimer = setTimeout(() => {
          bg_player.value?.stop()
          bg_player.value?.keepPlayerInvisible(false)
          isOneTimeStop = true
        }, 2000)
      }
    }

    return {
      waterfall_tab_root,
      onESCreate,
      onESStart,
      onESStop,
      onESResume,
      onESPause,
      onESDestroy,
      tabsTriggerTask,
      wTabBg,
      tabRef,
      bg_player, bgPlayerType,
      playerBindingRelation,
      callbackFn, playerBindingRelationArrKey,
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
      delayStopPlayer
    }
  }
})
</script>

<style src="./../css/home.css"></style>
