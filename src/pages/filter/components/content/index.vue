<template>
  <qt-view class="filter-main">
    <scroll-view class="filter-main-scroll" ref="scrollRef" :onScrollEnable="true" makeChildVisibleType="none">
      <qt-view style="background-color: transparent" :clipChildren="true">
        <!-- 筛选条件 -->
        <qt-view v-show="showConditions" class="filter-main-conditions">
          <qt-list-view
            class="filter-main-conditions-list"
            :style="{ height: listHeight }"
            ref="listRef"
            :padding="'80,0,40,0'"
            :enableSelectOnFocus="false"
          >
            <list-item :type="1" :width="contentWidth" :height="cfgListRowHeight" @onListItemClick="onListItemClick" />
          </qt-list-view>
        </qt-view>
        <!-- 筛选内容 -->
        <qt-view class="filter-main-contents">
          <qt-grid-view
            class="filter-main-contents-grid"
            :style="{ width: contentWidth }"
            ref="gridRef"
            name="contentGrid"
            :listData="gridData"
            :spanCount="cfgGridSpanCount"
            :padding="'80,17,40,0'"
            :clipChildren="false"
            :autofocusPosition="isInit ? 0 : -1"
            :enablePlaceholder="false"
            :blockFocusDirections="['down']"
            :openPage="true"
            :listenBoundEvent="true"
            :loadMore="onGridLoadMore"
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
import { qtRef, QTIListView, QTListViewItem, QTIGridView } from '@quicktvui/quicktvui3'
import { buildContents } from '../../adapter/index'
import { tertiary } from '../../adapter/interface'
import ListItem from './list-item.vue'
import GridItemH from './grid-item-h.vue'
import GridItemV from './grid-item-v.vue'
import config from '../../config'
import filterManager from '../../../../api/filter/index'

// 配置文件
const cfgListRowHeight = ref<number>(config.listRowHeight)
const cfgGridSpanCount = ref<number>(config.gridSpanCount)
const cfgGridContentLimit = ref<number>(config.gridContentLimit)

const toast = useESToast()
const scrollRef = ref<ESIScrollView>()
const contentWidth = ref<number>(cfgGridSpanCount.value === 5 ? 1920 : 1580)
const isInit = ref<boolean>(true)
// 筛选条件
const listRef = ref<QTIListView>()
const listHeight = ref<number>(330)
const showConditions = ref<boolean>(false)
// 筛选结果
const gridRef = ref<QTIGridView>()
const gridData = qtRef()
const gridScrollY = ref<number>(0)
const gridItemHWidth = ref<number>(cfgGridSpanCount.value === 5 ? 320 : 325)
const gridItemHHeight = ref<number>(cfgGridSpanCount.value === 5 ? 229 : 226)
const gridItemHImgHeight = ref<number>(cfgGridSpanCount.value === 5 ? 180 : 183)

// 全局页码
let page = 1
// 筛选条件
let listDateRef: QTListViewItem[] = []

function init(listData: tertiary[]) {
  showConditions.value = listData.length > 0
  // 计算筛选列表高度
  listHeight.value = listData.length * cfgListRowHeight.value
  // 初始化筛选条件
  listDateRef = listRef.value?.init(listData) as QTListViewItem[]
  // 初始化筛选内容
  loadContents(showConditions.value)
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
    isInit.value = false
    if (evt.position >= cfgGridSpanCount.value) {
      scrollRef.value?.scrollToWithOptions(0, listHeight.value, 300)
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

// 首次加载筛选内容
function loadContents(b: boolean, query?: string) {
  page = 1 // 重置页码
  showConditions.value = b
  filterManager.getContents(query, page, cfgGridContentLimit.value).then((contents) => {
    gridData.value = buildContents(contents)
    // TODO: 展示图片
    if (gridData.value.length === 0) {
      toast.showToast('暂无数据')
    }
  })
}

// 函数本身返回的页码有问题, 不要用
function onGridLoadMore() {
  // 初始化筛选内容
  filterManager.getContents('', ++page, cfgGridContentLimit.value).then((contents) => {
    const data = buildContents(contents)
    gridData.value.push(...data)
    // 停止分页
    if (data.length < cfgGridContentLimit.value) {
      gridRef.value?.stopPage()
    }
  })
}

function onBackPressed(): boolean {
  if (gridScrollY.value > 0) {
    gridRef.value?.scrollToFocused(0)
    return false
  }
  return true
}

defineExpose({ init, loadContents, onBackPressed })
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
  background-color: transparent;
  margin-bottom: 15px;
}

.filter-main-conditions-list {
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
