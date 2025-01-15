<template>
  <qt-view class="search-keyword">
    <qt-grid-view class="search-keyword-grid" :listData="gridData" :spanCount="3" :padding="'40,80,0,0'" @item-click="onGridItemClick">
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
        <qt-text
          class="search-keyword-grid-item-text"
          style="position: absolute"
          text="${text}"
          :showOnState="['normal', 'selected']"
          :ellipsizeMode="2"
          :focusable="false"
          :duplicateParentState="true"
        ></qt-text>
        <qt-text
          class="search-keyword-grid-item-text"
          style="position: absolute"
          text="${text}"
          typeface="bold"
          :showOnState="'focused'"
          :ellipsizeMode="4"
          :focusable="false"
          :duplicateParentState="true"
        ></qt-text>
      </qt-view>
    </qt-grid-view>
  </qt-view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { qtRef, QTListViewItem } from '@quicktvui/quicktvui3'
import { buildKeywords } from '../adapter/index'
import { KeywordType } from '../adapter/interface'
import searchManager from '../api/index'
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

<style scoped lang="scss" src="../scss/search-keyword-grid.scss"></style>
