<template>
  <div class="media-manager-root-css" :focusable="false"
       :blockFocusDirections="['left', 'right', 'down', 'up']"
       :showDialog="isFullWindow && isShowView"
           :style="{width:`${playerWidth}px`,height:`${playerHeight}px`}">
    <div class="media-manager-bg-css"
         :focusable="false"
         :gradientBackground="{colors: ['#E6000000', '#00000000'],  orientation: 4}"
         :style="{width:`${playerWidth}px`,height:`540px`}">

<!--  播放标题-->
      <span class="media-manager-title-css main-title-css" :focusable="false">{{mediaMainTitle}}</span>
<!--  播放副标题-->
      <span class="media-manager-title-css sub-title-css" :focusable="false">{{mediaSubTitle}}</span>
<!--  进度条-->
      <div class="media-manager-progress-root-css" :focusable="false" >
        <div class="media-manager-img-state-div-css" :focusable="false">
          <img class="media-manager-img-play-state-css"
               :focusable="false"
               :visible="!isPlayerPlaying"
               :src="playIcon"/>
          <img class="media-manager-img-play-state-css"
               :focusable="false"
               :visible="isPlayerPlaying"
               :src="pauseIcon"/>
        </div>

        <qt-seek-bar
          class="media-manager-seekbar-css"
          ref="mediaManagerSeekBarRef"
          name="seekBar"
          :color="{ startColor: '#FF6699', endColor: '#FF6699' }"
          :nextFocusName="{ down: 'mediaControlView',left: 'seekBar',right:'seekBar'}"
          :focusable="true"
          :onProgressChanged="onSeekBarChanged"
          @onSeekStop="onSeekBarSeekStop"
          @focus="onSeekbarFocusChanged"
          :autofocus="true"
        />
      </div>
<!--      设置按钮-->
      <div class="media-manager-setting-root-css">
        <media-control-view name="mediaControlView"/>
        <div class="media-manager-text-root-css">
          <span class="media-manager-progress-text-css"
                style="color:#BFBFBF" :numberOfLines="1" :focusable="false">{{duration}}</span>
          <span class="media-manager-progress-text-css"
                style="color: white" :numberOfLines="1" :focusable="false">{{progress}}</span>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ESPlayerWindowType } from "@extscreen/es3-player"
import { ESIPlayerManager, ESMediaItem } from "@extscreen/es3-player-manager"
import { QTISeekBar,QTSeekBarMode } from "@quicktvui/quicktvui3"
import { defineComponent } from "@vue/runtime-core"
import { ESKeyCode, ESKeyEvent, ESLogLevel, useESLog } from "@extscreen/es3-core"
import { onMounted, ref, watch } from "vue"
import playIcon from '../../assets/def_media/ic_def_media_player_play.png'
import pauseIcon from '../../assets/def_media/ic_def_media_player_pause.png'
import { s_to_hs } from "../../tools/formatDate"
import MediaControlView from "./media-control-view.vue"

const TAG = "XRG_MEDIA_DEF_MANAGER"
enum IMediaViewState{
  STATE_DISMISS = 0,
  STATE_SHOW = 1
}
export default defineComponent({
  name: "media-manager-view",
  components: { MediaControlView },
  props: {
    list:Array
  },
  setup(props, context) {
    const log = useESLog()
    const mediaManagerSeekBarRef = ref<QTISeekBar>()
    const playerWidth = ref<number>(0)
    const playerHeight = ref<number>(0)
    const isFullWindow = ref<boolean>(false)
    const isPlayerPlaying = ref<boolean>(false)
    const isProgressShowing = ref<boolean>(true)
    const progress = ref<string>('00:00')
    const duration = ref<string>('00:00')
    let isSeeking =  false
    let player: ESIPlayerManager
    let mediaMainTitle = ref("")
    let mediaSubTitle = ref("")
    let isShowView = ref(false)
    const viewState = ref<number>(0)
    let dismissTimer: NodeJS.Timeout

    onMounted(()=>{
      mediaManagerSeekBarRef.value?.setSeekBarMode(QTSeekBarMode.QT_SEEK_BAR_MODE_SINGLE)
      mediaManagerSeekBarRef.value?.setProgressHeight(18)
      mediaManagerSeekBarRef.value?.setProgressRadius(9);
      mediaManagerSeekBarRef.value?.setThumbWidth(60);
      mediaManagerSeekBarRef.value?.setThumbHeight(60);
      // mediaManagerSeekBarRef.value?.setLeftThumbUrl('http://extcdn.hsrc.tv/channelzero_image/web_static/extend_screen/public_images/ic_play_series_tip.png');
      // mediaManagerSeekBarRef.value?.setLeftThumbInactivatedUrl('http://extcdn.hsrc.tv/channelzero_image/web_static/extend_screen/public_images/ic_play_series_tip.png');

    })

    function isPlayerViewStateDismiss(){
      return IMediaViewState.STATE_DISMISS === viewState.value
    }

    function isPlayerViewStateShow(){
      return IMediaViewState.STATE_SHOW === viewState.value
    }

    function setPlayerViewStateShow(){
      viewState.value = IMediaViewState.STATE_SHOW
      isShowView.value = true
      requestFocus()
      setPlayerViewStateDismissDelay()
    }

    function setPlayerViewStateDismiss() {
      viewState.value = IMediaViewState.STATE_DISMISS
      isShowView.value = false
    }

    function setPlayerViewStateDismissDelay(delay:number=5000){
      clearDismissTimer()
      dismissTimer = setTimeout(()=>{
        setPlayerViewStateDismiss()
      },delay)
    }

    function clearDismissTimer() {
      if (dismissTimer) {
        clearTimeout(dismissTimer);
      }
    }

    function setPlayerManager(value: ESIPlayerManager): void {
      player = value
    }
    function getPlayerManager(): ESIPlayerManager {
      return player
    }
    function getId():string {
      return 'MediaManagerView'
    }
    function onPlayerWindowSizeChanged(width: number, height: number): void {
      playerWidth.value = width
      playerHeight.value = height
      isFullWindow.value = width === 1920
      // requestFocus()
    }
    function onPlayerWindowTypeChanged(windowType: ESPlayerWindowType): void {
      isFullWindow.value = (windowType == ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL)
      console.log(TAG,`onPlayerWindowTypeChanged windowType ${windowType} isFullWindow.value ${isFullWindow.value}`)
    }

    function onPlayerProgressChanged(p: number): void {
      if (isSeeking) {
        return
      }
      mediaManagerSeekBarRef.value?.setProgress(p);
      progress.value = s_to_hs(Math.floor(p / 1000))
    }
    function onPlayerDurationChanged(d: number): void {
      if (isSeeking) {
        return
      }
      mediaManagerSeekBarRef.value?.setMaxProgress(d);
      duration.value = "/"+s_to_hs(Math.floor(d / 1000))
    }

    function onSeekBarChanged(p) {
      // if (log.isLoggable(ESLogLevel.DEBUG)) {
      //   log.e(TAG, "-------onSeekBarChanged-----XXX--->>>>>", p)
      // }
      // progress.value = s_to_hs(Math.floor(p / 1000))
    }

    function onSeekBarSeekStop(progress) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onSeekBarSeekStop-------->>>>>", progress)
      }
      isSeeking = false
      if (player && progress >= 0) {
        player.seekTo(progress)
      }
    }

    function onSeekbarFocusChanged(event) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onSeekbarFocusChanged-------->>>>>", event)
      }
      let focused = event.isFocused;
      mediaManagerSeekBarRef.value?.setThumbActivate(focused);
    }

    function onKeyDown(keyEvent: ESKeyEvent):boolean{
      if (player && player.getWindowType() != ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL) {
        return false
      }
      setPlayerViewStateDismissDelay()
      switch (keyEvent.keyCode) {
        case ESKeyCode.ES_KEYCODE_DPAD_CENTER:
        case ESKeyCode.ES_KEYCODE_ENTER:
          if (isPlayerViewStateDismiss()){
            setPlayerViewStateShow()
          }
          if (isPlayerViewStateShow()){
            if (isPlayerPlaying.value) {
              player.pause()
              isPlayerPlaying.value = false
              clearDismissTimer()
            } else {
              player.start(0)
              isPlayerPlaying.value = true
            }
            return true
          }
          break;
        case ESKeyCode.ES_KEYCODE_DPAD_LEFT:
        case ESKeyCode.ES_KEYCODE_DPAD_RIGHT:
          if (isPlayerViewStateDismiss()) {
            setPlayerViewStateShow()
            return true
          }
          if (isPlayerViewStateShow()){
            if (mediaManagerSeekBarRef.value?.isFocused()){
              isSeeking = true
              mediaManagerSeekBarRef.value?.startSeek(keyEvent.keyCode === ESKeyCode.ES_KEYCODE_DPAD_RIGHT)
            }
            return true
          }
          break;

      }
      return true
    }

    function onKeyUp(keyEvent: ESKeyEvent):boolean{
      if (player.getWindowType() != ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL) {
        return false
      }
      if (isPlayerPlaying.value){
        setPlayerViewStateDismissDelay(5000)
      }
      switch(keyEvent.keyCode){
        case ESKeyCode.ES_KEYCODE_DPAD_LEFT:
        case ESKeyCode.ES_KEYCODE_DPAD_RIGHT:
          if (isPlayerViewStateShow() && mediaManagerSeekBarRef.value?.isFocused()){
            mediaManagerSeekBarRef.value?.stopSeek()
          }
          isSeeking = false
          return true
      }
      return true
    }

    function onBackPressed():boolean{
      if (player.getWindowType() != ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL) {
        return false
      }
      if (!isPlayerPlaying.value) {
        isPlayerPlaying.value = true
        player.start(0)
        return true
      }
      if (isPlayerViewStateShow()){
        setPlayerViewStateDismiss()
        return true
      }
      return false
    }

    function setShowView(isShow:boolean){
      isShowView.value = isShow
    }
    function requestFocus(){
      setTimeout(()=>{
        mediaManagerSeekBarRef.value?.requestFocus()
      },500)
    }

    function onPlayerPlayMedia(mediaItem: ESMediaItem):void{
      if (mediaItem){
        mediaMainTitle.value = mediaItem.title
        mediaSubTitle.value = mediaItem.subTitle
      }
    }

    function onPlayerPlaying(): void {
      isPlayerPlaying.value = true
    }
    function onPlayerPaused(): void {
      isPlayerPlaying.value = false
    }

    return {
      mediaManagerSeekBarRef,
      playerWidth,
      playerHeight,
      isFullWindow,
      mediaMainTitle,
      mediaSubTitle,
      isPlayerPlaying,
      isProgressShowing,
      progress,
      duration,
      playIcon,
      pauseIcon,
      isShowView,

      getId,
      setPlayerManager,
      getPlayerManager,
      setShowView,
      onPlayerWindowSizeChanged,
      onPlayerWindowTypeChanged,
      onPlayerProgressChanged,
      onPlayerDurationChanged,
      onSeekBarChanged,
      onSeekBarSeekStop,
      onSeekbarFocusChanged,
      onKeyDown,
      onKeyUp,
      onBackPressed,
      onPlayerPlayMedia,
      onPlayerPlaying,
      onPlayerPaused,
    }
  }
})
</script>

<style>
.media-manager-root-css {
  background-color: transparent;
}

.media-manager-bg-css {
  position: absolute;
  bottom: 0;
  left: 0;
  justify-content: flex-end;
  background-color: transparent;
}

.media-manager-bg-css .media-manager-title-css {
  width: 900px;
  margin-left: 90px;
  background-color: transparent;
}
.media-manager-bg-css .main-title-css {
  max-height: 88px;
  font-weight: bold;
  line-height: 44px;
  font-size: 36px;
  max-lines: 2;
  color:white;
  margin-bottom: 24px;
}
.media-manager-bg-css .sub-title-css{
  max-height: 30px;
  line-height: 30px;
  font-size: 26px;
  max-lines: 1;
  color:white;
  margin-bottom: 117px;
}

.media-manager-bg-css .media-manager-progress-root-css {
  width: 1920px;
  height: 60px;
  margin-bottom: 39px;
  flex-direction: row;
  background-color: transparent;
}

.media-manager-bg-css .media-manager-img-state-div-css{
  width: 36px;
  height:36px;
  margin-left: 90px;
  margin-top: 12px;
  background-color: transparent;
}

.media-manager-bg-css .media-manager-img-play-state-css {
  width: 36px;
  height:36px;
  position: absolute;
  background-color: transparent;
}

.media-manager-bg-css .media-manager-setting-root-css {
  margin-bottom: 54px;
  width: 1920px;
  height: 72px;
  background-color: transparent;
}


.media-manager-bg-css .media-manager-seekbar-css {
  width: 1700px;
  height: 60px;
  margin-left: 10px;
  background-color: transparent;
}

.media-manager-bg-css .media-manager-progress-text-css {
  font-size: 30px;
  height: 72px;
  text-align: center;
}

.media-manager-bg-css  .media-manager-text-root-css {
  position: absolute;
  height: 72px;
  right: 100px;
  top: 0;
  flex-direction: row-reverse;
  background-color: transparent;
}
</style>
