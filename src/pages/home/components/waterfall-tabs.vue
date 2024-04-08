<template>
  <div class="waterfall-tab-root-css" :clipChildren="false" ref="waterfall_tab_root" :clipPadding="false">
    <waterfall-background ref="wTabBg" />
    <!-- 背景播放及小窗播放组件 -->
    <bg-player class="bg_player" ref="bg_player" :clipChildren="false" :active="bgPlayerActive"
      style="position: absolute;">
    </bg-player>
    <div ref="buttonsHeaderDiv" name="buttonsHeaderDiv" class="buttons-header-css" :clipChildren="false"
      v-if="isShowTop" :blockFocusDirections="['left', 'right', 'up']">
      <slot name="buttonsHeader" />
    </div>
    <qt-tabs ref="tabRef" :tabContentResumeDelay="200" :tabContentBlockFocusDirections="tabContentBlockFocusDirections"
      tabNavBarClass="qt-tabs-waterfall-tab-css" tabPageClass="qt-tabs-waterfall-css" :triggerTask="tabsTriggerTask"
      :outOfDateTime="5 * 60 * 1000" @onTabClick="onTabClick" :tabContentSwitchDelay='0'
      @onTabPageChanged="onTabPageChanged" @onTabMoveToTopStart="onTabMoveToTopStart"
      @onTabMoveToTopEnd="onTabMoveToTopEnd" @onTabMoveToBottomStart="onTabMoveToBottomStart"
      @onTabMoveToBottomEnd="onTabMoveToBottomEnd" @onTabPageScrollToEnd="onTabPageScrollToEnd"
      @onTabPageScrollToStart="onTabPageScrollToStart" @onTabPageItemClick="onTabPageItemClick"
      @onTabPageItemFocused="onTabPageItemFocused" @onTabPageLoadData="onTabPageLoadData"
      @onTabPageScroll="onTabPageScroll" @onTabPageSectionAttached="onTabPageSectionAttached" class="qt-tabs-css">
      <template v-slot:tab-item>
        <tab-image-item :type="1" />
        <tab-icon-item :type="2" cornerIconLeft />
        <tab-text-icon-item :type="3" cornerIconLeft textIconLeft />
      </template>
      <template v-slot:waterfall-item>
        <page-state-image-item :type="1" />
        <page-no-frame-item :type="2" />
        <page-place-holder-item :type="3" />
        <item-cell-player :type="10008" ref="item_cell_player" :clipChildren="false" />
      </template>
      <template #waterfall-list-item>
        <page-state-image-item :type="1" />
        <page-no-frame-item :type="2" />
        <page-place-holder-item :type="3" />
      </template>
    </qt-tabs>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { reactive, ref, toRaw } from "vue";
import { getSectionPosLabelObject } from "../build_data/useTabData"
import WaterfallBackground from "./waterfall-background.vue";
import {
  QTITab,
  QTTab,
  QTTabEventParams,
  QTTabItem,
  QTTabPageData,
  QTTabPageState,
  QTWaterfallItem
} from "@quicktvui/quicktvui3";
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
import { Native } from "@extscreen/es3-vue";
import bgPlayer, { CoveredPlayerType } from "../../../components/bg-player.vue"

const TAG = "WATERFALL-TABS"

export default defineComponent({
  name: "waterfall-tabs",
  components: {
    PageNoFrameItem,
    PagePlaceHolderItem, itemCellPlayer, bgPlayer,
    TabTextIconItem, TabIconItem, PageStateImageItem, TabImageItem, WaterfallBackground
  },
  props: {
    isShowTop: {
      type: Boolean,
      default: true
    }
  },
  setup(props, context) {
    let waterfall_tab_root = ref()
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
    let bgPlayerActive = ref(false)
    let recordPlayerData = reactive({
      pageIndex: -1,
      itemIndex: -1,
      data: {} as QTWaterfallItem,
    })
    let isOneTime: boolean = false
    let isOneTimeStop: boolean = false
    let isPlaying = ref(false)
    //背景图
    const wTabBg = ref()
    //tab
    const tabContentBlockFocusDirections = ref(['down', 'right', 'top'])
    let tabItemList: Array<QTTabItem>
    let delayStopPlaerTimer: any = -1
    //
    function onESCreate(params) {
      isOneTime = true
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
        bg_player.value?.resume()
      }
    }

    function onESStop() {
      delayStopPlaerTimer && clearTimeout(delayStopPlaerTimer)
      bg_player.value?.stop()
      if (!isOneTimeStop) {
        delayStopPlaerTimer = setTimeout(() => {
          bg_player.value?.stop()
          isOneTimeStop = true
        }, 2000)
      }
    }

    function onESPause() {
      bg_player.value?.stop()
    }

    function onESDestroy() {
      bg_player.value?.reset()
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
      bg_player?.value.pause()
      if (bgPlayerType.value == CoveredPlayerType.TYPE_BG) {
        bg_player?.value.showCoverImmediately(true)
        bg_player?.value.keepPlayerInvisible(false)
      } else {
        bg_player?.value.showCoverImmediately(true)
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
      //我
      //bgPlayerActive.value = true
      if (bgPlayerType.value != -1) {
        if (bgPlayerType.value == CoveredPlayerType.TYPE_BG) {
          bg_player.value.delayShowPlayer(200)
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
      delayOnTabPageSectionAttachedTimer && clearTimeout(delayOnTabPageSectionAttachedTimer)
      delayOnTabPageSectionAttachedTimer = setTimeout(async () => {
        if (sectionList.length < 1) {
          log.e("IndieViewLog", `reutrn on sectionList.length < 1`)
          return
        }
        const isSwitchCellBg = sectionList[0].isSwitchCellBg
        if (isSwitchCellBg === '0') {
          const bg = globalApi.getTabBg(tabItemList[pageIndex]._id)
          wTabBg.value?.setImg(bg, "", true, false)
        }
        if (currentSectionAttachedIndex.value != pageIndex) {
          currentSectionAttachedIndex.value = pageIndex
          let sectionData = sectionList[0]
          if (sectionData && sectionData.itemList) {
            recordPlayerData.pageIndex = -1
            recordPlayerData.itemIndex = -1
            recordPlayerData.data = {} as QTWaterfallItem
            let flag = -1
            let width: any
            let height: any
            for (let index = 0; index < sectionData.itemList.length; index++) {
              const element = sectionData.itemList[index];
              log.e(TAG, `element : ${JSON.stringify(element)}`)
              log.e(TAG, `element isBGPlayer: ${element.isBgPlayer}`)
              log.e(TAG, `element sectionPosLabel: ${getSectionPosLabelObject(element.sectionPosLabel)}`)

              if (element.isCellPlayer) {
                if (element.isCellPlayerList) flag = CoveredPlayerType.TYPE_CELL_LIST
                else flag = CoveredPlayerType.TYPE_CELL
                // if(element.isBgPlayer) flag = 'isBgPlayer'
                element.childSID = "bg-player"
                width = element.style.width
                height = element.style.height
                recordPlayerData.pageIndex = pageIndex
                recordPlayerData.itemIndex = index
                recordPlayerData.data = element
              } else if (element.isBgPlayer) {
                flag = CoveredPlayerType.TYPE_BG
                element.childSID = ""
                width = element.style.width
                height = element.style.height
                recordPlayerData.pageIndex = pageIndex
                recordPlayerData.itemIndex = index
                recordPlayerData.data = element
                break
              }
            }
            bgPlayerType.value = flag
            // bg_player.value.bgPlayerOpacity = 0
            let parentSID: string = ''
            if (flag == CoveredPlayerType.TYPE_CELL) {
              Native.callUIFunction(waterfall_tab_root.value, 'dispatchFunctionBySid', [recordPlayerData.data.sid, 'setChildSID', ['bg-player']]);
              bg_player.value?.doChangeParent(parentSID, bgPlayerType.value,
                width, height, width, height,
                toRaw(recordPlayerData.data.playData), 0
              )
            } else if (flag == CoveredPlayerType.TYPE_CELL_LIST) {
              Native.callUIFunction(waterfall_tab_root.value, 'dispatchFunctionBySid', [recordPlayerData.data.sid, 'setChildSID', ['bg-player']]);
              bg_player.value?.doChangeParent(parentSID, bgPlayerType.value,
                width, height, 860, height,
                toRaw(recordPlayerData.data.playData), 0
              )
            } else if (flag == CoveredPlayerType.TYPE_BG) {
              Native.callUIFunction(waterfall_tab_root.value, 'dispatchFunctionBySid', ['bg_player_replace_child_sid', 'setChildSID', ['bg-player']]);
              if (recordPlayerData.data.item.playData[0].isRequestUrl) {
                let playerInfo = await globalApi.getHomeBgVideoAssetsUrl(toRaw(recordPlayerData.data.item.playData[0]))
                recordPlayerData.data.item.playData[0].url = playerInfo.url
              }
              bg_player.value?.doChangeParent(parentSID, bgPlayerType.value,
                1920, 1080, 1920, 1080,
                toRaw(recordPlayerData.data.item.playData), 0
              )
            } else if (isSwitchCellBg === '1') {
              const cellBg = sectionList[0].itemList[0]?.item.focusScreenImage
              wTabBg.value?.setImg(cellBg, "", true, false)
            } else {
              bg_player?.value.stop()
            }
            //if(delayDealwithplayerTimer) clearTimeout(delayDealwithplayerTimer)

          }
        }
      }, 200)
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
            bg_player.value.setNextImage(item.item.playData[0].cover)
            bg_player.value.showCoverImmediately()
            bg_player.value.stopIfNeed()
            delayDealwithplayerTimer = setTimeout(async () => {
              recordPlayerData.pageIndex = pageIndex
              recordPlayerData.itemIndex = itemIndex
              recordPlayerData.data = item
              let playerInfo = await globalApi.getHomeBgVideoAssetsUrl(item.item.playData[0])
              recordPlayerData.data.item.playData[0].url = playerInfo.url
              // bg_player.value.playAtIndex(itemIndex)
              bg_player.value.play(playerInfo.url)
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

    function onTabPageScroll(offsetX: number, scrollY: number) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '---------onTabPageScroll-------->>>>', offsetX, '---->>>', scrollY)
      }
      //如果有焦点播放需求时
      // if(Math.abs(scrollY) > 2) {
      //   bg_player.value?.showCoverImmediately(true)
      // }
      //bgPlayerActive.value = false
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
      delayOnTabPageSectionAttachedTimer && clearTimeout(delayOnTabPageSectionAttachedTimer)
      bg_player?.value.keepPlayerInvisible(true)
    }

    function onTabClick(item: QTTabItem) {

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
      bgPlayerActive,
      bg_player, bgPlayerType,
      tabContentBlockFocusDirections,

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
      onTabClick,
      onTabPageSectionAttached
    }
  }
})
</script>

<style src="./../css/home.css"></style>
