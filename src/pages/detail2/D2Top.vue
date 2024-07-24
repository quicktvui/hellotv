<template>
  <TopMenuBar :top-mode="mode" :btns="btns" :logo="logo" @clickItem="clickItemFn"/>
</template>
<script lang='ts' setup>
import { ref } from 'vue';
import TopMenuBar from '../../components/TopMenuBar/index.vue'
// @ts-ignore
import api from '../../api/details2/index.ts'
import { useESRouter } from '@extscreen/es3-router';

const router = useESRouter()
const mode = api.getConfig().topMode
const btns = ref()
const logo = ref()

api.getTopList().then(res=>{
  btns.value = res.btns
  logo.value = res.logo
})
const clickItemFn = (index, item)=>{
  if(item.router){
    if(item.router.isReplace){
      router.replace(item.router.route)
    }else{
      router.push(item.router.route)
    }
  }
}
</script>
<style scoped lang="less">

</style>