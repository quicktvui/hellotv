<template>
<div class="rt_content">
  <div class="rtc_video_box" :focusable="false" :type="rankingContentTypes.info" flexStyle="${style}">
    <RankTabVideoInfo :focusable="false"/>
    <div class="rtc_video_shadow" :focusable="false">
      <!-- <img src="../../../assets/ranking/shadow_bg.png" class="rtc_video_shadow_img" :focusable="false"/> -->
    </div>
  </div>
  
  <RankSortList :focusable="false" :type="rankingContentTypes.sort"/>
  
  <RankTabMoreList :focusable="false" :type="rankingContentTypes.more"/>
</div>
</template>
<script lang='ts' setup>
import RankTabVideoInfo from './RankTabVideoInfo.vue'
// import RankTabVideo from './RankTabVideo.vue'
import RankTabMoreList from './RankTabMoreList.vue'
import RankSortList from './RankSortList.vue'
// import RankTabPreviewImg from './RankTabPreviewImg.vue'
// @ts-ignore
import { rankingContentTypes } from '../index.ts'

</script>
<style scoped>
.rt_content{
  position: relative;
}
.rtc_video_box{
  background-color: transparent;
  display: flex;
  flex-direction: row;
}
.rtc_video_shadow {
  width: 1150px;
  height: 650px;
  background-color: transparent;
}
.rtc_video_shadow_img {
  width: 1150px;
  height: 650px;
  background-color: transparent;
}
</style>