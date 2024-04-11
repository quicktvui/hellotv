<template>
  <qt-column class="qt-collapse-item-speed"
             :focusable="false">
    <span class="qt-collapse-item-speed-title"
          :style="{opacity: isCollapseExpand ? 1 : 0.5}">倍速</span>
    <div class="qt-collapse-item-speed-content"
         :clipChildren="false"
         :style="{opacity: isCollapseExpand ? 1 : 0}">
      <qt-list-view
        ref="speedListViewRef" horizontal
        :visible="isCollapseExpand"
        class="qt-collapse-item-speed-content-list"
        :autofocusPosition="selectedIndex"
        @item-focused="onItemFocused"
        @item-click="onItemClicked">
        <media-collapse-list-item type="1"/>
      </qt-list-view>
    </div>
  </qt-column>
</template>

<script lang="ts">

import {defineComponent} from "@vue/runtime-core";
import {ESLogLevel, useESLog} from "@extscreen/es3-core";
import {ref} from "vue";
import {QTIListView, QTListViewItem} from "@quicktvui/quicktvui3";
import media_collapse_list_item from "./media-collapse-list-item.vue";

const TAG = 'QTCollapseItem'
export default defineComponent({
  name: "media-collapse-speed",
  components: {
    'media-collapse-list-item': media_collapse_list_item
  },
  setup(props, context) {
    const log = useESLog()
    const isCollapseExpand = ref<boolean>(false)
    const speedListViewRef = ref<QTIListView>()
    let itemDataList: Array<QTListViewItem>

    const selectedIndex = ref<number>(0)

    function onCollapseItemExpand(value: boolean) {
      isCollapseExpand.value = value
      scrollTo(selectedIndex.value)
      if (value) {
        // setItemFocused(selectedIndex.value)
      }
    }

    function scrollTo(position: number): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '------scrollTo---倍速--->>>>', position)
      }
      speedListViewRef.value?.scrollToIndex(position)
    }

    function onItemFocused(e) {
      let focused = e.isFocused;
      context.emit('onCollapseItemFocused', focused)
    }

    function onItemClicked(e) {
      context.emit('onCollapseItemClicked', e.position, e.item)
    }

    function setListData(dataList: Array<QTListViewItem>) {
      itemDataList = dataList;
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-------setListData-----倍速-->>>>', dataList)
      }
      speedListViewRef.value?.setListData(dataList)
    }

    function setItemFocused(position: number): void {
      selectedIndex.value = position
      if (!isCollapseExpand.value) {
        return
      }
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-------setItemFocused---倍速---->>>>', position)
      }
      speedListViewRef.value?.setItemFocused(position)
    }

    function setItemSelected(position: number): void {
      selectedIndex.value = position
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-------setItemSelected---倍速---->>>>', position)
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
          speedListViewRef.value?.updateItem(i, item)
        }
      }
    }

    return {
      isCollapseExpand,
      speedListViewRef,
      onCollapseItemExpand,

      onItemClicked,
      onItemFocused,
      //
      setListData,
      setItemFocused,
      setItemSelected
    }
  },
});

</script>

<style scoped>
.qt-collapse-item-speed {
  width: 1920px;
  height: 160px;
  background-color: transparent;
}

.qt-collapse-item-speed-title {
  width: 1740px;
  height: 30px;
  font-size: 27px;
  color: white;
  margin-left: 90px;
}

.qt-collapse-item-speed-content {
  width: 1920px;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qt-collapse-item-speed-content-list {
  width: 1920px;
  height: 80px;
  background-color: transparent;
}
</style>
