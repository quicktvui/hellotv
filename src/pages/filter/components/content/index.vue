<template>
  <qt-view class="filter-main">
    <!-- 筛选条件 -->
    <qt-view class="filter-main-conditions">
      <qt-list-view class="filter-main-conditions-list" ref="listRef"></qt-list-view>
    </qt-view>
    <!-- 筛选内容 -->
    <qt-view class="filter-main-contents">
      <qt-grid-view class="filter-main-contents-grid" ref="gridRef" :spanCount="5" :padding="'80,40,80,0'">
        <!-- 横图 -->
        <grid-item-h :type="1" />
        <!-- 竖图 -->
        <grid-item-v :type="2" />
      </qt-grid-view>
    </qt-view>
  </qt-view>
</template>

<script setup lang="ts" name="FilterBodyContent">
import { ref } from 'vue'
import { QTIListView, QTIGridView } from '@quicktvui/quicktvui3'
import GridItemH from './grid-item-h.vue'
import GridItemV from './grid-item-v.vue'

const listRef = ref<QTIListView>()
const gridRef = ref<QTIGridView>()

function init() {
  // 初始化筛选条件

  // 初始化筛选结果
  const gridData: any[] = []
  for (let i = 1; i <= 100; i++) {
    gridData.push({
      type: 1,
      title: '穿正南的恶魔' + i,
      subTitle: '看至 80%',
      cover: 'https://extcdn.hsrc.tv/channelzero_image/2024/10/29/1d4243a7-ae97-411a-a2f6-8c0d6519ab2a.jpg',
      decoration: { bottom: 40 }
    })
  }
  gridRef.value?.init(gridData)
}

defineExpose({ init })
</script>

<style scoped>
.filter-main {
  width: 1920px;
  height: 960px;
  background-color: transparent;
}

.filter-main-conditions {
  background-color: transparent;
}

.filter-main-conditions-list {
  background-color: transparent;
}

.filter-main-contents {
  width: 1920px;
  height: 960px;
  background-color: transparent;
}

.filter-main-contents-grid {
  width: 1920px;
  height: 960px;
  background-color: transparent;
}
</style>
