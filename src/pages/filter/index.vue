<template>
  <qt-view class="filter" :gradientBackground="{ colors: bgColor, orientation: 0 }">
    <!-- 顶部按钮 -->
    <qt-view class="filter-header"></qt-view>
    <!-- 内容主体 -->
    <qt-view class="filter-body">
      <!-- 筛选列表扩展项 -->
      <!-- 筛选列表 -->
      <!-- 筛选内容 -->
      <filter-body-content ref="filterBodyContent" />
    </qt-view>
  </qt-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ThemeConfig from '../../config/theme-config'
import FilterBodyContent from './components/content/index.vue'

const bgColor = ThemeConfig.rootBgGradientColor

const filterBodyContent = ref()

function onESCreate() {
  filterBodyContent.value?.init()
}

defineExpose({ onESCreate })
</script>

<style scoped>
.filter {
  width: 1920px;
  height: 1080px;
  background-color: transparent;
}

.filter-header {
  width: 1920px;
  height: 120px;
  background-color: transparent;
}

.filter-body {
  width: 1920px;
  height: 960px;
  background-color: transparent;
}
</style>
