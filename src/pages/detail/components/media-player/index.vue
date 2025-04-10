<template>
  <qt-view
    name='media-player'
    class="media-player"
    ref='playerParent'
    sid='playerParent'
    :focusable='false'>
    <!-- player-manager 播放管理器 -->
    <ESPlayerManager
      class="player-manager-css"
      ref="playerManager"
      name="es-player-manager"
      :visible="controlPlayViewShow"
      :smallWindowWidth="890"
      :smallWindowHeight="500"
      :floatWindowWidth="floatWindowWidth"
      :floatWindowHeight="floatWindowHeight"
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
      @onPlayerProgressChanged="onPlayerProgressChangedFn"
      @onPlayerDurationChanged="onPlayerDurationChangedFn">
    </ESPlayerManager>
    <!-- 低端机播放器遮罩 -->
  <qt-image
    name="playerLowMaskImg"
    :visible="playerMask"
    :class="playerMaskCss"
    :src="playerMaskImg" />
  </qt-view>
</template>

<script setup lang='ts' name='MediaPlayer'>
import { ref, markRaw, nextTick } from 'vue'
import { ESLogLevel, useESLog, ESKeyEvent, useESRuntime } from "@extscreen/es3-core";
import { useESRouter } from '@extscreen/es3-router'
import BuildConfig from "../../../../config/build-config";
import detailManager from '../../api/index'
import {
  ESIPlayerManager,
  ESMediaItem,
  ESMediaItemList,
  ESPlayerManager,
  useESPlayerManagerPlayModeManager
} from "@extscreen/es3-player-manager";
import {
  ESPlayerInterceptError,
  ESPlayerInterceptResult,
  ESPlayerPlayMode,
  ESPlayerWindowType,
  ESPlayerRate,
  useESPlayerRateManager, useESPlayerAspectRatioManager, ESPlayerAspectRatio
} from '@extscreen/es3-player'
import { ESVideoPlayer } from "@extscreen/es3-video-player";
import { IMedia, IMediaItem } from '../../adapter/interface'
import MediaPlayerView from './media-player-view.vue'
import MediaPlayerSmallView from './media-player-small-view.vue'
import {
  buildMediaList,
  createESPlayerMediaSourceListInterceptor
} from "../../adapter/media-player";

  const TAG = 'MediaSeriesView'
  const emits = defineEmits([
    'onMediaSeriesListItemLoad',
    'onPlayerPlaying',
    'onPlayerPlayMedia',
    'onPlayerWindowTypeChanged'
  ])
  const log = useESLog()
  const router = useESRouter()
  const runtime = useESRuntime()
  const aspectRatioManager = useESPlayerAspectRatioManager()
  let deviceId = runtime.getRuntimeDeviceId()??''
  let m: IMedia
  let playerParent = ref()
  let controlPlayViewShow = ref(true)
  const floatWindowWidth = ref<number>(BuildConfig.isLowEndDev ? 0 : 502)
  const floatWindowHeight = ref<number>(BuildConfig.isLowEndDev ? 0 : 283)
  const playerViewList =  [
    markRaw(MediaPlayerView),
    markRaw(MediaPlayerSmallView),
  ]
  playerViewList[0].name = 'media-player-view'
  const interceptor = createESPlayerMediaSourceListInterceptor(detailManager)
  const playerManager = ref<ESIPlayerManager>()
  const playerList = [markRaw(ESVideoPlayer)]
  const playerListRef = ref(playerList)
  const playerViewListRef = ref(playerViewList)
  const playModeManager = useESPlayerManagerPlayModeManager()
  const playerRateManager = useESPlayerRateManager()
  const playerLeft = ref<number>(80)
  const top = 135
  const playerTop = ref<number>(top)

  const playerMask = ref<boolean>(BuildConfig.isLowEndDev)
  const playerMaskCss = ref<string>('media-player-mask-small-css')
  const playerMaskImg = ref<string>('')
  let isLoadLow = ref(false)
  let progressTimer: any = -1
  let _progress,_duration = 0;//播放进度/总时长

  const play = (media: IMedia) => {
    m = media
    let playList: ESMediaItemList = {
      index: 0,
      list: [],
      media: media
    }
    // aspectRatioManager.setAspectRatio(ESPlayerAspectRatio.ES_PLAYER_AR_ASPECT_FIT_PARENT)
    playerMaskImg.value = media.cover
    playerManager.value?.initialize()
    playModeManager.setPlayMode(ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_LOOP)
    playerManager.value?.playMediaList(playList)
  }
  const addMediaItemList = (page: number, mediaList: Array<IMediaItem>) => {
    //播放器数据
    const mediaItemList = buildMediaList(page, mediaList, [interceptor], m)
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, '-----------addMediaItemList------------->>>>', page, mediaList)
    }
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, '-----------buildMediaItemList------XXXXX------->>>>', page, mediaList, mediaItemList)
    }
    playerManager.value?.addMediaToIndex(page * 10, mediaItemList)
  }
  const playMediaItemById = (id: string) => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, '-----------playMediaItemById------------->>>>', id)
    }
    playerManager.value?.playMediaById(id)
  }
  const playMediaItemByIndex = (index: number) => {
    if(!BuildConfig.isLowEndDev) playerManager.value?.playMediaByIndex(index)
  }
  const stop = () => {
    playerManager.value?.stop()
    let _index = Math.max(playerManager.value?.getPlayingMediaIndex()||0, 0)
    const media = playerManager.value?.getMedia(_index)
    if(media && media.analyzeParams && _progress>0){
      const body = {
        id: media.analyzeParams.metaId,
        deviceId: deviceId,
        recordType: "history",
        title: media.title,
        episode: _index+1,
        episodeId: media.analyzeParams.episodeId,
        totalDuration: _duration||_progress,
        viewedDuration: _progress,
        coverH: media.analyzeParams.assetLongCoverH,
        coverV: media.analyzeParams.assetLongCoverV
      }
      detailManager.reportRecordData(body) // 上报播放历史
    }
  }
  const release = () => {
    setSmallWindow()
    playerManager.value?.release()
  }
  const resume = () => {
    if (BuildConfig.isLowEndDev && playerManager.value?.getWindowType() !== ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL){
      return
    }
    playerManager.value?.resume()
  }
  const reset = () => {
    playerManager.value?.reset()
    playerRateManager.setPlayRate(ESPlayerRate.ES_PLAYER_RATE_1)
  }
  const setFullWindow = () => {
    if (BuildConfig.isLowEndDev) {
      controlPlayViewShow.value = true
      playerMask.value = false
      isLoadLow.value = false
    }
    playerManager.value?.setFullWindow()
  }
  const setFloatWindow = () => {
    if (BuildConfig.isLowEndDev) {
      controlPlayViewShow.value = false
      playerMask.value = false
      isLoadLow.value = true
      return
    }
    playerLeft.value = 1393
    playerTop.value = 25
    playerManager.value?.setFloatWindow()
  }
  const setSmallWindow = () => {
    if (BuildConfig.isLowEndDev) {
      controlPlayViewShow.value = true
      playerMask.value = BuildConfig.isLowEndDev
      if (isLoadLow.value) {
        isLoadLow.value = false
        return
      }
      isLoadLow.value = false
    }
    playerLeft.value = 80
    playerTop.value = top
    playerManager.value?.setSmallWindow()
  }
  const getWindowType = (): ESPlayerWindowType => {
    return playerManager.value?.getWindowType() ?? ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL
  }
  const getLoadLow = ():boolean => {
    return isLoadLow.value
  }
  const getPlayingMediaIndex = (): number => {
    return playerManager.value?.getPlayingMediaIndex() ?? -1
  }
  const changeVisible = (visibility: boolean) => {
    // playerParent.value?.dispatchFunctionBySid('playerParent', 'changeAlpha', [visibility ? 1 : 0])
  }
  const startProgressTimer = () => {
    stopProgressTimer()
    progressTimer = setInterval(() => {
      playerManager.value?.getDuration()
      playerManager.value?.getCurrentPosition()
    }, 500);
  }
  const stopProgressTimer = () => {
    if (progressTimer) {
      clearInterval(progressTimer);
    }
  }
  const onPlayerPlayMedia = (mediaItem: ESMediaItem) => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, '-----------onPlayerPlayMedia------------->>>>')
    }
    emits('onPlayerPlayMedia', mediaItem)
  }
  const onPlayerPlaying = () => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, '-----------onPlayerPlaying------------->>>>')
    }
    startProgressTimer()
    emits('onPlayerPlaying')
    //屏蔽再次播放同一个视频时视频从历史记录起播
    const curPlayingMedia:ESMediaItem | null | undefined = playerManager.value?.getPlayingMedia()
    if (curPlayingMedia && curPlayingMedia.position){
      curPlayingMedia.position.support = false
    }
  }
  const onPlayerPaused = () => {}
  const onPlayerStopped = () => {}
  const onPlayerWindowTypeChanged = (windowType: ESPlayerWindowType) => {
    emits('onPlayerWindowTypeChanged', windowType)
    switch (windowType) {
      case ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FLOAT:
        playerMask.value = false
        playerMaskCss.value = 'media-player-mask-float-css'
        if (BuildConfig.isLowEndDev) {
          playerManager.value?.pause()
          playerManager.value?.stop()
        }
        break
      case ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_SMALL:
        playerLeft.value = 80
        playerTop.value = top
        playerMask.value = BuildConfig.isLowEndDev
        playerMaskCss.value = 'media-player-mask-small-css'
        if (BuildConfig.isLowEndDev) {
          playerManager.value?.pause()
          playerManager.value?.stop()
        }
        break
      case ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL:
        playerLeft.value = 0
        playerTop.value = 0
        playerMask.value = false
        if (BuildConfig.isLowEndDev) {
          setTimeout(()=>{ playerManager.value?.resume()},300)
        }
        break
    }
  }
  const onPlayerInterceptSuccess = (result: ESPlayerInterceptResult) => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, '-----------onPlayerInterceptSuccess------------->>>>', result)
    }
  }
  const onPlayerInterceptError = (result: ESPlayerInterceptError) => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, '-----------onPlayerInterceptError------------->>>>', result)
    }
  }
  const onPlayerProgressChangedFn = (progress: number) => {_progress = progress}
  const onPlayerDurationChangedFn = (d: number) => {_duration = d}
  const onKeyDown = (keyEvent: ESKeyEvent): boolean => {
    if (playerManager.value) {
      return playerManager.value!.onKeyDown(keyEvent)
    }
    return false
  }
  const onKeyUp = (keyEvent: ESKeyEvent): boolean => {
    if (playerManager.value) {
      return playerManager.value!.onKeyUp(keyEvent)
    }
    return false
  }
  const onBackPressed = (): boolean => {
    if (getWindowType() !== ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL) {
      return false;
    }
    if (playerManager.value) {
      return playerManager.value!.onBackPressed()
    }
    return false
  }
  defineExpose({
    onPlayerWindowTypeChanged,
    play,
    addMediaItemList,
    playMediaItemById,
    playMediaItemByIndex,
    stop,
    resume,
    release,
    reset,
    setFullWindow,
    setFloatWindow,
    setSmallWindow,
    getWindowType,
    getLoadLow,
    getPlayingMediaIndex,
    changeVisible,
    onKeyUp,
    onKeyDown,
    onBackPressed,
  })
  </script>

<style lang='scss' scoped>
.media-player{
  width: 1920px;
  height: 1080px;
  background-color: transparent;
  .player-manager-css{
    position: absolute;
    background-color: black;
  }
  .media-player-mask-small-css {
    width: 890px;
    height: 500px;
    background-color: transparent;
    position: absolute;
    top: 90px;
    left: 90px;
  }
  .media-player-mask-float-css {
    width: 502px;
    height: 283px;
    background-color: transparent;
    position: absolute;
    top: 25px;
    left: 1393px;
  }
}
</style>
