<template>
  <qt-view class="media-collapse-speed" :focusable="false">
    <span class="media-collapse-speed-title" :opacity="isCollapseExpand ? 1 : 0.5">倍速</span>
    <div class="media-collapse-speed-content" :clipChildren="false" :opacity="isCollapseExpand ? 1 : 0">
      <qt-list-view
        ref="speedListViewRef" horizontal
        :autofocusPosition="selectedIndex"
        sid='collapse-item-speed'
        v-show='isCollapseExpand'
        class="media-collapse-speed-list"
        @item-focused="onItemFocused"
        @item-click="onItemClicked">
        <media-collapse-list-item type="1"/>
      </qt-list-view>
    </div>   
  </qt-view>
</template>
      
<script setup lang='ts' name='media-collapse-speed'>
import { ref } from 'vue'
import { ESLogLevel, useESLog } from "@extscreen/es3-core"
import { QTIListView, QTListViewItem} from '@quicktvui/quicktvui3'
import MediaCollapseListItem from "./media-collapse-list-item.vue";
  const TAG = 'media-collapse-speed'
  const log = useESLog()
  const isCollapseExpand = ref<boolean>(false)
  const speedListViewRef = ref<QTIListView>()
  const emits = defineEmits([
    'onCollapseItemFocused','onCollapseItemClicked'
  ])
  let itemDataList: Array<QTListViewItem>
  const selectedIndex = ref<number>(0)
  const onItemFocused = (e) => {
    let focused = e.isFocused;
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.e(TAG, "-------onCollapseItemFocused-----播放顺序--->>>>>", focused)
    }
    emits('onCollapseItemFocused', focused)
  }
  const onItemClicked = (e) => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, '-------onCollapseItemClicked-----播放顺序-->>>>', e)
    }
    emits('onCollapseItemClicked', e.position, e.item)
  }
  const setListData = (dataList: Array<QTListViewItem>) => {
    itemDataList = dataList;
    speedListViewRef.value?.setListData(dataList)
  }
  const setItemFocused = (position: number): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, '-------setItemFocused---播放顺序---->>>>', position)
    }
    selectedIndex.value = position
    if (!isCollapseExpand.value) {
      return
    }
    // speedListViewRef.value?.setItemFocused(position)
  }
  const setItemSelected = (position: number): void => {
    selectedIndex.value = position
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, '-------setItemSelected---播放顺序---->>>>', position)
    }
    if (itemDataList) {
      for (let i = 0; i < itemDataList.length; i++) {
        const item = itemDataList[i]
        if (position == i) {
          item.iconStyle = {
            width: 32,
            height: 32
          }
        } else {
          item.iconStyle = {
            width: 0,
            height: 0
          }
        }
        speedListViewRef.value?.updateItemRange(i,1,[item])
      }
    }
  } 
  // CollapseItem 展示回调
  const onCollapseItemExpand = (value: boolean) => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.e(TAG, "-------onCollapseItemExpand-----播放顺序--->>>>>", value)
    }
    isCollapseExpand.value = value
    if (value) {
      setItemFocused(selectedIndex.value)
    }
  }
  defineExpose({
    setListData,
    setItemFocused,
    setItemSelected,
    onCollapseItemExpand
  })
</script>
      
<style lang='scss' scoped>
.media-collapse-speed{
  width: 1920px;
  height: 160px;
  background-color: transparent;
  .media-collapse-speed-title{
    width: 1740px;
    height: 32px;
    font-size: 27px;
    color: white;
    margin-left: 90px;
  }
  .media-collapse-speed-content{
    width: 1920px;
    height: 130px;
    display: flex;
    align-items: center;
    justify-content: center;
    .media-collapse-speed-list {
      width: 1920px;
      height: 80px;
      background-color: transparent;
    }
  }
}
</style>
        