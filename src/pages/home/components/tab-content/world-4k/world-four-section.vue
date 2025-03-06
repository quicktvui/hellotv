<template>
  <tv-item class='world-4k-section-root-css'
           flexStyle='${style}' layout='${layout}'
           :clipChildren='false' :clipPadding='false'
           @item-bind='onItemBind'>
    <qt-list-view class='world-4k-section-list-css'
                  horizontal
                  :infiniteParams='{scrollOffset:253,minChildScale:0.86}'
                  sid='${list4KSid}'
                  flexStyle='${style}'
                  list='${itemList}'
                  padding='0,30,0,30'
                  :blockFocusDirections="['left','right']"
                  :clipChildren='false'
                  :clipPadding='false'
                  makeChildVisibleType='center'
                  :enableSelectOnFocus='true'
                  :autoSelectPosition='1000000000'>
      <world-four-section-item :type='TabContentItemType.TYPE_WATERFALL_SECTION_4K_ITEM'/>
    </qt-list-view>
  </tv-item>

</template>

<script lang='ts' setup name='world-four-section'>

import WorldFourSectionItem from './world-four-section-item.vue'
import TabContentItemType from "../../../adapter/tab-content/tab-content-item-type.ts"

const emits = defineEmits(['loadMore'])
const props = defineProps({
  getTabRef: {
    type: Function
  }
})

const onItemBind = (e) => {
  if (e.item){
    const tabRef = props.getTabRef!()
    const tabDataManager = tabRef.getDataManager()
    const curSection = tabDataManager.getSection(e.pageIndex,e.position)
    if(curSection.itemList.length < 1){
      const content4kId = e.item.content4kId
      emits("loadMore",e.pageIndex,content4kId)
    }
  }
}
defineExpose({})

</script>

<style lang='scss' src='../../../scss/world-four-section.scss'>

</style>
