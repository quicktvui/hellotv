<template>
  <qt-column class="qt-collapse-item-order" :focusable="false">
    <span class="qt-collapse-item-order-title"
          :style="{ opacity: isCollapseExpand ? 1 : 0.5 }">播放顺序</span>
    <div class="qt-collapse-item-order-content"
         :clipChildren="false"
         :style="{ opacity: isCollapseExpand ? 1 : 0 }">
      <qt-list-view
        ref="orderListViewRef" horizontal
        :autofocusPosition="selectedIndex"
        sid='collapse-item-order'
        v-show='isCollapseExpand'
        class="qt-collapse-item-order-content-list"
        @item-focused="onItemFocused"
        @item-click="onItemClicked">
        <media-collapse-list-item type="1"/>
      </qt-list-view>
    </div>
  </qt-column>
</template>

<script lang="ts">

import { defineComponent } from "@vue/runtime-core";
import { ESLogLevel, useESLog } from "@extscreen/es3-core";
import { ref } from "vue";
import media_collapse_list_item from "./media-collapse-list-item.vue";
import { QTIListView, QTListViewItem } from "@quicktvui/quicktvui3";

const TAG = 'QTCollapseItem'

export default defineComponent({
  name: "media-collapse-order",
  emits: ['onCollapseItemFocused'],
  components: {
    'media-collapse-list-item': media_collapse_list_item
  },
  setup(props, context) {
    const log = useESLog()
    const isCollapseExpand = ref<boolean>(false)
    const orderListViewRef = ref<QTIListView>()

    let itemDataList: Array<QTListViewItem>
    const selectedIndex = ref<number>(0)

    function onCollapseItemExpand(value: boolean) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onCollapseItemExpand-----播放顺序--->>>>>", value)
      }
      isCollapseExpand.value = value
      if (value) {
        setItemFocused(selectedIndex.value)
      }
    }

    function onItemFocused(e) {
      let focused = e.isFocused;
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onCollapseItemFocused-----播放顺序--->>>>>", focused)
      }
      context.emit('onCollapseItemFocused', focused)
    }

    function onItemClicked(e) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-------onCollapseItemClicked-----播放顺序-->>>>', e)
      }
      context.emit('onCollapseItemClicked', e.position, e.item)
    }

    function setListData(dataList: Array<QTListViewItem>) {
      itemDataList = dataList;
      orderListViewRef.value?.setListData(dataList)
    }

    function setItemFocused(position: number): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-------setItemFocused---播放顺序---->>>>', position)
      }
      selectedIndex.value = position
      if (!isCollapseExpand.value) {
        return
      }
      // orderListViewRef.value?.setItemFocused(position)
    }

    function setItemSelected(position: number): void {
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
          orderListViewRef.value?.updateItem(i, item)
        }
      }
    }

    return {
      isCollapseExpand,
      onCollapseItemExpand,
      onItemFocused,
      onItemClicked,
      orderListViewRef,
      //
      setListData,
      setItemFocused,
      setItemSelected,
      selectedIndex
    }
  },
});

</script>

<style scoped>
.qt-collapse-item-order {
  width: 1920px;
  height: 160px;
  background-color: transparent;
}

.qt-collapse-item-order-title {
  width: 1740px;
  height: 32px;
  font-size: 27px;
  color: white;
  margin-left: 90px;
}

.qt-collapse-item-order-content {
  width: 1920px;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qt-collapse-item-order-content-list {
  width: 1920px;
  height: 80px;
  background-color: transparent;
}
</style>
