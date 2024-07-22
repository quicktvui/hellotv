<template>
<div class="d2_video">
  <!-- <img :src="bigImg" class="d2_video_poster"/> -->
  <media-def-player
    ref="PlayerManagerRef"
    class="d2_video_media"
    :initPlayerWindowType="2"
    @onPlayerInitialized="onPlayerInitialized"
  />
</div>
</template>
<script lang='ts' setup>
import { onMounted, ref } from 'vue';
import mediaDefPlayer from '../../components/media/media-def-player.vue'
const bigImg = 'http://qcloudimg.moss.huan.tv/project/lexue_education/lexue/2020/10/16/f4d06569c526405bae3c865afdbcd11f.jpg'
const playData = [{
  id:'1532310053293928449',
  title:'特斯拉自动驾驶遭遇“水土不服”？懂车帝原创全面评测Model 3',
  cover:'http://cms.hmon.tv/common/static/file/2024/05/31/ce5b63bc-5f2f-4171-871c-b709b9cb822a.png',
  url:"http://qcloudcdn.a311.ottcn.com/channelzero/2024/02/05/d477660a-3eb6-4c7f-b82b-0b61c035505c.mp4",
  isRequestUrl:false
}]
const PlayerManagerRef = ref()
const playerIsInitialized= ref(false)
const onPlayerInitialized = ()=>{
  playerIsInitialized.value = true
}
const playByIndex= (index:number)=>{
  let list = JSON.parse(JSON.stringify(playData))
  let item = list[index]
  play(item)
}

const play =(item:any)=>{
  let mediaItem_0 = {
    id:item.id,
    title:item.title,
    subTitle:'2020年 12月 17日完结 ｜ 100万+播放',
    mediaSourceList: {
      index: 0,
      list: [{
        uri: item.url,
        definition: 1
      }]
    },
  }
  PlayerManagerRef.value?.playMediaList({
    index: 0,
    list: [mediaItem_0]
  });
  
}

defineExpose({
  init(){
    if(!playerIsInitialized.value){
      PlayerManagerRef.value?.initialize()
    };
    PlayerManagerRef.value?.setPlayMediaListMode(3)
    PlayerManagerRef.value?.setFullWindow()
    playByIndex(0)
  },
  onKeyDown (keyEvent):boolean{
    console.log('-lsj-onKeyDown-v')
    return PlayerManagerRef.value?.onKeyDown(keyEvent)
  },
  onKeyUp (keyEvent):boolean{
    console.log('-lsj-onKeyUp-v')
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