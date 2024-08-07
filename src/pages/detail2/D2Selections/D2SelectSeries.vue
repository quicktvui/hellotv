<template>
  <select-series 
    class="d2_select_series2" ref="d2SelectSeries2" :clipChildren="false"
    :scrollParam="scrollParams" :groupParam="groupParams" :commonParam="commonParams"
    :display="true" @load-data="onLoadData" @item-click="onItemClick"
    :focusable="false" :custom-item="true"
    @group-item-focused="onGroupItemFocused"
  >
    <qt-view 
      class="d2ss_item" autoWidth :clipChildren="false" 
      :focusable="true" :focusScale="1.08"
    >
      <qt-text 
        text="${title}" class="d2ss_item_text" :focusable="false" 
        duplicateParentState gravity="center" :ellipsizeMode="2" :lines="1"
      ></qt-text>
    </qt-view>
  </select-series>
</template>
<script lang='ts' setup>
import { ref, onMounted } from 'vue';
import type {ESIMediaSeries} from "@extscreen/es3-component";
import d2Api from '../../../api/details2/index'
// @ts-ignore
import { dVideoSectionPageSize, detail2Ui, getPageIndex,getPageNo } from '../index.ts'

let pageSize: number = d2Api.getConfig().videoSectionPageSize||dVideoSectionPageSize;//每页加载多少条数据
let totalCount: number = detail2Ui.vdata?.selectionTotalSize||0;
const d2SelectSeries2 = ref<ESIMediaSeries>()

let prevSelectionIndex=0
const onItemClick = (ev) => {
  prevSelectionIndex = ev.position
  detail2Ui.selectionIndex = ev.position
  const pageNo = getPageNo(ev.position)
  const pIndex = getPageIndex(ev.position)
  const newList = detail2Ui.selectionList.get(pageNo)
  if(newList){
    detail2Ui.changePlayList(newList)
    detail2Ui.changeVideo(pIndex)
    detail2Ui.selectionPageNo = pageNo
  }
}
const onGroupItemFocused = (ev) => {
  // console.log(ev.position+1, '--lsj-onGroupItemFocused')
}
const onLoadData = (e) => {
  // e.page是从0开始的，但是分页需要从1开始
  detail2Ui.getMediaSelectionList(e.page+1).then(mList=>{
    d2SelectSeries2.value?.setPageData(e.page, mList);
  })
}
const scrollParams = {
  scrollType: 0,//0 1
  pageDisplayCount: pageSize,
  paddingForPageLeft: 0,
  paddingForPageRight: 0,
}
const groupParams = {
  groupSize: pageSize,
  scrollTargetOffset: 2,
  // groupUp: true,
  groupMarginLeft: 0,
  textColor: {
    normal: "#FFFFFF",
    focused: "#000000",
    selected: "#FF5E90",
  },
  focusBackground: {
    color: ['#ffffff', '#ffffff'],
    //   orientation: 'LEFT_RIGHT',
    cornerRadius: [9, 9, 9, 9],
    padding: [0,0]
  },
  mark: {
    color: '#00FFFFFF'
  },
  itemWidth: 180, itemHeight: 66, itemGap: 25,
  background:{
    color:['#33666666',"#33666666"],
    cornerRadius: [9,9,9,9],
    padding: [0,0],
  }
}
const commonParams = {
  contentWidth: 1720,//1824
  itemGap: 48,
  initPosition: 0
  // contentHeight: 80
}
const setSelect = ()=>{
  const currentTab = detail2Ui.currentPlayPath[0]
  if(currentTab == detail2Ui.selectionPositoin){
    if(prevSelectionIndex !== detail2Ui.selectionIndex){
      console.log('lsj-scrollTo', detail2Ui.selectionIndex)
      d2SelectSeries2.value?.scrollTo(detail2Ui.selectionIndex)
      d2SelectSeries2.value?.setSelected(detail2Ui.selectionIndex)
    }
  } else {
    // d2SelectSeries2.value?.setGroupSelected(-1)
    d2SelectSeries2.value?.setSelected(-1)
  }
}
detail2Ui.$on(setSelect)
onMounted(()=>{
  if(totalCount){
    d2SelectSeries2.value?.setInitData(totalCount,pageSize)
  }
})
</script>
<style scoped>
.d2_select_series2{
  width: 1920px;
  height: 220px;
  /* 270px */
  background-color: transparent;
}

.d2ss_item {
  width: 307px;
  height: 120px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 9px;
  margin-right: 40px;
  background-color: rgba(102, 102, 102, 0.2);
  focus-background-color: #ffffff;
}

.d2ss_item_text {
  width: 267px;
  height: 120px;
  color: #BFBFBF;
  font-size: 30px;
  focus-color: #0E0E0E;
  select-color: #FF5E90;
}
</style>