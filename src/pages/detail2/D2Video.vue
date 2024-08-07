<template>
  <div class="d2_video">
    <media-def-player 
      ref="PlayerManagerRef" class="d2_video_media" :initPlayerWindowType="2"
      :is-show-player-controller="true" :menuList="menuList"
      @onPlayerPlayMedia="onPlayerPlayMedia"
      @onPlayerCompleted="onPlayerCompletedFn"
    />
  </div>
</template>
<script lang='ts' setup>
import { onBeforeUnmount, ref, onMounted } from 'vue';
import mediaDefPlayer from '../../components/media/media-def-player.vue'
import { defList,PlayMenuNameFlag } from '../../components/media/adapter/ControlDataAdapter'
// @ts-ignore
import { detail2Ui, getMediaList,getSelectionIndex } from './index.ts'
import { useESToast } from '@extscreen/es3-core';

const toast = useESToast()
const PlayerManagerRef = ref()
let playIndex=-1
let isOver = false//是否全集播放完毕
let isStop = false//是否播放完一个列表，暂停

const menuList = [
  { type: 1, nameFlag: PlayMenuNameFlag.NEXT, name: '下一集', decoration: { right: 30 } },
  ...defList(),
]

const onPlayerCompletedFn = ()=>{
  if(isStop){
    if(detail2Ui.isSelection()){//选集
      const pageNo = detail2Ui.selectionPageNo+1
      const sIndex = detail2Ui.selectionIndex + 1;
      detail2Ui.getMediaSelectionList(pageNo).then(newList=>{
        if(newList && newList.length){
          isStop = false
          detail2Ui.changePlayList(newList)
          detail2Ui.selectTab2Index = detail2Ui.selectTab2Index+1
          detail2Ui.selectionIndex = sIndex
          detail2Ui.selectionPageNo = pageNo
          detail2Ui.changeVideo(0)
        } else {
          isOver = true
          toast.showLongToast("已经全部播放完毕")
        }
      })
    } else {//系列

    }
  }
}
const onPlayerPlayMedia = (mItem)=>{
  let mIndex = detail2Ui.playList.findIndex(dpItem=>dpItem.videoData.id===mItem.id)
  if(mIndex > -1){
    if(playIndex != mIndex){
      playIndex = mIndex//当前列表中的索引

      if(detail2Ui.isSelection()){ // 选集
        const sIndex = getSelectionIndex(detail2Ui.selectionPageNo, mIndex)
        detail2Ui.selectionIndex = sIndex//设置选集中的索引
      } else {
        detail2Ui.selectionIndex = mIndex//设置选集中的索引
      }
      if(mIndex === detail2Ui.playList.length-1){
        isStop = true
      }
      detail2Ui.changeVideo(mIndex)
    }
  } else {
    // 加载更多分集数据，或提示当前系列分集已经播完
  }
}

const playByIndex = (playList:any[]=[]) => {
  if(playList.length){
    playIndex = detail2Ui.playIndex
    PlayerManagerRef.value?.playMediaList({
      index: detail2Ui.playIndex,
      list: getMediaList(playList),
      // interceptors: Array<ESIPlayerInterceptor>
    });
  }
}

detail2Ui.$on((playList=[]) => {
  if(detail2Ui.isChangedTab()){
    // PlayerManagerRef.value?.pause()
    // PlayerManagerRef.value?.stop()
    PlayerManagerRef.value?.reset()
    playByIndex(playList)
  } else {
    if(playIndex != detail2Ui.playIndex){
      playIndex = detail2Ui.playIndex
      PlayerManagerRef.value?.pause()//先暂停上次播放
      PlayerManagerRef.value?.playMediaItemByIndex(playIndex)
    }
  }
})
onMounted(()=>{
  PlayerManagerRef.value?.initPlayData([],1,[])// 初始化播放器
})
onBeforeUnmount(()=>{
  playIndex =  -1
  PlayerManagerRef.value?.pause()
  PlayerManagerRef.value?.stop()
  // PlayerManagerRef.value?.release()
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
