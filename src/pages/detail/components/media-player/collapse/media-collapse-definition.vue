<template>
  <qt-view class="media-collapse-definition" :focusable="false">
    <span class="media-collapse-definition-title" :opacity="isCollapseExpand ? 1 : 0.5">倍速</span>
    <div class="media-collapse-definition-content" :clipChildren="false" :opacity="isCollapseExpand ? 1 : 0">
      <qt-list-view
        ref="definitionListViewRef" horizontal
        :autofocusPosition="selectedIndex"
        sid='collapse-item-definition'
        v-show='isCollapseExpand'
        class="media-collapse-definition-list"
        @item-focused="onItemFocused"
        @item-click="onItemClicked">
        <media-collapse-list-item type="1"/>
      </qt-list-view>
    </div>   
  </qt-view>
</template>
      
<script setup lang='ts' name='media-collapse-definition'>
import { ref } from 'vue'
import { ESLogLevel, useESLog, toast } from "@extscreen/es3-core"
import { QTIListView, QTListViewItem} from '@quicktvui/quicktvui3'
import MediaCollapseListItem from "./media-collapse-list-item.vue";
  const TAG = 'media-collapse-definition'
  const log = useESLog()
  const isCollapseExpand = ref<boolean>(false)
  const definitionListViewRef = ref<QTIListView>()
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
    definitionListViewRef.value?.setListData(dataList)
  }
  const setItemFocused = (position: number): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, '-------setItemFocused---播放顺序---->>>>', position)
    }
    selectedIndex.value = position
    if (!isCollapseExpand.value) {
      return
    }
    // definitionListViewRef.value?.setItemFocused(position)
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
        definitionListViewRef.value?.updateItemRange(i,1,[item])
      }
    }
  } 
  defineExpose({
    setListData,
    setItemFocused,
    setItemSelected
  })
</script>
      
<style lang='scss' scoped>
.media-collapse-definition{
  width: 1920px;
  height: 160px;
  background-color: transparent;
  .media-collapse-definition-title{
    width: 1740px;
    height: 32px;
    font-size: 27px;
    color: white;
    margin-left: 90px;
  }
  .media-collapse-definition-content{
    width: 1920px;
    height: 130px;
    display: flex;
    align-items: center;
    justify-content: center;
    .media-collapse-definition-list {
      width: 1920px;
      height: 80px;
      background-color: transparent;
    }
  }
}
</style>
        