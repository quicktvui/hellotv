<template>
  <qt-view class="search-three-columns" :gradientBackground="{ colors: themeConfig.rootBgGradientColor, orientation: 4 }">
    <scroll-view name="searchScroll" makeChildVisibleType="none" :horizontal="true" :onScrollEnable="true">
      <qt-view class="search-three-columns-body" :clipChildren="true">
        <!-- 键盘区域 -->
        <search-keyboard ref="keyboardRef" @updateInput="updateInput" />
        <!-- 搜索关键词 -->
        <search-keyword ref="keywordRef" :inputText="inputText" @updateFocusName="updateFocusName" @updateKeyword="updateKeyword" />
        <!-- 搜索内容区域 -->
        <search-content ref="contentRef" :keyword="keyword" :triggerTask="triggerTask" @setLoading="setLoading" />
      </qt-view>
    </scroll-view>
    <!-- 搜索内容区域loading -->
    <qt-view
      v-if="isLoading"
      class="search-three-columns-body-loading"
      :gradientBackground="{ colors: themeConfig.rootBgGradientColor, orientation: 4 }"
    >
      <qt-loading-view style="height: 100px; width: 100px" color="rgba(21,122,252,0.3)" :focusable="false"></qt-loading-view>
    </qt-view>
  </qt-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useESToast } from '@extscreen/es3-core'
import { useESRouter } from '@extscreen/es3-router'
import themeConfig from '../../config/theme-config'
import searchKeyboard from './components/search-keyboard.vue'
import searchKeyword from './components/search-keyword.vue'
import searchContent from './components/search-content.vue'

const toast = useESToast()
const router = useESRouter()
// 键盘
const keyboardRef = ref()
const inputText = ref<string>('')
const isLoading = ref<boolean>(false)
// 关键词
const keywordRef = ref()
const keyword = ref<string>('')
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
// 焦点
const curFocusName = ref<string>('searchKeyboard')

function updateInput(val: string) {
  inputText.value = val
}

function updateKeyword(val: string) {
  keyword.value = val
}

function updateFocusName(val: string) {
  curFocusName.value = val
}

function setLoading(b: boolean): void {
  isLoading.value = b
}

function onBackPressed() {
  if (curFocusName.value === 'searchKeyboard') {
    router.back()
  } else {
    keyboardRef.value?.onBackPressed()
    curFocusName.value = 'searchKeyboard'
  }
}

defineExpose({ onBackPressed })
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

.search-three-columns-body-loading {
  width: 768px;
  height: 1080px;
  background-color: transparent;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 1152px;
}
</style>
