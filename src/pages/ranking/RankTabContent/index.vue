<template>
<div class="rt_content">
  <div class="rtc_video_box">
    <RankTabVideoInfo />
    <RankTabVideo />
  </div>
  
  <div class="rtc_sort" v-if="isSort">
    <RankSortList />
  </div>
  <div class="rtc_more" v-else>
    <RankTabMoreList />
  </div>
</div>
</template>
<script lang='ts' setup>
import RankTabVideoInfo from './RankTabVideoInfo.vue'
import RankTabVideo from './RankTabVideo.vue'
import RankTabMoreList from './RankTabMoreList.vue'
import RankSortList from './RankSortList.vue'
import { computed } from 'vue';

const isSort = computed(()=>{
  return true
})
</script>
<style scoped>
.rt_content{
  position: relative;
}
.rtc_video_box{
  position: absolute;
  z-index: 1;
  display: flex;
  flex-direction: row;
}
.rtc_more {
  position: absolute;
  z-index: 2;
}
</style>