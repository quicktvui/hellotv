<template>
  <es-player-manager
    class="media-player-root-css"
    ref="playerManager"
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
    @onPlayerProgressChanged="onPlayerProgressChanged"
    @onPlayerDurationChanged="onPlayerDurationChanged"
  />
</template>

<script lang='ts'>
import { ESKeyEvent } from '@extscreen/es3-core'
import {
  ESIPlayerInterceptor, ESPlayerDecode, ESPlayerInterceptError, ESPlayerInterceptResult,
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
      default:initDefaultMenuList()
    }
  },
  emits: [
    "onPlayerPlayMedia",
    "onPlayerPlaying",
    "onPlayerWindowTypeChanged",
    "onPlayerCompleted",
    "onPlayerInterceptSuccess",
    "onPlayerInterceptError",
    "onPlayerInitialized",
    "onPlayerProgressChanged",
    "onPlayerDurationChanged"
  ],
  setup(props, context) {
    const playerManager = ref<ESIPlayerManager>()
    const playerList = [markRaw(ESVideoPlayer)]
    const playerListRef = ref(playerList)
    let playerViewList = []
    //付费类型 0：免费，其他收费
    let payStatus:string|number
    //当前播放进度
    let curProgress:number = 0
    if(props.isShowPlayerController){
      playerViewList = [markRaw(MediaLoadingView),markRaw(MediaManagerView)]
    }else{
      playerViewList = [markRaw(MediaLoadingView)]
    }
    let playerViewListRef = ref(playerViewList)
    let progressTimer: NodeJS.Timeout
    let playerIsInitialized = ref(false)
    let playInterceptors:Array<ESIPlayerInterceptor> | undefined
    onMounted(()=>{
      if(props.isShowPlayerController){
        const mRef:any =  playerManager.value?.getPlayerView("MediaManagerView")
        mRef.setMenuList(props.menuList)
      }
    })
    onBeforeUnmount(()=>{
      stopProgressTimer()
    })
    const isMenuShow =  ():boolean=>{
      const mRef:any =  playerManager.value?.getPlayerView("media-manager-view")
      return mRef.isViewShow()
    }
    const initPlayData = (playData:Array<IMediaList>,playMode?: ESPlayerPlayMode, interceptors?:Array<ESIPlayerInterceptor>):ESMediaItemList=>{
      playInterceptors = interceptors
      const list:ESMediaItemList = buildPlayData(playData,interceptors)
      if(!playerIsInitialized.value) initialize()
      if (playMode){
        setPlayMediaListMode(playMode)
      }else{
        setPlayMediaListMode(ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_LOOP)
      }
      if (!playData || playData.length === 0){
        playerManager.value?.playMediaList(list);
      }
      return list
    }
    const resetMediaList = ()=>{
      playerManager.value?.resetMediaList()
    }

    const loadMoreMediaList =(index:number=0,playDatas:Array<IMediaList>,list?:ESMediaItem[])=>{
      if(!list){
        list = buildMediaItemList(index,playDatas,playInterceptors)
      }
      playerManager.value?.addMediaToIndex(index,list)
    }
    const getMediaList = (): SparseArray<ESMediaItem> | null | undefined =>{
      return playerManager.value?.getMediaList()
    }

    const onPlayerPlayMedia = (mediaItem: ESMediaItem) => {
      payStatus = mediaItem.payStatus

      context.emit('onPlayerPlayMedia', mediaItem)
    }

    const onPlayerPlaying = () => {
      startProgressTimer()
      context.emit('onPlayerPlaying')
    }
    function startProgressTimer() {
      stopProgressTimer()
      progressTimer = setInterval(() => {
        playerManager.value?.getDuration()
        playerManager.value?.getCurrentPosition()
      }, 1000);
    }
    function stopProgressTimer() {
      if (progressTimer) {
        clearInterval(progressTimer);
      }
    }
    function onPlayerPaused(): void {
      stopProgressTimer()
    }
    function onPlayerStopped(): void {
      stopProgressTimer()
    }
    function onPlayerWindowTypeChanged(windowType: ESPlayerWindowType): void {
      context.emit('onPlayerWindowTypeChanged', windowType)
    }
    function onPlayerCompleted(): void {
      context.emit('onPlayerCompleted')
    }
    function onPlayerInterceptSuccess(result: ESPlayerInterceptResult): void {
      context.emit('onPlayerInterceptSuccess', result)
    }
    function onPlayerInterceptError(result: ESPlayerInterceptError): void {

      context.emit('onPlayerInterceptError', result)
    }
    function onPlayerInitialized(): void {
      playerIsInitialized.value = true
      context.emit('onPlayerInitialized')
      playerManager.value?.setDecode(ESPlayerDecode.ES_PLAYER_DECODE_HARDWARE)
      playerManager.value?.setPlayRate(ESPlayerRate.ES_PLAYER_RATE_1)
    }
    function onPlayerProgressChanged(p: number):void{
      curProgress = p
      context.emit('onPlayerProgressChanged',p)
    }
    function onPlayerDurationChanged(d: number):void{
      context.emit('onPlayerDurationChanged',d)
    }
    function seekTo(progress: number): void{
      playerManager.value?.seekTo(progress)
    }
    function initialize() {
      playerManager.value?.initialize()
    }
    function playMediaItemById(id: string) {
      playerManager.value?.playMediaById(id)
    }
    function playMediaItemByIndex(index: number) {
      playerManager.value?.playMediaByIndex(index)
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
    function replyRate(r?:number){
      const mRef:any =  playerManager.value?.getPlayerView("media-manager-view")
      if(mRef){
        mRef.replyRate(r)
      }
    }
    function start(position:number){
      replyRate()
      playerManager.value?.start(position)
    }
    function pause() {
      playerManager.value?.pause()
    }
    function resume(){
      replyRate()
      playerManager.value?.resume()
    }
    function trySeeResume(){
      resume()
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
      onPlayerProgressChanged,
      onPlayerDurationChanged,
      seekTo,
      initPlayData,
      initialize,
      playMediaItemByIndex,
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
      clear(){//清除一些必要数据，防止影响其他页面的播放器
        const mRef:any =  playerManager.value?.getPlayerView("media-manager-view")
        if(mRef){
          mRef.clear()
        }
      }
    }
  }
})
</script>

<style lang='scss' src='./scss/media-player.scss'>

</style>
