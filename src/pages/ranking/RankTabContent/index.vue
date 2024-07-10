<template>
<div class="rt_content" :style="rtcStyle">
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
import { StyleValue, computed } from 'vue';
import rankApi from '../../../api/ranking/index'

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