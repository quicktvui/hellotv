<template>
<div class="d_page2">
  <D2Video ref="D2VideoRef" />

  <template v-if="!isLoading">
    <div v-show="isShowDes" class="d_page2_cover" :clipChildren="false">
      <D2Top v-if="pConfig.isShowTop" />
      <D2Info />
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
import api from '../../api/details2/index.ts'
import { IDetail2Config } from '../../api/details2/types';

const pConfig = ref<Partial<IDetail2Config>>({});
const isLoading = ref(true)
const D2VideoRef = ref()

const isShowDes = ref(true)
defineExpose({
  onESCreate(params){
    api.initPageData(params).then(()=>{
      pConfig.value = api.getConfig()
      isLoading.value = false
      D2VideoRef.value?.init()

      setTimeout(() => {
        isShowDes.value = false
      }, 10000);
    })
  },
  onKeyDown (keyEvent){
    console.log('lsj--onKeyDown')
    return D2VideoRef.value?.onKeyDown(keyEvent)
  },
  onKeyUp (keyEvent){
    console.log('lsj--onKeyUp')
    return D2VideoRef.value?.onKeyUp(keyEvent)
  },
  onBackPressed (){
    if(!D2VideoRef.value?.onBackPressed()){
      if(!isShowDes.value){
        isShowDes.value = true
        return false
      }
      return true
    }
    return false
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
  background-color: rgba(0,0,0,0.9);
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
