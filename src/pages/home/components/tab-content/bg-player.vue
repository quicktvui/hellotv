<template>
  <div class='bg-player-root-css' :clipChildren="false">
    <qt-replace-child
      class='bg-player-replace-child'
      sid='bgPlayerReplaceChildSid'
      :markChildSID='TabContentConfig.homeBgPlaySid'
      :replaceOnVisibilityChanged='false'
      :focusable="false" :clipChildren="false" >
    </qt-replace-child>
    <div class='bg-player-parent-css' sid='bgPlayerParentSid' >
      <div class='bg-player-window' v-if='playerWindowInit'
           :style='{width:`${playerWindowWidth}px`,height:`${playerWindowHeight}px`}'
           :fillParent="true"
           :clipChildren="false"
           :focusable="false">
        <media-player-view
          class='bg-player-view'
          ref='bgPlayerViewRef'
          :clipChildren="false"
          :playerLeft='playerLeft'
          :playerTop='playerTop'
          :isShowPlayerController='false'
          @onPlayerPlayMedia="onPlayerPlayMedia"
          @onPlayerPlaying="onPlayerPlaying"
          @onPlayerCompleted="onPlayerCompleted"
        />

      </div>
    </div>
  </div>

</template>

<script lang='ts' setup name='BgPlayer'>
import { ESMediaItem } from '@extscreen/es3-player-manager'
import { ref } from 'vue'
import MediaPlayerView from '../../../../components/media/view/media-player-view.vue'
import TabContentConfig from '../../build-data/tab-content/tab-content-config.ts'

//播放窗口初始化
let playerWindowInit =  ref(false)
//播放器窗口大小
const playerWindowWidth = ref(0)
const playerWindowHeight = ref(0)
//播放器偏移量
let playerLeft = ref<number>(0)
let playerTop = ref<number>(0)

const onPlayerPlayMedia = (mediaItem: ESMediaItem)=>{

}
const onPlayerPlaying = () => {

}
const onPlayerCompleted = () => {

}
defineExpose({})

</script>

<style lang='scss' src='../../scss/bg-player.scss'>

</style>
