<template>
  <qt-view class="search-content">
    <!-- 提示 -->
    <qt-text v-if="showTips && !lockTips" class="search-content-tips" :text="tips" gravity="center|start" typeface="bold"></qt-text>
    <!-- 内容 -->
    <qt-tabs
      ref="tabRef"
      tabNavBarClass="search-content-tab"
      tabPageClass="search-content-tab-page"
      :autoHandleBackKey="true"
      :contentNextFocus="{ left: 'keywordList' }"
      @onTabPageLoadData="onTabPageLoadData"
      @onTabPageItemClick="onTabPageItemClick"
      @onTabMoveToTopStart="onTabMoveToTopStart"
      @onTabMoveToBottomEnd="onTabMoveToBottomEnd"
    >
      <!-- Tab -->
      <template v-slot:tab-item>
        <qt-view class="search-content-tab-item" :type="TabItemType.TEXT" :focusable="true">
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
        <search-content-item-h :type="ContentType.HORIZONTAL" />
        <!-- 竖图 -->
        <search-content-item-v :type="ContentType.VERTICAL" />
      </template>
    </qt-tabs>
  </qt-view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { QTITab, QTTabPageData, QTTabPageState, QTWaterfallItem } from '@quicktvui/quicktvui3'
import { buildTab, buildContents, buildRecommends, buildEndSection } from '../adapter/index'
import { TabItemType, ContentType } from '../adapter/interface'
import searchContentItemH from './search-content-item-h.vue'
import searchContentItemV from './search-content-item-v.vue'
import launch from '../../../tools/launch'
import config from '../config'
import searchManager from '../api/index'

const props = defineProps({
  keyword: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['setLoading'])
// 顶部提示
const showTips = ref<boolean>(true)
const lockTips = ref<boolean>(false)
const tips = ref<string>('')
// 内容组件
const tabRef = ref<QTITab>()
// 关键词
const rawKeyword = ref<string>()

watch(
  () => props.keyword,
  () => {
    // 设置loading状态
    emits('setLoading', true)
    // 重置状态
    showTips.value = true
    lockTips.value = false
    // 提示词
    tips.value = props.keyword.length > 0 ? `全部“${props.keyword}”结果` : '热门推荐'
    // 初始化组件
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
async function onTabPageLoadData(pageIndex: number, pageNo: number) {
  let tabPage: QTTabPageData = { data: [] }
  if (rawKeyword.value?.length === 0) {
    const recommends = await searchManager.getHotRecommends(++pageNo, config.gridHotRecommendsLimit)
    tabPage.data = buildRecommends(recommends)
    // 停止分页
    if (recommends.items.length < config.gridHotRecommendsLimit) {
      tabPage.data.push(buildEndSection())
      tabRef.value?.setPageState(pageIndex, QTTabPageState.QT_TAB_PAGE_STATE_COMPLETE)
    }
  } else {
    tabPage.data = buildContents(await searchManager.getContents(rawKeyword.value, ++pageNo))
    // 没有搜索结果时, 不展示顶部提示词
    if (tabPage.data.length === 2) {
      showTips.value = false
      lockTips.value = true
    }
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

function onTabPageItemClick(pageIndex: number, sectionIndex: number, itemIndex: number, item: QTWaterfallItem) {
  launch.launchDetail(item.id)
}

function onTabMoveToTopStart() {
  showTips.value = false
}

function onTabMoveToBottomEnd() {
  showTips.value = true
}
</script>

<style lang="scss" src="../scss/search-content.scss"></style>
