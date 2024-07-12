<template>
  <div class="rtm_tv_item" :type="rankingContentTypes.more">
    <tv-item
      keyName="_id"
      :blockFocusDirections="['left', 'right']"
      :clipChildren="false"
      :clipPadding="false"
      singleton flexStyle="${style}"
      focusScrollTarget="${isFocusScrollTarget==true}"
      scrollOverride="${scrollOverride}"
      @item-bind="onSectionBind"
    >
      <qt-waterfall
        ref="waterfall" :list-data="waterfallDatas" class="rtm_waterfall"
        :style="rtmTvItemStyle"
      />
    </tv-item>
  </div>
</template>
<script lang='ts' setup>
// @ts-ignore
import { rankingContentTypes } from '../index.ts'
import { StyleValue, computed, onMounted } from 'vue';
import { qtRef } from '@quicktvui/quicktvui3';
import type { QTWaterfallSection } from '@quicktvui/quicktvui3';
import rankApi from '../../../api/ranking/index'

const waterfallDatas = qtRef<QTWaterfallSection[]>()

const configs = rankApi.getConfig()
const rtmTvItemStyle = computed<StyleValue>(()=>{
  return {
    width: 1920 - configs.pageSpace  + 'px', height: '384px'
  }
})
const onSectionBind = (ev) => {
  if(ev.item?.itemList){
    console.log(ev, '--lsj-ev.item.itemList')
    // waterfallDatas.value = ev.item.itemList
  }
}
</script>
<style scoped>
.rtm_tv_item {
  width: 1920px;
  height: 385px;
  background-color: transparent;
}
.rtm_waterfall {
  background-color: rgba(0,0,0,0.8);
}
</style>