<template>
  <qt-view class="filter-extend" :gradientBackground="{ colors: ['#00000000', '#10141A'], orientation: 0 }">
    <qt-list-view
      class="filter-extend-list"
      ref="listRef"
      :nextFocusName="{ up: 'topView', right: 'sidebarList' }"
      @item-focused="onItemFocused"
    >
      <qt-view class="filter-extend-list-item" :type="1" :focusable="true" eventFocus eventClick>
        <qt-text
          class="filter-extend-list-item-text"
          text="${name}"
          gravity="center|end"
          :focusable="false"
          :duplicateParentState="true"
        ></qt-text>
      </qt-view>
    </qt-list-view>
  </qt-view>
</template>

<script setup lang="ts" name="FilterExtend">
import { ref } from 'vue'
import { QTIListView } from '@quicktvui/quicktvui3'

const emits = defineEmits(['onListItemFocused'])

const listRef = ref<QTIListView>()

function init() {
  listRef.value?.init([
    { type: 1, name: '番剧' },
    { type: 1, name: '电影' },
    { type: 1, name: '纪录片' },
    { type: 1, name: '国创' },
    { type: 1, name: '电视剧' },
    { type: 1, name: '综艺' }
  ])
}

function onItemFocused(evt) {
  emits('onListItemFocused', evt)
}

defineExpose({ init })
</script>

<style scoped>
.filter-extend {
  width: 210px;
  height: 960px;
  background-color: transparent;
}

.filter-extend-list {
  width: 210px;
  height: 960px;
  background-color: transparent;
}

.filter-extend-list-item {
  width: 210px;
  height: 106px;
  background-color: transparent;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  focus-background-color: white;
}

.filter-extend-list-item-text {
  width: 179px;
  height: 106px;
  background-color: transparent;
  color: white;
  font-size: 36px;
  focus-color: #13161b;
}
</style>
