<template>
  <div class="activity2" :gradientBackground="pageConfig.bgColor">
    <qt-image v-if="pageConfig.bgImg" class="bg_img" :src="pageConfig.bgImg" :focusable="false"/>
    <AcTop v-if="pageConfig.top" ref="AcTopRef" :isTop="isTop" @emTabChange="emTabChangeFn" />
    <scroll-view class="ac_content" ref="acContentScrollRef" :focusable="false" :clipChildren="false" :clipPadding="false" :onScrollEnable="true">
      <div class="ac_content_inner">
        <AcBanner ref="bannerRef" />
        <AcAaterfall :isTop="isTop" ref="AcAaterfallRef" @emToTop="emToTopFn" />
      </div>
    </scroll-view>
    <qt-loading-view v-if="isLoading" class="page_loading" color="rgba(255,255,255,0.3)" :focusable="false" />
  </div>
</template>
<script lang='ts' setup>
import { ESKeyEvent, useESToast } from '@extscreen/es3-core'
import { nextTick, ref } from 'vue';
import AcTop from './AcTop.vue'
import AcBanner from './AcBanner.vue'
import AcAaterfall from './AcAaterfall.vue'
import { useESRouter } from '@extscreen/es3-router';
// @ts-ignore
import activity2Api from '../../api/activity2/index.ts'
// @ts-ignore
import { IActivityConfig } from '../../api/activity2/types.ts';
// @ts-ignore
import { getBgColor } from './index.ts';

let dScrollTop = 100// - 100
let scrollTop = 0// - 100
let isTop = ref(false)
let topOffset = 0
const acContentScrollRef = ref()
const AcTopRef = ref()
const AcAaterfallRef = ref()
const bannerRef = ref()
// const toast = useESToast()
const router = useESRouter()
const isLoading = ref(true)
const pageConfig = ref<IActivityConfig>({
  bgColor: {colors:['#2F3541','#252930'],cornerRadius:0},
  bgImg: '',
  banner: { style: { height: '600px' } }
})

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
  async onESCreate(params) {
    await activity2Api.initPageData(params).then(res=>{
      activity2Api.pageData = res
      AcTopRef.value?.init()
      bannerRef.value?.init()
      AcAaterfallRef.value?.init()
      isLoading.value = false
    }).catch(()=>{})
    activity2Api.getConfigs().then(apiconfig=>{
      if(apiconfig.bgColor){
        apiconfig.bgColor = getBgColor(apiconfig.bgColor)
      }
      pageConfig.value = Object.assign(pageConfig.value, apiconfig)
      if(apiconfig.banner?.style.height){
        scrollTop = parseInt(apiconfig.banner.style.height)||dScrollTop
      }else{
        scrollTop = dScrollTop
      }
    })
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

.page_loading {
  height: 100px; width: 100px;
  position: absolute;
  left: 900px;
  top: 500px;
  background-color: transparent;
  z-index: 999999;
}
</style>