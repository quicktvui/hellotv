<template>
  <div class='bg-player-root-css' :clipChildren='false'>
    <qt-replace-child
      class='bg-player-replace-child'
      sid='bgPlayerReplaceChildSid'
      :markChildSID='TabContentConfig.homeBgPlaySid'
      :replaceOnVisibilityChanged='false'
      :focusable='false' :clipChildren='false'>
    </qt-replace-child>
    <!--  此div的作用是让bg_player在一开始的时候不显示，否则如果瀑布流首屏配置了播放器，就会先闪现在左上角一下-->
    <div class='bg-player-parent-css' sid='bgPlayerParentSid'>
      <div class='bg-player-window' v-if='playerWindowInit'
           :style='{width:`${playerWindowWidth}px`,height:`${playerWindowHeight}px`}'
           :fillParent='true'
           :clipChildren='false'
           :focusable='false'>
        <media-player-view
          class='bg-player-view'
          ref='bgPlayerViewRef'
          :clipChildren='false'
          :playerLeft='playerLeft'
          :playerTop='playerTop'
          :isShowPlayerController='false'
          @onPlayerPlayMedia='onPlayerPlayMedia'
          @onPlayerPlaying='onPlayerPlaying'
          @onPlayerCompleted='onPlayerCompleted'
        />

      </div>
    </div>
    <!-- 背景图-->
    <bg-animation class='bg-player-background-img'
                  :bgStyle='{width:playerWidth,height:playerHeight,left:playerLeft,top:playerTop}'
                  ref='bgPlayerBackgroundImgRef'
                  :visible='bgPlayerType!==HomePlayType.TYPE_4K'
                  :focusable='false' />
    <!-- 全屏背景遮罩-->
    <div class='bg-player-mask' v-if='!isShowShadow'
         :visible='bgPlayerType===HomePlayType.TYPE_BG'
         :bgStyle='{width:playerWidth,height:playerHeight,left:playerLeft,top:playerTop}'
         :focusable='false' />
    <!-- 背景阴影 -->
    <img class='bg-player-shadow' v-else
         :style="{width:playerWidth + 'px',height:playerHeight + 'px',left: playerLeft,top: playerTop}"
         :focusable='false'
         :src='bg_shadow'
    />
  </div>

</template>

<script lang='ts' setup name='bg-player'>
import { ESMediaItem } from '@extscreen/es3-player-manager'
import { ref } from 'vue'
import BgAnimation from '../../../../components/bg-animation.vue'
import MediaPlayerView from '../../../../components/media/view/media-player-view.vue'
import TabContentConfig from '../../build-data/tab-content/tab-content-config.ts'
import { HomePlayType, PlayerState } from '../../build-data/tab-content/tab-content-imp.ts'
import bg_shadow from "../../../../assets/home/bg_shadow.png"

//播放窗口初始化
let playerWindowInit = ref(false)
//播放器窗口大小
const playerWindowWidth = ref(0)
const playerWindowHeight = ref(0)
//播放器大小
const playerWidth = ref(0)
const playerHeight = ref(0)
//播放器偏移量
const playerLeft = ref<number>(0)
const playerTop = ref<number>(0)
//播放类型
const bgPlayerType = ref(HomePlayType.TYPE_UNDEFINED)
//播放状态
let curPlayState = PlayerState.STATE_WAIT
//是否显示边框阴影
const isShowShadow = ref(false)

const onPlayerPlayMedia = (mediaItem: ESMediaItem) => {

}
const onPlayerPlaying = () => {

}
const onPlayerCompleted = () => {

}
const changeShadow = (boo: boolean) => {
  isShowShadow.value = boo
}
defineExpose({ changeShadow })

</script>

<style lang='scss' src='../../scss/bg-player.scss'>

</style>
