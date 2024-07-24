<template>
<div class="d2_video">
  <media-def-player
    ref="PlayerManagerRef"
    class="d2_video_media"
    :initPlayerWindowType="2"
    :is-show-player-controller="true"
    @onPlayerInitialized="onPlayerInitialized"
  />
</div>
</template>
<script lang='ts' setup>
import { onMounted, ref } from 'vue';
import mediaDefPlayer from '../../components/media/media-def-player.vue'
// @ts-ignore
import { detail2Ui } from './index.ts'
import d2Api from '../../api/details2/index'

const playData = ref<any[]>([])
const PlayerManagerRef = ref()
const playerIsInitialized= ref(false)
const onPlayerInitialized = ()=>{
  playerIsInitialized.value = true
}
const playByIndex= (index:number)=>{
  let dataItem = JSON.parse(JSON.stringify(playData.value[index]))
  if(dataItem){
    let mediaItem_0 = d2Api.getMediaDataOfInterceptor(dataItem)
    PlayerManagerRef.value?.playMediaList({
      index: 0,
      list: [mediaItem_0]
    });
  }
}

const initPlay = ()=>{
  if(!playerIsInitialized.value){
    PlayerManagerRef.value?.initialize()
    PlayerManagerRef.value?.setPlayMediaListMode(3)
    PlayerManagerRef.value?.setFullWindow()
  }else{
    PlayerManagerRef.value.reset()
  }
  playByIndex(detail2Ui.selectTabListIndex)
}
detail2Ui.$on((playList)=>{
  playData.value = playList
  initPlay()
})
defineExpose({
  onKeyDown (keyEvent):boolean{
    return PlayerManagerRef.value?.onKeyDown(keyEvent)
  },
  onKeyUp (keyEvent):boolean{
    return PlayerManagerRef.value?.onKeyUp(keyEvent)
  },
  onBackPressed ():boolean{
    return PlayerManagerRef.value?.onBackPressed()
  }
})
</script>
<style scoped>
.d2_video{
  width: 1920px;
  height: 1080px;
  background-color: transparent;
}
.d2_video_media {
  position: absolute;
  background-color: transparent;
}
.d2_video_poster{
  width: 1920px;
  height: 1080px;
}
</style>
