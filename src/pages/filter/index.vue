<template>
  <qt-view class="filter" :gradientBackground="{ colors: themeConfig.rootBgGradientColor, orientation: 4 }">
    <!-- 顶部按钮 -->
    <top-view name="topView" :logoRight="true" :nextFocusName="{ down: 'sidebarList' }" />
    <!-- 内容主体 -->
    <scroll-view name="filterScroll" makeChildVisibleType="none" :horizontal="true" :onScrollEnable="true" :initialContentOffset="210">
      <qt-view class="filter-body" :clipChildren="true">
        <!-- 筛选列表扩展项 -->
        <filter-extend v-if="config.isLeftListExpanded" ref="extendRef" :triggerTask="triggerTask" />
        <!-- 筛选列表 -->
        <filter-sidebar v-if="config.isLeftList" ref="sidebarRef" @onListItemFocused="onListItemFocused" />
        <!-- 筛选内容 -->
        <filter-content ref="contentRef" />
      </qt-view>
    </scroll-view>
  </qt-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useESRouter } from '@extscreen/es3-router'
import themeConfig from '../../config/theme-config'
import config from './config'
import TopView from '../../components/top-view.vue'
import FilterExtend from './components/extend/index.vue'
import FilterSidebar from './components/sidebar/index.vue'
import FilterContent from './components/content/index.vue'

const router = useESRouter()

// 扩展列表
const extendRef = ref()
// 筛选列表
const sidebarRef = ref()
// 筛选内容
const contentRef = ref()

const triggerTask = [
  {
    event: 'onFocusAcquired',
    target: 'filterScroll',
    function: 'scrollToWithOptions',
    params: [{ x: -210, y: 0, duration: 300 }]
  },
  {
    event: 'onFocusLost',
    target: 'filterScroll',
    function: 'scrollToWithOptions',
    params: [{ x: 210, y: 0, duration: 300 }]
  }
]

function onESCreate() {
  extendRef.value?.init()
  sidebarRef.value?.init()
  contentRef.value?.init()
}

function onListItemFocused(evt) {
  if (evt.isFocused) {
    contentRef.value?.scrollToTop()
  }
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
