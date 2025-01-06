<template>
  <qt-view class="search-content">
    <!-- 提示 -->
    <qt-text class="search-content-tips" :text="tips" gravity="center|start"></qt-text>
    <!-- 内容 -->
    <qt-tabs
      ref="tabRef"
      tabNavBarClass="search-content-tab"
      tabPageClass="search-content-tab-page"
      :autoHandleBackKey="true"
      :contentNextFocus="{ left: 'keywordList' }"
      @onTabPageLoadData="onTabPageLoadData"
    >
      <!-- Tab -->
      <template v-slot:tab-item>
        <qt-view class="search-content-tab-item" :type="1" :focusable="true">
          <qt-text
            class="search-content-tab-item-text"
            autoWidth
            text="${text}"
            gravity="center|start"
            :focusable="false"
            :duplicateParentState="true"
          ></qt-text>
        </qt-view>
      </template>
      <!-- Content -->
      <template v-slot:waterfall-item>
        <!-- 横图 -->
        <qt-view class="search-content-item-h" :type="1" :focusable="true" layout="${layout}">
          <qt-image
            class="search-content-item-img-h"
            src="${cover}"
            :postDelay="100"
            :enableFocusBorder="true"
            :focusable="false"
            :duplicateParentState="true"
          ></qt-image>
          <qt-text
            class="search-content-item-text"
            style="width: 410px"
            text="${title}"
            gravity="center|start"
            :lines="1"
            :ellipsizeMode="4"
            :focusable="false"
            :duplicateParentState="true"
          ></qt-text>
        </qt-view>
        <!-- 竖图 -->
        <qt-view class="search-content-item-v" :type="2" :focusable="true" layout="${layout}">
          <qt-image
            class="search-content-item-img-v"
            src="${cover}"
            :postDelay="100"
            :enableFocusBorder="true"
            :focusable="false"
            :duplicateParentState="true"
          ></qt-image>
          <qt-text
            class="search-content-item-text"
            style="width: 260px"
            text="${title}"
            gravity="center"
            :lines="1"
            :ellipsizeMode="4"
            :focusable="false"
            :duplicateParentState="true"
          ></qt-text>
        </qt-view>
      </template>
    </qt-tabs>
  </qt-view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useESToast } from '@extscreen/es3-core'
import { QTITab, QTTabPageState } from '@quicktvui/quicktvui3'
import { buildTab, buildContents } from '../adapter/index'
import searchManager from '../../../api/search/index'

const props = defineProps({
  keyword: {
    type: String,
    default: ''
  }
})
const toast = useESToast()
const tabRef = ref<QTITab>()
const tips = ref<string>('')
const rawKeyword = ref<string>()

watch(
  () => props.keyword,
  () => {
    tips.value = `全部“${props.keyword}”结果`
    init(props.keyword)
  }
)

function init(keyword: string) {
  rawKeyword.value = keyword
  // 初始化组件
  searchManager.getContents(keyword).then(() => {
    tabRef.value?.initTab(buildTab())
    tabRef.value?.initPage({ width: 1920, height: 1080 })
  })
}

function onTabPageLoadData(pageIndex: number, pageNo: number, useDiff: boolean) {
  searchManager.getContents(rawKeyword.value, ++pageNo).then((contents) => {
    tabRef.value?.setPageData(pageIndex, { data: buildContents(contents) })
  })
  tabRef.value?.setPageState(pageIndex, QTTabPageState.QT_TAB_PAGE_STATE_COMPLETE)
}
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
  margin-top: 85px;
  margin-left: 80px;
  color: white;
  font-size: 40px;
}

.search-content-tab {
  height: 0px;
  background-color: transparent;
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
  background-color: transparent;
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
  background-color: transparent;
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
