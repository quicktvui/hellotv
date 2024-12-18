<template>
  <qt-view class="filter-main">
    <scroll-view class="filter-main-scroll" ref="scrollRef" :onScrollEnable="true" makeChildVisibleType="none">
      <qt-view style="background-color: transparent" :clipChildren="true">
        <!-- 筛选条件 -->
        <qt-view class="filter-main-conditions">
          <qt-list-view class="filter-main-conditions-list" ref="listRef" :padding="'80,0,40,0'" :enableSelectOnFocus="false">
            <list-item :type="1" :width="contentWidth" @onListItemClick="onListItemClick" />
          </qt-list-view>
        </qt-view>
        <!-- 筛选内容 -->
        <qt-view class="filter-main-contents">
          <qt-grid-view
            class="filter-main-contents-grid"
            :style="{ width: contentWidth }"
            ref="gridRef"
            name="contentGrid"
            :spanCount="cfgSpanCount"
            :padding="'80,17,40,0'"
            :clipChildren="false"
            :autofocusPosition="0"
            :enablePlaceholder="false"
            :blockFocusDirections="['down']"
            @item-click="onGridItemClick"
            @item-focused="onGridItemFocused"
            @scroll-state-changed="onGridScrollStateChanged"
          >
            <!-- 横图 -->
            <grid-item-h :type="1" :width="gridItemHWidth" :height="gridItemHHeight" :imgHeight="gridItemHImgHeight" />
            <!-- 竖图 -->
            <grid-item-v :type="2" />
          </qt-grid-view>
        </qt-view>
      </qt-view>
    </scroll-view>
  </qt-view>
</template>

<script setup lang="ts" name="FilterContent">
import { ref } from 'vue'
import { useESToast } from '@extscreen/es3-core'
import { ESIScrollView } from '@extscreen/es3-component'
import { QTIListView, QTListViewItem, QTIGridView } from '@quicktvui/quicktvui3'
import ListItem from './list-item.vue'
import GridItemH from './grid-item-h.vue'
import GridItemV from './grid-item-v.vue'
import config from '../../config'

// 配置文件
const cfgSpanCount = ref<number>(config.gridSpanCount)

const toast = useESToast()
const scrollRef = ref<ESIScrollView>()
const contentWidth = ref<number>(cfgSpanCount.value === 5 ? 1920 : 1580)
// 筛选条件
const listRef = ref<QTIListView>()
// 筛选结果
const gridRef = ref<QTIGridView>()
const gridScrollY = ref<number>(0)
const gridItemHWidth = ref<number>(cfgSpanCount.value === 5 ? 320 : 325)
const gridItemHHeight = ref<number>(cfgSpanCount.value === 5 ? 229 : 226)
const gridItemHImgHeight = ref<number>(cfgSpanCount.value === 5 ? 180 : 183)

// 筛选条件
let listDateRef: QTListViewItem[] = []

function init() {
  // 初始化筛选条件
  const listData: any[] = []
  for (let i = 1; i <= 5; i++) {
    listData.push({
      type: 1,
      list: [
        { type: 1, text: '全部', decoration: { right: 48 } },
        { type: 1, text: '全部', decoration: { right: 36 } },
        { type: 1, text: '全部', decoration: { right: 36 } },
        { type: 1, text: '全部', decoration: { right: 36 } },
        { type: 1, text: '全部', decoration: { right: 36 } },
        { type: 1, text: '全部', decoration: { right: 36 } },
        { type: 1, text: '全部', decoration: { right: 36 } },
        { type: 1, text: '全部', decoration: { right: 36 } }
      ],
      defaultSelectedPos: 0
    })
  }
  listDateRef = listRef.value?.init(listData) as QTListViewItem[]

  // 初始化筛选结果
  const gridData: any[] = []
  for (let i = 1; i <= 100; i++) {
    gridData.push({
      type: 1,
      title: '完美世界' + i,
      cover: 'https://extcdn.hsrc.tv/channelzero_image/2024/10/29/1d4243a7-ae97-411a-a2f6-8c0d6519ab2a.jpg',
      decoration: { right: 40, bottom: 40 }
    })
  }
  gridRef.value?.init(gridData)
}

function onListItemClick(evt) {
  toast.showToast('调接口')
  // 更新选中状态
  listDateRef[evt.parentPosition].defaultSelectedPos = evt.position
}

function onGridItemClick() {
  toast.showToast('跳详情')
}

function onGridItemFocused(evt) {
  if (evt.isFocused) {
    if (evt.position >= cfgSpanCount.value) {
      scrollRef.value?.scrollToWithOptions(0, 330, 300)
      gridScrollY.value = 1
    } else {
      scrollRef.value?.scrollToWithOptions(0, 0, 300)
      gridScrollY.value = 0
    }
  }
}

function onGridScrollStateChanged(evt) {
  if (evt.newState === 0 && evt.offsetY > 0) {
    gridScrollY.value = evt.offsetY
  }
}

function onBackPressed(): boolean {
  if (gridScrollY.value > 0) {
    gridRef.value?.scrollToFocused(0)
    return false
  }
  return true
}

defineExpose({ init, onBackPressed })
</script>

<style scoped>
.filter-main {
  height: 960px;
  background-color: transparent;
}

.filter-main-scroll {
  height: 960px;
  background-color: transparent;
}

.filter-main-conditions {
  height: 330px;
  background-color: transparent;
  margin-bottom: 15px;
}

.filter-main-conditions-list {
  height: 330px;
  background-color: transparent;
}

.filter-main-contents {
  height: 960px;
  background-color: transparent;
}

.filter-main-contents-grid {
  height: 960px;
  background-color: transparent;
}
</style>
