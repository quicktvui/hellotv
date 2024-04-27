<template>
  <qt-row class="media-player-small-view-root-css"
          :focusable="false"
          :style="{width:playerWidth, height:playerHeight}">
    <img class="media-player-small-view-placeholder"
         v-if="showBackground"
         :style="{width:playerWidth, height:playerHeight}"
         :src="mediaPlayerPlaceholder">

    <div class="media-player-small-view-tip-root"
         v-if="showBottomTip"
         :gradientBackground="{colors:['#00000000','#E5000000']}"
         :duplicateParentState="true">
      <span class="media-player-small-view-tip-span">按【OK键】全屏观看</span>
    </div>

    <media-player-loading-view
      ref="mediaPlayerLoadingRef"
      :style="{width:playerWidth, height:playerHeight}" />

    <!-- 鉴权失败 -->
    <qt-column class="media-player-small-view-auth-css"
               :style="{width:playerWidth, height:playerHeight}"
               v-if="showAuthError && !isFloatWindow"
               :focusable="false">
      <span class="media-player-small-view-text-css">
        购买后可观看全部影视片VIP节目
      </span>
      <qt-row class="media-player-small-view-button-css"
              :gradientBackground="{colors:['#FFEEB364','#FFFFE398'], orientation: 6, cornerRadii4: [35, 35, 35, 35]}"
              :focusable="false">
              <span class="media-player-small-view-buy-text-css">
                立即购买
              </span>
      </qt-row>
    </qt-column>

    <!-- 鉴权失败 -->
    <qt-column class="media-player-float-view-auth-css"
               :style="{width:playerWidth, height:playerHeight}"
               v-if="showAuthError && isFloatWindow"
               :focusable="false">
      <span class="media-player-float-view-text-css">
        购买后可观看全部影视片VIP节目
      </span>
      <qt-row class="media-player-float-view-button-css"
              :gradientBackground="{colors:['#FFEEB364','#FFFFE398'], orientation: 6, cornerRadii4: [35, 35, 35, 35]}"
              :focusable="false">
              <span class="media-player-float-view-buy-text-css">
                立即购买
              </span>
      </qt-row>
    </qt-column>

  </qt-row>
</template>

<script lang="ts">

import {defineComponent} from "@vue/runtime-core";
import {
  ESPlayerError,
  ESPlayerInterceptError,
  ESPlayerInterceptResult,
  ESPlayerWindowType
} from "@extscreen/es3-player";
import { ESKeyEvent, ESLogLevel, useESEventBus, useESLog } from "@extscreen/es3-core"
import {ESIPlayerManager, ESMediaItem, ESMediaItemList} from "@extscreen/es3-player-manager";
import {ref} from "vue";

import playerStatePlaying from '../../../assets/ic_media_player_play.png'
import playerStatePaused from '../../../assets/ic_media_player_pause.png'
import {IMediaPlayerViewState} from "./IMediaPlayerViewState";
import {IMediaLoadingView} from "./IMediaLoadingView";
import mediaPlayerPlaceholder from "../../../assets/ic_media_player_placeholder.png"
import {IMedia} from "../../../api/media/IMedia";
import media_player_loading_view from "./media-player-loading-view.vue";
import {MEDIA_PLAYER_ERROR_AUTH} from "./IMediaPlayerErrors";

const TAG = 'MediaPlayerSmallView'

export default defineComponent({
  name: "media-player-small-view",
  components: {
    'media-player-loading-view': media_player_loading_view,
  },
  setup(props, context) {
    let enabled = true
    let player: ESIPlayerManager

    const log = useESLog()
    const eventBus = useESEventBus()

    const playerWidth = ref<number>(0)
    const playerHeight = ref<number>(0)
    const showPlaceholder = ref<boolean>(true)
    const mediaTitle = ref<string>('')
    const isPlayerPlaying = ref<boolean>(false)
    const mediaPlayerLoadingRef = ref<IMediaLoadingView>()

    const showBackground = ref<boolean>(true)
    const showAuthError = ref<boolean>(false)

    let media: IMedia

    let playingMediaItem: ESMediaItem

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

    eventBus.on("onPlayerPlaceholderFocus", onPlayerPlaceholderFocus)

    function onPlayerPlaceholderFocus(focused: boolean) {
      playerPlaceholderFocus = focused
      showBottomTip.value = (windowType == ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_SMALL) && focused
    }

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

    //-----------------------------------------------------------------------

    function getId(): string {
      return 'MediaPlayerSmallView'
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

    function onPlayerInterceptSuccess(value: ESPlayerInterceptResult): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onPlayerInterceptSuccess---start----->>>>>", value)
      }
    }

    function onPlayerInterceptError(error: ESPlayerInterceptError): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onPlayerInterceptError---start----->>>>>", error)
      }
      if (error.error?.errorCode == MEDIA_PLAYER_ERROR_AUTH) {
        if (log.isLoggable(ESLogLevel.DEBUG)) {
          log.e(TAG, "-------onPlayerInterceptError--end------>>>>>", error)
        }
        showBackground.value = true
        showAuthError.value = true
        mediaPlayerLoadingRef.value?.dismissLoading()
      }
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
      showBackground.value = false
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onPlayerPlaying-------->>>>>")
      }
      mediaPlayerLoadingRef.value?.dismissLoading()
    }

    function onPlayerProgressChanged(p: number): void {

    }

    function onPlayerDurationChanged(d: number): void {

    }

    function onPlayerPaused(): void {
    }

    function onPlayerError(error: ESPlayerError): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "-----------onPlayerError------------->>>>", error)
      }
    }

    function onPlayerPlayMediaList(playList: ESMediaItemList): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-----------onPlayerPlayMediaList------------->>>>', playList)
      }
      media = playList.media
    }

    function onPlayerPlayMedia(mediaItem: ESMediaItem): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-----------onPlayerPlayMedia------------->>>>', mediaItem)
      }
      playingMediaItem = mediaItem
      mediaPlayerLoadingRef.value?.showLoading()
      showAuthError.value = false
    }

    function onPlayerWindowTypeChanged(windowType: ESPlayerWindowType): void {
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

    function onPlayerWindowSizeChanged(width: number, height: number): void {
      // console.log('----------onPlayerWindowSizeChanged------------------>>>' + width + '---' + height)
      playerWidth.value = width
      playerHeight.value = height
    }

    function onKeyDown(keyEvent: ESKeyEvent): boolean {
      return false
    }

    function onKeyUp(keyEvent: ESKeyEvent): boolean {
      return false
    }

    return {
      mediaPlayerPlaceholder,
      mediaPlayerLoadingRef,
      mediaTitle,
      isPlayerPlaying,
      isFullWindow,
      isFloatWindow,
      showBottomTip,
      //
      isTitleBarShowing,
      isMenuShowing,
      isProgressShowing,
      showBackground,
      showAuthError,
      //
      playerWidth,
      playerHeight,
      showPlaceholder,
      playerStatePlaying,
      playerStatePaused,

      //
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
      onPlayerProgressChanged,
      onPlayerDurationChanged,
      onPlayerPaused,
      onPlayerError,
      onPlayerPlayMediaList,
      onPlayerPlayMedia,
      onPlayerWindowTypeChanged,
      onPlayerWindowSizeChanged,
      onKeyDown,
      onKeyUp,
    }
  },
});

</script>

<style scoped>
.media-player-small-view-root-css {
  background-color: transparent;
  position: absolute;
}

.media-player-small-view-placeholder {

}

.media-player-small-view-auth-css {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}

.media-player-small-view-text-css {
  width: 890px;
  height: 40px;
  font-size: 36px;
  color: #F4D297;
  text-align: center;
}

.media-player-small-view-button-css {
  width: 378px;
  height: 70px;
  border-radius: 35px;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
}

.media-player-small-view-buy-text-css {
  width: 378px;
  height: 34px;
  font-size: 30px;
  color: #603314;
  text-align: center;
}

.media-player-small-view-tip-root {
  background-color: transparent;
  height: 86px;
  width: 890px;
  position: absolute;
  bottom: 0;
}

.media-player-small-view-tip-span {
  position: absolute;
  width: 500px;
  height: 35px;
  right: 25px;
  bottom: 25px;
  font-size: 30px;
  color: white;
  text-align: right;
}

.media-player-float-view-auth-css {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
}

.media-player-float-view-text-css {
  width: 400px;
  height: 30px;
  font-size: 20px;
  color: #F4D297;
  text-align: center;
}

.media-player-float-view-button-css {
  width: 200px;
  height: 40px;
  border-radius: 35px;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 40px;
}

.media-player-float-view-buy-text-css {
  width: 200px;
  height: 20px;
  font-size: 20px;
  color: #603314;
  text-align: center;
}

</style>
