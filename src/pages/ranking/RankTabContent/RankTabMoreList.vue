<template>
  <div class="rtm_list" flexStyle="${style}" :clipChildren="true">
    <qt-waterfall
      ref="waterfall" class="rtm_waterfall" tvItemListName="itemList"
      flexStyle="${style}" enablePlaceholder :makeChildVisibleClampForward="80"
      :makeChildVisibleClampBackward="15"
      :endHintEnabled="false"
      @onItemClick="onItemClick"
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
import { StyleValue, computed, onMounted, ref } from 'vue';
import { qtRef, QTWaterfallVisibleType, QTWaterfallSectionType } from '@quicktvui/quicktvui3';
import type { QTWaterfallSection, QTIWaterfall } from '@quicktvui/quicktvui3';

const waterfall = ref<QTIWaterfall>()
// const waterfallDatas = qtRef<QTWaterfallSection[]>()
waterfall.value?.init({
  width: 1920,
  height: 385,
  visibleType: QTWaterfallVisibleType.QT_WATERFALL_VISIBLE_TYPE_NORMAL
})
const onItemFocused = (sectionIndex, posterIndex, isFocus, data) => {
  if(isFocus&&data&&data.rwaData){
    rankingUi.updateCurrent(data.rwaData)
  }
}
const onItemClick = (sectionIndex, posterIndex, data, ev) => {
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