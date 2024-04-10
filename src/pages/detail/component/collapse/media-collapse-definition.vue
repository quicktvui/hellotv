<template>
  <qt-column class="qt-collapse-item-definition"
             :focusable="false">
    <span class="qt-collapse-item-definition-title"
          :style="{opacity: isCollapseExpand ? 1 : 0.5}">清晰度</span>
    <div class="qt-collapse-item-definition-content"
         :clipChildren="false"
         :style="{opacity: isCollapseExpand ? 1 : 0}">
      <qt-list-view
        ref="definitionListViewRef" horizontal
        class="qt-collapse-item-content-list"
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
  name: "media-collapse-definition",
  components: {
    'media-collapse-list-item': media_collapse_list_item
  },
  setup(props, context) {
    const log = useESLog()
    const isCollapseExpand = ref<boolean>(false)
    const definitionListViewRef = ref<QTIListView>()
    let itemDataList: Array<QTListViewItem>

    let selectedIndex = 0
    let focusTimer

    function onCollapseItemExpand(value: boolean) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-------onCollapseItemExpand---清晰度---->>>>', value)
      }
      isCollapseExpand.value = value

      if (value) {
        focusTimer = setTimeout(() => {
          setItemFocused(selectedIndex)
        }, 1000)
      } else {
        if (focusTimer) {
          clearTimeout(focusTimer)
        }
      }
    }

    function onItemFocused(e) {
      let focused = e.isFocused;
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onCollapseItemFocused-----清晰度--->>>>>", focused)
      }
      context.emit('onCollapseItemFocused', focused)
    }

    function onItemClicked(e) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-------onCollapseItemClicked-----清晰度-->>>>', e)
      }
      context.emit('onCollapseItemClicked', e.position, e.item)
    }

    function setListData(dataList: Array<QTListViewItem>) {
      itemDataList = dataList;
      definitionListViewRef.value?.setListData(dataList)
    }

    function setItemFocused(position: number): void {
      selectedIndex = position
      if (!isCollapseExpand.value) {
        return
      }
      definitionListViewRef.value?.setItemFocused(position)
    }

    function setItemSelected(position: number): void {
      selectedIndex = position
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
          definitionListViewRef.value?.updateItem(i, item)
        }
      }
    }

    return {
      isCollapseExpand,
      definitionListViewRef,
      onCollapseItemExpand,

      onItemClicked,
      onItemFocused,

      setListData,
      setItemFocused,
      setItemSelected,
    }
  },
});

</script>

<style scoped>
.qt-collapse-item-definition {
  width: 1920px;
  height: 160px;
  background-color: transparent;
}

.qt-collapse-item-definition-title {
  width: 1740px;
  height: 30px;
  font-size: 27px;
  color: white;
  margin-left: 90px;
}

.qt-collapse-item-definition-content {
  width: 1920px;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qt-collapse-item-content-list {
  width: 1920px;
  height: 80px;
  background-color: transparent;
}
</style>
