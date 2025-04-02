<template>
  <qt-view class="search-keyword">
    <!-- 暂无数据 -->
    <qt-view v-if="isEmpty" class="search-keyword-empty" :focusable="false">
      <qt-text class="search-keyword-empty-text" text="抱歉暂无相关内容" gravity="center" :focusable="false"></qt-text>
      <qt-text class="search-keyword-empty-text" text="为您推荐右边热门影片～" gravity="center" :focusable="false"></qt-text>
    </qt-view>
    <qt-view v-else>
      <!-- 搜索词条 -->
      <qt-list-view
        class="search-keyword-list"
        ref="listRef"
        name="keywordList"
        :padding="'0,55,0,0'"
        :singleSelectPosition="singleSelectPos"
        :blockFocusDirections="['down']"
        :nextFocusName="{ right: 'gridItem' }"
        :openPage="true"
        :listenBoundEvent="true"
        :loadMore="onListLoadMore"
        @item-focused="onListItemFocused"
        @item-click="onListItemClick"
      >
        <!-- 标题 -->
        <qt-view :type="KeywordType.TITLE" class="search-keyword-list-item-title" :focusable="false" eventFocus eventClick>
          <qt-text
            class="search-keyword-list-item-title-text"
            text="${text}"
            gravity="center|start"
            typeface="bold"
            :focusable="false"
          ></qt-text>
          <qt-view class="search-keyword-list-item-title-btn" showIf="${showClearBtn}" :focusable="true">
            <qt-view class="search-keyword-list-item-title-btn-img" :focusable="false" :duplicateParentState="true">
              <qt-image
                class="search-keyword-list-item-title-btn-img"
                style="position: absolute"
                :showOnState="['normal', 'selected']"
                :src="icClearDark"
                :focusable="false"
                :duplicateParentState="true"
              ></qt-image>
              <qt-image
                class="search-keyword-list-item-title-btn-img"
                style="position: absolute"
                showOnState="focused"
                :src="icClearFocused"
                :focusable="false"
                :duplicateParentState="true"
              ></qt-image>
            </qt-view>
            <qt-text
              class="search-keyword-list-item-title-btn-text"
              text="清空"
              gravity="center"
              :focusable="false"
              :duplicateParentState="true"
            ></qt-text>
          </qt-view>
        </qt-view>
        <!-- 普通文本 -->
        <qt-view :type="KeywordType.TEXT" class="search-keyword-list-item" :focusable="true" eventFocus eventClick>
          <qt-text
            class="search-keyword-list-item-text"
            autoHeight
            text="${text}"
            gravity="center|start"
            :showOnState="['normal', 'selected']"
            :lines="1"
            :ellipsizeMode="4"
            :focusable="false"
            :duplicateParentState="true"
          ></qt-text>
          <qt-text
            class="search-keyword-list-item-text"
            autoHeight
            text="${text}"
            typeface="bold"
            gravity="center|start"
            showOnState="focused"
            :lines="1"
            :ellipsizeMode="4"
            :focusable="false"
            :duplicateParentState="true"
          ></qt-text>
        </qt-view>
      </qt-list-view>
    </qt-view>
  </qt-view>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { QTIListView, QTListViewItem } from '@quicktvui/quicktvui3'
import { buildKeywords } from '../adapter/index'
import { KeywordType } from '../adapter/interface'
import icClearDark from '../../../assets/search/ic_clear_dark.png'
import icClearFocused from '../../../assets/search/ic_clear_focused.png'
import searchManager from '../api/index'
import config from '../config'

const props = defineProps({
  inputText: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['setLoading', 'updateFocusName', 'updateFocusDeny', 'updateKeyword'])
// 页面引用
const mode = ref<'hot' | 'guess' | 'all'>('hot')
const listRef = ref<QTIListView>()
const singleSelectPos = ref<number>(1)
const isEmpty = ref<boolean>(false)
// 局部变量
let curPage = 0
let pageSize = config.listKeywordsLimit
let historyLength = 0
// 最后焦点位置
let lastFocusPos = singleSelectPos.value
// 组件绑定数据
let listData: QTListViewItem[] = []
let loadTimer: any = -1
let listFocusTimer: any = -1

onMounted(() => loadSuggestions())

watch(
  () => props.inputText,
  () => {
    mode.value = props.inputText.length > 0 ? 'guess' : 'hot'
    // 状态重置
    isEmpty.value = false
    lastFocusPos = singleSelectPos.value
    curPage = 0
    // 加载词条
    loadSuggestions()
  }
)

async function loadSuggestions(page = 1) {
  try {
    // 搜索词条
    const suggestions = await searchManager.getSuggestions(mode.value, props.inputText, page, pageSize)
    const keywords = buildKeywords(suggestions, mode.value)

    if (page === 1) {
      resetAndInitialize(keywords)
    } else {
      if (keywords.length > 0) {
        listData.push(...keywords)
      } else {
        listRef.value?.stopPage()
      }
    }

    clearTimeout(loadTimer)
    loadTimer = setTimeout(() => {
      emits('updateKeyword', listData.length > 0 ? listData[1].text : '')
      emits('setLoading', false)
    }, 300)
  } catch (error) {
    qt.log.e('ok->', 'Error loading suggestions:', error)
    emits('setLoading', false)
  }
}

function resetAndInitialize(keywords) {
  curPage = 1

  // 添加标题
  keywords.unshift({ type: KeywordType.TITLE, text: mode.value === 'hot' ? '热门搜索' : '猜你想搜' })

  // 搜索历史
  const history = [
    { type: KeywordType.TITLE, text: '搜索历史', showClearBtn: true },
    { type: KeywordType.TEXT, text: '清清溪流' },
    { type: KeywordType.TEXT, text: '反印度式浪漫' },
    { type: KeywordType.TEXT, text: '小飞侠' }
  ]

  // 记录历史条数
  historyLength = history.length

  // 添加搜索历史
  keywords.unshift(...history)

  listData = listRef.value?.init(keywords) || []
  listRef.value?.scrollToTop()
  listRef.value?.setItemSelected(singleSelectPos.value, true)
  isEmpty.value = listData.length === 0
}

function onListLoadMore() {
  // 第一页通过 onMounted 生命周期触发
  if (curPage > 0) {
    loadSuggestions(++curPage)
  }
}

function onListItemFocused(evt) {
  // 不处理标题的焦点事件
  if (evt.item.type === KeywordType.TITLE) {
    return
  }

  if (evt.isFocused) {
    emits('updateFocusName', 'searchKeyword')
  }

  clearTimeout(listFocusTimer)
  listFocusTimer = setTimeout(() => {
    if (evt.isFocused && evt.position != lastFocusPos) {
      lastFocusPos = evt.position
      emits('updateKeyword', evt.item.text)
    } else {
      emits('updateFocusDeny', false)
    }
  }, 300)
}

function onListItemClick(evt) {
  // 清空搜索历史
  searchManager.clearHistory()
  // 清空本地历史
  listData.splice(0, historyLength)
  lastFocusPos = 0
}

function onBackPressed() {
  listRef.value?.setItemFocused(lastFocusPos)
}

defineExpose({ onBackPressed })
</script>

<style scoped lang="scss" src="../scss/search-keyword.scss"></style>
