<template>
  <qt-view class="filter-expand" :gradientBackground="{ colors: ['#00000000', '#10141A'], orientation: 0 }">
    <qt-list-view
      class="filter-expand-list"
      ref="listRef"
      :nextFocusName="{ up: 'topView', right: 'sidebarList' }"
      @item-focused="onItemFocused"
    >
      <qt-view class="filter-expand-list-item" :type="1" :focusable="true" eventFocus eventClick>
        <qt-text
          class="filter-expand-list-item-text"
          text="${name}"
          gravity="center|end"
          :focusable="false"
          :duplicateParentState="true"
        ></qt-text>
      </qt-view>
    </qt-list-view>
  </qt-view>
</template>

<script setup lang="ts" name="FilterExpand">
import { ref } from 'vue'
import { QTIListView } from '@quicktvui/quicktvui3'
import { primary } from '../../adapter/interface'

const emits = defineEmits(['onListItemFocused'])

const listRef = ref<QTIListView>()

function init(listData: primary[]) {
  listRef.value?.init(listData)
}

function onItemFocused(evt) {
  emits('onListItemFocused', evt)
}

defineExpose({ init })
</script>

<style scoped>
.filter-expand {
  width: 210px;
  height: 960px;
  background-color: transparent;
}

.filter-expand-list {
  width: 210px;
  height: 960px;
  background-color: transparent;
}

.filter-expand-list-item {
  width: 210px;
  height: 106px;
  background-color: transparent;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  focus-background-color: white;
}

.filter-expand-list-item-text {
  width: 179px;
  height: 106px;
  background-color: transparent;
  color: white;
  font-size: 36px;
  focus-color: #13161b;
}
</style>
