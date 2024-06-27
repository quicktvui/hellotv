<template>
<div class="d2_video">
  <img :src="bigImg" class="d2_video_poster"/>
</div>
</template>
<script lang='ts' setup>
const bigImg = 'http://qcloudimg.moss.huan.tv/project/lexue_education/lexue/2020/10/16/f4d06569c526405bae3c865afdbcd11f.jpg'

</script>
<style scoped>
.d2_video{
  width: 1920px;
  height: 1080px;
}
.d2_video_poster{
  width: 1920px;
  height: 1080px;
}
</style>