<template>
  <div class='detail-full-player-view'>
    <full-player-view
    ref='fullPlayerViewRef'
    />

  </div>

</template>

<script lang='ts' setup>
import { ESKeyEvent, useESEventBus, useESRuntime } from '@extscreen/es3-core'
import { ref } from 'vue'
import { IMedia, IMediaItem } from '../detail/adapter/interface'
import detailManager from '../detail/api'
import FullPlayerView from './components/media-player/full-player-view.vue'

defineOptions({
  name: 'index'
})
const runtime = useESRuntime()
const eventbus = useESEventBus()
const deviceId = runtime.getRuntimeDeviceId()??''
const fullPlayerViewRef = ref()
let mediaId = ref('')
let mediaDetail: IMedia
let currentPlayIndex = -1 // 当前播放视频的index
const onESCreate = (params)=>{
  mediaId.value = params && params.mediaId ? params.mediaId : '1584863712586579969'
  getDetail()
}

const onESDestroy = () => {
  fullPlayerViewRef.value?.releasePlayer()
}

const getDetail = ( )=>{
  detailManager.getMediaDetail(mediaId.value)
    .then(async (res: IMedia) => {
      mediaDetail = res
      mediaDetail.mediaSeriesType = 1 //设置选集类型
      currentPlayIndex = 0
      mediaDetail._prevPlayIndex = currentPlayIndex
      // await getHistory()
      // const index = currentPlayIndex + 1
      // const pageNo = Math.ceil(index / 10)
      fullPlayerViewRef.value.initPlayInfo(mediaDetail)
      getMediaList(mediaDetail.episodesId,1)
    })
}

const getHistory = ()=>{
  detailManager.getRecordData(mediaDetail.id,deviceId,'history').then(res=>{
    if (res){
      mediaDetail.history = res
      currentPlayIndex = Math.min(Math.max((Number(res.episode)||0)-1, 0), Math.max(mediaDetail.episodes-1, 0))
      mediaDetail._prevPlayIndex = currentPlayIndex
    }else{
      currentPlayIndex = 0
      mediaDetail._prevPlayIndex = currentPlayIndex
    }
  }).catch(()=>{
    currentPlayIndex = 0
    mediaDetail._prevPlayIndex = currentPlayIndex
  })
}

const getMediaList = (episodesId:string,pageNo:number)=>{
  detailManager.getMediaSeriesList(episodesId,pageNo,10)
  .then((mediaList:Array<IMediaItem>)=>{
    eventbus.emit('onFullPlayerMediaListLoad', pageNo, mediaList)
    fullPlayerViewRef.value?.loadMoreMediaList(pageNo, mediaList)
    if (currentPlayIndex >= 0) {
      fullPlayerViewRef.value?.playMediaItemByIndex(currentPlayIndex)
      currentPlayIndex = -1
      mediaDetail._prevPlayIndex = -1
    }
  })
}
const onKeyDown = (keyEvent: ESKeyEvent): boolean => {
  if (fullPlayerViewRef.value?.onKeyDown(keyEvent)) {
    return true
  }
  return false
}

const onKeyUp = (keyEvent: ESKeyEvent): boolean => {
  if (fullPlayerViewRef.value?.onKeyUp(keyEvent)) {
    return true
  }
  return false
}
defineExpose({onESCreate,onESDestroy,onKeyDown,onKeyUp})

</script>

<style lang='scss'>
.detail-full-player-view{
  width: 1920px;
  height:1080px;
  background-color: transparent;
}
</style>
