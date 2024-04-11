<template>
  <div class="activity2" :gradientBackground="dConfig.bgColor">
    <qt-image v-if="dConfig.bgImg" class="bg_img" :src="dConfig.bgImg" :focusable="false"/>
    <AcTop v-if="dConfig.top" ref="AcTopRef" :isTop="isTop" @emTabChange="emTabChangeFn" />
    <scroll-view class="ac_content" ref="acContentScrollRef" :focusable="false" :clipChildren="false" :clipPadding="false" :onScrollEnable="true">
      <div class="ac_content_inner">
        <AcBanner />
        <AcAaterfall :isTop="isTop" ref="AcAaterfallRef" @emToTop="emToTopFn" />
      </div>
    </scroll-view>
  </div>
</template>
<script lang='ts' setup>
// @ts-ignore
import { dConfig } from './index.ts'
import { ESKeyEvent, useESToast } from '@extscreen/es3-core'
import { nextTick, ref } from 'vue';
import AcTop from './AcTop.vue'
import AcBanner from './AcBanner.vue'
import AcAaterfall from './AcAaterfall.vue'
import { useESRouter } from '@extscreen/es3-router';

const scrollTop = parseInt(dConfig.banner?.style?.height||'0')// - 100
let isTop = ref(false)
let topOffset = 0
const acContentScrollRef = ref()
const AcTopRef = ref()
const AcAaterfallRef = ref()
const toast = useESToast()
const router = useESRouter()

const emTabChangeFn = (e)=>{
  if(isTop.value && scrollTop && e.isFocused && topOffset === scrollTop){
    // toast.showLongToast('emTabChangeFn-'+isTop.value)
    acContentScrollRef.value?.scrollTo(0,0,100)
    isTop.value = false
    topOffset = 0
  }
}
const emToTopFn = (top) => {
  // toast.showLongToast(top+'')
  if(!isTop.value && scrollTop && topOffset === 0){
    acContentScrollRef.value?.scrollTo(0,scrollTop,100)
    isTop.value = true
    topOffset = scrollTop
  }
}
defineExpose({
  onESCreate(params) {
    AcTopRef.value?.init()
    AcAaterfallRef.value?.init()
    // setTimeout(() => {
      // acContentScrollRef.value.scrollTo(0,0,100)//scrollToWithOptions
    // }, 1000);
  },
  onKeyDown(keyEvent: ESKeyEvent): boolean {
    AcAaterfallRef.value?.onKeyDown(keyEvent)
    return true
  },
  onBackPressed(){
    if(!AcAaterfallRef.value?.onBackPressed()){
      return false
    }
    router.back()
    return true
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
.ac_content_inner{
  width: 1920px;
  height: 2000px;
  background-color: transparent;
}
</style>