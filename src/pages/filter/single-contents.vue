<template>
  <qt-view class="filter" :gradientBackground="{ colors: themeConfig.rootBgGradientColor, orientation: 4 }">
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
import filterManager from '../../api/filter/index'

const router = useESRouter()

// 筛选内容
const contentRef = ref()

function onESCreate(params: { primaryId: string }) {
  loadFilters(params.primaryId || '1848555233454727169')
}

function loadFilters(primaryId: string) {
  filterManager.getFilters(primaryId).then((filters) => {
    const { tertiaries } = buildFilters(primaryId, filters)
    // 初始化三级列表
    contentRef.value?.init(tertiaries)
  })
}

function onBackPressed() {
  if (contentRef.value?.onBackPressed()) {
    router.back()
  }
}

defineExpose({ onESCreate, onBackPressed })
</script>

<style scoped>
.filter {
  width: 1920px;
  height: 1080px;
  background-color: transparent;
}

.filter-body {
  width: 2130px;
  height: 960px;
  background-color: transparent;
  flex-direction: row;
}
</style>
