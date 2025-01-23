<template>
<div class="ac_banner" :style="bannerConfig.style">
  <img v-if="bannerConfig.img" class="ac_banner_img" :style="bannerConfig.style" :src="bannerConfig.img" />
</div>
</template>
<script lang='ts' setup>
import { ref } from 'vue';
// @ts-ignore
import activity2Api from '../../api/activity2/index.ts';
const bannerConfig = ref({
  img: '',
  style: {}
})
defineExpose({
  async init(){
    const tconfig = await activity2Api.getConfigs()
    bannerConfig.value = Object.assign(bannerConfig.value, tconfig.banner)
  }
})
</script>
<style scoped>
.ac_banner{
  width: 1920px;
  min-height: 100px;
  background-color: transparent;
}
.ac_banner_img{
  width: 1920px;
  /* height: 600px; */
  background-color: transparent;
}
</style>