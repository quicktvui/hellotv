<template>
  <qt-view class="search-content">
    <!-- 提示 -->
    <qt-text v-if="showTips" class="search-content-tips" :text="tips" gravity="center|start" typeface="bold"></qt-text>
    <!-- 内容 -->
    <qt-tabs
      ref="tabRef"
      tabNavBarClass="search-content-tab"
      tabPageClass="search-content-tab-page"
      :autoHandleBackKey="true"
      :contentNextFocus="{ left: 'keywordList' }"
      @onTabPageLoadData="onTabPageLoadData"
      @onTabMoveToTopStart="onTabMoveToTopStart"
      @onTabMoveToBottomEnd="onTabMoveToBottomEnd"
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
import { QTITab, QTTabPageData, QTTabPageState } from '@quicktvui/quicktvui3'
import { buildTab, buildContents, buildRecommends } from '../adapter/index'
import config from '../config'
import searchManager from '../../../api/search/index'

const props = defineProps({
  keyword: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['setLoading'])
const toast = useESToast()
// 顶部提示
const showTips = ref<boolean>(true)
const tips = ref<string>('')
// 内容组件
const tabRef = ref<QTITab>()
// 关键词
const rawKeyword = ref<string>()

watch(
  () => props.keyword,
  () => {
    emits('setLoading', true)
    tips.value = props.keyword.length > 0 ? `全部“${props.keyword}”结果` : '热门推荐'
    init(props.keyword)
  }
)

function init(keyword: string) {
  rawKeyword.value = keyword
  // 初始化组件
  tabRef.value?.initTab(buildTab())
  tabRef.value?.initPage({ width: 1920, height: 1080 })
}

let timer: any = -1
async function onTabPageLoadData(pageIndex: number, pageNo: number, useDiff: boolean) {
  let tabPage: QTTabPageData = { data: [] }
  if (rawKeyword.value?.length === 0) {
    tabPage.data = buildRecommends(await searchManager.getHotRecommends(++pageNo, config.gridHotRecommendsLimit))
  } else {
    tabPage.data = buildContents(await searchManager.getContents(rawKeyword.value, ++pageNo))
    // 停止分页
    tabRef.value?.setPageState(pageIndex, QTTabPageState.QT_TAB_PAGE_STATE_COMPLETE)
  }
  // 数据更新
  if (pageNo === 1) {
    tabRef.value?.setPageData(pageIndex, tabPage)
  } else {
    tabRef.value?.addPageData(pageIndex, tabPage, 0)
  }

  // 延迟关闭上层loading
  clearTimeout(timer)
  timer = setTimeout(() => emits('setLoading', false), 100)
}

function onTabMoveToTopStart() {
  showTips.value = false
}

function onTabMoveToBottomEnd() {
  showTips.value = true
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
  margin-top: 75px;
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
  margin-left: 24px;
  margin-right: 24px;
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
