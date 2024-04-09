<template>
  <qt-waterfall
    ref="waterfall"
    class="ac_waterfall"
    :style="waterfallStyle"
    @onScroll='onScroll'
    @onItemClick='onItemClick'
    @onItemFocused='onItemFocused'
    @onItemBind='onItemBind'
    @onScrollStateChanged='onScrollStateChanged'
    @onItemAttached='onItemAttached'
  >
    <template v-slot:item>
      <AcPoster :type='1' />
    </template>
  </qt-waterfall>
</template>
<script lang='ts' setup>
import { ref } from 'vue'
import {
	QTIWaterfall, QTWaterfall,
} from '@quicktvui/quicktvui3';
import AcPoster from './AcPoster/index.vue'
// @ts-ignore
import { getBlockList, blockWidth, blockHeight } from './index.ts'
import { useESToast } from '@extscreen/es3-core';

const toast = useESToast()
const waterfall = ref<QTIWaterfall>();
const waterfallStyle = {
  width: blockWidth+'px', height: blockHeight+'px'
}
const onScroll = ()=>{
  toast.showLongToast('onScroll')
}
const onItemClick = ()=>{
  toast.showLongToast('onItemClick')
}
const onItemFocused = ()=>{
  toast.showLongToast('onItemFocused')
}
const onItemBind = ()=>{
  toast.showLongToast('onItemBind')
}
const onScrollStateChanged = (e)=>{
  toast.showLongToast('onScrollStateChanged')
}
const onItemAttached = ()=>{
  toast.showLongToast('onItemAttached')
}
defineExpose({
  init(params) {
    //1.初始化瀑布流
    let waterfallData: QTWaterfall = {
      width: blockWidth, height: blockHeight,
    };
    waterfall.value?.init(waterfallData);
    //4.给瀑布流设置板块列表数据
    waterfall.value?.setSectionList(getBlockList());
  }
})
</script>
<style scoped>
.ac_waterfall {
  background-color: transparent;
}
</style>