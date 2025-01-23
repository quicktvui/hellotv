<template>
  <qt-view class="search" :gradientBackground="{ colors: themeConfig.bgGradientColor, orientation: 4 }">
    <scroll-view name="searchScroll" makeChildVisibleType="none" :horizontal="true" :onScrollEnable="true">
      <qt-view class="search-columns-body" style="width: 3072px" :clipChildren="true">
        <!-- 键盘区域 -->
        <search-keyboard ref="keyboardRef" @updateInput="updateInput" />
        <!-- 搜索关键词区域 -->
        <search-keyword
          ref="keywordRef"
          :inputText="inputText"
          @setLoading="setLoading"
          @updateFocusName="updateFocusName"
          @updateKeyword="updateKeyword"
        />
        <!-- 搜索内容区域 -->
        <search-content ref="contentRef" :keyword="keyword" :triggerTask="triggerTask" @setLoading="setLoading" />
      </qt-view>
    </scroll-view>
    <!-- 搜索关键词、内容区域loading -->
    <qt-view
      v-if="isLoading"
      class="search-columns-body-loading"
      :style="{ width: `${loadingWidth}px`, left: `${loadingLeft}px` }"
      :gradientBackground="{ colors: themeConfig.bgGradientColor, orientation: 4 }"
    >
      <qt-loading-view style="height: 100px; width: 100px" color="rgba(21,122,252,0.3)" :focusable="false"></qt-loading-view>
    </qt-view>
  </qt-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useESRouter } from '@extscreen/es3-router'
import themeConfig from '../../config/theme-config'
import searchKeyboard from './components/search-keyboard.vue'
import searchKeyword from './components/search-keyword.vue'
import searchContent from './components/search-content.vue'

const router = useESRouter()
// 键盘
const keyboardRef = ref()
const inputText = ref<string>('')
const isLoading = ref<boolean>(false)
const loadingLeft = ref<number>(634)
const loadingWidth = ref<number>(1286)
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

/**
 * 输入数据更新
 */
function updateInput(val: string) {
  inputText.value = val
  isLoading.value = true
}

/**
 * 搜索关键词更新
 */
function updateKeyword(val: string) {
  keyword.value = val
}

/**
 * 当前焦点位置更新
 */
function updateFocusName(val: string) {
  curFocusName.value = val
}

/**
 * loading状态、位置控制
 */
function setLoading(b: boolean): void {
  if (b) {
    loadingLeft.value = 1152
    loadingWidth.value = 768
  } else {
    loadingLeft.value = 634
    loadingWidth.value = 1286
  }
  isLoading.value = b
}

/**
 * 返回按键处理
 */
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

<style scoped lang="scss" src="./scss/search.scss"></style>
