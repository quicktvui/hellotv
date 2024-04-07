<template>
  <div class="activity2" :gradientBackground="dConfig.bgColor">
    <qt-image v-if="dConfig.bgImg" class="bg_img" :src="dConfig.bgImg" :focusable="false"/>
    <div class="ac_content">
      <AcTop ref="AcTopRef" />
    </div>
  </div>
</template>
<script lang='ts' setup>
// @ts-ignore
import { dConfig } from './index.ts'
// import { } from '@extscreen/es3-core'
import AcTop from './AcTop.vue'
import { ref } from 'vue';

const AcTopRef = ref()
defineExpose({
  onESCreate(params) {
    AcTopRef.value?.init()
  }
})
</script>
<style scoped>
.activity2 {
  position: relative;
  width: 1920px;
  height: 1080px;
  border: 0px solid transparent;
  background-color: transparent;
}
.bg_img{
  position: absolute;
  left: 0;
  top: 0;
  width: 1920px;
  height: 1080px;
  background-color: transparent;
  z-index: 1;
}
.ac_content {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 10;
  width: 1920px;
  height: 1080px;
  background-color: transparent;
}

</style>