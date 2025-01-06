<template>
  <qt-view class="search-keyword">
    <!-- 暂无数据 -->
    <qt-view v-if="isEmpty" class="search-keyword-empty" :focusable="false">
      <qt-text class="search-keyword-empty-text" text="抱歉暂无相关内容" gravity="center" :focusable="false"></qt-text>
      <qt-text class="search-keyword-empty-text" text="为您推荐右边热门影片～" gravity="center" :focusable="false"></qt-text>
    </qt-view>
    <qt-list-view
      v-else
      class="search-keyword-list"
      ref="listRef"
      name="keywordList"
      :padding="'0,72,0,0'"
      :singleSelectPosition="singleSelectPos"
      :blockFocusDirections="['down']"
      :openPage="true"
      :listenBoundEvent="true"
      :loadMore="onListLoadMore"
      @item-focused="onListItemFocused"
    >
      <!-- 标题 -->
      <qt-view :type="1" class="search-keyword-list-item" :focusable="false">
        <qt-text
          class="search-keyword-list-item-text"
          style="color: white; font-size: 40px"
          autoWidth
          autoHeight
          text="${text}"
          :focusable="false"
        ></qt-text>
      </qt-view>
      <!-- 普通文本 -->
      <qt-view :type="2" class="search-keyword-list-item" :focusable="true" eventFocus eventClick>
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
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useESToast } from '@extscreen/es3-core'
import { QTIListView, QTListViewItem } from '@quicktvui/quicktvui3'
import { buildKeywords } from '../adapter/index'
import searchManager from '../../../api/search/index'
import config from '../config'

const props = defineProps({
  inputText: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['updateFocusName', 'updateKeyword'])
const toast = useESToast()
// 关键词列表
const listRef = ref<QTIListView>()
// 默认选择位置
const singleSelectPos = ref<number>(1)
// 暂无数据
const isEmpty = ref<boolean>(false)
// 页码
let page = 0
// 分页大小
let pageSize = config.listKeywordsLimit
// 最后焦点位置
let lastFocusPos = singleSelectPos.value

onMounted(() => loadSuggestions())

watch(
  () => props.inputText,
  () => {
    // 重置状态
    isEmpty.value = false
    lastFocusPos = singleSelectPos.value
    // 重置页码
    page = 0
    // 加载词条
    loadSuggestions()
  }
)

let listData: QTListViewItem[] = []
async function loadSuggestions(page: number = 1) {
  const suggestions = await searchManager.getSuggestions(props.inputText.length > 0 ? 'guess' : 'hot', props.inputText, page, pageSize)
  const keywords = buildKeywords(suggestions)

  if (page === 1) {
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
      listData.push(...keywords.splice(1))
    } else {
      listRef.value?.stopPage()
    }
  }

  emits('updateKeyword', listData.length > 0 ? listData[1].text : '')
}

function onListLoadMore() {
  if (page > 0) {
    loadSuggestions(++page)
  }
}

let listFocusTimer: any = -1
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

<style scoped lang="scss">
.search-keyword {
  width: 518px;
  height: 1080px;
  background-color: transparent;
}

.search-keyword-empty {
  width: 518px;
  height: 1080px;
  background-color: transparent;
  align-items: center;
  justify-content: center;
}

.search-keyword-empty-text {
  width: 518px;
  height: 40px;
  background-color: transparent;
  color: $text-normal-color;
  font-size: 30px;
}

.search-keyword-list {
  width: 518px;
  height: 1080px;
  background-color: transparent;
}

.search-keyword-list-item {
  width: 518px;
  height: 84px;
  background-color: transparent;
  justify-content: center;
  border-radius: 8px;
  focus-background-color: $gl-theme-btn-bg-focus-color;
}

.search-keyword-list-item-text {
  width: 358px;
  position: absolute;
  left: 80px;
  color: $text-normal-color;
  font-size: 36px;
  focus-color: $text-focus-color;
  select-color: $text-select-color;
}
</style>
