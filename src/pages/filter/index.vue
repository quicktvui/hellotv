<template>
  <qt-view class="filter" :gradientBackground="{ colors: themeConfig.rootBgGradientColor, orientation: 4 }">
    <!-- 顶部按钮 -->
    <top-view name="topView" :logoRight="true" :nextFocusName="{ down: 'sidebarList' }" />
    <!-- 内容主体 -->
    <scroll-view name="filterScroll" makeChildVisibleType="none" :horizontal="true" :onScrollEnable="true" :initialContentOffset="210">
      <qt-view class="filter-body" :clipChildren="true">
        <!-- 筛选列表扩展项 -->
        <filter-expand v-if="config.isLeftListExpand" ref="expandRef" :triggerTask="triggerTask" />
        <!-- 筛选列表 -->
        <filter-sidebar v-if="config.isLeftList" ref="sidebarRef" @onListItemFocused="onListItemFocused" />
        <!-- 筛选内容 -->
        <filter-content ref="contentRef" @setNextFocusNameRight="setNextFocusNameRight" />
      </qt-view>
    </scroll-view>
  </qt-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useESRouter } from '@extscreen/es3-router'
import { buildFilters } from './adapter/index'
import themeConfig from '../../config/theme-config'
import config from './config'
import TopView from '../../components/top-view.vue'
import FilterExpand from './components/expand/index.vue'
import FilterSidebar from './components/sidebar/index.vue'
import FilterContent from './components/content/index.vue'
import filterManager from '../../api/filter/index'

const router = useESRouter()

// 扩展列表
const expandRef = ref()
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

async function onESCreate() {
  const filters = await filterManager.getFilters('1848555233454727169', '1848555233454727169')
  const { primaries, secondaries, tertiaries } = buildFilters(filters)
  // 初始化一级列表
  expandRef.value?.init(primaries)
  // 初始化二级列表
  sidebarRef.value?.init(secondaries)
  // 初始化三级列表
  contentRef.value?.init(tertiaries)
}

let lastPosition = 1
let listTimer: any = -1
function onListItemFocused(evt) {
  if (evt.isFocused && evt.position != lastPosition) {
    clearTimeout(listTimer)
    listTimer = setTimeout(() => {
      lastPosition = evt.position
      contentRef.value?.loadContents(evt.item.id, evt.item.type === 2, evt.item.type !== 2)
    }, 300)
  }
}

function setNextFocusNameRight(s: string) {
  sidebarRef.value?.setNextFocusNameRight(s)
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
