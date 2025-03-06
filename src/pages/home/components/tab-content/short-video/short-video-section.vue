<template>
  <tv-item
    class='short-video-section-root-css'
    flexStyle='${style}' layout='${layout}'
    :clipChildren='true' :clipPadding='false'
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
      @loadMore="loadMore"
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
let tabPageIndex = -1
let shortVideoId = ""
let pageNo = 1
let loadMoreTimer:any = -1
const onItemBind = (e) =>{
  if (e.item){
    const tabRef = props.getTabRef!()
    const tabDataManager = tabRef.getDataManager()
    tabPageIndex = e.pageIndex
    const curSection = tabDataManager.getSection(tabPageIndex,e.position)
    if (curSection.itemList.length < 1){
      shortVideoId = e.item.shortVideoId
      emits("loadMore",tabPageIndex,shortVideoId,pageNo)
    }
  }
}
const loadMore = (e)=>{
  clearTimeout(loadMoreTimer)
  loadMoreTimer = setTimeout(()=>{
    pageNo ++
    emits('loadMore',tabPageIndex,shortVideoId,pageNo)
  },500)
}

defineExpose({})

</script>

<style lang='scss' src='../../../scss/short-video-section.scss'>

</style>
