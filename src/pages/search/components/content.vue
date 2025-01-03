<template>
  <qt-view class="search-content">
    <qt-tabs
      ref="tabRef"
      tabNavBarClass="search-content-tab"
      tabPageClass="search-content-tab-page"
      :clipChildren="false"
      @onTabPageLoadData="onTabPageLoadData"
    >
      <!-- Tab -->
      <template v-slot:tab-item>
        <qt-view class="search-content-tab-item" :type="1" :focusable="true">
          <qt-text
            class="search-content-tab-item-text"
            autoWidth
            text="${text}"
            gravity="center"
            :focusable="false"
            :duplicateParentState="true"
          ></qt-text>
        </qt-view>
      </template>
      <!-- Content -->
      <template v-slot:waterfall-item>
        <!-- 横图 -->
        <qt-view class="search-content-item-h" :type="1" :focusable="true" layout="${layout}">
          <qt-image class="search-content-item-img-h"></qt-image>
          <qt-text
            class="search-content-item-text"
            autoWidth
            text="${title}"
            gravity="center"
            :focusable="false"
            :duplicateParentState="true"
          ></qt-text>
        </qt-view>
        <!-- 竖图 -->
        <qt-view class="search-content-item-v" :type="2" :focusable="true" layout="${layout}">
          <qt-image class="search-content-item-img-v"></qt-image>
          <qt-text
            class="search-content-item-text"
            autoWidth
            text="${title}"
            gravity="center"
            :focusable="false"
            :duplicateParentState="true"
          ></qt-text>
        </qt-view>
      </template>
    </qt-tabs>
  </qt-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useESToast } from '@extscreen/es3-core'
import { QTITab, QTWaterfallSectionType, QTTabPageState } from '@quicktvui/quicktvui3'

const toast = useESToast()
const tabRef = ref<QTITab>()

function init() {
  tabRef.value?.initTab({
    defaultIndex: 0,
    defaultFocusIndex: -1,
    itemList: [
      { type: 1, text: '全部', titleSize: 36, decoration: { left: 62 } },
      { type: 1, text: '影视综合', titleSize: 36 },
      { type: 1, text: '小视频', titleSize: 36 }
    ]
  })
  tabRef.value?.initPage({ width: 1920, height: 1080 })
}

function onTabPageLoadData(pageIndex: number, pageNo: number, useDiff: boolean) {
  toast.showToast(`${pageIndex}-${pageNo}-${useDiff}`)

  tabRef.value?.setPageData(pageIndex, {
    data: [
      {
        _id: 't1',
        type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_FLEX,
        style: { width: 1920 },
        decoration: { left: 80 },
        title: '绘本',
        titleStyle: { height: 50, fontSize: 40 },
        itemList: [
          { _id: 't1-1', type: 1, style: { width: 410, height: 276 }, decoration: { top: 40, right: 40 }, title: '哈哈哈' },
          { _id: 't1-2', type: 1, style: { width: 410, height: 276 }, decoration: { top: 40, right: 40 }, title: '哈哈哈' },
          { _id: 't1-3', type: 1, style: { width: 410, height: 276 }, decoration: { top: 40, right: 40 }, title: '哈哈哈' },
          { _id: 't1-4', type: 1, style: { width: 410, height: 276 }, decoration: { top: 40, right: 40 }, title: '哈哈哈' },
          { _id: 't1-5', type: 1, style: { width: 410, height: 276 }, decoration: { top: 40, right: 40 }, title: '哈哈哈' },
          { _id: 't1-6', type: 1, style: { width: 410, height: 276 }, decoration: { top: 40, right: 40 }, title: '哈哈哈' }
        ]
      },
      {
        _id: 't2',
        type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_FLEX,
        style: { width: 1920 },
        decoration: { top: 40, left: 80, bottom: 250 },
        title: '大家都在搜',
        titleStyle: { height: 50, fontSize: 40 },
        itemList: [
          { _id: 't2-1', type: 2, style: { width: 260, height: 414 }, decoration: { top: 40, right: 40 }, title: '哈哈哈' },
          { _id: 't2-2', type: 2, style: { width: 260, height: 414 }, decoration: { top: 40, right: 40 }, title: '哈哈哈' },
          { _id: 't2-3', type: 2, style: { width: 260, height: 414 }, decoration: { top: 40, right: 40 }, title: '哈哈哈' },
          { _id: 't2-4', type: 2, style: { width: 260, height: 414 }, decoration: { top: 40, right: 40 }, title: '哈哈哈' },
          { _id: 't2-5', type: 2, style: { width: 260, height: 414 }, decoration: { top: 40, right: 40 }, title: '哈哈哈' },
          { _id: 't2-6', type: 2, style: { width: 260, height: 414 }, decoration: { top: 40, right: 40 }, title: '哈哈哈' }
        ]
      }
    ]
  })
  tabRef.value?.setPageState(pageIndex, QTTabPageState.QT_TAB_PAGE_STATE_COMPLETE)
}

defineExpose({ init })
</script>

<style lang="scss">
.search-content {
  width: 1920px;
  height: 1080px;
  background-color: transparent;
}

.search-content-tips {
  width: 1920px;
  height: 50px;
  background-color: transparent;
  margin-top: 75px;
  margin-left: 80px;
  color: white;
  font-size: 40px;
}

.search-content-tab {
  width: 1920px;
  height: 60px;
  background-color: transparent;
  margin-top: 85px;
}

.search-content-tab-page {
  width: 1920px;
  height: 1080px;
  background-color: transparent;
  margin-top: 40px;
}

.search-content-tab-item {
  height: 60px;
  background-color: transparent;
  border-radius: 30px;
  focus-background-color: $gl-theme-btn-bg-focus-color;
}

.search-content-tab-item-text {
  height: 60px;
  background-color: transparent;
  margin-left: 18px;
  margin-right: 18px;
  color: $text-normal-color;
  font-size: 36px;
  focus-color: $text-focus-color;
  select-color: $text-select-color;
}

.search-content-item-h {
  width: 410px;
  height: 276px;
  background-color: transparent;
  border-radius: 16px;
}

.search-content-item-img-h {
  width: 410px;
  height: 230px;
  background-color: red;
}

.search-content-item-v {
  width: 260px;
  height: 414px;
  background-color: transparent;
  border-radius: 16px;
}

.search-content-item-img-v {
  width: 260px;
  height: 368px;
  background-color: red;
}

.search-content-item-text {
  height: 40px;
  background-color: transparent;
  margin-top: 11px;
  color: $text-normal-color;
  font-size: 30px;
  focus-color: white;
}
</style>
