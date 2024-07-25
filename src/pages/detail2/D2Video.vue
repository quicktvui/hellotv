<template>
  <div class="d2_video">
    <media-def-player 
      ref="PlayerManagerRef" class="d2_video_media" :initPlayerWindowType="2"
      :is-show-player-controller="true" @onPlayerInitialized="onPlayerInitialized" 
      />
  </div>
</template>
<script lang='ts' setup>
import { onMounted, ref } from 'vue';
import mediaDefPlayer from '../../components/media/media-def-player.vue'
import { defList,PlayMenuNameFlag } from '../../components/media/adapter/ControlDataAdapter'
// @ts-ignore
import { detail2Ui } from './index.ts'
import d2Api from '../../api/details2/index'

const menuList = [
  { type: 1, nameFlag: PlayMenuNameFlag.NEXT, name: '下一集', decoration: { right: 30 } },
  ...defList(),
]

const PlayerManagerRef = ref()
const playerIsInitialized = ref(false)
const onPlayerInitialized = () => {
  playerIsInitialized.value = true
}
const playByIndex = (playList=[]) => {
  PlayerManagerRef.value?.playMediaList({
    index: detail2Ui.selectTabListIndex,
    list: playList.map(dataItem=>{
      return d2Api.getMediaDataOfInterceptor(dataItem)
    })
  });
}

const initPlay = (playList) => {
  if (!playerIsInitialized.value) {
    PlayerManagerRef.value?.initialize()
    PlayerManagerRef.value?.setPlayMediaListMode(4)
    PlayerManagerRef.value?.setFullWindow()
  } else {
    PlayerManagerRef.value.reset()
  }
  playByIndex(playList)
}
detail2Ui.$on((playList=[]) => {
  if(detail2Ui.isChangedTab()){
    console.log('lsj--initPlay')
    initPlay(playList)
  } else {
    console.log('lsj--playMediaItemByIndex')
    PlayerManagerRef.value?.playMediaItemByIndex(detail2Ui.selectTabListIndex)
  }
})
defineExpose({
  onKeyDown(keyEvent): boolean {
    return PlayerManagerRef.value?.onKeyDown(keyEvent)
  },
  onKeyUp(keyEvent): boolean {
    return PlayerManagerRef.value?.onKeyUp(keyEvent)
  },
  onBackPressed(): boolean {
    return PlayerManagerRef.value?.onBackPressed()
  }
})
</script>
<style scoped>
.d2_video {
  width: 1920px;
  height: 1080px;
  background-color: transparent;
}

.d2_video_media {
  position: absolute;
  background-color: transparent;
}

.d2_video_poster {
  width: 1920px;
  height: 1080px;
}
</style>
