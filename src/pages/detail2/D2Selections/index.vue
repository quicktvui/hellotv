<template>
  <qt-waterfall
    ref="waterfallRef" class="d2s_waterfall"
    flexStyle="${style}" enablePlaceholder
    :endHintEnabled="false" sid="D2SelectionsWaterfallSid"
    @onItemClick="onItemClickFn"
    :paddingRect="[0,0,0,0]"
    :blockFocusDirections="['left', 'right', 'down']"
    :list-data="waterfallData"
  >
    <template v-slot:list-item>
      <qt-poster :borderRadius="20"/>
    </template>
    <template v-slot:section>
      <D2SelectionSection :type="D2SelectionsSectionTypes.selection" />
    </template>
  </qt-waterfall>
</template>
<script lang='ts' setup>
import { ref } from 'vue';
import { qtRef } from '@quicktvui/quicktvui3'
import type { QTWaterfallSection } from '@quicktvui/quicktvui3'
import D2SelectionSection from './D2SelectionSection.vue'
// @ts-ignore
import { D2SelectionsSectionTypes } from '../index.ts'
import d2Api from '../../../api/details2/index'

const waterfallRef = ref()
const waterfallData = qtRef<QTWaterfallSection[]>()
const onItemClickFn = ()=> {}

d2Api.getSelectionsData().then(res=>{
  waterfallData.value = res
  console.log(res, '--lsj--getSelectionsData')
})
</script>
<style scoped>
.d2s_waterfall {
  width: 1920px;
  height: 470px;
  background-color: transparent;
  position: absolute;
  left: 0.01px;
  bottom: 0.01px;
  z-index: 999;
}
</style>