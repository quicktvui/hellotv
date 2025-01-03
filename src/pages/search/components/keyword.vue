<template>
  <qt-view class="search-keyword">
    <qt-list-view
      class="search-keyword-list"
      ref="listRef"
      name="keywordList"
      :padding="'0,72,0,0'"
      :singleSelectPosition="1"
      @item-focused="onListItemFocused"
    >
      <!-- 标题 -->
      <qt-view :type="1" class="search-keyword-list-item" :focusable="false">
        <qt-text class="search-keyword-list-item-text" style="color: white; font-size: 40px" autoWidth autoHeight text="${text}"></qt-text>
      </qt-view>
      <!-- 普通文本 -->
      <qt-view :type="2" class="search-keyword-list-item" :focusable="true" eventFocus eventClick>
        <qt-text
          class="search-keyword-list-item-text"
          autoWidth
          autoHeight
          text="${text}"
          gravity="center"
          :showOnState="['normal', 'selected']"
          :lines="1"
          :ellipsizeMode="4"
          :focusable="false"
          :duplicateParentState="true"
        ></qt-text>
        <qt-text
          class="search-keyword-list-item-text"
          autoWidth
          autoHeight
          text="${text}"
          typeface="bold"
          gravity="center"
          showOnState="focused"
          :lines="1"
          :ellipsizeMode="4"
          :focusable="false"
          :duplicateParentState="true"
        ></qt-text>
      </qt-view>
    </qt-list-view>
  </qt-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useESToast } from '@extscreen/es3-core'
import { QTIListView } from '@quicktvui/quicktvui3'
import { Keyword } from '../adapter/interface'

const emits = defineEmits(['searchByKeyword'])

const toast = useESToast()
const listRef = ref<QTIListView>()

function init(keywords: Keyword[]) {
  listRef.value?.init(keywords)
}

let lastFocusPos = 0
function onListItemFocused(evt) {
  if (evt.isFocused && evt.position != lastFocusPos) {
    lastFocusPos = evt.position
    emits('searchByKeyword', evt.item.text)
  }
}

defineExpose({ init })
</script>

<style scoped lang="scss">
.search-keyword {
  width: 518px;
  height: 1080px;
  background-color: transparent;
}

.search-keyword-list {
  width: 518px;
  height: 1080px;
  background-color: transparent;
}

.search-keyword-list-item {
  width: 518px;
  height: 84px;
  background-color: transparent;
  justify-content: center;
  border-radius: 8px;
  focus-background-color: $gl-theme-btn-bg-focus-color;
}

.search-keyword-list-item-text {
  position: absolute;
  left: 80px;
  color: $text-normal-color;
  font-size: 36px;
  focus-color: $text-focus-color;
  select-color: $text-select-color;
}
</style>
