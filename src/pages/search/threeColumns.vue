<template>
  <qt-view class="search-three-columns" :gradientBackground="{ colors: themeConfig.rootBgGradientColor, orientation: 4 }">
    <scroll-view name="searchScroll" makeChildVisibleType="none" :horizontal="true" :onScrollEnable="true">
      <qt-view class="search-three-columns-body" :clipChildren="true">
        <!-- 键盘区域 -->
        <keyboard ref="keyboardRef" />
        <!-- 搜索关键词 -->
        <keyword ref="keywordRef" />
        <!-- 搜索内容区域 -->
        <content ref="contentRef" :triggerTask="triggerTask" />
      </qt-view>
    </scroll-view>
  </qt-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import themeConfig from '../../config/theme-config'
import keyboard from './components/keyboard.vue'
import keyword from './components/keyword.vue'
import content from './components/content.vue'

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
  // 初始化关键词
  keywordRef.value?.init()
  // 初始化内容
  contentRef.value?.init()
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
