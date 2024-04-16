<template>
  <qt-column class="media-player-root-css">
    <es-player-manager ref="playerManager" :smallWindowWidth="890" :smallWindowHeight="500" :initPlayerWindowType="1"
      playerBackgroundColor="black" :playMediaAuto="false" :playerList="playerListRef"
      :playerViewList="playerViewListRef" :style="{ left: playerLeft, top: playerTop }"
      @onPlayerPlayMedia="onPlayerPlayMedia" @onPlayerPlaying="onPlayerPlaying" @onPlayerPaused="onPlayerPaused"
      @onPlayerStopped="onPlayerStopped" @onPlayerWindowTypeChanged="onPlayerWindowTypeChanged"
      @onPlayerInterceptSuccess="onPlayerInterceptSuccess" @onPlayerInterceptError="onPlayerInterceptError"
      class="media-player-manager-css" />
  </qt-column>
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
import { ESKeyEvent, ESLogLevel, useESEventBus, useESLog } from "@extscreen/es3-core";
import { buildMediaItemList } from "../adapter/PlayerDataAdapter";
import { useMediaDataSource } from "../../../api/UseApi";
import ESMediaPlayerSmallView from "./media-player-small-view.vue"
import {
  createESPlayerMediaItemAuthInterceptor,
  createESPlayerMediaSourceListInterceptor
} from "../player/ESPlayerMediaItemInterceptor";

const TAG = 'MediaPlayer'

export default defineComponent({
  name: "media-player-view",
  components: {
    'es-player-manager': ESPlayerManager,
  },
  setup(props, context) {
    const log = useESLog()
    const eventbus = useESEventBus()
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

    let progressTimer: NodeJS.Timeout

    const mediaSourceListInterceptor = createESPlayerMediaSourceListInterceptor(mediaDataSource)
    const mediaItemAuthInterceptor = createESPlayerMediaItemAuthInterceptor(mediaDataSource)

    //--------------------------------------------------------------------
    function play(media: IMedia) {
      let playList: ESMediaItemList = {
        index: 0,
        list: [],
        media: media
      }
      playerManager.value?.initialize()
      playModeManager.setPlayMode(ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_LOOP)
      playerManager.value?.playMediaList(playList)

      if (!media.itemList.enable) {
        addMediaItemList(1, [media])
        playMediaItemByIndex(0)
      }
    }

    function addMediaItemList(page: number, mediaList: Array<IMedia>) {
      //播放器数据
      const mediaItemList = buildMediaItemList(page, mediaList, [
        // mediaItemAuthInterceptor,
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
      playerManager.value?.playMediaByIndex(index)
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
      playerLeft.value = 1520
      playerTop.value = 0
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
          break
        case ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_SMALL:
          playerLeft.value = 90
          playerTop.value = 135
          break
        case ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL:
          playerLeft.value = 0
          playerTop.value = 0
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
      onPlayerInterceptError
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
</style>
