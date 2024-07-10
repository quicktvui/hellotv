<template>
<div class="rt_content" :style="rtcStyle">
  <div class="rtc_video_box" :type="rankingContentTypes.info">
    <RankTabVideoInfo />
    <div class="rtc_video_preview">
      <RankTabVideo showIf="${isVedio==true}" />
      <RankTabPreviewImg showIf="${isVedio==false}"/>
    </div>
  </div>
  
  <div class="rtc_sort" :type="rankingContentTypes.sort">
    <RankSortList />
  </div>
  <div class="rtc_more" :type="rankingContentTypes.more">
    <RankTabMoreList />
  </div>
</div>
</template>
<script lang='ts' setup>
import RankTabVideoInfo from './RankTabVideoInfo.vue'
import RankTabVideo from './RankTabVideo.vue'
import RankTabMoreList from './RankTabMoreList.vue'
import RankSortList from './RankSortList.vue'
import RankTabPreviewImg from './RankTabPreviewImg.vue'
import { StyleValue, computed } from 'vue';
import rankApi from '../../../api/ranking/index'
// @ts-ignore
import { rankingContentTypes } from '../index.ts'

const isSort = computed(()=>{
  return true
})
const configs = rankApi.getConfig()
const rtcStyle = computed<StyleValue>(()=>{
  const space = configs.pageSpace||0
  return { width: 1920 - space + 'px', marginLeft: space+'px'  }
})
</script>
<style scoped>
.rt_content{
  position: relative;
}
.rtc_video_box{
  width: 1920px;
  height: 800px;
  background-color: transparent;
  display: flex;
  flex-direction: row;
}
.rtc_sort {
  position: absolute;
  z-index: 1;
}
.rtc_more {
  position: absolute;
  z-index: 2;
}
.rtc_video_preview {
  width: 1140px;
  height: 640px;
  position: relative;
  background-color: transparent;
}
</style>