<template>
  <qt-view class="filter" :gradientBackground="{ colors: themeConfig.bgGradientColor, orientation: 4 }">
    <!-- 顶部按钮 -->
    <top-view name="topView" :logoRight="true" />
    <!-- 内容主体 -->
    <qt-view class="filter-body" :clipChildren="true">
      <!-- 筛选内容 -->
      <filter-content ref="contentRef" />
    </qt-view>
  </qt-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useESRouter } from '@extscreen/es3-router'
import { buildFilters } from './adapter/index'
import themeConfig from '../../config/theme-config'
import TopView from '../../components/top-view.vue'
import FilterContent from './components/content/index.vue'
import filterManager from './api/index'

const router = useESRouter()

// 筛选内容
const contentRef = ref()

function onESCreate(params: { screenId: string; defaultTags?: string }) {
  loadFilters(params.screenId || '1848555233454727169', params.defaultTags || '不存在标签,美国,动作')
}

function loadFilters(primaryId: string, defaultTags: string) {
  filterManager.getFilters(primaryId).then((filters) => {
    const { tertiaries } = buildFilters(primaryId, filters, defaultTags.split(','))
    // 初始化三级列表
    contentRef.value?.init(primaryId, tertiaries)
  })
}

function onBackPressed() {
  if (contentRef.value?.onBackPressed()) {
    router.back()
  }
}

defineExpose({ onESCreate, onBackPressed })
</script>

<style scoped lang="scss" src="./scss/filter.scss"></style>
