<template>
  <qt-view class="media-player-view-root"
    name='mediaRoot' :focusable="false"
    :style="{ width: playerWidth, height: playerHeight }">
    <!-- media-player-view -->
    <qt-view  class="media-player-view" :visible="isFullWindow" :focusable="false">
      <!-- 顶部条 -->
      <qt-view class="media-player-view-title"
        v-if="isFullWindow && isTitleBarShowing"
        :gradientBackground="{ colors: ['#E6000000', '#00000000'] }">
        <qt-text class="media-player-view-title-text"
          :focusable="false" :fontSize="30" :text="mediaTitle"/>
      </qt-view>
      <!-- 底部进度条 -->
      <qt-view class="media-player-view-bottom" v-if="isFullWindow && isProgressShowing">
        <!-- 进度条背景渐变 -->
        <qt-view class="media-player-view-bottom-bg"
          v-if="isFullWindow && isProgressShowing"
          :gradientBackground="{ colors: ['#00000000', '#E6000000'] }" />
        <!-- 底部进度条 -->
        <qt-column class="media-player-view-state-progress" v-show="isProgressShowing">
          <!-- 播放状态 -->
          <img :visible="!isPlayerPlaying" :focusable="false" :src="playIcon"
            duplicateParentState postDelay="100" />
          <img :visible="isPlayerPlaying" :focusable="false" :src="pauseIcon"
            duplicateParentState postDelay="100" />
          <!-- 播放进度 -->
          <qt-row class="media-player-view-progress" :autofocus="true">
            <qt-text class="media-player-view-progress-text" :focusable="false"
              gravity="center" :fontSize="30" :text="progress"/>

            <qt-seek-bar
              class="media-player-view-seekbar"
              ref="seekBarRef"
              name="seekBar"
              :blockFocusDirections='["left","right","up"]'
              :color="{ startColor: '#FFFFFF', endColor: '#FFFFFF' }"
              :nextFocusName="{ left: 'seekBar' }"
              :visible="isFullWindow && isProgressShowing"
              @onSeekStart='onSeekBarSeekStart'
              @onSeekStop="onSeekBarSeekStop"
              @focus="onSeekbarFocusChanged"
              :focusable="true"/>

            <qt-text class="media-player-view-progress-text" :focusable="false"
              gravity="center" :fontSize="30" :text="duration"/>
          </qt-row>
          <!-- 下一个按钮-->
          <div class="media-player-view-next" :focusable="true" name="nextButton"
            :nextFocusName="{up: 'seekBar',down: 'nextButton',
              right: 'nextButton',left: 'nextButton'}"
            :visible="mediaSeriesVisible"
            @click="onNextButtonClicked"
            @focus="onNextButtonFocusChanged">
            <div class="media-player-view-next-text-focus"
              showOnState="focused" duplicateParentState
              :gradientBackground="{
                colors: ThemeConfig.btnGradientFocusColor,
                cornerRadius: 8, orientation: 6 }">
            </div>
            <qt-text class="media-player-view-next-text" gravity="center" typeface="bold"
              duplicateParentState :fontSize="30" text="下一个" focusScale="1.1"/>
          </div>
        </qt-column>
      </qt-view>
      <!-- 底部菜单 -->
      <qt-view :visible="isFullWindow && isMenuShowing" class="media-player-view-menu">
        <qt-view v-if="isFullWindow && isMenuShowing"
          class="media-player-view-menu-bg" :gradientBackground="{ colors: ['#00000000', '#E6000000'] }"/>
        <!-- 折叠面板 -->
        <qt-collapse ref="mediaCollapseRef"
          :visible="isFullWindow && isMenuShowing"
          v-if="mediaCollapseMenuInit"
          class="media-player-collapse">
          <media-collapse-order
            ref="mediaCollapseOrderRef"
            :blockFocusDirections="['left', 'right', 'down', 'up']"
            name="mediaCollapseOrder"
            @onCollapseItemFocused="onCollapseItemOrderFocused"
            @onCollapseItemClicked="onCollapseItemOrderClicked"/>
          <media-collapse-speed
            ref="mediaCollapseSpeedRef"
            :blockFocusDirections="['left', 'right', 'up']"
            name="mediaCollapseSpeed"
            @onCollapseItemFocused="onCollapseItemSpeedFocused"
            @onCollapseItemClicked="onCollapseItemSpeedClicked"/>
          <media-collapse-definition
            ref="mediaCollapseDefinitionRef"
            :blockFocusDirections="['left', 'right']"
            name="mediaCollapseDefinition"
            @onCollapseItemFocused="onCollapseItemDefinitionFocused"
            @onCollapseItemClicked="onCollapseItemDefinitionClicked"/>
          <media-collapse-media-series
            v-if="mediaListVisible"
            ref="mediaCollapseMediaSeriesRef"
            :blockFocusDirections="['left', 'right', 'down']"
            name="mediaCollapseMediaSeries"
            @onMediaSeriesGroupItemFocus="onMediaSeriesGroupItemFocus"
            @onMediaSeriesItemFocus="onMediaSeriesItemFocus"
            @onMediaSeriesItemClick="onMediaSeriesItemClick"/>
        </qt-collapse>
      </qt-view>
    </qt-view>
    <!-- loading -->
    <qt-view
      class="media-player-loading"
      :focusable="false"
      ref="mediaPlayerLoadingRef"
      name='loadingRoot'
      :fillParent='true' :visible="showLoading"
      :style="{width:playerWidth, height:playerHeight}">
      <qt-loading-view :style="{width:100, height:100}"/>
    </qt-view>
  </qt-view>
</template>

<script setup lang='ts' name='MediaPlayerView'>
import { ref, watch, onMounted, nextTick, onUnmounted} from 'vue'
import { ESKeyCode, ESKeyEvent, ESLogLevel, toast, useESEventBus, useESLog } from "@extscreen/es3-core"
import {ESIPlayerManager, ESMediaItem, ESMediaItemList} from "@extscreen/es3-player-manager";
import {
  ESPlayerAspectRatio,
  ESPlayerDecode,
  ESPlayerDefinition,
  ESPlayerInterceptError,
  ESPlayerInterceptResult,
  ESPlayerPlayMode,
  ESPlayerRate,
  ESPlayerWindowType
} from "@extscreen/es3-player";
import { QTISeekBar, QTICollapse, QTCollapse, QTListViewItem} from '@quicktvui/quicktvui3'
import { IMedia, IMediaPlayerViewState,IMediaItem,
  IMediaCollapseItemListView,IMediaCollapseMediaSeriesView
 } from '../../adapter/interface'
import BuildConfig from "../../../../config/build-config";
import ThemeConfig from "../../../../config/theme-config";
import { s_to_hs } from "../../../../tools/format-date";
import {
  buildPlayModeList,
  buildDefinitionList,
  buildPlayRateList,
  buildCollapseMenu,
  getPlayModeIndex,
  getDefinitionIndex,
  getPlayRateIndex
} from "../../adapter/media-player";
import playIcon from '../../../../assets/detail/ic_media_player_play.png'
import pauseIcon from '../../../../assets/detail/ic_media_player_pause.png'
import MediaCollapseOrder from './collapse/media-collapse-order.vue'
import MediaCollapseSpeed from './collapse/media-collapse-speed.vue'
import MediaCollapseDefinition from './collapse/media-collapse-definition.vue'
import MediaCollapseMediaSeries from './collapse/media-collapse-media-series.vue'

  const TAG = 'MediaPlayerView'
  let enabled = true
  let player: ESIPlayerManager
  const log = useESLog()
  const eventBus = useESEventBus()

  let media: IMedia
  let playingMediaItem: ESMediaItem
  const playerWidth = ref<number>(0)
  const playerHeight = ref<number>(0)
  const showPlaceholder = ref<boolean>(true)
  const isFullWindow = ref<boolean>(false)
  let showLoading = ref(false)
  const isTitleBarShowing = ref<boolean>(true)
  const mediaTitle = ref<string>('')
  const viewState = ref<number>(1)
  let dismissTimer:any = -1
  const isMediaAuthError = ref<boolean>(false)

  //-------------------------进度条----------------------------
  const isProgressShowing = ref<boolean>(false)
  let isPlayerPlaying = ref<boolean>(false)
  const seekBarRef = ref<QTISeekBar>()
  let progress = ref<string>('00:00')
  let duration = ref<string>('00:00')
  seekBarRef.value?.setSeekBarMode(1);
  seekBarRef.value?.setProgressHeight(5);
  seekBarRef.value?.setProgressRadius(100);
  let isSeeking = false
  let nextButtonFocused = false
  const mediaSeriesVisible = ref<boolean>(true)

  //-------------------------菜单----------------------------
  const mediaCollapseMenuInit = ref<boolean>(false)
  const dataMap = new Map<number, Array<IMediaItem>>()
  const mediaListVisible = ref<boolean>(true)
  const mediaCollapseOrderRef = ref<IMediaCollapseItemListView>()
  const mediaCollapseSpeedRef = ref<IMediaCollapseItemListView>()
  const mediaCollapseDefinitionRef = ref<IMediaCollapseItemListView>()
  const mediaCollapseMediaSeriesRef = ref<IMediaCollapseMediaSeriesView>()
  const mediaCollapseRef = ref<QTICollapse>()
  const isMenuShowing = ref<boolean>(false)
  let collapseItemIndex = 0
  let collapseItemList: any = []
  let collapse: QTCollapse
  let mediaListGroupItemFocused = false
  let playModeList: Array<ESPlayerPlayMode>
  let playMode: ESPlayerPlayMode
  let definitionList: Array<ESPlayerDefinition>
  let definition: ESPlayerDefinition
  let rateList: Array<ESPlayerRate>
  let rate: ESPlayerRate
  let decodeList: Array<ESPlayerDecode>

  //------------------进度条 callback-----------------------------------
  const onSeekBarSeekStart = (progress) => {
    isSeeking = true
  }
  const onSeekBarSeekStop = (progress) => {
    isSeeking = false
    if (player && progress >= 0) {
      player.seekTo(progress)
    }
  }
  const onSeekbarFocusChanged = () => {}
  const onNextButtonClicked = () => {if (player) player.playNextMedia()}
  const onNextButtonFocusChanged = (e) => {
    nextButtonFocused = e.isFocused
    log.e(TAG, "onNextButtonFocusChanged nextButtonFocused" + nextButtonFocused)
  }
  const initSeekBar = ()=>{
    seekBarRef.value?.setSeekBarMode(1);
    seekBarRef.value?.setProgressHeight(12);
    seekBarRef.value?.setProgressRadius(6);
    seekBarRef.value?.setThumbWidth(60)
    seekBarRef.value?.setThumbHeight(60)
    seekBarRef.value?.setLeftThumbUrl('http://extcdn.hsrc.tv/extend_screen/images/default/ic_1905_thumb.png')
    seekBarRef.value?.setLeftThumbInactivatedDrawable({
      colors: ['#00000000', '#00000000'],
      cornerRadius: 4
    })
  }
  onMounted(() => {
    initSeekBar()
    eventBus.on('onMediaListItemLoad', onMediaListItemLoad)
  });
  onUnmounted(() => {
    eventBus.off('onMediaListItemLoad', onMediaListItemLoad)
  });
  //--------------------------------菜单----------------------------------
  watch(
    () => [mediaCollapseRef.value] as const,
    ([instance], [oldInstance]) => {
      if (instance) {
        if (log.isLoggable(ESLogLevel.DEBUG)) {
          log.e(TAG, "----watch---initCollapseMenu----->>>>>",oldInstance)
        }
        collapse = buildCollapseMenu(mediaListVisible.value)
        collapseItemIndex = collapse.defaultIndex ?? 0
        collapseItemList = collapse.itemList
        mediaCollapseRef.value?.init(collapse)
        initCollapseOrderMenu()
        initCollapseSpeedMenu()
        initCollapseDefinitionMenu()
        initCollapseMediaSeries()
      }
    },
    { flush: 'post' }
  )
  const initCollapseMenu = () => {mediaCollapseMenuInit.value = true}
  const onMediaListItemLoad = (page: number, mediaList: Array<IMediaItem>) => {
    console.log(mediaList,'1wqeqeeeeeeeeeeeeeeeeeeee')
    if (mediaCollapseMenuInit.value) {
      nextTick(() => {
        mediaCollapseMediaSeriesRef.value?.setListData(page, mediaList)
      })
    } else {
      dataMap.set(page, mediaList)
      console.log(dataMap,'11wqeqeeeeeeeeeeeeeeeeeeee')
    }
  }
  //播放顺序
  const initCollapseOrderMenu = () => {
    if (mediaCollapseMenuInit.value) {
      nextTick(() => {
        if (playModeList != null && playModeList != undefined && playModeList.length > 0) {
          let data = buildPlayModeList(playModeList)
          if(!mediaListVisible.value)  data.pop()
          mediaCollapseOrderRef.value?.setListData(data)
        }
        setCollapseItemOrderSelected()
      })
    }
  }
  const setCollapseItemOrderSelected = () => {
    nextTick(() => {
      if (playModeList) {
        let index = getPlayModeIndex(playMode, playModeList)
        if (log.isLoggable(ESLogLevel.DEBUG)) {
          log.e(TAG, "-------getPlayModeIndex-------->>>>>", playMode, playModeList, index)
        }
        if (index > -1) {
          if(!mediaListVisible.value)  index = 0
          mediaCollapseOrderRef.value?.setItemSelected(index)
        }
      }
    })
  }
  const onCollapseItemOrderFocused = () => {
    mediaListGroupItemFocused = false
  }
  const onCollapseItemOrderClicked = (index: number, item: QTListViewItem) => {
    if (playMode == item.mode) return
    player?.setPlayMediaListMode(item.mode)
  }
  //  清晰度相关
  const initCollapseDefinitionMenu = () => {
    if (mediaCollapseMenuInit.value) {
      nextTick(() => {
        if (definitionList) {
          mediaCollapseDefinitionRef.value?.setListData(buildDefinitionList(definitionList))
        }
        setCollapseItemDefinitionSelected()
      })
    }
  }
  const setCollapseItemDefinitionSelected = () => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, '-------setCollapseItemDefinitionSelected-----清晰度-->>>>', definitionList, definition)
    }
    if (definitionList) {
      const index = getDefinitionIndex(definition, definitionList)
      if (index > -1) {
        mediaCollapseDefinitionRef.value?.setItemSelected(index)
      }
    }
  }
  const onCollapseItemDefinitionFocused = () => {
    mediaListGroupItemFocused = false
  }
  const onCollapseItemDefinitionClicked = (index: number, item: QTListViewItem) => {
    if (definition == item.definition) return
    player?.setDefinition(item.definition)
  }
  //  倍速相关
  const initCollapseSpeedMenu = () => {
    if (mediaCollapseMenuInit.value) {
      nextTick(() => {
        if (rateList) {
          mediaCollapseSpeedRef.value?.setListData(buildPlayRateList(rateList))
        }
        setCollapseItemSpeedSelected()
      })
    }
  }
  const setCollapseItemSpeedSelected = () => {
    if (rateList) {
      const index = getPlayRateIndex(rate, rateList)
      if (index > -1) {
        mediaCollapseSpeedRef.value?.setItemSelected(index)
      }
    }
  }
  const onCollapseItemSpeedFocused = () => {
    mediaListGroupItemFocused = false
  }
  const onCollapseItemSpeedClicked = (index: number, item: QTListViewItem) => {
    if (rate == item.rate) return
    player?.setPlayRate(item.rate)
  }
  //  选集相关
  const initCollapseMediaSeries = () => {
    if (mediaCollapseMenuInit.value) {
      nextTick(() => {
        if (media) {
          mediaCollapseMediaSeriesRef.value?.init(media)
        }
        if (dataMap.size > 0) {
          dataMap.forEach(function (mediaList: Array<IMediaItem>, page: number) {
            mediaCollapseMediaSeriesRef.value?.setListData(page, mediaList)
          });
          dataMap.clear()
        }
        setCollapseItemMediaListSelected()
      })
    }
  }
  const setCollapseItemMediaListSelected = () => {
    if (playingMediaItem) {
      const index = playingMediaItem.index
      if (index > -1) {
        mediaCollapseMediaSeriesRef.value?.setItemSelected(index)
      }
    }
  }
  const onMediaSeriesGroupItemFocus = (index: number) => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.e(TAG, "---选集----onMediaSeriesGroupItemFocus------>>>>>", index)
    }
    mediaListGroupItemFocused = true
  }
  const onMediaSeriesItemFocus = (index: number) => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.e(TAG, "----选集---onMediaSeriesItemFocus------>>>>>", index)
    }
    mediaListGroupItemFocused = false
  }
  const onMediaSeriesItemClick = (index: number, item: QTListViewItem) => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.e(TAG, "-------onMediaSeriesItemClick------>>>>>", index, item)
    }
    player?.stop()
    player?.playMediaById(item.id)
  }
  //************************播放器************************
  const isPlayerViewStateMenu = () => {
    return IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_MENU === viewState.value;
  }
  const isPlayerViewStateDismiss = () => {
    return IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_DISMISS === viewState.value;
  }
  const isPlayerViewStateProgress = () => {
    return IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_PROGRESS === viewState.value;
  }
  const setPlayerViewStateDismiss = () => {
    const lastViewState = viewState.value
    viewState.value = IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_DISMISS
    initPlayerViewState(lastViewState);
  }
  const setPlayerViewStateProgress = () => {
    const lastViewState = viewState.value
    viewState.value = IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_PROGRESS
    initPlayerViewState(lastViewState);
  }
  function setPlayerViewStateDismissDelay(delay: number) {
    clearTimeout(dismissTimer);
    dismissTimer = setTimeout(() => {
      setPlayerViewStateDismiss();
    }, delay);
  }
  const initPlayerViewState = (lastViewState: number) => {
    switch (viewState.value) {
      case IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_DISMISS:
        isTitleBarShowing.value = false
        isMenuShowing.value = false
        isProgressShowing.value = false
        mediaListGroupItemFocused = false
        if (lastViewState == IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_MENU) {
          mediaCollapseRef.value?.collapse()
          collapseItemIndex = collapse.defaultIndex ?? 0
        }
        break
      case IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_MENU:
        isMenuShowing.value = true
        isProgressShowing.value = false
        if (!mediaCollapseMenuInit.value) {
          initCollapseMenu()
        }
        mediaCollapseRef.value?.expandItem(collapseItemIndex)
        break
      case IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_PROGRESS:
        isMenuShowing.value = false
        isTitleBarShowing.value = true
        isProgressShowing.value = true
        mediaListGroupItemFocused = false
        if (lastViewState == IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_MENU) {
          mediaCollapseRef.value?.collapse()
          collapseItemIndex = collapse.defaultIndex ?? 0
        }
        break
    }
    if (viewState.value !== IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_DISMISS){
      setPlayerViewStateDismissDelay(5000)
    }
  }
  const setPlayerViewStateMenu = () => {
    const lastViewState = viewState.value
    viewState.value = IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_MENU
    initPlayerViewState(lastViewState);
  }
  const getId = (): string => {return 'MediaPlayerSmallView'}
  const setEnabled = (value: boolean): void => {enabled = value}
  const isEnabled = (): boolean => {return enabled;}
  const setPlayerManager = (value: ESIPlayerManager): void => {player = value}
  const getPlayerManager = (): ESIPlayerManager => {return player}

  const onPlayerInterceptSuccess = (value: ESPlayerInterceptResult): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.e(TAG, "-------onPlayerInterceptSuccess----ccc---->>>>>", value)
    }
    isMediaAuthError.value = false
  }
  const onPlayerInterceptError = (value: ESPlayerInterceptError): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.e(TAG, "-------onPlayerInterceptError----ccc---->>>>>", value)
    }
    isMediaAuthError.value = true
  }
  const onPlayerPrepared = (): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.e(TAG, "-------onPlayerPrepared-------->>>>>")
    }
  }
  const onPlayerBufferStart = (): void => {showLoading.value = true}
  const onPlayerBufferEnd = (): void => {showLoading.value = false}
  const onPlayerPlaying = (): void => {
    isPlayerPlaying.value = true
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.e(TAG, "-------onPlayerPlaying-------->>>>>")
    }
    showLoading.value = false
  }
  const onPlayerProgressChanged = (p: number): void => {
    if (isSeeking) {
      return
    }
    seekBarRef.value?.setProgress(p);
    progress.value = s_to_hs(Math.floor(p / 1000))
  }
  const onPlayerDurationChanged = (d: number): void => {
    if (isSeeking) {
      return
    }
    seekBarRef.value?.setMaxProgress(d);
    duration.value = s_to_hs(Math.floor(d / 1000))
  }
  const onPlayerPaused = (): void => {isPlayerPlaying.value = false}
  const onPlayerDefinitionListChanged = (list: Array<ESPlayerDefinition>): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.e(TAG, "-------onPlayerDefinitionListChanged-----清晰度--->>>>>", list)
    }
    definitionList = list
    initCollapseDefinitionMenu()
  }
  const onPlayerDefinitionChanged = (d: ESPlayerDefinition): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.e(TAG, "-------onPlayerDefinitionChanged-----清晰度--->>>>>", d)
    }
    definition = d
    setCollapseItemDefinitionSelected()
  }
  const onPlayerPlayRateListChanged = (list: Array<ESPlayerRate>): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.e(TAG, "-------onPlayerPlayRateListChanged-------->>>>>", list)
    }
    rateList = BuildConfig.isLowEndDev ? [ESPlayerRate.ES_PLAYER_RATE_1] : list
    initCollapseSpeedMenu()
  }
  const onPlayerPlayRateChanged = (r: ESPlayerRate): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.e(TAG, "-------onPlayerPlayRateChanged-------->>>>>", r)
    }
    rate = r
    setCollapseItemSpeedSelected()
  }
  const onPlayerDecodeListChanged = (list: Array<ESPlayerDecode>): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.e(TAG, "-------onPlayerDecodeListChanged-------->>>>>", list)
    }
    decodeList = list
  }
  const onPlayerDecodeChanged = (d: ESPlayerDecode): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.e(TAG, "-------onPlayerDecodeChanged-------->>>>>", d)
    }
  }
  const onPlayerAspectRatioListChanged = (list: Array<ESPlayerAspectRatio>): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.e(TAG, "-------onPlayerAspectRatioListChanged-------->>>>>", list)
    }
  }
  const onPlayerAspectRatioChanged = (a: ESPlayerAspectRatio): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.e(TAG, "-------onPlayerAspectRatioChanged-------->>>>>", a)
    }
  }
  const onPlayerPlayMediaListModeListChanged = (modeList: Array<ESPlayerPlayMode>): void => {
    const filterModeList: Array<any> = []
    if (modeList && modeList.length) {
      for (let i = 0; i < modeList.length; i++) {
        let mode: ESPlayerPlayMode = modeList[i]
        if (mode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_REPEAT ||
          mode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_LOOP) {
          filterModeList.push(mode)
        }
      }
    }
    playModeList = filterModeList
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.e(TAG, "-------onPlayerPlayModeListChanged-------->>>>>", modeList)
    }
    if(mediaListVisible.value) initCollapseOrderMenu()
  }
  const onPlayerPlayMediaListModeChanged = (mode: ESPlayerPlayMode): void => {
    playMode = mode
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.e(TAG, "-------onPlayerPlayModeChanged-------->>>>>", mode)
    }
    setCollapseItemOrderSelected()
  }
  const onPlayerPlayMediaList = (playList: ESMediaItemList): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, '-----------onPlayerPlayMediaList------------->>>>', playList)
    }
    media = playList.media
    mediaListVisible.value = media.itemList.enable
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, '-----------onPlayerPlayMediaList------------->>>>', mediaListVisible.value, media.itemList.enable)
    }
  }
  const onPlayerPlayMedia = (mediaItem: ESMediaItem): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, '-----------onPlayerPlayMedia------------->>>>', mediaItem)
    }
    playingMediaItem = mediaItem
    if (mediaItem) {
      mediaTitle.value = mediaItem.title
    }
    showLoading.value = false
    setCollapseItemMediaListSelected()
  }
  const onPlayerNoMediaCanPlay = (): void => {}
  const onPlayerWindowTypeChanged = (windowType: ESPlayerWindowType): void => {
    showPlaceholder.value = (windowType == ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_SMALL)
    isFullWindow.value = (windowType == ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL)
    switch (windowType) {
      case ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FLOAT:
        break
      case ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_SMALL:
        break
      case ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL:
        initPlayerViewState(1)
        break
    }
  }
  const onPlayerWindowSizeChanged = (width: number, height: number): void => {
    playerWidth.value = width
    playerHeight.value = height
  }
  const onPlayerRelease = (): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, "-----------onPlayerRelease------------->>>>")
    }
    mediaCollapseMediaSeriesRef.value?.release()
    mediaCollapseMenuInit.value = false
  }
  const onPlayerReset = (): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, '-----------onPlayerReset------------->>>>')
    }
  }
  const onKeyDown = (keyEvent: ESKeyEvent): boolean => {
    if (player.getWindowType() != ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL) {
      return false
    }
    switch (keyEvent.keyCode) {
      case ESKeyCode.ES_KEYCODE_DPAD_CENTER:
      case ESKeyCode.ES_KEYCODE_ENTER:
        if (isPlayerViewStateDismiss()) {
          setPlayerViewStateProgress()
        }
        if (isPlayerViewStateProgress()) {
          if (isPlayerPlaying.value) {
            player.pause()
            isPlayerPlaying.value = false
          } else {
            player.start(0)
            isPlayerPlaying.value = true
          }
          return true
        }
      case ESKeyCode.ES_KEYCODE_DPAD_LEFT:
      case ESKeyCode.ES_KEYCODE_DPAD_RIGHT:
        if (isPlayerViewStateDismiss()) {
          setPlayerViewStateProgress()
          return true
        }
        if (isPlayerViewStateProgress()) {
          if (isPlayerViewStateProgress() && seekBarRef.value?.isFocused()) {
            seekBarRef.value?.startSeek(keyEvent.keyCode === ESKeyCode.ES_KEYCODE_DPAD_RIGHT)
          }
          return true
        }
        break
      case ESKeyCode.ES_KEYCODE_MENU:
        if (!isPlayerViewStateMenu()) {
          setPlayerViewStateMenu()
          return true
        }
        break
      case ESKeyCode.ES_KEYCODE_DPAD_UP:
        if (isPlayerViewStateMenu()) {
          if (!mediaListGroupItemFocused) {
            if (collapseItemIndex - 1 >= 0) {
              collapseItemIndex--
              mediaCollapseRef.value?.expandItem(collapseItemIndex)
            }
          }
        }

        break
      case ESKeyCode.ES_KEYCODE_DPAD_DOWN:
        if (nextButtonFocused) {
          if (!isPlayerViewStateMenu()) {
            setPlayerViewStateMenu()
            nextButtonFocused = false
            return true
          }
          return true
        }
        if (isPlayerViewStateDismiss()) {
          setPlayerViewStateMenu()
          return true
        }
        if (isPlayerViewStateMenu()) {
          if (collapseItemIndex + 1 < collapseItemList.length) {
            collapseItemIndex++
            mediaCollapseRef.value?.expandItem(collapseItemIndex)
          }
        }
        break
    }
    return true
  }
  const onKeyUp = (keyEvent: ESKeyEvent): boolean => {
    if (player.getWindowType() != ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL) {
      return false
    }
    setPlayerViewStateDismissDelay(5000)
    switch (keyEvent.keyCode) {
      case ESKeyCode.ES_KEYCODE_DPAD_LEFT:
      case ESKeyCode.ES_KEYCODE_DPAD_RIGHT:
        if (isPlayerViewStateProgress() && seekBarRef.value?.isFocused()) {
          seekBarRef.value?.stopSeek()
        }
        isSeeking = false
        return true
    }
    return true
  }
  const onBackPressed = (): boolean => {
    if (player.getWindowType() != ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL) {
      return false
    }
    if (isMediaAuthError.value &&
      player.getWindowType() == ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL) {
      player.setSmallWindow()
      return true
    }
    if (!isPlayerPlaying.value) {
      isPlayerPlaying.value = true
      player.start(0)
      return true
    }
    if (isPlayerViewStateMenu() || isPlayerViewStateProgress()) {
      setPlayerViewStateDismiss()
      return true
    }
    if (player && player.getWindowType() == ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL) {
      player.setSmallWindow()
      return true
    }
    return false
  }

  defineExpose({
    showPlaceholder,isFullWindow,
    getId,setEnabled,isEnabled,setPlayerManager,
    getPlayerManager,
    onPlayerInterceptSuccess,
    onPlayerInterceptError,
    onPlayerPrepared,
    onPlayerBufferStart,
    onPlayerBufferEnd,
    onPlayerPlaying,
    onPlayerProgressChanged,
    onPlayerDurationChanged,
    onPlayerPaused,
    onPlayerDefinitionListChanged,
    onPlayerDefinitionChanged,
    onPlayerPlayRateListChanged,
    onPlayerPlayRateChanged,
    onPlayerDecodeListChanged,
    onPlayerDecodeChanged,
    onPlayerAspectRatioListChanged,
    onPlayerAspectRatioChanged,
    onPlayerPlayMediaListModeListChanged,
    onPlayerPlayMediaListModeChanged,
    onPlayerPlayMediaList,
    onPlayerPlayMedia,
    onPlayerNoMediaCanPlay,
    onPlayerWindowTypeChanged,
    onPlayerWindowSizeChanged,
    onPlayerRelease,
    onPlayerReset,
    onKeyDown,
    onKeyUp,
    onBackPressed
  })
</script>

<style lang='scss' scoped>
.media-player-view-root{
  background-color: transparent;
  .media-player-view{
    width: 1920px;
    height: 1080px;
    background-color: transparent;
    //顶部条
    .media-player-view-title {
      background-color: transparent;
      .media-player-view-title-text{
        width: 1740px;
        height: 50px;
        font-size: 44px;
        font-weight: 400;
        color: white;
        margin-left: 90px;
        margin-top: 50px;
      }
    }
    //底部进度条
    .media-player-view-bottom {
      width: 1920px;
      height: 700px;
      background-color: transparent;
      position: absolute;
      bottom: 0;
      left: 0;
      align-items: flex-start;
      justify-content: flex-end;
      .media-player-view-bottom-bg {
        width: 1920px;
        height: 700px;
        background-color: transparent;
        position: absolute;
        bottom: 0;
        left: 0;
      }
      //进度条
      .media-player-view-state-progress {
        align-items: flex-start;
        justify-content: flex-end;
        background-color: transparent;
        >img {
          width: 80px;
          height: 80px;
          margin-left: 90px;
          margin-bottom: 14px;
        }
        .media-player-view-progress {
          width: 1740px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 25px;
          margin-left: 90px;
          .media-player-view-progress-text {
            width: 100px;
            height: 60px;
            font-size: 30px;
            font-weight: 400;
            color: white;
          }
          .media-player-view-seekbar {
            width: 1512px;
            height: 60px;
            margin-left: 20px;
            margin-right: 20px;
          }
        }
        .media-player-view-next {
          width: 130px;
          height: 60px;
          margin-left: 90px;
          margin-bottom: 40px;
          background-color: rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          focus-background-color: #FFF5F5F5;
          .media-player-view-next-text-focus {
            width: 130px;
            height: 60px;
            background-color: transparent;
            border-radius: 8px;
            position: absolute;
          }
          .media-player-view-next-text {
            width: 130px;
            height: 60px;
            font-size: 30px;
            font-weight: 400;
            color: white;
            focus-color: #000;
          }
        }
      }
    }
    //底部菜单
    .media-player-view-menu {
      width: 1920px;
      height: 700px;
      background-color: transparent;
      position: absolute;
      bottom: 0;
      left: 0;
      align-items: flex-start;
      justify-content: flex-end;
      .media-player-view-menu-bg {
        width: 1920px;
        height: 640px;
        position: absolute;
        left: 0;
        background-color: transparent;
      }
      .media-player-collapse {
        width: 1920px;
        height: 640px;
        position: absolute;
        left: 0;
        background-color: transparent;
      }
    }
  }
  .media-player-loading {
    background-color: transparent;
    position: absolute;
    align-items: center;
    justify-content: center;
  }
}
</style>
