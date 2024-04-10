<template>
  <qt-waterfall
    ref="waterfall"
    class="ac_waterfall"
    :style="waterfallStyle"
    :requestFocus="true"
    :paddingRect="[0,0,0,50]"
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
import { getBlockList, dBlockWidth, dBlockHeight, IBlockItemData } from './index.ts'
import { useESToast, ESKeyEvent } from '@extscreen/es3-core';
// @ts-ignore
import activity2Api from '../../api/activity2/index.ts';
import { useESRouter } from '@extscreen/es3-router';

const router = useESRouter()
const toast = useESToast()
const waterfall = ref<QTIWaterfall>();
const waterfallStyle = {
  width: dBlockWidth+'px', height: dBlockHeight+'px'
}
let _waterfallHeight = 0
let scrollTop = 0
let firstId = ''
const onScroll = (scrollX, scrollY)=>{
  scrollTop = scrollY
}
const onItemClick = (parentPosition, position, item:IBlockItemData)=>{
  if(item._router){
    toast.showLongToast(item._router.name)
    router.push({
        name: item._router.name, //'series_view',
        params: item._router.params?{...item._router.params}:undefined
    });
  }
}
const onItemFocused = ()=>{
  // toast.showLongToast('onItemFocused')
}
const onItemBind = ()=>{
  // toast.showLongToast('onItemBind')
}
const onScrollStateChanged = (e)=>{
  // toast.showLongToast('onScrollStateChanged')
  // console.log(e, '---lsj-onScrollStateChanged')
}
const onItemAttached = ()=>{
  // toast.showLongToast('onItemAttached')
}
defineExpose({
  async init(params) {
    //1.初始化瀑布流
    let waterfallData: QTWaterfall = {
      width: dBlockWidth, height: dBlockHeight,
    };
    waterfall.value?.init(waterfallData);
    //4.给瀑布流设置板块列表数据
    const apiData = await activity2Api.getList()
    const {sectionList, waterfallHeight} = getBlockList(apiData)
    waterfall.value?.setSectionList(sectionList);
    _waterfallHeight = waterfallHeight
    if(sectionList[0]){
      firstId = sectionList[0].itemList?.[0]?._id || ''
    }
  },
  onBackPressed() {
    // toast.showLongToast(firstId+'')
    if(_waterfallHeight > dBlockHeight && scrollTop > 0){
      waterfall.value?.scrollToTop()
      waterfall.value?.setAutoFocus(firstId, 500)
      scrollTop = 0
      return false
    }
    return true
  }
})
</script>
<style scoped>
.ac_waterfall {
  width: 1920px;
  height: 980px;
  background-color: transparent;
}
</style>