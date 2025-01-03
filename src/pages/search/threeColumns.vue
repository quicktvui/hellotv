<template>
  <qt-view class="search-three-columns" :gradientBackground="{ colors: themeConfig.rootBgGradientColor, orientation: 4 }">
    <scroll-view name="searchScroll" makeChildVisibleType="none" :horizontal="true" :onScrollEnable="true">
      <qt-view class="search-three-columns-body" :clipChildren="true">
        <!-- 键盘区域 -->
        <keyboard ref="keyboardRef" />
        <!-- 搜索关键词 -->
        <keyword ref="keywordRef" @searchByKeyword="searchByKeyword" />
        <!-- 搜索内容区域 -->
        <content-waterfall ref="contentRef" :triggerTask="triggerTask" />
      </qt-view>
    </scroll-view>
  </qt-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { buildKeywords } from './adapter/index'
import themeConfig from '../../config/theme-config'
import keyboard from './components/keyboard.vue'
import keyword from './components/keyword.vue'
import contentWaterfall from './components/content-waterfall.vue'
import searchManager from '../../api/search/index'

// 键盘
const keyboardRef = ref()
// 关键词
const keywordRef = ref()
// 内容
const contentRef = ref()
const triggerTask = [
  {
    event: 'onFocusAcquired',
    target: 'searchScroll',
    function: 'scrollToWithOptions',
    params: [{ x: 1152, y: 0, duration: 300 }]
  },
  {
    event: 'onFocusLost',
    target: 'searchScroll',
    function: 'scrollToWithOptions',
    params: [{ x: -1152, y: 0, duration: 300 }]
  }
]

function onESCreate() {
  // 初始化键盘
  keyboardRef.value?.init()
  // 加载关键词
  searchManager.getSuggestions('hot').then((suggestions) => {
    keywordRef.value?.init(buildKeywords(suggestions))
  })
}

function searchByKeyword(keyword: string) {
  contentRef.value?.init(keyword)
}

defineExpose({ onESCreate })
</script>

<style scoped>
.search-three-columns {
  width: 1920px;
  height: 1080px;
  background-color: transparent;
}

.search-three-columns-body {
  width: 3072px;
  background-color: transparent;
  flex-direction: row;
}
</style>
