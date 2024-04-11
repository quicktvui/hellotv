<template>
<div class="ac_banner" :style="bannerConfig.style">
  <img v-if="bannerConfig.img" class="ac_banner_img" :style="bannerConfig.style" :src="bannerConfig.img" />
</div>
</template>
<script lang='ts' setup>
// @ts-ignore
import { dConfig } from './index.ts'
const bannerConfig = dConfig.banner || {
  img: '',
  style: {}
}
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