<template>
  <div style='width:1920px;height: 1080px;background-color: #669966'>
    <media-player-view
      ref='mediaPlayerViewRef'
      style='position: absolute;background-color: transparent'
      @onPlayerPlaying = 'onVideoPlayerPlaying'
      :isShowPlayerController='false'
    />
    <bg-animation
      ref='imgRef'
      :focusable='false'
    />
  </div>

</template>

<script lang='ts' setup name='MTest'>

import { ESKeyEvent } from '@extscreen/es3-core'
import { ESMediaItemList } from '@extscreen/es3-player-manager'
import { useESRouter } from '@extscreen/es3-router'
import { ref } from 'vue'
import BgAnimation from '../components/bg-animation.vue'
import { IMediaList } from '../components/media/build-data/media-imp'
import MediaPlayerView from '../components/media/view/media-player-view.vue'

const mediaPlayerViewRef = ref()
const imgRef = ref()
const router =useESRouter()

const playData:Array<IMediaList> = [
  {
    id:'1532310053293928449',
    title:'111特斯拉自动驾驶遭遇“水土不服”？懂车帝原创全面评测Model 3',
    cover:'http://cms.hmon.tv/common/static/file/2024/05/31/ce5b63bc-5f2f-4171-871c-b709b9cb822a.png',
    url:[{
      playUrl:"http://qcloudcdn.a311.ottcn.com/channelzero/2024/02/05/d477660a-3eb6-4c7f-b82b-0b61c035505c.mp4",
      definition:"1"
    }],
    isRequestUrl:false
  },
  {
    id:'1532309801724030977',
    title:'222特斯拉自动驾驶遭遇“水土不服”？懂车帝原创全面评测Model 3',
    subTitle:'2020年 12月 17日完结 ｜ 100万+播放',
    cover:'http://cms.hmon.tv/common/static/file/2024/05/31/ce5b63bc-5f2f-4171-871c-b709b9cb822a.png',
    url:[{playUrl:"http://qcloudcdn.a311.ottcn.com/channelzero/2024/02/05/110e7a35-1ba3-4d87-a8ea-0f462de40866.mp4",
      definition:"1"}],
    isRequestUrl:false
  },
]
const onESCreate = ()=>{
  const bg = playData[0].cover
  setBgImage(bg)
  const list:ESMediaItemList = mediaPlayerViewRef.value.initPlayData(playData)
  mediaPlayerViewRef.value.playMediaList(list)
  // mediaPlayerViewRef.value.setSize(1920,1080)
}
const setBgImage = (imgUrl:string)=>{
  if (imgUrl) imgRef.value.setImg(imgUrl)
  else imgRef.value.clearImg()
}
const onVideoPlayerPlaying = ()=>{
  setBgImage("")
}
const onKeyDown = (keyEvent: ESKeyEvent):boolean=>{
  if (mediaPlayerViewRef.value?.onKeyDown(keyEvent)) {
    return true
  }
  return false
}
const onKeyUp = (keyEvent: ESKeyEvent):boolean=>{
  if (mediaPlayerViewRef.value?.onKeyUp(keyEvent)) {
    return true
  }
  return false
}
const onBackPressed = ():boolean=>{
  if (mediaPlayerViewRef.value?.onBackPressed()) {
    return true
  }
  router.back()
  return true
}
defineExpose({onESCreate,onKeyDown,onKeyUp,onBackPressed})

</script>

<style lang='scss'>

</style>
