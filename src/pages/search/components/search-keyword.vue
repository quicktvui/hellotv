<template>
  <qt-view class="search-keyword">
    <!-- 标题 -->
    <qt-text class="search-keyword-title" :text="title" gravity="center|start" typeface="bold" :focusable="false"></qt-text>
    <!-- 暂无数据 -->
    <qt-view v-if="isEmpty" class="search-keyword-empty" :focusable="false">
      <qt-text class="search-keyword-empty-text" text="抱歉暂无相关内容" gravity="center" :focusable="false"></qt-text>
      <qt-text class="search-keyword-empty-text" text="为您推荐右边热门影片～" gravity="center" :focusable="false"></qt-text>
    </qt-view>
    <qt-view v-else>
      <!-- 词条 -->
      <qt-list-view
        class="search-keyword-list"
        ref="listRef"
        name="keywordList"
        :padding="'0,40,0,0'"
        :singleSelectPosition="singleSelectPos"
        :blockFocusDirections="['down']"
        :openPage="true"
        :listenBoundEvent="true"
        :loadMore="onListLoadMore"
        @item-focused="onListItemFocused"
      >
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
import searchManager from '../api/index'
import config from '../config'

const props = defineProps({
  inputText: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['setLoading', 'updateFocusName', 'updateKeyword'])
// 页面引用
const title = ref<string>('热门搜索')
const listRef = ref<QTIListView>()
const singleSelectPos = ref<number>(0)
const isEmpty = ref<boolean>(false)
// 局部变量
let curPage = 0
let pageSize = config.listKeywordsLimit
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
    title.value = props.inputText.length > 0 ? '猜你想搜' : '热门搜索'
    // 状态重置
    isEmpty.value = false
    lastFocusPos = singleSelectPos.value
    curPage = 0
    // 加载词条
    loadSuggestions()
  }
)

/**
 * 获取搜索关键词
 * @param page 页码
 */
async function loadSuggestions(page: number = 1) {
  const mode = props.inputText.length > 0 ? 'guess' : 'hot'
  const suggestions = await searchManager.getSuggestions(mode, props.inputText, page, pageSize)
  const keywords = buildKeywords(suggestions, mode)

  if (page === 1) {
    curPage = 1
    if (keywords.length > 0) {
      listData = listRef.value?.init(keywords) as QTListViewItem[]
      listRef.value?.scrollToTop()
      listRef.value?.setItemSelected(singleSelectPos.value, true)
    } else {
      listData.splice(0)
      isEmpty.value = true
    }
  } else {
    if (keywords.length > 0) {
      listData.push(...keywords)
    } else {
      listRef.value?.stopPage()
    }
  }

  clearTimeout(loadTimer)
  loadTimer = setTimeout(() => {
    emits('updateKeyword', listData.length > 0 ? listData[0].text : '')
    emits('setLoading', false)
  }, 300)
}

function onListLoadMore() {
  // 第一页通过 onMounted 生命周期触发
  if (curPage > 0) {
    loadSuggestions(++curPage)
  }
}

function onListItemFocused(evt) {
  if (evt.isFocused) {
    emits('updateFocusName', 'searchKeyword')
  }

  clearTimeout(listFocusTimer)
  listFocusTimer = setTimeout(() => {
    if (evt.isFocused && evt.position != lastFocusPos) {
      lastFocusPos = evt.position
      emits('updateKeyword', evt.item.text)
    }
  }, 300)
}

function onBackPressed() {
  listRef.value?.setItemFocused(lastFocusPos)
}

defineExpose({ onBackPressed })
</script>

<style scoped lang="scss" src="../scss/search-keyword.scss"></style>
