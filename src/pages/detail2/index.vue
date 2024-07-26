<template>
<div class="d_page2">
  <D2Video ref="D2VideoRef" />

  <template v-if="!isLoading">
    <div v-show="isShowDes" class="d_page2_cover" :clipChildren="false">
      <D2Top v-if="pConfig.isShowTop" />
      <D2Info @clickAction="clickActionFn"/>
      <D2Selections />
      <D2DesDrawer />
    </div>
  </template>
  <div class="d2_loading_box" v-show="isLoading">
    <qt-loading-view color="rgba(255,255,255,0.3)" style="height: 100px; width: 100px" :focusable="false" />
  </div>
</div>
</template>
<script lang='ts' setup>
import { ref } from 'vue'
import D2Video from './D2Video.vue'
import D2Top from './D2Top.vue'
import D2Info from './D2Info/index.vue'
import D2Selections from './D2Selections/index.vue'
import D2DesDrawer from './D2DesDrawer.vue'
// @ts-ignore
import { detail2Ui } from './index.ts'
import api from '../../api/details2/index'
import { IDetail2Config, IvideoDesActions,IvideoParams } from '../../api/details2/types';
import { useESRouter } from '@extscreen/es3-router'

const pConfig = ref<Partial<IDetail2Config>>({});
const isLoading = ref(true)
const D2VideoRef = ref()

const router = useESRouter()
router.afterEach((to, from, failure) => {
  if(to.name !== 'detail2'){
    clearTimeout(timerOutId)
  }
})

const isShowDes = ref(true)
let timerOutId:any = null
const starTime = ()=>{
  clearTimeout(timerOutId)
  // timerOutId = setTimeout(() => {
  //   isShowDes.value = false
  // }, 10000);
}
const clickActionFn = (actionItem)=>{
  if(actionItem.action === IvideoDesActions.fullScreen){
    clearTimeout(timerOutId)
    isShowDes.value = false
  } else if(actionItem.router){
    const currentPlay = detail2Ui.getCurrentPlay()?.videoData||{}
    router.push({
      name: actionItem.router.name,//'d2Introduction',
      params:{...currentPlay, ...(actionItem.router.params||{})}
    })
  }
}
defineExpose({
  onESCreate(params:IvideoParams){
    api.initPageData(params).then(()=>{
      pConfig.value = api.getConfig()

      detail2Ui.setVideo({id: 'd2'+Math.random()}).then(()=>{
        isLoading.value = false
        detail2Ui.$emit()
        starTime()
      })
    })
  },
  onKeyDown (keyEvent){
    if(!isShowDes.value){
      return D2VideoRef.value?.onKeyDown(keyEvent)
    }else{
      starTime()
    }
    return false
  },
  onKeyUp (keyEvent){
    if(!isShowDes.value){
      return D2VideoRef.value?.onKeyUp(keyEvent)
    }
    return false
  },
  onBackPressed (){
    if(!isShowDes.value){
      const press = D2VideoRef.value?.onBackPressed()
      if(!press){
        isShowDes.value = true
        starTime()
      }
    }else{
      router.back()
    }
  },
  onESDestroy(){
    clearTimeout(timerOutId)
    detail2Ui.clear()
  }
})
</script>
<style scoped>
.d_page2{
  position: relative;
  width: 1920px;
  height: 1080px;
  background-color: #000000;
}
.d_page2_cover{
  position: absolute;
  left: 0.01px;
  top: 0.01px;
  width: 1920px;
  height: 1080px;
  background-color: rgba(0,0,0,0.8);
  z-index: 2;
}
.d2_loading_box{
  position: absolute;
  left: 0.01px;
  top: 0.01px;
  width: 1920px;
  height: 1080px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 10;
  background-color: transparent;
}
</style>
