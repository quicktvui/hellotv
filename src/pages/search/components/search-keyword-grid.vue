<template>
  <qt-view class="search-keyword">
    <qt-grid-view class="search-keyword-grid" :list-data="gridData" :spanCount="3" :padding="'70,80,0,0'" @item-click="onGridItemClick">
      <!-- 标题 -->
      <template v-slot:header>
        <qt-view :type="KeywordType.TITLE" class="search-keyword-grid-item" :focusable="false">
          <qt-text
            class="search-keyword-grid-item-text"
            style="height: 50px; color: white; font-size: 40px"
            autoWidth
            text="${text}"
            gravity="center"
            :focusable="false"
          ></qt-text>
        </qt-view>
      </template>
      <!-- 内容 -->
      <qt-view :type="KeywordType.TEXT" class="search-keyword-grid-item" :focusable="true" eventClick>
        <qt-text class="search-keyword-grid-item-text" text="${text}" :ellipsizeMode="3" :focusable="false" duplicateParentState></qt-text>
      </qt-view>
    </qt-grid-view>
  </qt-view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { qtRef, QTListViewItem } from '@quicktvui/quicktvui3'
import { buildKeywords } from '../adapter/index'
import { KeywordType } from '../adapter/interface'
import searchManager from '../../../api/search/index'
import launch from '../../../tools/launch'

const gridData = qtRef<QTListViewItem[]>()

onMounted(() => {
  searchManager.getSuggestions('all').then((suggestions) => {
    gridData.value = buildKeywords(suggestions, 'all')
  })
})

function onGridItemClick(evt) {
  launch.launchDetail(evt.item.jumpId)
}
</script>

<style scoped lang="scss">
.search-keyword {
  width: 1286px;
  height: 1080px;
  background-color: transparent;
}

.search-keyword-grid {
  width: 1286px;
  height: 1080px;
  background-color: transparent;
}

.search-keyword-grid-item {
  width: 320px;
  height: 50px;
  background-color: transparent;
  padding-left: 10px;
  border-radius: 6px;
  justify-content: center;
  focus-background-color: $gl-theme-btn-bg-focus-color;
}

.search-keyword-grid-item-text {
  width: 300px;
  height: 40px;
  background-color: transparent;
  color: $text-normal-color;
  font-size: 30px;
  focus-color: $text-focus-color;
}
</style>
