<template>
  <select-series 
    class="d2_select_series2" ref="d2SelectSeries2" :clipChildren="false"
    :scrollParam="scrollParams" :groupParam="groupParams" :commonParam="commonParams"
    :display="true" @load-data="onLoadData" @item-click="onItemClick"
    :focusable="false" :custom-item="true"
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
import { detail2Ui } from '../index.ts'

let catchMList:any[] = []
let pageSize: number = 20;//每页加载多少条数据
let totalCount: number = detail2Ui.vdata?.selectionTotalSize||0;
const d2SelectSeries2 = ref<ESIMediaSeries>()
const onItemClick = (ev) => {
  // console.log(ev.data.videoData, '---lsj--s-s-onItemClick')
  detail2Ui.changePlayList(catchMList)
  detail2Ui.changeVideo(ev.position)
}
const onLoadData = (e) => {
  let page = e.page; // 要加载的页数
  if(detail2Ui.vdata){
    d2Api.getMediaSelectionList(detail2Ui.vdata, page, pageSize).then(mList=>{
      d2SelectSeries2.value?.setPageData(page, mList);
      if(!catchMList.length){
        catchMList = mList
      }else{
        catchMList = catchMList.concat(mList)
      }
    })
  }
}
const scrollParams = {
  scrollType: 0,//0 1
  pageDisplayCount: 10,
  paddingForPageLeft: 0,
  paddingForPageRight: 0,
}
const groupParams = {
  groupSize: 10,
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
    //   cornerRadius: [40, 40, 40, 40],
    //   padding: [34, 6]
  },
  mark: {
    color: '#00FFFFFF'
  }
}
const commonParams = {
  contentWidth: 1720,//1824
  itemGap: 48,
  // contentHeight: 80
}
detail2Ui.$on(()=>{
  console.log(detail2Ui.tabPath.get(detail2Ui.selectionPositoin), '--lsj-selectionPositoin')
})
onMounted(()=>{
  if(totalCount){
    d2SelectSeries2.value?.setInitData(totalCount,pageSize)
    d2SelectSeries2.value?.setSelected(1)
    d2SelectSeries2.value?.setGroupSelected(0)
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