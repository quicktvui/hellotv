<template>
  <div class="ac_black" :style="pStyle">
    <text-view class="black_title" :text="pTitle" :style="pTitleStyle" gravity="centerVertical" autoWidth autoHeight :focusable="false"></text-view>
    <div class="black_list">
    </div>
  </div>
</template>
<script lang='ts' setup>
// @ts-ignore
import { dConfig } from './index.ts'
const props = withDefaults(defineProps<{
  pTitle:string
  pStyle:{ marginBottom:string }
  pTitleStyle: { fontSize:string; color:string }
}>(), {
  pTitle: dConfig.block.title,
  pStyle: ()=>dConfig.block.pStyle,
  pTitleStyle: ()=>dConfig.block.pTitleStyle,
})

</script>
<style scoped>
.ac_black {
  position: relative;
  width: 1740px;
  background-color: transparent;
  /* margin-top: 500px; */
}
.black_title{
  height: 80px;
  background-color: transparent;
}
.black_list{
  width: 1740px;
  min-height: 200px;
  background-color: rgba(0,0,0,0.5);
}
</style>