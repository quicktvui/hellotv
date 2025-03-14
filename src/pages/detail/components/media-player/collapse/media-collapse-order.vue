<template>
  <qt-view class="media-collapse-order" :focusable="false">
    <span class="media-collapse-order-title" :opacity="isCollapseExpand ? 1 : 0.5">播放顺序</span>
    <qt-animation ref="animationRef">
      <div class="media-collapse-order-content" :clipChildren="false">
        <qt-list-view
          ref="orderListViewRef" horizontal
          :autofocusPosition="selectedIndex"
          sid='collapse-item-order'
          class="media-collapse-order-list"
          @item-focused="onItemFocused"
          @item-click="onItemClicked">
          <media-collapse-list-item type="1"/>
        </qt-list-view>
      </div>
    </qt-animation>
  </qt-view>
</template>

<script setup lang='ts' name='media-collapse-order'>
import { ref } from 'vue'
import { ESLogLevel, useESLog } from "@extscreen/es3-core"
import {
  QTAnimationPropertyName,
  QTAnimationValueType,
  QTIAnimation,
  QTIListView,
  QTListViewItem
} from '@quicktvui/quicktvui3'
import MediaCollapseListItem from "./media-collapse-list-item.vue";
  const TAG = 'media-collapse-order'
  const log = useESLog()
  const isCollapseExpand = ref<boolean>(false)
  const orderListViewRef = ref<QTIListView>()
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
    console.log(dataList,'dataListdataListdataListdataList')
    orderListViewRef.value?.setListData(dataList)
  }
  const setItemFocused = (position: number): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, '-------setItemFocused---播放顺序---->>>>', position)
    }
    selectedIndex.value = position
    if (!isCollapseExpand.value) {
      return
    }
    // orderListViewRef.value?.setItemFocused(position)
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
        orderListViewRef.value?.updateItemRange(i,1,[item])
      }
    }
  }
  // CollapseItem 展示回调
  const onCollapseItemExpand = (value: boolean, init: boolean) => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.e(TAG, "-------onCollapseItemExpand-----播放顺序--->>>>>", value)
    }
    isCollapseExpand.value = value

    let delay = init ? 0 : 300
    if (value) {
      show(delay)
    } else {
      dismiss(delay)
    }

    if (value) {
      setItemFocused(selectedIndex.value)
    }
  }

  const animationRef = ref<QTIAnimation>()
  let alpha = 1
  function show(delay) {
    if (alpha == 1) {
      return
    }
    animationRef.value?.objectAnimator2(
      '1',
      QTAnimationValueType.QT_ANIMATION_VALUE_TYPE_FLOAT,
      QTAnimationPropertyName.QT_ANIMATION_PROPERTY_NAME_ALPHA,
      alpha,
      1,
      delay,
      -1,
      0,
      false,
      false
    )
    animationRef.value?.startAnimator('1')
    alpha = 1
  }

  function dismiss(delay) {
    if (alpha == 0) {
      return
    }
    animationRef.value?.objectAnimator2(
      '2',
      QTAnimationValueType.QT_ANIMATION_VALUE_TYPE_FLOAT,
      QTAnimationPropertyName.QT_ANIMATION_PROPERTY_NAME_ALPHA,
      alpha,
      0,
      delay,
      -1,
      0,
      false,
      false
    )
    animationRef.value?.startAnimator('2')
    alpha = 0
  }

  defineExpose({
    setListData,
    setItemFocused,
    setItemSelected,
    onCollapseItemExpand
  })
</script>

<style lang='scss' scoped>
.media-collapse-order{
  width: 1920px;
  height: 160px;
  background-color: transparent;
  .media-collapse-order-title{
    width: 1740px;
    height: 32px;
    font-size: 27px;
    color: white;
    margin-left: 90px;
    z-index: 1000;
  }
  .media-collapse-order-content{
    width: 1920px;
    height: 130px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    .media-collapse-order-list {
      width: 1920px;
      height: 80px;
      background-color: transparent;
    }
  }
}
</style>
