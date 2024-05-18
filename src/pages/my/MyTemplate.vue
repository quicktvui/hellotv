<template>
<div class="my_page" :style="cStyle" :gradientBackground="bg">
  <qt-button text="个人中心-template"></qt-button>
</div>
</template>
<script lang='ts' setup>
import { CSSProperties, StyleValue, computed, ref } from 'vue';
// @ts-ignore
import myApi from '../../api/my/index.ts'
import { Tbg, getBgColor } from '../../api/my/types'

interface Iprops {
  width: number
  height: number
}
const props = withDefaults(defineProps<Iprops>(),{
  width: 1920, height: 1080
})

const bg = ref<Tbg>(getBgColor('#ffffff'))
const cStyle = computed<CSSProperties>(()=>{
  return { 
    width: props.width+'px', height: props.height+'px'
  }
})

defineExpose({
  async onESCreate(params){
    myApi.initPageData(params).then(res=>{
      myApi.pageData = res;

      myApi.getConfig().then(config=>{
        bg.value = getBgColor(config.bgColor)
      })
    })
  }
})
</script>
<style scoped>
.my_page {
  background-color: #000000;
}
</style>