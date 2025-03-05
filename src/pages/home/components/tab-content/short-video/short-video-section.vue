<template>
  <tv-item
    class='short-video-section-root-css'
    flexStyle='${style}' layout='${layout}'
    :clipChildren='false' :clipPadding='false'
    @item-bind='onItemBind'
  >
    <qt-list-view
      class='short-video-section-list-css'
      sid="${shortList.sid}"
      flexStyle='${shortList.style}'
      list='${itemList}'
      :clipChildren="false"
      :resetOnDetach="true"
      :enablePlaceholder="false"
      :pauseTaskOnHide='true'
      :blockFocusDirections="['left','right','down']"
      :autoSelectPosition="0"
    >
      <short-video-section-item :type='TabContentType.TYPE_WATERFALL_SECTION_SHORT_SCREEN_ITEM'/>

    </qt-list-view>

  </tv-item>

</template>

<script lang='ts' setup>
import ShortVideoSectionItem from './short-video-section-item.vue'
import TabContentType from '../../../adapter/tab-content/tab-content-item-type'

defineOptions({
  name: 'short-video-section'
})
const emits = defineEmits(['loadMore'])
const props = defineProps({
  getTabRef: {
    type: Function
  }
})
const onItemBind = (e) =>{
  console.log("XRG==onItemBind=",e)
  if (e.item){
    const tabRef = props.getTabRef!()
    const tabDataManager = tabRef.getDataManager()
    const tabPageIndex = e.pageIndex
    console.log("XRG==tabPageIndex=",tabPageIndex)
    const curSection = tabDataManager.getSection(tabPageIndex,e.position)
    console.log("XRG==curSection=",curSection)
    if (curSection.itemList.length < 1){
      const shortVideoId = e.item.shortVideoId
      console.log("XRG==shortVideoId=",shortVideoId)
      emits("loadMore",tabPageIndex,shortVideoId,1)
    }
  }
}

defineExpose({})

</script>

<style lang='scss' src='../../../scss/short-video-section.scss'>

</style>
