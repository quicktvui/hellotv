<template>
  <!-- :clipBounds="{left:100,top:100,right:100,bottom:100}" -->
  <div class="rtm_list" flexStyle="${style}" :clipChildren="true">
    <qt-waterfall
      ref="waterfall" class="rtm_waterfall" tvItemListName="itemList"
      flexStyle="${style}" enablePlaceholder 
      :makeChildVisibleClampBackward="15" :makeChildVisibleClampForward="80"
      :endHintEnabled="false" sid="RankTabMoreListWaterfallSid"
      @onItemClick="onItemClickFn"
      @onItemFocused="onItemFocused"
    >
      <template v-slot:list-item>
        <qt-poster :borderRadius="20"/>
      </template>
    </qt-waterfall>
    <!-- :makeChildVisibleClampForward="70" -->
    <!-- :nextTargetFocusPosition="0" -->
  </div>
</template>
<script lang='ts' setup>
// @ts-ignore
import { rankingUi } from '../index.ts'
import { StyleValue, onMounted, onBeforeUnmount, ref } from 'vue';
import { VirtualView, QTWaterfallVisibleType, QTWaterfallSectionType } from '@quicktvui/quicktvui3';
import type { QTWaterfallSection, QTIWaterfall } from '@quicktvui/quicktvui3';
import { EventBus } from "@extscreen/es3-vue"
import { useESRouter, useESRoute } from '@extscreen/es3-router';

const router = useESRouter()
const route = useESRoute()
const cRouteName = route.name
let toRouteName = cRouteName
const waterfall = ref<QTIWaterfall>()
// const waterfallDatas = qtRef<QTWaterfallSection[]>()

let fSectionIndex = -1
let fPrevSectionIndex = -1
let isLoseFocused = -1

router.afterEach((to, from, failure) => {
  toRouteName = to.name
})

onMounted(()=>{
  waterfall.value?.init({
    width: 1920,
    height: 385,
    visibleType: QTWaterfallVisibleType.QT_WATERFALL_VISIBLE_TYPE_NORMAL
  })
})
const onItemFocused = (sectionIndex, posterIndex, isFocus, data) => {
  if(isFocus){
    rankingUi.changeData({
      sectionIndex,itemIndex:posterIndex
    })
    fSectionIndex = sectionIndex
  } else {
    fPrevSectionIndex = sectionIndex
  }
  isLoseFocused = Number(isFocus)
}

const dispatchKeyEventFn = (keyEvent) => {
  if (keyEvent && keyEvent.action === 1 && toRouteName === cRouteName) {
    if(isLoseFocused === 0){//waterfall失去焦点
      rankingUi.changeData({
        sectionIndex: 0, itemIndex: 0
      })
      
      const sid = rankingUi.getSid({ sectionIndex: fSectionIndex })
      if(sid){
        VirtualView.call(sid, 'clearFocus', [])
        VirtualView.call(sid, 'scrollToPosition', [0])
      }
      VirtualView.call('RankTabMoreListWaterfallSid', 'clearFocus', [])
      VirtualView.call('RankTabMoreListWaterfallSid', 'scrollToPosition', [0])
      
      isLoseFocused = -1
      fPrevSectionIndex = -1
      fSectionIndex = -1
    }
    if(isLoseFocused === 1){//waterfall切换板块焦点
      if(fSectionIndex>-1&&fPrevSectionIndex>-1&&fPrevSectionIndex!==fSectionIndex){
        const sid = rankingUi.getSid({ sectionIndex: fPrevSectionIndex })
        if(sid){
          VirtualView.call(sid, 'clearFocus', [])
          VirtualView.call(sid, 'scrollToPosition', [0])
        }
      }
    }
  }
}
EventBus.$on('DispatchKeyEvent', dispatchKeyEventFn);
onBeforeUnmount(()=>{
  EventBus.$off('DispatchKeyEvent', dispatchKeyEventFn)
})
const onItemClickFn = (sectionIndex, posterIndex, data, e)=> {
  if(e.item._router){
    router.push({
        name: e.item._router.url, //'series_view',
        params: e.item._router.params?{...e.item._router.params}:undefined
    });
  }
}
</script>
<style scoped>
.rtm_list {
  background-color: transparent;
}

.rtm_waterfall {
  /* width: 1920px;
  height: 385px; */
  background-color: transparent;
}
</style>