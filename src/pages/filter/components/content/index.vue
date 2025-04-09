<template>
  <qt-view class="filter-main" :style="{ width: contentWidth }" :focusable="false">
    <scroll-view class="filter-main-scroll" ref="scrollRef" :focusable="false" :onScrollEnable="true" makeChildVisibleType="none">
      <qt-view v-show="!isLoading" style="background-color: transparent" :clipChildren="true">
        <!-- 筛选条件 -->
        <qt-view v-if="showConditions" class="filter-main-conditions">
          <qt-list-view
            class="filter-main-conditions-list"
            :style="{ height: listHeight }"
            ref="listRef"
            name="contentList"
            :padding="'56,0,40,0'"
            :enableSelectOnFocus="false"
            @item-focused="onListItemFocused"
          >
            <list-item :type="TertiaryType.LIST" :width="contentWidth" :height="listRowHeight" @onListItemClick="onListItemClick" />
          </qt-list-view>
        </qt-view>
        <!-- 筛选内容 -->
        <qt-view class="filter-main-contents" :descendantFocusability="gridDeny">
          <qt-grid-view
            class="filter-main-contents-grid"
            :style="{ width: contentWidth }"
            ref="gridRef"
            name="contentGrid"
            :listData="gridData"
            :spanCount="cfgGridSpanCount"
            :padding="cfgGridItemMode === 1 ? '80,17,40,0' : '80,17,0,0'"
            :clipChildren="false"
            :autofocusPosition="isInit ? 0 : -1"
            :enablePlaceholder="true"
            :nextFocusName="{ left: 'sidebarList' }"
            :nextFocusUpSID="'--sid--'"
            :blockFocusDirections="['right', 'down']"
            :openPage="true"
            :listenBoundEvent="true"
            :listenHasFocusChange="true"
            :loadMore="onGridLoadMore"
            @item-click="onGridItemClick"
            @item-focused="onGridItemFocused"
            @scroll-state-changed="onGridScrollStateChanged"
          >
            <!-- 横图 -->
            <grid-item-h
              :type="GridContentType.HORIZONTAL"
              :width="gridItemHWidth"
              :height="gridItemHHeight"
              :imgHeight="gridItemHImgHeight"
            />
            <!-- 竖图 -->
            <grid-item-v :type="GridContentType.VERTICAL" />
            <!-- 到底提示 -->
            <template #footer>
              <qt-text
                :type="1003"
                :style="{ width: `${contentWidth - 150}px`, height: `100px`, color: 'rgba(255,255,255,0.55)', fontSize: `28px` }"
                text="已经到底啦，按【返回键】回到顶部"
                gravity="center"
                :focusable="false"
              ></qt-text>
            </template>
          </qt-grid-view>
        </qt-view>
      </qt-view>
    </scroll-view>

    <!-- 筛选条件记录 -->
    <qt-view
      :visible="showRecords"
      class="filter-main-conditions-record"
      :style="{ width: contentWidth, height: listRowHeight }"
      :gradientBackground="{ colors: ['#1A2029', '#161B24'], orientation: 0 }"
    >
      <qt-list-view :style="{ height: listRowHeight }" ref="recordListRef" horizontal :padding="'80,0,40,0'">
        <list-item-record :type="1" />
      </qt-list-view>
    </qt-view>

    <!-- 暂无数据 -->
    <qt-view v-if="isEmpty" class="filter-main-box" :style="{ width: contentWidth, marginTop: listHeight / 2 }">
      <qt-image class="filter-main-box-img" :src="icEmpty"></qt-image>
      <qt-text class="filter-main-box-text" text="暂无数据" gravity="center"></qt-text>
    </qt-view>

    <!-- 全屏loading -->
    <qt-view
      v-if="isLoading"
      class="filter-main-box"
      :style="{ width: contentWidth }"
      :gradientBackground="{ colors: ['#1A2029', '#00040B'], orientation: 0 }"
    >
      <qt-loading-view style="height: 100px; width: 100px" color="rgba(21,122,252,0.3)" :focusable="false"></qt-loading-view>
    </qt-view>
  </qt-view>
</template>

<script setup lang="ts" name="FilterContent">
import { ref, nextTick } from 'vue'
import { ESIScrollView } from '@extscreen/es3-component'
import { qtRef, QTIListView, QTListViewItem, QTIGridView } from '@quicktvui/quicktvui3'
import { buildContents, getContentsQuery, shouldAddEndSection } from '../../adapter/index'
import { Tertiary, TertiaryType, GridContentType } from '../../adapter/interface'
import icEmpty from '../../../../assets/filter/ic_empty.png'
import ListItem from './list-item.vue'
import ListItemRecord from './list-item-record.vue'
import GridItemH from './grid-item-h.vue'
import GridItemV from './grid-item-v.vue'
import config from '../../config'
import filterManager from '../../api/index'
import launch from '../../../../tools/launch'

const emits = defineEmits(['setNextFocusNameRight'])

// 配置文件
const cfgGridItemMode = ref<number>(config.gridItemMode)
const cfgGridSpanCount = ref<number>(config.gridSpanCount)
const cfgGridContentLimit = ref<number>(config.gridContentLimit)

const scrollRef = ref<ESIScrollView>()
const contentWidth = ref<number>(
  (cfgGridItemMode.value === 1 && cfgGridSpanCount.value === 4) || (cfgGridItemMode.value === 2 && cfgGridSpanCount.value === 5)
    ? 1580
    : 1920
)
const isInit = ref<boolean>(true)
const isLoading = ref<boolean>(false)
const isEmpty = ref<boolean>(false)
// 筛选条件
const listRef = ref<QTIListView>()
const listHeight = ref<number>(330)
const listRowHeight = ref<number>(66)
const showConditions = ref<boolean>(false)
// 筛选条件记录
const recordListRef = ref<QTIListView>()
const showRecords = ref<boolean>(false)
// 筛选结果
const gridRef = ref<QTIGridView>()
const gridDeny = ref<number>(1)
const gridData = qtRef()
const gridScrollY = ref<number>(0)
const gridItemHWidth = ref<number>(cfgGridSpanCount.value === 5 ? 320 : 325)
const gridItemHHeight = ref<number>(cfgGridSpanCount.value === 5 ? 229 : 226)
const gridItemHImgHeight = ref<number>(cfgGridSpanCount.value === 5 ? 180 : 183)

// 页码
let page = 1
// 初始参数
let rawParams: any = {}
// 请求参数
let reqQuery: string = ''
// 筛选条件
let listDateRef: QTListViewItem[] = []

function init(primaryId: string, listData: Tertiary[], defaultSecondaryId?: string) {
  // 保存筛选数据
  rawParams = { primaryId, listData, defaultSecondaryId }
  // 加载筛选内容
  if (defaultSecondaryId !== undefined && defaultSecondaryId != '') {
    loadContents(defaultSecondaryId || '', false, true)
  } else {
    loadContents(reqQuery, listData.length > 0)
  }
}

function onListItemFocused(evt) {
  if (evt.isFocused) {
    emits('setNextFocusNameRight', 'contentList')
    showRecords.value = false
    gridScrollY.value = 0
    gridRef.value?.scrollToSelected(0, true)
    scrollRef.value?.scrollToWithOptions(0, 0, 300)
  }
}

let lastParentPosition = 0
let lastCurentPosition = 0
function onListItemClick(evt) {
  // 屏蔽内容区域焦点
  gridDeny.value = 2

  // 点击相同条件不触发
  if (evt.parentPosition === lastParentPosition && evt.position === lastCurentPosition) {
    return
  }

  lastParentPosition = evt.parentPosition
  lastCurentPosition = evt.position

  // 更新选中状态
  listDateRef[lastParentPosition].defaultSelectedPos = lastCurentPosition
  // 记录选中条件
  rawParams.listData[lastParentPosition].defaultSelectedPos = lastCurentPosition
  // 重新获取筛选结果
  loadContents(getContentsQuery(rawParams.listData).join(','))
}

function onGridItemClick(evt) {
  launch.launchDetail(evt.item.id)
}

function onGridItemFocused(evt) {
  if (evt.isFocused) {
    emits('setNextFocusNameRight', 'contentGrid')

    isInit.value = false
    if (evt.position >= cfgGridSpanCount.value) {
      if (gridScrollY.value === 0) {
        // 筛选记录
        const records = getContentsQuery(rawParams.listData).map((item) => ({ type: 1, text: item, decoration: { top: 10, right: 30 } }))
        if (records.length > 0) {
          showRecords.value = true
          recordListRef.value?.init(records)
        }
        scrollRef.value?.scrollToWithOptions(0, listHeight.value - (showRecords.value ? listRowHeight.value : 0), 300)
        gridScrollY.value = 1
      }
    } else {
      showRecords.value = false
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

let ininConditionTimer: any = -1
let loadingTimer: any = -1
/**
 * 加载筛选内容
 * @param query 查询参数
 * @param resetFilters 是否需要重新初始化筛选条件组件
 * @param hideFilters 是否需要隐藏筛选条件组件
 */
function loadContents(query: string, resetFilters?: boolean, hideFilters?: boolean) {
  isEmpty.value = false
  showRecords.value = false
  gridScrollY.value = 0
  scrollRef.value?.scrollToWithOptions(0, 0, 300)

  if (resetFilters) {
    isLoading.value = true
    // 计算筛选列表高度
    listHeight.value = rawParams.listData.length * listRowHeight.value
    // 初始化筛选条件
    showConditions.value = false
    clearTimeout(ininConditionTimer)
    ininConditionTimer = setTimeout(() => {
      showConditions.value = true
      nextTick(() => {
        listDateRef = listRef.value?.init(rawParams.listData) as QTListViewItem[]
      })
    }, 300)
  } else if (hideFilters) {
    listHeight.value = 0
    isLoading.value = true
    showConditions.value = false
  }

  // 重置页码
  page = 1
  // 重置查询参数
  reqQuery = resetFilters ? getContentsQuery(rawParams.listData).join(',') : query
  // 请求数据
  filterManager.getContents(rawParams.primaryId, reqQuery, page, cfgGridContentLimit.value).then((contents) => {
    gridRef.value?.scrollToTop()
    gridData.value = buildContents(contents)

    clearTimeout(loadingTimer)
    loadingTimer = setTimeout(() => {
      isLoading.value = false
      if (gridData.value.length === 0) {
        emits('setNextFocusNameRight', showConditions.value ? 'contentList' : '')
        isEmpty.value = true
      } else {
        emits('setNextFocusNameRight', 'contentGrid')
        isEmpty.value = false
        gridDeny.value = 1
        gridRef.value?.setItemSelected(0, true)
      }
    }, 300)
  })
}

// 函数本身返回的页码有问题, 不要用
function onGridLoadMore() {
  // 初始化筛选内容
  filterManager.getContents(rawParams.primaryId, reqQuery, ++page, cfgGridContentLimit.value).then((contents) => {
    const data = buildContents(contents)
    gridData.value.push(...data)
    // 停止分页
    if (data.length < cfgGridContentLimit.value) {
      if (shouldAddEndSection(showConditions.value, gridData.value.length)) {
        gridData.value.push({ type: 1003, decoration: { bottom: showConditions.value && reqQuery.length > 0 ? 100 : 30 } })
      }
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

<style scoped lang="scss" src="../../scss/filter-content.scss"></style>
