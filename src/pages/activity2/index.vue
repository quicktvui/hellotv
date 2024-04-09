<template>
  <div class="activity2" :gradientBackground="dConfig.bgColor">
    <qt-image v-if="dConfig.bgImg" class="bg_img" :src="dConfig.bgImg" :focusable="false"/>
    <AcTop ref="AcTopRef" />
    <div class="ac_content">
      <AcBanner />
      <AcAaterfall ref="AcAaterfallRef" />
    </div>
  </div>
</template>
<script lang='ts' setup>
// @ts-ignore
import { dConfig } from './index.ts'
// import { } from '@extscreen/es3-core'
import { ref } from 'vue';
import AcTop from './AcTop.vue'
// import AcBlack from './AcBlack.vue'
import AcBanner from './AcBanner.vue'
import AcAaterfall from './AcAaterfall.vue'

const AcTopRef = ref()
const AcAaterfallRef = ref()
defineExpose({
  onESCreate(params) {
    AcTopRef.value?.init()
    AcAaterfallRef.value?.init()
  }
})
</script>
<style scoped>
.activity2 {
  position: relative;
  width: 1920px;
  height: 1080px;
  border: 0px solid transparent;
  background-color: #2F3541;
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
  align-items: center;
  border: 0 solid transparent;
  background-color: transparent;
}

</style>