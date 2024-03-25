<template>
  <qt-view class="media-player-view-root-css"
           :focusable="false"
           :style="{width:playerWidth, height:playerHeight}">
    <qt-view class="media-player-view-full-root-css"
             v-show="isFullWindow"
             :focusable="false">
      <!-- 顶部条 -->
      <qt-view class="media-player-view-title-css"
               v-if="isFullWindow && isTitleBarShowing"
               :gradientBackground="{colors:['#E6000000', '#00000000']}">
        <qt-text class="media-player-view-title-text-css"
                 :focusable="false"
                 :fontSize="30" :text="mediaTitle"/>
      </qt-view>

      <!-- 底部进度条 -->
      <qt-view class="media-player-view-bottom-css"
               v-if="isFullWindow && isProgressShowing"
               :gradientBackground="{colors:['#00000000', '#E6000000']}">
        <!-- 底部进度条 -->
        <qt-column class="media-player-view-state-progress-root-css"
                   v-show="isProgressShowing">
          <!-- 播放状态 -->
          <img class="media-player-view-state-img-css"
               v-show="!isPlayerPlaying"
               :duplicateParentState="true" postDelay="100" :focusable="false"
               :src="playerStatePlaying"/>
          <img class="media-player-view-state-img-css"
               v-show="isPlayerPlaying"
               :duplicateParentState="true" postDelay="100" :focusable="false"
               :src="playerStatePaused"/>

          <!-- 播放进度 -->
          <qt-row class="media-player-view-progress-root-css" :autofocus="true">

            <qt-text class="media-player-view-progress-text-css"
                     :focusable="false"
                     gravity="center"
                     :fontSize="30" :text="progress"/>

            <qt-seek-bar
              ref="seekBarRef"
              name="seekBar"
              :nextFocusName="{left:'seekBar'}"
              :visible="isFullWindow && isProgressShowing"
              class="media-player-view-seekbar-css"
              :onProgressChanged="onSeekBarChanged"
              @onSeekStop="onSeekBarSeekStop"
              @focus="onSeekbarFocusChanged"

              :focusable="true"/>

            <qt-text class="media-player-view-progress-text-css"
                     :focusable="false"
                     gravity="center"
                     :fontSize="30" :text="duration"/>
          </qt-row>

          <!-- 下一个按钮-->
          <div class="media-player-view-next-css"
               :focusable="true"
               name="nextButton"
               @click="onNextButtonClicked"
               @focus="onNextButtonFocusChanged"
               :nextFocusName="{
                    up:'seekBar',
                    down:'nextButton',
                    right: 'nextButton',
                    left: 'nextButton'
                 }"
               >
            <qt-text class="media-player-view-next-text-css"
                     :duplicateParentState="true"
                     gravity="center"
                     :fontSize="30" text="下一个"
                     focusScale="1.1"/>
          </div>
        </qt-column>
      </qt-view>

      <!-- 底部菜单 -->
      <qt-view class="media-player-view-menu-css"
               v-show="isFullWindow && isMenuShowing">
        <qt-view class="media-player-collapse-css"
                 v-if="isFullWindow && isMenuShowing"
                 :gradientBackground="{colors:['#00000000', '#E6000000']}"/>
        <qt-collapse
          ref="mediaCollapseRef"
          v-show="isFullWindow && isMenuShowing"
          class="media-player-collapse-css">
          <media-collapse-order
            ref="mediaCollapseOrderRef"
            :nextFocusName="{
                    up:'mediaCollapseOrder',
                    down:'mediaCollapseSpeed'
                 }"
            name="mediaCollapseOrder"
            @onCollapseItemFocused="onCollapseItemOrderFocused"
            @onCollapseItemClicked="onCollapseItemOrderClicked"/>
          <media-collapse-speed
            ref="mediaCollapseSpeedRef"
            :nextFocusName="{
                    up:'mediaCollapseOrder',
                    down:'mediaCollapseDefinition'
                 }"
            name="mediaCollapseSpeed"
            @onCollapseItemFocused="onCollapseItemSpeedFocused"
            @onCollapseItemClicked="onCollapseItemSpeedClicked"/>
          <media-collapse-definition
            ref="mediaCollapseDefinitionRef"
            :nextFocusName="{
                    up:'mediaCollapseSpeed',
                    down:'mediaCollapseMediaList'
                 }"
            name="mediaCollapseDefinition"
            @onCollapseItemFocused="onCollapseItemDefinitionFocused"
            @onCollapseItemClicked="onCollapseItemDefinitionClicked"/>
          <media-collapse-media-list
            ref="mediaCollapseMediaListRef"
            :nextFocusName="{
                    up:'mediaCollapseDefinition',
                    down:'mediaCollapseMediaList'
                 }"
            name="mediaCollapseMediaList"
            @onMediaListGroupItemFocused="onCollapseItemMediaListGroupFocused"
            @onMediaListItemFocused="onCollapseItemMediaListFocused"
            @onMediaListItemClicked="onCollapseItemMediaListClicked"/>
        </qt-collapse>
      </qt-view>
    </qt-view>

    <media-player-loading-view
      ref="mediaPlayerLoadingRef"
      :style="{width:playerWidth, height:playerHeight}"/>
  </qt-view>
</template>

<script lang="ts">

import {defineComponent, onUnmounted} from "@vue/runtime-core";
import {
  ESMediaSource,
  ESMediaSourceList,
  ESPlayerAspectRatio,
  ESPlayerDecode,
  ESPlayerDefinition,
  ESPlayerError,
  ESPlayerInfo,
  ESPlayerInterceptError,
  ESPlayerInterceptResult,
  ESPlayerPlayMode,
  ESPlayerRate,
  ESPlayerWindowType
} from "@extscreen/es3-player";
import {ESKeyCode, ESKeyEvent, ESLogLevel, useESEventBus, useESLog} from "@extscreen/es3-core";
import {ESIPlayerManager, ESMediaItem, ESMediaItemList} from "@extscreen/es3-player-manager";
import {ref, markRaw, onMounted} from "vue";

import playerStatePlaying from '../../../assets/ic_media_player_play.png'
import playerStatePaused from '../../../assets/ic_media_player_pause.png'
import {QTISeekBar, QTICollapse, QTCollapse, QTListViewItem} from "@quicktvui/quicktvui3";
import {s_to_hs} from "../../../tools/formatDate";
import {IMediaPlayerViewState} from "./IMediaPlayerViewState";
import media_player_loading_view from "./media-player-loading-view.vue";
import {IMediaLoadingView} from "./IMediaLoadingView";

//
import media_collapse_definition from './collapse/media-collapse-definition.vue'
import media_collapse_media_list from './collapse/media-collapse-media-list.vue'
import media_collapse_order from './collapse/media-collapse-order.vue'
import media_collapse_speed from './collapse/media-collapse-speed.vue'
import {IMediaCollapseItemListView} from "./collapse/IMediaCollapseItemListView";
import {
  buildPlayModeList,
  buildDefinitionList,
  buildPlayRateList,
  buildCollapseMenu,
  getPlayModeIndex, getDefinitionIndex, getPlayRateIndex
} from "../adapter/PlayerDataAdapter";
import {IMedia} from "../../../api/media/IMedia";
import {IMediaCollapseMediaSeriesView} from "./collapse/IMediaCollapseMediaSeriesView";

const TAG = 'MediaPlayerView'

export default defineComponent({
  name: "media-player-view",
  components: {
    'media-player-loading-view': media_player_loading_view,
    'media-collapse-definition': media_collapse_definition,
    'media-collapse-media-list': media_collapse_media_list,
    'media-collapse-order': media_collapse_order,
    'media-collapse-speed': media_collapse_speed
  },
  setup(props, context) {
    let enabled = true
    let player: ESIPlayerManager

    const log = useESLog()
    const eventbus = useESEventBus()


    const playerWidth = ref<number>(0)
    const playerHeight = ref<number>(0)
    const showPlaceholder = ref<boolean>(true)
    const mediaTitle = ref<string>('')
    const isPlayerPlaying = ref<boolean>(false)
    const mediaPlayerLoadingRef = ref<IMediaLoadingView>()
    const isMediaAuthError = ref<boolean>(false)

    //-----------------------------------------------------
    const seekBarRef = ref<QTISeekBar>()
    const progress = ref<string>('00:00')
    const duration = ref<string>('00:00')
    seekBarRef.value?.setSeekBarMode(1);
    seekBarRef.value?.setProgressHeight(5);
    seekBarRef.value?.setProgressRadius(100);
    let isSeeking = false
    let nextButtonFocused = false
    //----------------------菜单-------------------------------
    onMounted(() => {
      eventbus.on('onMediaListItemLoad', onMediaListItemLoad)
    });
    onUnmounted(() => {
      eventbus.off('onMediaListItemLoad', onMediaListItemLoad)
    });

    const dataMap = new Map<number, Array<IMedia>>()

    function onMediaListItemLoad(page: number, mediaList: Array<IMedia>) {
      if (mediaCollapseMenuInit) {
        mediaCollapseMediaListRef.value?.setListData(page, mediaList)
      } else {
        dataMap.set(page, mediaList)
      }
    }

    let mediaCollapseMenuInit = false

    let media: IMedia

    let playingMediaItem: ESMediaItem

    let playModeList: Array<ESPlayerPlayMode>
    let playMode: ESPlayerPlayMode

    let definitionList: Array<ESPlayerDefinition>
    let definition: ESPlayerDefinition

    let rateList: Array<ESPlayerRate>
    let rate: ESPlayerRate

    let decodeList: Array<ESPlayerDecode>
    let decode: ESPlayerDecode

    let aspectRatioList: Array<ESPlayerAspectRatio>
    let aspectRatio: ESPlayerAspectRatio

    let collapseItemIndex = 0
    const mediaCollapseRef = ref<QTICollapse>()

    const mediaCollapseOrderRef = ref<IMediaCollapseItemListView>()
    const mediaCollapseSpeedRef = ref<IMediaCollapseItemListView>()
    const mediaCollapseDefinitionRef = ref<IMediaCollapseItemListView>()
    const mediaCollapseMediaListRef = ref<IMediaCollapseMediaSeriesView>()

    //-------------------------------菜单-----------------------------------
    function initCollapseMenu() {
      mediaCollapseRef.value?.init(buildCollapseMenu())
      mediaCollapseMenuInit = true;
    }

    //-------------------------------播放顺序-----------------------------------
    function initCollapseOrderMenu() {
      if (playModeList) {
        mediaCollapseOrderRef.value?.setListData(buildPlayModeList(playModeList))
      }
      setCollapseItemOrderSelected()
    }

    function setCollapseItemOrderSelected() {
      if (playModeList) {
        const index = getPlayModeIndex(playMode, playModeList)
        if (index > -1) {
          mediaCollapseOrderRef.value?.setItemSelected(index)
        }
      }
    }

    function setCollapseOrderMenuFocused() {
      setTimeout(() => {
        mediaCollapseOrderRef.value?.setItemFocused(0)
      }, 500)
    }

    function onCollapseItemOrderFocused(focused: boolean) {
      if (focused && collapseItemIndex != 0) {
        collapseItemIndex = 0
        mediaCollapseRef.value?.expandItem(collapseItemIndex)
      }
    }

    function onCollapseItemOrderClicked(index: number, item: QTListViewItem) {
      if (playMode == item.mode) return
      player?.setPlayMediaListMode(item.mode)
    }

    //------------------------------清晰度------------------------------------
    function initCollapseDefinitionMenu() {
      if (definitionList) {
        mediaCollapseDefinitionRef.value?.setListData(buildDefinitionList(definitionList))
      }
      setCollapseItemDefinitionSelected()
    }

    function setCollapseItemDefinitionSelected() {
      if (definitionList) {
        const index = getDefinitionIndex(definition, definitionList)
        if (index > -1) {
          mediaCollapseDefinitionRef.value?.setItemSelected(index)
        }
      }
    }

    function onCollapseItemDefinitionFocused(focused: boolean) {
      if (focused && collapseItemIndex != 2) {
        collapseItemIndex = 2
        mediaCollapseRef.value?.expandItem(collapseItemIndex)
      }
    }

    function onCollapseItemDefinitionClicked(index: number, item: QTListViewItem) {
      if (definition == item.definition) return
      player?.setDefinition(item.definition)
    }

    //--------------------------------倍速----------------------------------
    function initCollapseSpeedMenu() {
      if (rateList) {
        mediaCollapseSpeedRef.value?.setListData(buildPlayRateList(rateList))
      }
      setCollapseItemSpeedSelected()
    }

    function setCollapseItemSpeedSelected() {
      if (rateList) {
        const index = getPlayRateIndex(rate, rateList)
        if (index > -1) {
          mediaCollapseSpeedRef.value?.setItemSelected(index)
        }
      }
    }

    function onCollapseItemSpeedFocused(focused: boolean) {
      if (focused && collapseItemIndex != 1) {
        collapseItemIndex = 1
        mediaCollapseRef.value?.expandItem(collapseItemIndex)
      }
    }

    function onCollapseItemSpeedClicked(index: number, item: QTListViewItem) {
      if (rate == item.rate) return
      player?.setPlayRate(item.rate)
    }

    //--------------------------------媒资列表----------------------------------
    function initCollapseListMenu() {
      if (media) {
        mediaCollapseMediaListRef.value?.initMedia(media)
      }
      if (dataMap.size > 0) {
        dataMap.forEach(function (mediaList: Array<IMedia>, page: number) {
          mediaCollapseMediaListRef.value?.setListData(page, mediaList)
        });
        dataMap.clear()
      }
      setCollapseItemMediaListSelected()
    }

    function setCollapseItemMediaListSelected() {
      if (playingMediaItem) {
        const index = playingMediaItem.index
        if (index > -1) {
          mediaCollapseMediaListRef.value?.setItemSelected(index)
        }
      }
    }

    function onCollapseItemMediaListGroupFocused(index: number) {
      if (collapseItemIndex != 3) {
        collapseItemIndex = 3
        mediaCollapseRef.value?.expandItem(collapseItemIndex)
      }
    }

    function onCollapseItemMediaListClicked(index: number, item: QTListViewItem) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onCollapseItemMediaListClicked------>>>>>", index, item)
      }
      player?.playMediaById(item.id)
    }

    function onCollapseItemMediaListFocused(index: number) {
      if (collapseItemIndex != 3) {
        collapseItemIndex = 3
        mediaCollapseRef.value?.expandItem(collapseItemIndex)
      }
    }

    //-----------------------------------------------------播放器窗口--------------------------------------------------------
    const isFullWindow = ref<boolean>(false)
    const viewState = ref<number>(1)
    const isTitleBarShowing = ref<boolean>(true)
    const isMenuShowing = ref<boolean>(false)
    const isProgressShowing = ref<boolean>(false)
    let dismissTimer

    function isPlayerViewStateMenu() {
      return IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_MENU === viewState.value;
    }

    function isPlayerViewStateDismiss() {
      return IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_DISMISS === viewState.value;
    }

    function isPlayerViewStateProgress() {
      return IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_PROGRESS === viewState.value;
    }

    function setPlayerViewStateProgress() {
      const lastViewState = viewState.value
      viewState.value = IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_PROGRESS
      initPlayerViewState(lastViewState);
    }

    function setPlayerViewStateDismiss() {
      const lastViewState = viewState.value
      viewState.value = IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_DISMISS
      initPlayerViewState(lastViewState);
    }

    function setPlayerViewStateMenu() {
      const lastViewState = viewState.value
      viewState.value = IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_MENU
      initPlayerViewState(lastViewState);
    }

    function clearDismissTimer() {
      if (dismissTimer) {
        clearTimeout(dismissTimer);
      }
    }

    function setPlayerViewStateDismissDelay(delay: number) {
      clearDismissTimer();
      dismissTimer = setTimeout(() => {
        setPlayerViewStateDismiss();
      }, delay);
    }

    function initPlayerViewState(lastViewState: number) {
      switch (viewState.value) {
        case IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_DISMISS:
          isTitleBarShowing.value = false
          isMenuShowing.value = false
          isProgressShowing.value = false
          mediaCollapseMediaListRef?.value?.show(false)
          break
        case IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_MENU:
          isMenuShowing.value = true
          isProgressShowing.value = false
          mediaCollapseMediaListRef?.value?.show(true)
          //setCollapseOrderMenuFocused()
          break
        case IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_PROGRESS:
          isMenuShowing.value = false
          isTitleBarShowing.value = true
          isProgressShowing.value = true
          mediaCollapseMediaListRef?.value?.show(false)
          break
      }
      setPlayerViewStateDismissDelay(5000)
    }

    //-----------------------------------------------------
    function onNextButtonClicked() {
      if (player) {
        player.playNextMedia()
      }
    }
    function onNextButtonFocusChanged(e) {
      nextButtonFocused = e.isFocused
        log.e(TAG, "onNextButtonFocusChanged nextButtonFocused"+nextButtonFocused)
    }

    function onSeekBarChanged(p) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onSeekBarChanged-----XXX--->>>>>", p)
      }
      progress.value = s_to_hs(Math.floor(p / 1000))
    }

    function onSeekBarSeekStop(progress) {
      isSeeking = false
      if (player && progress >= 0) {
        player.seekTo(progress)
      }
    }

    function onSeekbarFocusChanged(event) {
      let focused = event.isFocused;
      seekBarRef.value?.setThumbActivate(focused);
    }

    //-----------------------------------------------------------------------

    function getId(): string {
      return 'MediaPlayerView'
    }

    function setEnabled(value: boolean): void {
      enabled = value
    }

    function isEnabled(): boolean {
      return enabled;
    }

    function setPlayerManager(value: ESIPlayerManager): void {
      player = value
    }

    function getPlayerManager(): ESIPlayerManager {
      return player
    }

    function onPlayerInitialized(playerType: number): void {
    }

    function onPlayerPlayMediaSourceList(mediaSourceList: ESMediaSourceList): void {
    }

    function onPlayerPlayMediaSource(mediaSource: ESMediaSource): void {
    }

    function onPlayerInterceptSuccess(value: ESPlayerInterceptResult): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onPlayerInterceptSuccess----ccc---->>>>>", value)
      }
      isMediaAuthError.value = false
    }

    function onPlayerInterceptError(value: ESPlayerInterceptError): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onPlayerInterceptError----ccc---->>>>>", value)
      }
      isMediaAuthError.value = true
    }

    function onPlayerPreparing(): void {
    }

    function onPlayerPrepared(): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onPlayerPrepared-------->>>>>")
      }
    }

    function onPlayerBufferStart(): void {
      mediaPlayerLoadingRef.value?.showLoading()
    }

    function onPlayerBufferEnd(): void {
      mediaPlayerLoadingRef.value?.dismissLoading()
    }

    function onPlayerPlaying(): void {
      isPlayerPlaying.value = true
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onPlayerPlaying-------->>>>>")
      }
      mediaPlayerLoadingRef.value?.dismissLoading()
    }

    function onPlayerProgressChanged(p: number): void {
      if (isSeeking) {
        return
      }
      seekBarRef.value?.setProgress(p);
      progress.value = s_to_hs(Math.floor(p / 1000))
    }

    function onPlayerDurationChanged(d: number): void {
      if (isSeeking) {
        return
      }
      seekBarRef.value?.setMaxProgress(d);
      duration.value = s_to_hs(Math.floor(d / 1000))
    }

    function onPlayerSeekStart(): void {
    }

    function onPlayerSeekCompleted(): void {
    }

    function onPlayerPaused(): void {
      isPlayerPlaying.value = false
    }

    function onPlayerResumed(): void {
    }

    function onPlayerStopped(): void {
    }

    function onPlayerCompleted(): void {
    }

    function onPlayerError(error: ESPlayerError): void {
    }

    function onPlayerInfo(info: ESPlayerInfo): void {
    }

    function onPlayerNoMediaSourceCanPlay(next: boolean): void {
    }
    function onPlayerDefinitionListChanged(list: Array<ESPlayerDefinition>): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onPlayerDefinitionListChanged-------->>>>>", list)
      }
      definitionList = list
      initCollapseDefinitionMenu()
    }

    function onPlayerDefinitionChanged(d: ESPlayerDefinition): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onPlayerDefinitionChanged-------->>>>>", d)
      }
      definition = d
      setCollapseItemDefinitionSelected()
    }

    function onPlayerPlayRateListChanged(list: Array<ESPlayerRate>): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onPlayerPlayRateListChanged-------->>>>>", list)
      }
      rateList = list
      initCollapseSpeedMenu()
    }

    function onPlayerPlayRateChanged(r: ESPlayerRate): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onPlayerPlayRateChanged-------->>>>>", r)
      }
      rate = r
      setCollapseItemSpeedSelected()
    }

    function onPlayerDecodeListChanged(list: Array<ESPlayerDecode>): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onPlayerDecodeListChanged-------->>>>>", list)
      }
      decodeList = list
    }

    function onPlayerDecodeChanged(d: ESPlayerDecode): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onPlayerDecodeChanged-------->>>>>", d)
      }
      decode = d
    }

    function onPlayerAspectRatioListChanged(list: Array<ESPlayerAspectRatio>): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onPlayerAspectRatioListChanged-------->>>>>", list)
      }
      aspectRatioList = list
    }

    function onPlayerAspectRatioChanged(a: ESPlayerAspectRatio): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onPlayerAspectRatioChanged-------->>>>>", a)
      }
      aspectRatio = a
    }

    function onPlayerPlayMediaListModeListChanged(modeList: Array<ESPlayerPlayMode>): void {
      playModeList = modeList
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onPlayerPlayModeListChanged-------->>>>>", modeList)
      }
      initCollapseOrderMenu()
    }

    function onPlayerPlayMediaListModeChanged(mode: ESPlayerPlayMode): void {
      playMode = mode
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onPlayerPlayModeChanged-------->>>>>", mode)
      }
      setCollapseItemOrderSelected()
    }

    function onPlayerPlayMediaList(playList: ESMediaItemList): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-----------onPlayerPlayMediaList------------->>>>', playList)
      }
      media = playList.media
      initCollapseMenu()
      initCollapseListMenu()
    }

    function onPlayerPlayMedia(mediaItem: ESMediaItem): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-----------onPlayerPlayMedia------------->>>>', mediaItem)
      }
      playingMediaItem = mediaItem
      if (mediaItem) {
        mediaTitle.value = mediaItem.title
      }
      mediaPlayerLoadingRef.value?.showLoading()
      setCollapseItemMediaListSelected()
    }

    function onPlayerNoMediaCanPlay(next: boolean): void {
    }

    function onPlayerWindowTypeChanged(windowType: ESPlayerWindowType): void {
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

    function onPlayerWindowSizeChanged(width: number, height: number): void {
      console.log('----------onPlayerWindowSizeChanged------------------>>>' + width + '---' + height)
      playerWidth.value = width
      playerHeight.value = height
    }

    function onKeyDown(keyEvent: ESKeyEvent): boolean {
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
            } else {
              player.start(0)
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
              isSeeking = true
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
          break
        case ESKeyCode.ES_KEYCODE_DPAD_DOWN:
          if(nextButtonFocused){
            if (!isPlayerViewStateMenu()) {
              setPlayerViewStateMenu()
                nextButtonFocused = false
              return true
            }
          }
          break
      }
      return true
    }

    function onKeyUp(keyEvent: ESKeyEvent): boolean {
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

    function onBackPressed(): boolean {
      if (player.getWindowType() != ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL) {
        return false
      }

      if (isMediaAuthError.value &&
        player.getWindowType() == ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL) {
        player.setSmallWindow()
        return true
      }
      if (!isPlayerPlaying.value) {
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

    return {
      mediaPlayerLoadingRef,
      mediaTitle,
      isPlayerPlaying,
      isFullWindow,
      isMediaAuthError,
      progress,
      duration,
      //
      isTitleBarShowing,
      isMenuShowing,
      isProgressShowing,
      //
      playerWidth,
      playerHeight,
      showPlaceholder,
      playerStatePlaying,
      playerStatePaused,
      //
      seekBarRef,
      onSeekBarChanged,
      onSeekbarFocusChanged,
      onSeekBarSeekStop,
      //
      mediaCollapseRef,
      mediaCollapseOrderRef,
      mediaCollapseSpeedRef,
      mediaCollapseDefinitionRef,
      mediaCollapseMediaListRef,
      onCollapseItemOrderFocused,
      onCollapseItemOrderClicked,
      onCollapseItemSpeedFocused,
      onCollapseItemSpeedClicked,
      onCollapseItemDefinitionFocused,
      onCollapseItemDefinitionClicked,
      onCollapseItemMediaListFocused,
      onCollapseItemMediaListClicked,
      onCollapseItemMediaListGroupFocused,
      //
      getId,
      setEnabled,
      isEnabled,
      setPlayerManager,
      getPlayerManager,
      onPlayerInitialized,
      onPlayerPlayMediaSourceList,
      onPlayerPlayMediaSource,
      onPlayerInterceptSuccess,
      onPlayerInterceptError,
      onPlayerPreparing,
      onPlayerPrepared,
      onPlayerBufferStart,
      onPlayerBufferEnd,
      onPlayerPlaying,
      onPlayerProgressChanged,
      onPlayerDurationChanged,
      onPlayerSeekStart,
      onPlayerSeekCompleted,
      onPlayerPaused,
      onPlayerResumed,
      onPlayerStopped,
      onPlayerCompleted,
      onPlayerError,
      onPlayerInfo,
      onPlayerNoMediaSourceCanPlay,
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
      onKeyDown,
      onKeyUp,
      onBackPressed,
      //
      onNextButtonClicked,
      onNextButtonFocusChanged,
    }
  },
});

</script>

<style scoped>
.media-player-view-root-css {
  background-color: transparent;
}

.media-player-view-full-root-css {
  width: 1920px;
  height: 1080px;
}

.media-player-small-root-css {
  background-color: transparent;
}

.media-player-view-title-css {
  background-color: transparent;
}

.media-player-view-title-text-css {
  width: 1740px;
  height: 50px;
  font-size: 44px;
  font-weight: 400;
  color: white;
  margin-left: 90px;
  margin-top: 50px;
}

.media-player-view-bottom-css {
  width: 1920px;
  height: 700px;
  background-color: transparent;
  position: absolute;
  bottom: 0;
  left: 0;
  align-items: flex-start;
  justify-content: flex-end;
}

.media-player-view-menu-css {
  width: 1920px;
  height: 700px;
  background-color: transparent;
  position: absolute;
  bottom: 0;
  left: 0;
  align-items: flex-start;
  justify-content: flex-end;
}

.media-player-collapse-css {
  width: 1920px;
  height: 640px;
  position: absolute;
  left: 0;
  background-color: transparent;
}

.media-player-view-state-img-css {
  width: 80px;
  height: 80px;
  margin-left: 90px;
  margin-bottom: 14px;
}

.media-player-view-progress-root-css {
  width: 1740px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 25px;
  margin-left: 90px;
}

.media-player-view-progress-text-css {
  width: 100px;
  height: 60px;
  font-size: 30px;
  font-weight: 400;
  color: white;
}

.media-player-view-seekbar-css {
  width: 1512px;
  height: 60px;
  margin-left: 20px;
  margin-right: 20px;
}

.media-player-view-next-css {
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
}

.media-player-view-next-text-css {
  width: 130px;
  height: 60px;
  font-size: 30px;
  font-weight: 400;
  color: white;
  focus-color: black;
}

.media-player-view-state-progress-root-css {
  align-items: flex-start;
  justify-content: flex-end;
}


</style>
