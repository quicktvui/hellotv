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
  ESIPlayerInterceptor,
  ESPlayerInterceptError,
  ESPlayerInterceptResult, ESPlayerPlayMode,
  ESPlayerWindowType
} from "@extscreen/es3-player"
import { ESMediaItemList } from "@extscreen/es3-player-manager/dist/src/core/ESMediaItemList"
import { ESVideoPlayer } from "@extscreen/es3-video-player"
import { defineComponent } from "@vue/runtime-core"
import { ESKeyEvent, ESLogLevel, useESLog } from "@extscreen/es3-core"
import {
  ESIPlayerManager,
  ESMediaItem,
  ESPlayerManager,
  useESPlayerManagerPlayModeManager
} from "@extscreen/es3-player-manager"
import { markRaw, ref, onMounted } from "vue"
import BuildConfig from "../../build/BuildConfig"
import { buildMediaItemList, buildPlayData, defList } from "./adapter/ControlDataAdapter"
import { ESDefMediaList } from "./impl/ESDefMediaList"
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
      default:false
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
    if(props.isShowPlayerController){
      playerViewList = [markRaw(MediaManagerView)]
    }
    let playerViewListRef = ref(playerViewList)
    let progressTimer: NodeJS.Timeout
    let playerIsInitialized = ref(false)
    let playInterceptors:Array<ESIPlayerInterceptor> | undefined
    const playModeManager = useESPlayerManagerPlayModeManager()
    onMounted(()=>{
      if(props.isShowPlayerController){
        const mRef:any =  playerManager.value?.getPlayerView("media-manager-view")
        mRef.setMenuList(props.menuList)
      }
    })
    const isMenuShow =  ():boolean=>{
      const mRef:any =  playerManager.value?.getPlayerView("media-manager-view")
      return mRef.isViewShow()
    }

    const initPlayData = (playDatas:Array<ESDefMediaList>,playMode?: ESPlayerPlayMode,interceptors?:Array<ESIPlayerInterceptor>):ESMediaItemList=>{
      playInterceptors = interceptors
      const list:ESMediaItemList = buildPlayData(playDatas,interceptors)
      if(!playerIsInitialized.value) initialize()
      if (playMode){
        playModeManager.setPlayMode(playMode)
      }else{
        playModeManager.setPlayMode(ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_LOOP)
      }
      if (!playDatas || playDatas.length === 0){
        playerManager.value?.playMediaList(list);
      }
      return list
    }

    const loadMoreMediaList =(index:number=0,playDatas:Array<ESDefMediaList>)=>{
      const list:Array<ESMediaItem> = buildMediaItemList(index,playDatas,playInterceptors)
      playerManager.value?.addMediaToIndex(index,list)
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
      playerIsInitialized.value = true
      context.emit('onPlayerInitialized')
    }

    function initialize() {
      playerManager.value?.initialize()
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
    function getPlayingMediaIndex():number {
      return  playerManager.value!.getPlayingMediaIndex()
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
      initPlayData,
      initialize,
      playMediaItemByIndex,
      playMediaItemById,
      setFullWindow,
      setSmallWindow,
      getWindowType,
      setSize,
      playMediaList,
      loadMoreMediaList,
      setPlayMediaListMode,
      getPlayingMediaIndex,
      start,
      pause,
      resume,
      stop,
      reset,
      release,
      onKeyDown,
      onKeyUp,
      onBackPressed,
      isMenuShow,
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
