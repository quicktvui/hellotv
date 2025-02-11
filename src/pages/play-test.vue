<template>
  <div style='width: 1920px;height: 1080px;background-color: #669940;'>
    <media-player-view
      ref='mediaPlayerViewRef'
      style='position:absolute;background-color: transparent'
      :initPlayerWindowType='2'
      :isShowPlayerController='true'
      @onPlayerPlaying='onVideoPlayerPlaying'
    />
    <bg-animation ref='itemCellBgImgRef' :focusable='false' />

  </div>
</template>

<script lang='ts' setup name='play-test'>

import { ESKeyEvent } from '@extscreen/es3-core'
import { ref } from 'vue'
import BgAnimation from '../components/bg-animation.vue'
import { IMediaList } from '../components/media/build-data/media-imp'
import MediaPlayerView from '../components/media/view/media-player-view.vue'
import launch from '../tools/launch'
import { PlayType } from './home/adapter/tab-content/tab-content-imp.ts'

const mediaPlayerViewRef = ref()
const itemCellBgImgRef = ref()

const playData: Array<IMediaList> = [{
  id: '1532310053293928449',
  type: PlayType.TYPE_LONG,
  title: '111特斯拉自动驾驶遭遇“水土不服”？懂车帝原创全面评测Model 3',
  cover: 'http://cms.hmon.tv/common/static/file/2024/05/31/ce5b63bc-5f2f-4171-871c-b709b9cb822a.png',
  url: [{
    playUrl: 'http://extcdn.hsrc.tv/channelzero/2024/02/05/d477660a-3eb6-4c7f-b82b-0b61c035505c.mp4',
    definition: '1'
  }],
  isRequestUrl: false
}, {
  id: '1532309801724030977',
  type: PlayType.TYPE_LONG,
  title: '222特斯拉自动驾驶遭遇“水土不服”？懂车帝原创全面评测Model 3',
  cover: 'http://cms.hmon.tv/common/static/file/2024/05/31/ce5b63bc-5f2f-4171-871c-b709b9cb822a.png',
  url: [{
    playUrl: 'http://extcdn.hsrc.tv/channelzero/2024/02/05/5fc2d6dd-0566-4c70-a4ba-be6e47e39252.mp4',
    definition: '1'
  }],
  isRequestUrl: false
}]

const onESCreate = ()=>{
  let imgBg = playData[0].cover
  setBgImage(imgBg)
  const list = mediaPlayerViewRef.value.initPlayData(playData)
  mediaPlayerViewRef.value.playMediaList(list)
}

const onVideoPlayerPlaying = () => {
  setBgImage('')
}
const setBgImage = (imgUrl: string) => {
  if (imgUrl) itemCellBgImgRef.value.setImg(imgUrl)
  else itemCellBgImgRef.value.clearImg()
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
  launch.launchBack()
  return true
}
defineExpose({onESCreate,onKeyDown,onKeyUp,onBackPressed})

</script>

<style lang='scss'>

</style>
