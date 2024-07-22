<template>
  <div class="d2s_waterfall_box" clipChildren>
    <qt-waterfall
      ref="waterfallRef" class="d2s_waterfall"
      flexStyle="${style}" enablePlaceholder
      :endHintEnabled="false" sid="D2SelectionsWaterfallSid"
      @onItemClick="onItemClickFn"
      :paddingRect="[0,0,0,0]"
      :blockFocusDirections="['left', 'right', 'down']"
      :list-data="waterfallData"
      @item-focused="onItemFocusedFn"
      @item-bind="onItemBindFn"
    >
      <template v-slot:list-item>
        <Hposter :borderRadius="20" :type="hPosterType"/>
      </template>
      <template v-slot:section>
        <D2SelectionSection :type="D2SelectionsSectionTypes.selection" />
      </template>
    </qt-waterfall>
  </div>
</template>
<script lang='ts' setup>
import { ref } from 'vue';
import { qtRef } from '@quicktvui/quicktvui3'
import type { QTWaterfallSection } from '@quicktvui/quicktvui3'
import D2SelectionSection from './D2SelectionSection.vue'
// @ts-ignore
import { D2SelectionsSectionTypes, detail2Ui } from '../index.ts'
import d2Api from '../../../api/details2/index'
import Hposter from '../../../components/Hposter/index.vue'
import { hPosterType } from '../../../components/Hposter/configs'
import { VirtualView } from '@quicktvui/quicktvui3'

const waterfallRef = ref()
const waterfallData = qtRef<QTWaterfallSection[]>()
const onItemClickFn = ()=> {}
const onItemFocusedFn = (e) => {
  if(e.parentPosition===0 && e.position !== detail2Ui.selectTabIndex){
    detail2Ui.selectTabIndex = e.position
    
    const tabObj = detail2Ui.getTab2(e.item)
    //第二层tab
    waterfallData.value[1] = tabObj.tabs2Section
    //第三层tab-list
    waterfallData.value[2] = tabObj.tab2ContentSection
  }
  if(e.parentPosition===1 && detail2Ui.selectTab2Index !== e.position){
    detail2Ui.selectTab2Index = e.position
    // //第三层tab-list
    const tabContent = detail2Ui.getShowTabList(e.item as any)
    waterfallData.value[2] = tabContent
  }
}
let isInitBind = false
const onItemBindFn = (e) => {
  if(!isInitBind){
    isInitBind = true
    VirtualView.call(detail2Ui.tabSid, 'setSelectChildPosition', [detail2Ui.selectTabIndex])
    VirtualView.call(detail2Ui.tab2Sid, 'setSelectChildPosition', [detail2Ui.selectTab2Index])
    VirtualView.call(detail2Ui.tabListSid, 'setSelectChildPosition', [detail2Ui.selectTabListIndex])
  }
}
d2Api.getSelectionsData().then(res=>{
  const tabSection = res[0]
  if(tabSection){
    const tab = tabSection.itemList[detail2Ui.selectTabIndex]
    const tabObj = detail2Ui.getTab2(tab as any)
    //第二层tab
    res.splice(1, 0, tabObj.tabs2Section)
    //第三层tab-list
    res.splice(2, 0, tabObj.tab2ContentSection)
  }
  waterfallData.value = res
})
</script>
<style scoped>
.d2s_waterfall_box {
  width: 1920px;
  height: 470px;
  background-color: transparent;
  position: absolute;
  left: 0.01px;
  bottom: 0.01px;
  z-index: 999;
}
.d2s_waterfall {
  width: 1920px;
  height: 470px;
  background-color: transparent;
}
</style>