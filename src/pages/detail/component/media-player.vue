<template>
  <qt-column name='media-player' class="media-player-root-css" ref='playerParent' sid='playerParent' :focusable='false'>
    <es-player-manager
      ref="playerManager"
      :smallWindowWidth="890"
      :smallWindowHeight="500"
      :floatWindowWidth="502"
      :floatWindowHeight="283"
      :initPlayerWindowType="1"
      playerBackgroundColor="black"
      :playMediaAuto="false"
      :focusable='false'
      :playerList="playerListRef"
      :playerViewList="playerViewListRef"
      :style="{ left: playerLeft, top: playerTop }"
      @onPlayerPlayMedia="onPlayerPlayMedia"
      @onPlayerPlaying="onPlayerPlaying"
      @onPlayerPaused="onPlayerPaused"
      @onPlayerStopped="onPlayerStopped"
      @onPlayerWindowTypeChanged="onPlayerWindowTypeChanged"
      @onPlayerInterceptSuccess="onPlayerInterceptSuccess"
      @onPlayerInterceptError="onPlayerInterceptError"
      class="media-player-manager-css"/>
  </qt-column>

  <!-- 低端机播放器遮罩 -->
  <qt-image v-show="playerMask" :class=playerMaskCss :src=playerMaskImg />
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import {
  ESIPlayerManager, ESMediaItem,
  ESMediaItemList,
  ESPlayerManager,
  useESPlayerManagerPlayModeManager
} from "@extscreen/es3-player-manager";
import { markRaw, ref } from "vue";
import { ESVideoPlayer } from "@extscreen/es3-video-player";
import {
  ESPlayerInterceptError,
  ESPlayerInterceptResult,
  ESPlayerPlayMode,
  ESPlayerWindowType,
  ESPlayerRate,
  useESPlayerRateManager
} from "@extscreen/es3-player"
import { IMedia } from "../../../api/media/IMedia";
import ESMediaPlayerView from "./media-player-view.vue"
import { ESKeyEvent, ESLogLevel, useESLog } from "@extscreen/es3-core";
import { buildMediaItemList } from "../adapter/PlayerDataAdapter";
import { useMediaDataSource } from "../../../api/UseApi";
import ESMediaPlayerSmallView from "./media-player-small-view.vue"
import {
  createESPlayerMediaItemAuthInterceptor,
  createESPlayerMediaSourceListInterceptor
} from "../player/ESPlayerMediaItemInterceptor";
import BuildConfig from '../../../build/BuildConfig'

const TAG = 'MediaPlayer'

export default defineComponent({
  name: "media-player-view",
  components: {
    'es-player-manager': ESPlayerManager,
  },
  emits: [
    "onPlayerPlayMedia",
    "onPlayerPlaying",
    "onPlayerWindowTypeChanged"
  ],
  setup(props, context) {
    const log = useESLog()
    const playerManager = ref<ESIPlayerManager>()
    const playerList = [markRaw(ESVideoPlayer)]
    const playerListRef = ref(playerList)
    const playerViewList = [
      markRaw(ESMediaPlayerView),
      markRaw(ESMediaPlayerSmallView),
    ]
    const playerViewListRef = ref(playerViewList)
    const playModeManager = useESPlayerManagerPlayModeManager()
    const mediaDataSource = useMediaDataSource()
    const playerRateManager = useESPlayerRateManager()

    const playerLeft = ref<number>(90)
    const playerTop = ref<number>(135)

    const playerMask = ref<boolean>(BuildConfig.isLowEndDev)
    const playerMaskCss = ref<string>('media-player-mask-small-css')
    const playerMaskImg = ref<string>('')

    let progressTimer: NodeJS.Timeout

    let playerParent = ref()

    const mediaSourceListInterceptor = createESPlayerMediaSourceListInterceptor(mediaDataSource)
    const mediaItemAuthInterceptor = createESPlayerMediaItemAuthInterceptor(mediaDataSource)

    //--------------------------------------------------------------------
    function play(media: IMedia) {
      let playList: ESMediaItemList = {
        index: 0,
        list: [],
        media: media
      }
      playerMaskImg.value = media.coverH
      playerManager.value?.initialize()
      playModeManager.setPlayMode(ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_LOOP)
      playerManager.value?.playMediaList(playList)
    }

    function addMediaItemList(page: number, mediaList: Array<IMedia>) {
      //播放器数据
      const mediaItemList = buildMediaItemList(page, mediaList, [
        mediaItemAuthInterceptor,
        mediaSourceListInterceptor
      ])
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-----------addMediaItemList------------->>>>', page, mediaList)
      }
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-----------buildMediaItemList------XXXXX------->>>>', page, mediaList, JSON.stringify(mediaItemList))
      }
      playerManager.value?.addMediaToIndex(page * 10, mediaItemList)
    }

    function playMediaItemById(id: string) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-----------playMediaItemById------------->>>>', id)
      }
      playerManager.value?.playMediaById(id)
    }

    function playMediaItemByIndex(index: number) {
      if (!BuildConfig.isLowEndDev) playerManager.value?.playMediaByIndex(index)
    }

    function changeVisible(visibility: boolean) {
      //playerParent.value?.setVisibility(visibility ? 'visible' : 'invisible')
      playerParent.value?.dispatchFunctionBySid('playerParent', 'changeAlpha', [visibility ? 1 : 0])
    }

    function getPlayingMediaIndex(): number {
      return playerManager.value?.getPlayingMediaIndex() ?? -1
    }

    function stop() {
      playerManager.value?.stop()
    }

    function release() {
      setSmallWindow()
      playerManager.value?.release()
    }

    function resume() {
      playerManager.value?.resume()
    }

    function reset() {
      playerManager.value?.reset()
      playerRateManager.setPlayRate(ESPlayerRate.ES_PLAYER_RATE_1)
    }

    function onPlayerInterceptSuccess(result: ESPlayerInterceptResult): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-----------onPlayerInterceptSuccess------------->>>>', result)
      }
    }

    function onPlayerInterceptError(result: ESPlayerInterceptError): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-----------onPlayerInterceptError------------->>>>', result)
      }
    }

    function startProgressTimer() {
      stopProgressTimer()
      progressTimer = setInterval(() => {
        playerManager.value?.getDuration()
        playerManager.value?.getCurrentPosition()
      }, 500);
    }

    function stopProgressTimer() {
      if (progressTimer) {
        clearInterval(progressTimer);
      }
    }

    const onPlayerPlaying = () => {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-----------onPlayerPlaying------------->>>>')
      }
      startProgressTimer()
      context.emit('onPlayerPlaying')
    }

    const onPlayerPlayMedia = (mediaItem: ESMediaItem) => {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-----------onPlayerPlayMedia------------->>>>')
      }
      context.emit('onPlayerPlayMedia', mediaItem)
    }

    function onPlayerPaused(): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-----------onPlayerPaused------------->>>>')
      }
    }

    function onPlayerStopped(): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-----------onPlayerStopped------------->>>>')
      }
      stopProgressTimer()
    }

    function setFullWindow() {
      playerManager.value?.setFullWindow()
    }

    function setFloatWindow() {
      playerManager.value?.setFloatWindow()
      playerLeft.value = 1393
      playerTop.value = 25
    }

    function setSmallWindow() {
      playerLeft.value = 90
      playerTop.value = 135
      playerManager.value?.setSmallWindow()
    }

    function getWindowType(): ESPlayerWindowType {
      return playerManager.value?.getWindowType() ?? ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL
    }

    function onKeyDown(keyEvent: ESKeyEvent): boolean {
      if (playerManager.value) {
        return playerManager.value!.onKeyDown(keyEvent)
      }
      return false
    }

    function onKeyUp(keyEvent: ESKeyEvent): boolean {
      if (playerManager.value) {
        return playerManager.value!.onKeyUp(keyEvent)
      }
      return false
    }

    function onBackPressed(): boolean {
      if (getWindowType() !== ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL) {
        return false;
      }
      if (playerManager.value) {
        return playerManager.value!.onBackPressed()
      }
      return false
    }

    function onPlayerWindowTypeChanged(windowType: ESPlayerWindowType): void {
      context.emit('onPlayerWindowTypeChanged', windowType)
      switch (windowType) {
        case ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FLOAT:
          playerMask.value = BuildConfig.isLowEndDev
          playerMaskCss.value = 'media-player-mask-float-css'
          if (playerMask.value) playerManager.value?.pause()
          break
        case ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_SMALL:
          playerLeft.value = 90
          playerTop.value = 135
          playerMask.value = BuildConfig.isLowEndDev
          playerMaskCss.value = 'media-player-mask-small-css'
          if (playerMask.value) playerManager.value?.pause()
          break
        case ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL:
          playerLeft.value = 0
          playerTop.value = 0
          playerMask.value = false
          if (BuildConfig.isLowEndDev) playerManager.value?.resume()
          break
      }
    }

    return {
      progressTimer,
      playerLeft,
      playerTop,
      playerViewListRef,
      playerManager,
      playerListRef,
      playerMask,
      playerMaskCss,
      playerMaskImg,
      play,
      stop,
      release,
      reset,
      resume,
      onPlayerPlaying,
      onPlayerPaused,
      onPlayerStopped,
      onPlayerWindowTypeChanged,
      onKeyUp,
      onKeyDown,
      onBackPressed,
      setFullWindow,
      playMediaItemById,
      playMediaItemByIndex,
      addMediaItemList,
      setFloatWindow,
      setSmallWindow,
      getWindowType,
      getPlayingMediaIndex,
      onPlayerPlayMedia,
      onPlayerInterceptSuccess,
      onPlayerInterceptError,
      playerParent,
      changeVisible,
    }
  },
});

</script>

<style scoped>
.media-player-root-css {
  width: 1920px;
  height: 1080px;
  background-color: transparent;
}

.media-player-manager-css {
  position: absolute;
  background-color: black;
}

.media-player-mask-small-css {
  width: 890px;
  height: 500px;
  background-color: transparent;
  position: absolute;
  top: 135;
  left: 90;
}

.media-player-mask-float-css {
  width: 502px;
  height: 283px;
  background-color: transparent;
  position: absolute;
  top: 25;
  left: 1393;
}
</style>
