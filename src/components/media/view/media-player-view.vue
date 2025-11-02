<template>
  <es-player-manager
    class='media-player-root-css'
    ref='playerManager'
    :focusable='false'
    :initPlayerWindowType='playerWindowType'
    :style='{ left: playerLeft, top: playerTop }'
    :playerList='playerListRef'
    :playerViewList='playerViewListRef'
    @onPlayerPlayMedia='onPlayerPlayMedia'
    @onPlayerPlaying='onPlayerPlaying'
    @onPlayerPaused='onPlayerPaused'
    @onPlayerStopped='onPlayerStopped'
    @onPlayerWindowTypeChanged='onPlayerWindowTypeChanged'
    @onPlayerCompleted='onPlayerCompleted'
    @onPlayerInterceptSuccess='onPlayerInterceptSuccess'
    @onPlayerInterceptError='onPlayerInterceptError'
    @onPlayerInitialized='onPlayerInitialized'
    @onPlayerProgressChanged='onPlayerProgressChanged'
    @onPlayerDurationChanged='onPlayerDurationChanged'
    @onPlayerError='onPlayerError'
  />
</template>

<script lang='ts'>
import { ESKeyEvent } from '@extscreen/es3-core'
import {
  ESIPlayerInterceptor,
  ESPlayerDecode,
  ESPlayerError,
  ESPlayerInterceptError,
  ESPlayerInterceptResult,
  ESPlayerPlayMode,
  ESPlayerRate,
  ESPlayerWindowType
} from '@extscreen/es3-player'
import { ESVideoPlayer } from '@extscreen/es3-video-player'
import { defineComponent, markRaw, onBeforeUnmount, onMounted, ref } from 'vue'
import {
  ESIPlayerManager,
  ESMediaItem,
  ESMediaItemList,
  ESPlayerManager, SparseArray
} from '@extscreen/es3-player-manager'
import {
  buildMediaItemList,
  buildPlayData,
  initDefaultMenuList
} from '../build-data/media-control-adapter'
import { IMediaList } from '../build-data/media-imp'
import MediaLoadingView from './media-loading-view.vue'
import MediaManagerView from './media-manager-view.vue'

export default defineComponent({
  name: 'MediaPlayerView',
  components: {
    'es-player-manager': ESPlayerManager
  },
  props: {
    playerWindowType: {
      type: Number,
      default: ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL
    },
    isShowPlayerController: {
      type: Boolean,
      default: false
    },
    playerLeft: {
      type: Number,
      default: 0
    },
    playerTop: {
      type: Number,
      default: 0
    },
    menuList: {
      type: Array,
      default: initDefaultMenuList()
    }
  },
  emits: [
    'onPlayerPlayMedia',
    'onPlayerPlaying',
    'onPlayerWindowTypeChanged',
    'onPlayerCompleted',
    'onPlayerInterceptSuccess',
    'onPlayerInterceptError',
    'onPlayerInitialized',
    'onPlayerProgressChanged',
    'onPlayerDurationChanged',
    'onPlayerError'
  ],
  setup(props, context) {
    const playerManager = ref<ESIPlayerManager>()
    const playerList = [markRaw(ESVideoPlayer)]
    const playerListRef = ref(playerList)
    let playerViewList = []
    //付费类型 0：免费，其他收费
    // let payStatus: string | number
    //当前播放进度
    // let curProgress: number = 0
    if (props.isShowPlayerController) {
      playerViewList = [markRaw(MediaLoadingView), markRaw(MediaManagerView)]
      //todo 让立朋兼容一个__name的获取
      playerViewList[1].name = 'media-manager-view'
    } else {
      playerViewList = [markRaw(MediaLoadingView)]
    }
    let playerViewListRef = ref(playerViewList)

    let progressTimer: any
    let playerIsInitialized = ref(false)
    let playInterceptors: Array<ESIPlayerInterceptor> | undefined
    onMounted(() => {
      if (props.isShowPlayerController && props.menuList && props.menuList.length > 0) {
        const mRef: any = playerManager.value?.getPlayerView('media-manager-view')
        mRef.initMenuList(props.menuList)
      }
    })
    onBeforeUnmount(() => {
      stopProgressTimer()
    })
    const isMenuShow = (): boolean => {
      const mRef: any = playerManager.value?.getPlayerView('media-manager-view')
      return mRef.isViewShow()
    }
    const initPlayData = (playData: Array<IMediaList>,index:number=0, playMode?: ESPlayerPlayMode, interceptors?: Array<ESIPlayerInterceptor>): ESMediaItemList => {
      playInterceptors = interceptors
      const list: ESMediaItemList = buildPlayData(playData,index, interceptors)
      if (playMode) {
        setPlayMediaListMode(playMode)
      } else {
        setPlayMediaListMode(ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_LOOP)
      }
      // if (!playerIsInitialized.value) initialize()

      if (!playData || playData.length === 0) {
        playerManager.value?.playMediaList(list)
      }
      return list
    }
    const resetMediaList = () => {
      playerManager.value?.resetMediaList()
    }

    const loadMoreMediaList = (index: number = 0, playDatas: Array<IMediaList>, list?: ESMediaItem[]) => {
      if (!list) {
        list = buildMediaItemList(index, playDatas, playInterceptors)
      }
      playerManager.value?.addMediaToIndex(index, list)
    }
    const getMediaList = (): SparseArray<ESMediaItem> | null | undefined => {
      return playerManager.value?.getMediaList()
    }

    const onPlayerPlayMedia = (mediaItem: ESMediaItem) => {
      // payStatus = mediaItem.payStatus

      context.emit('onPlayerPlayMedia', mediaItem)
    }

    const onPlayerPlaying = () => {
      startProgressTimer()
      context.emit('onPlayerPlaying')
    }
    const startProgressTimer = () => {
      stopProgressTimer()
      progressTimer = setInterval(() => {
        playerManager.value?.getDuration()
        playerManager.value?.getCurrentPosition()
      }, 1000)
    }
    const stopProgressTimer = () => {
      if (progressTimer) {
        clearInterval(progressTimer)
      }
    }
    const onPlayerPaused = (): void => {
      stopProgressTimer()
    }
    const onPlayerStopped = (): void => {
      stopProgressTimer()
    }
    const onPlayerWindowTypeChanged = (windowType: ESPlayerWindowType): void => {
      context.emit('onPlayerWindowTypeChanged', windowType)
    }
    const onPlayerCompleted = (): void => {
      context.emit('onPlayerCompleted')
    }
    const onPlayerInterceptSuccess = (result: ESPlayerInterceptResult): void => {
      context.emit('onPlayerInterceptSuccess', result)
    }
    const onPlayerInterceptError = (result: ESPlayerInterceptError): void => {

      context.emit('onPlayerInterceptError', result)
    }
    const onPlayerInitialized = (): void => {
      playerIsInitialized.value = true
      context.emit('onPlayerInitialized')
      playerManager.value?.setDecode(ESPlayerDecode.ES_PLAYER_DECODE_HARDWARE)
      playerManager.value?.setPlayRate(ESPlayerRate.ES_PLAYER_RATE_1)
    }

    const onPlayerProgressChanged = (p: number): void => {
      // curProgress = p
      context.emit('onPlayerProgressChanged', p)
    }

    const onPlayerDurationChanged = (d: number): void => {
      context.emit('onPlayerDurationChanged', d)
    }
    const onPlayerError = (error: ESPlayerError): void => {
      context.emit('onPlayerError', error)
    }
    const seekTo = (progress: number): void => {
      playerManager.value?.seekTo(progress)
    }

    const initialize = () => {
      playerManager.value?.initialize()
    }

    const playMediaItemById = (id: string) => {
      playerManager.value?.playMediaById(id)
    }

    const playMediaItemByIndex = (index: number) => {
      playerManager.value?.playMediaByIndex(index)
    }

    const playNextMediaItem = ()=>{
      playerManager.value?.playNextMedia()
    }

    const getPlayingMediaIndex = (): number => {
      return playerManager.value!.getPlayingMediaIndex()
    }

    const setFullWindow = () => {
      playerManager.value?.setFullWindow()
    }

    const setSmallWindow = () => {
      playerManager.value?.setSmallWindow()
    }

    const setSize = (width: number, height: number): void => {
      playerManager.value?.setSize(width, height)
    }

    const playMediaList = (playList: ESMediaItemList) => {
      playerManager.value?.playMediaList(playList)
    }

    const setPlayMediaListMode = (playMode: ESPlayerPlayMode): void => {
      playerManager.value?.setPlayMediaListMode(playMode)
    }

    const replyRate = (r?: number) => {
      const mRef: any = playerManager.value?.getPlayerView('media-manager-view')
      if (mRef) {
        mRef.replyRate(r)
      }
    }

    const start = (position: number) => {
      replyRate()
      playerManager.value?.start(position)
    }

    const pause = () => {
      playerManager.value?.pause()
    }

    const resume = () => {
      replyRate()
      playerManager.value?.resume()
    }

    const trySeeResume = () => {
      resume()
    }

    const stop = () => {
      playerManager.value?.stop()
    }

    const reset = () => {
      playerManager.value?.reset()
    }

    const release = () => {
      playerManager.value?.release()
    }

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

    const getWindowType = (): ESPlayerWindowType => {
      return playerManager.value?.getWindowType() ?? ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL
    }

    const onBackPressed = (): boolean => {
      if (getWindowType() !== ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL) {
        return false
      }
      if (playerManager.value) {
        return playerManager.value!.onBackPressed()
      }
      return false
    }

    return {
      playerManager,
      onPlayerPlayMedia,
      onPlayerPlaying,
      onPlayerPaused,
      onPlayerStopped,
      onPlayerWindowTypeChanged,
      onPlayerCompleted,
      onPlayerInterceptSuccess,
      onPlayerInterceptError,
      onPlayerInitialized,
      onPlayerProgressChanged,
      onPlayerDurationChanged,
      onPlayerError,
      seekTo,
      initPlayData,
      initialize,
      playMediaItemByIndex,
      playNextMediaItem,
      playMediaItemById,
      setFullWindow,
      setSmallWindow,
      getWindowType,
      setSize,
      resetMediaList,
      playMediaList,
      loadMoreMediaList,
      setPlayMediaListMode,
      getPlayingMediaIndex,
      getMediaList,
      start,
      pause,
      resume,
      trySeeResume,
      stop,
      reset,
      release,
      onKeyDown,
      onKeyUp,
      onBackPressed,
      isMenuShow,
      playerListRef,
      playerViewListRef,
      replyRate,
      clear() {//清除一些必要数据，防止影响其他页面的播放器
        const mRef: any = playerManager.value?.getPlayerView('media-manager-view')
        if (mRef) {
          mRef.clear()
        }
      }
    }
  }
})
</script>

<style lang='scss' src='./scss/media-player.scss'>

</style>
