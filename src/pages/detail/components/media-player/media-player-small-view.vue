<template>
  <qt-view class="media-player-small-view-root"
    name='smallRoot'
    :focusable="false"
    :style="{width:playerWidth, height:playerHeight}">
    <!-- 占位图 -->
    <img
      v-if="showBackground"
      :fillParent='true'
      :style="{width:playerWidth, height:playerHeight}"
      :src="mediaPlayerPlaceholder">
    <!-- 小窗文字提示 -->
    <qt-view class="media-player-small-view-tip"
      v-if="showBottomTip"
      :gradientBackground="{colors:['#00000000','#E5000000']}"
      :duplicateParentState="true">
      <span :visible="isTrySee" class="tip-text1" >正在试看</span>
      <span class="tip-text2">按【OK键】全屏观看</span>
    </qt-view>
    <qt-view 
      class="media-player-loading" 
      :focusable="false" 
      ref="mediaPlayerLoadingRef"
      name='loadingRoot'
      :fillParent='true' :visible="showLoading"
      :style="{width:playerWidth, height:playerHeight}">
      <qt-loading-view :style="{width:100, height:100}"/>
    </qt-view>
    <!-- 鉴权失败 -->
    <qt-column class="media-player-small-view-auth"
      :style="{width: playerWidth, height: playerHeight}"
      v-if="showAuthError && !isFloatWindow"
      :focusable="false">
      <span>购买后可观看全部影视片VIP节目</span>
      <qt-row class="media-player-small-view-button"
        :gradientBackground="{colors:['#FFEEB364','#FFFFE398'], orientation: 6, cornerRadii4: [35, 35, 35, 35]}"
        :focusable="false">
        <span>立即购买</span>
      </qt-row>
    </qt-column>
    <!-- 鉴权失败 -->
    <qt-column class="media-player-float-view-auth-css"
      :style="{width:playerWidth, height:playerHeight}"
      v-if="showAuthError && isFloatWindow"
      :focusable="false">
      <span>购买后可观看全部影视片VIP节目</span>
      <qt-row class="media-player-float-view-button"
        :gradientBackground="{colors:['#FFEEB364','#FFFFE398'], orientation: 6, cornerRadii4: [35, 35, 35, 35]}"
        :focusable="false">
        <span>立即购买</span>
      </qt-row>
    </qt-column>
  </qt-view>
</template>
    
<script setup lang='ts' name='ButtonMenu'>
import { ref } from 'vue'
import {ESLogLevel, useESEventBus, useESLog } from "@extscreen/es3-core"
import {ESIPlayerManager, ESMediaItem, ESMediaItemList} from "@extscreen/es3-player-manager";
import {
  ESPlayerError,
  ESPlayerInterceptError,
  ESPlayerInterceptResult,
  ESPlayerWindowType
} from "@extscreen/es3-player";
import { IMediaPlayerViewState, MEDIA_PLAYER_ERROR_AUTH } from '../../adapter/interface'
import { isTrySee } from '../../adapter/index'
import mediaPlayerPlaceholder from "../../../../assets/detail/ic_media_player_placeholder.png"
  const TAG = 'MediaPlayerSmallView'
  let enabled = true
  let player: ESIPlayerManager
  const log = useESLog()
  const eventBus = useESEventBus()
  const playerWidth = ref<number>(0)
  const playerHeight = ref<number>(0)
  const showPlaceholder = ref<boolean>(true)
  const isPlayerPlaying = ref<boolean>(false)
  let showLoading = ref(false)
  const showBackground = ref<boolean>(true)
  const showAuthError = ref<boolean>(false)
  const isFullWindow = ref<boolean>(false)
  const isFloatWindow = ref<boolean>(false)
  const showBottomTip = ref<boolean>(true)
  const viewState = ref<number>(1)
  const isTitleBarShowing = ref<boolean>(true)
  const isMenuShowing = ref<boolean>(false)
  const isProgressShowing = ref<boolean>(false)
  let dismissTimer

  let playerPlaceholderFocus = false
  let windowType: ESPlayerWindowType = ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_SMALL

  const onPlayerPlaceholderFocus = (focused: boolean) => {
    playerPlaceholderFocus = focused
    showBottomTip.value = (windowType == ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_SMALL) && focused
  }
  eventBus.on("onPlayerPlaceholderFocus", onPlayerPlaceholderFocus)
  const setPlayerViewStateDismiss = () => {
    const lastViewState = viewState.value
    viewState.value = IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_DISMISS
    initPlayerViewState(lastViewState);
  }
  const setPlayerViewStateDismissDelay = (delay: number) => {
    clearTimeout(dismissTimer);
    dismissTimer = setTimeout(() => {
      setPlayerViewStateDismiss();
    }, delay);
  }
  const initPlayerViewState = () => {
    switch (viewState.value) {
      case IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_DISMISS:
        isTitleBarShowing.value = false
        isMenuShowing.value = false
        isProgressShowing.value = false
        break
      case IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_MENU:
        isMenuShowing.value = true
        isProgressShowing.value = false
        break
      case IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_PROGRESS:
        isMenuShowing.value = false
        isTitleBarShowing.value = true
        isProgressShowing.value = true
        break
    }
    setPlayerViewStateDismissDelay(5000)
  }
  const getId = (): string => {return 'MediaPlayerSmallView'}
  const setEnabled = (value: boolean): void => {enabled = value}
  const isEnabled = (): boolean => {return enabled;}
  const setPlayerManager = (value: ESIPlayerManager): void => {player = value}
  const getPlayerManager = (): ESIPlayerManager => {return player}
  const onPlayerInterceptSuccess = (value: ESPlayerInterceptResult): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.e(TAG, "-------onPlayerInterceptSuccess---start----->>>>>", value)
    }
  }
  const onPlayerInterceptError = (error: ESPlayerInterceptError): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.e(TAG, "-------onPlayerInterceptError---start----->>>>>", error)
    }
    if (error.error?.errorCode == MEDIA_PLAYER_ERROR_AUTH) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onPlayerInterceptError--end------>>>>>", error)
      }
      showBackground.value = true
      showAuthError.value = true
      showLoading.value = false
    }
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
    showBackground.value = false
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.e(TAG, "-------onPlayerPlaying-------->>>>>")
    }
    showLoading.value = false
  }
  const onPlayerError = (error: ESPlayerError): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, "-----------onPlayerError------------->>>>", error)
    }
  }
  const onPlayerPlayMediaList = (playList: ESMediaItemList): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, '-----------onPlayerPlayMediaList------------->>>>', playList)
    }
  }
  const onPlayerPlayMedia = (mediaItem: ESMediaItem): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, '-----------onPlayerPlayMedia------------->>>>', mediaItem)
    }
    showLoading.value = true
    showAuthError.value = false
  }
  const onPlayerWindowTypeChanged = (windowType: ESPlayerWindowType): void => {
    showPlaceholder.value = (windowType == ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_SMALL)
    isFullWindow.value = (windowType == ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL)
    isFloatWindow.value = (windowType == ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FLOAT)
    showBottomTip.value = (windowType == ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_SMALL)
      && playerPlaceholderFocus
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
  const onKeyDown = (): boolean => {return false}
  const onKeyUp = (): boolean => {return false}

  defineExpose({
    showPlaceholder,isFullWindow,isFloatWindow,showBottomTip,
    getId,
    setEnabled,
    isEnabled,
    setPlayerManager,
    getPlayerManager,
    onPlayerInterceptSuccess,
    onPlayerInterceptError,
    onPlayerPrepared,
    onPlayerBufferStart,
    onPlayerBufferEnd,
    onPlayerPlaying,
    onPlayerError,
    onPlayerPlayMediaList,
    onPlayerPlayMedia,
    onPlayerWindowTypeChanged,
    onPlayerWindowSizeChanged,
    onKeyDown,
    onKeyUp
  })
</script>

<style lang='scss' scoped>
.media-player-small-view-root{
  background-color: transparent;
  position: absolute;
  .media-player-small-view-tip {
    background-color: transparent;
    height: 86px;
    width: 890px;
    position: absolute;
    bottom: 0;
    .tip-text1{
      position: absolute;
      width: 300px;
      height: 35px;
      left: 25px;
      bottom: 25px;
      font-size: 30px;
      color: white;
    }
    .tip-text2{
      position: absolute;
      width: 500px;
      height: 35px;
      right: 25px;
      bottom: 25px;
      font-size: 30px;
      color: white;
      text-align: right;
    }
  }
  .media-player-loading {
    background-color: transparent;
    position: absolute;
    align-items: center;
    justify-content: center;
  }
  .media-player-small-view-auth {
    position: absolute;
    justify-content: center;
    align-items: center;
    > span {
      width: 890px;
      height: 40px;
      font-size: 36px;
      color: #F4D297;
      text-align: center;
    }
    .media-player-small-view-button{
      width: 378px;
      height: 70px;
      border-radius: 35px;
      background-color: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 40px;
      span{
        width: 378px;
        height: 34px;
        font-size: 30px;
        color: #603314;
        text-align: center;
      }
    }
  }
  .media-player-float-view-auth-css{
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    >span{
      width: 400px;
      height: 30px;
      font-size: 20px;
      color: #F4D297;
      text-align: center;
    }
    .media-player-float-view-button{
      width: 200px;
      height: 40px;
      border-radius: 35px;
      background-color: transparent;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 40px;
      span{
        width: 200px;
        height: 20px;
        font-size: 20px;
        color: #603314;
        text-align: center;
      }
    }
  }
}
</style>
