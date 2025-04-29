<template>
  <qt-view class="search-content">
    <!-- 提示 -->
    <qt-text v-if="showTips && !lockTips" class="search-content-tips" :text="tips" gravity="center|start" typeface="bold"></qt-text>
    <!-- 内容 -->
    <qt-tabs
      ref="tabRef"
      tabNavBarClass="search-content-tab"
      tabPageClass="search-content-tab-page"
      :focusMemory="true"
      :autoHandleBackKey="true"
      :contentNextFocus="{ left: 'keywordList' }"
      :tabContentBlockFocusDirections="['up', 'down']"
      @onTabPageLoadData="onTabPageLoadData"
      @onTabPageItemFocused="onTabPageItemFocused"
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
      <!-- 分页加载中 -->
      <template v-slot:waterfall-section>
        <qt-view
          style="width: 1920px; height: 100px; background-color: transparent; align-items: center; justify-content: center"
          :type="-10008"
          :focusable="false"
        >
          <qt-loading-view style="height: 40px; width: 40px" name="loading" color="rgba(255,255,255,0.3)" :focusable="false" />
        </qt-view>
      </template>
    </qt-tabs>
  </qt-view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { QTITab, QTTabPageData, QTTabPageState, QTWaterfallItem } from '@quicktvui/quicktvui3'
import { buildTab, buildContentSections, buildRecommendSections, buildLoadingSection, buildEndSection } from '../adapter/index'
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
const emits = defineEmits(['setLoading', 'updateFocusName', 'updateFocusDeny'])
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

// 加载关键词搜索和大家都在搜
async function loadSearchData(pageIndex: number, page: number) {
  let tabPage: QTTabPageData = { useDiff: true, data: [] }
  let stopPage = false

  try {
    const contentsResult = await searchManager.getContents(rawKeyword.value, page, config.gridContentsLimit)
    const sections = buildContentSections(contentsResult, 4)

    if (contentsResult.items.length > 0) {
      tabPage.data.push(...sections)
    } else {
      // 没有搜索结果时, 不展示顶部提示词
      showTips.value = false
      lockTips.value = true
    }

    if (contentsResult.items.length < config.gridContentsLimit) {
      stopPage = true
      // 请求大家都在搜
      const recommends = await searchManager.getHotRecommends(1, config.gridHotRecommendsLimit)
      tabPage.data.push(...buildRecommendSections(recommends, 6, true, showTips.value))
      tabPage.data.push(buildEndSection())
      // 停止分页
      tabRef.value?.setPageState(pageIndex, QTTabPageState.QT_TAB_PAGE_STATE_COMPLETE)
    }

    // 添加加载中
    if (!stopPage) {
      tabPage.data.push(buildLoadingSection())
    }

    if (page === 1) {
      // 列表第一个Item添加特殊标识
      tabPage.data[0].itemList[0]._id = '--search-grid-first-item--'
      tabRef.value?.setPageData(pageIndex, tabPage)
    } else {
      tabRef.value?.addPageData(pageIndex, tabPage, 1)
    }
  } catch (error) {
    qt.log.e('error->loadSearchData', error)
  } finally {
    delayedUpdate()
  }
}

// 延迟更新上层状态
function delayedUpdate() {
  clearTimeout(timer)
  timer = setTimeout(() => {
    emits('setLoading', false)
    emits('updateFocusDeny', false)
  }, 500)
}

let timer: any = -1
function onTabPageLoadData(pageIndex: number, pageNo: number) {
  if (rawKeyword.value?.length === 0) {
    searchManager
      .getHotRecommends(1, config.gridHotRecommendsLimit)
      .then((recommends) => {
        let tabPage: QTTabPageData = { useDiff: true, data: [] }
        if (recommends.items.length > 0) {
          tabPage.data.push(...buildRecommendSections(recommends, 6, false, showTips.value))
        }
        tabPage.data.push(buildEndSection())
        tabRef.value?.setPageData(pageIndex, tabPage)
        tabRef.value?.setPageState(pageIndex, QTTabPageState.QT_TAB_PAGE_STATE_COMPLETE)
      })
      .catch((error) => {
        qt.log.e('error->getContents for recommends', error)
      })
      .finally(() => {
        delayedUpdate()
      })
  } else {
    loadSearchData(pageIndex, ++pageNo)
  }
}

function onTabPageItemFocused(pageIndex: number, sectionIndex: number, itemIndex: number, isFocused: boolean, item: QTWaterfallItem) {
  if (isFocused) {
    qt.eventBus.emit('updateFocusRightSid', '')
    emits('updateFocusName', 'searchContentItem')
  }
}

function onTabPageItemClick(pageIndex: number, sectionIndex: number, itemIndex: number, item: QTWaterfallItem) {
  // 跳转详情页
  launch.launchDetail(item.id)
  // 上报搜索历史
  searchManager.addHistory(rawKeyword.value || '')
}

function onTabMoveToTopStart() {
  showTips.value = false
}

function onTabMoveToBottomEnd() {
  showTips.value = true
}
</script>

<style lang="scss" src="../scss/search-content.scss"></style>
