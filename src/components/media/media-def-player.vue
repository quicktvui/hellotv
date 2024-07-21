<template>
  <es-player-manager
    ref="playerManager"
    class="media-def-root-css"
    :focusable="false"
    :initPlayerWindowType="playerWindowType"
    :style="{ left: playerLeft, top: playerTop }"
    :playerList="playerListRef"
    :playerViewList="playerViewListRef"
    @onPlayerPlayMedia="onPlayerPlayMedia"
    @onPlayerPlaying="onPlayerPlaying"
    @onPlayerPaused="onPlayerPaused"
    @onPlayerStopped="onPlayerStopped"
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
  ESPlayerInterceptResult, ESPlayerPlayMode,
  ESPlayerWindowType
} from "@extscreen/es3-player"
import { ESMediaItemList } from "@extscreen/es3-player-manager/dist/src/core/ESMediaItemList"
import { ESVideoPlayer } from "@extscreen/es3-video-player"
import { defineComponent } from "@vue/runtime-core"
import { ESKeyEvent, ESLogLevel, useESLog } from "@extscreen/es3-core"
import { ESIPlayerManager, ESMediaItem, ESPlayerManager } from "@extscreen/es3-player-manager"
import { markRaw, onMounted, ref,h } from "vue"
import { defList } from "./adapter/ControlDataAdapter"
import MediaManagerView from "./media-manager-view.vue"

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
      default:true
    },
    playerLeft:{
      type:Number,
      default:0
    },
    playerTop:{
      type:Number,
      default:0
    },
    menuList:{
      type:Array,
      default:defList()
    }
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
    const playerManager = ref<ESIPlayerManager>()
    const playerList = [markRaw(ESVideoPlayer)]
    const playerListRef = ref(playerList)
    let playerViewList = []
    let playerViewListRef = ref([])
    let progressTimer: NodeJS.Timeout
    onMounted(()=>{
      if (props.isShowPlayerController){
        playerViewList = [markRaw(h(MediaManagerView,{menuList:props.menuList}))]

        playerViewListRef.value = playerViewList
        // setTimeout(()=>{
        //   const mRef:any =  playerManager.value?.getPlayerView("media-manager-view")
        //   mRef.setShowView(true)
        // },6000)
      }
    })

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
      startProgressTimer()
      context.emit('onPlayerPlaying')
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

    function initialize() {
      playerManager.value?.initialize()
    }
    function setFullWindow(){
      playerManager.value?.setFullWindow()
    }
    function setSmallWindow(){
      playerManager.value?.setSmallWindow()
    }

    function setSize(width: number, height: number): void{
      playerManager.value?.setSize(width,height)
    }

    function playMediaList(playList: ESMediaItemList): void{
      playerManager.value?.playMediaList(playList)
    }
    function setPlayMediaListMode(playMode: ESPlayerPlayMode): void{
      playerManager.value?.setPlayMediaListMode(playMode)
    }

    function start(position:number){
      playerManager.value?.start(position)
    }
    function pause() {
      playerManager.value?.pause()
    }
    function resume(){
      playerManager.value?.resume()
    }
    function stop(){
      playerManager.value?.stop()
    }
    function reset(){
      playerManager.value?.reset()
    }
    function release(){
      playerManager.value?.release()
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
    function getWindowType(): ESPlayerWindowType {
      return playerManager.value?.getWindowType() ?? ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL
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
      initialize,
      setFullWindow,
      setSmallWindow,
      getWindowType,
      setSize,
      playMediaList,
      setPlayMediaListMode,
      start,
      pause,
      resume,
      stop,
      reset,
      release,
      onKeyDown,
      onKeyUp,
      onBackPressed,
      playerListRef,
      playerViewListRef,

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
