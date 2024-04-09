<template>
<div class="ac_banner" :style="dConfig.banner.style">
  <img v-if="dConfig.banner.img" class="ac_banner_img" :style="dConfig.banner.style" :src="dConfig.banner.img" />
</div>
</template>
<script lang='ts' setup>
// @ts-ignore
import { dConfig } from './index.ts'
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