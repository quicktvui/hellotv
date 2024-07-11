<template>
  <es-player-manager
    v-if="startInit"
    ref="playerManager"
    class="media-def-root-css"
    :focusable="false"
    :initPlayerWindowType="playerWindowType"
    :style="{ left: playerLeft, top: playerTop }"
    :playerList="playerListRef"
    :playerViewList="playerViewListRef"
    @onPlayerPlayMedia="onPlayerPlayMedia"
    @onPlayerPlaying="onPlayerPlaying"
    @onPlayerWindowTypeChanged="onPlayerWindowTypeChanged"
    @onPlayerCompleted="onPlayerCompleted"
    @onPlayerInterceptSuccess="onPlayerInterceptSuccess"
    @onPlayerInterceptError="onPlayerInterceptError"
    @onPlayerInitialized="onPlayerInitialized"
  />
</template>

<script lang="ts">
import {
  ESPlayerInterceptError,
  ESPlayerInterceptResult,
  ESPlayerWindowType
} from "@extscreen/es3-player"
import { ESVideoPlayer } from "@extscreen/es3-video-player"
import { defineComponent } from "@vue/runtime-core"
import { ESLogLevel, useESLog } from "@extscreen/es3-core"
import { ESIPlayerManager, ESMediaItem, ESPlayerManager } from "@extscreen/es3-player-manager"
import { markRaw, ref } from "vue"

const TAG = "MediaDefPlayer"

export default defineComponent({
  name: "media-def-player",
  components: {
    "es-player-manager": ESPlayerManager
  },
  props:{
    playerWindowType:{
      type:Number,
      default:ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL
    },
    isShowPlayerController:{
      type:Boolean,
      default:false
    },

  },
  emits: [
    "onPlayerPlayMedia",
    "onPlayerPlaying",
    "onPlayerWindowTypeChanged",
    "onPlayerCompleted",
    "onPlayerInterceptSuccess",
    "onPlayerInterceptError",
    "onPlayerInitialized"
  ],
  setup(props, context) {
    const log = useESLog()
    let playerLeft = ref(0)
    let playerTop = ref(0)
    const playerManager = ref<ESIPlayerManager>()
    const playerList = [markRaw(ESVideoPlayer)]
    const playerListRef = ref(playerList)
    let playerViewList = []
    let playerViewListRef = ref()
    //初始化标志
    let startInit = ref(false)
    function init(){
      if (props.isShowPlayerController){
        playerViewList = []
      }
      playerViewListRef.value = playerViewList
      startInit.value = true

    }

    const onPlayerPlayMedia = (mediaItem: ESMediaItem) => {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-----------onPlayerPlayMedia------------->>>>')
      }
      context.emit('onPlayerPlayMedia', mediaItem)
    }
    const onPlayerPlaying = () => {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-----------onPlayerPlaying------------->>>>')
      }
      // startProgressTimer()
      context.emit('onPlayerPlaying')
    }
    function onPlayerWindowTypeChanged(windowType: ESPlayerWindowType): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-----------onPlayerWindowTypeChanged------------->>>>')
      }
      context.emit('onPlayerWindowTypeChanged', windowType)
    }
    function onPlayerCompleted(): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-----------onPlayerCompleted------------->>>>')
      }
      context.emit('onPlayerCompleted')
    }
    function onPlayerInterceptSuccess(result: ESPlayerInterceptResult): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-----------onPlayerInterceptSuccess------------->>>>', result)
      }
      context.emit('onPlayerInterceptSuccess', result)
    }
    function onPlayerInterceptError(result: ESPlayerInterceptError): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-----------onPlayerInterceptError------------->>>>', result)
      }
      context.emit('onPlayerInterceptError', result)
    }
    function onPlayerInitialized(): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-----------onPlayerInitialized------------->>>>')
      }
      context.emit('onPlayerInitialized')
    }

    return {
      onPlayerPlayMedia,
      onPlayerPlaying,
      onPlayerWindowTypeChanged,
      onPlayerCompleted,
      onPlayerInterceptSuccess,
      onPlayerInterceptError,
      onPlayerInitialized,

      playerListRef,
      playerViewListRef,

      startInit,
      playerLeft,
      playerTop
    }
  }
})
</script>

<style scoped>
.media-def-root-css{
  width:1920px;
  height: 1080px;
  background-color: transparent;
  position: absolute;
}
</style>
