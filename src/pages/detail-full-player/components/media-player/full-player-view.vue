<template>
  <es-player-manager
    class='full-player-root-css'
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
  ESPlayerDecode, ESPlayerError,
  ESPlayerInterceptError,
  ESPlayerInterceptResult, ESPlayerPlayMode, ESPlayerRate,
  ESPlayerWindowType
} from '@extscreen/es3-player'
import { defineComponent, markRaw, ref } from 'vue'
import {
  ESIPlayerManager,
  ESMediaItem,
  ESMediaItemList,
  ESPlayerManager,
} from '@extscreen/es3-player-manager'
import { ESVideoPlayer } from '@extscreen/es3-video-player'
import { IMediaList } from '../../../../components/media/build-data/media-imp'
import { IMedia } from '../../../detail/adapter/interface'
import {
  buildMediaList,
  createESPlayerMediaSourceListInterceptor
} from '../../../detail/adapter/media-player'
import FullPlayerLoadingView from './full-player-loading.vue'
import FullPlayerMenuView from './full-player-menu-view.vue'

export default defineComponent({
  name: 'FullPlayerView',
  components: {
    'es-player-manager': ESPlayerManager
  },
  props: {
    playerWindowType: {
      type: Number,
      default: ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL
    },
    playerLeft: {
      type: Number,
      default: 0
    },
    playerTop: {
      type: Number,
      default: 0
    },
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
    const playerViewListRef = ref([markRaw(FullPlayerLoadingView),markRaw(FullPlayerMenuView)])
    const interceptor = createESPlayerMediaSourceListInterceptor()
    let progressTimer: any
    let m: IMedia

    const initPlayInfo = (media: IMedia)=>{
      m = media
      let playList: ESMediaItemList = {
        index: 0,
        list: [],
        media: media
      }
      playerManager.value?.setPlayMediaListMode(ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_LOOP)
      playerManager.value?.playMediaList(playList)
    }

    const loadMoreMediaList = (page: number = 0, mediaList: Array<IMediaList>) => {
      const mediaItemList = buildMediaList(page, mediaList, [interceptor], m)
      playerManager.value?.addMediaToIndex((page-1) * 10, mediaItemList)
    }

    const playMediaItemByIndex = (index: number) => {
      playerManager.value?.playMediaByIndex(index)
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
    return {
      playerManager,
      playerListRef,
      playerViewListRef,
      onKeyDown,
      onKeyUp,
      initPlayInfo,
      loadMoreMediaList,
      playMediaItemByIndex,
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

    }
  }
})
</script>

<style lang='scss' src='../../scss/full-player-view.scss'>

</style>
