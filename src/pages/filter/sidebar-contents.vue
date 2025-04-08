<template>
  <qt-view class="filter" :gradientBackground="{ colors: themeConfig.bgGradientColor, orientation: 4 }">
    <!-- 焦点占位, 解决页面跳焦的问题 -->
    <qt-view class="filter-focus-placeholder" :focusable="true"></qt-view>
    <!-- 顶部按钮 -->
    <top-view name="topView" :logoRight="true" :nextFocusName="{ down: 'sidebarList' }" :blockFocusDirections="['left', 'up']" />
    <!-- 内容主体 -->
    <qt-view class="filter-body" :clipChildren="true">
      <!-- 筛选列表 -->
      <filter-sidebar
        ref="sidebarRef"
        :blockFocusDir="sidebarBlockFocusDir"
        :singleSelectPos="sidebarSinglePos"
        @onListItemFocused="onListItemFocused"
      />
      <!-- 筛选内容 -->
      <filter-content ref="contentRef" :descendantFocusability="contentDeny" @setNextFocusNameRight="setNextFocusNameRight" />
    </qt-view>
  </qt-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useESRouter } from '@extscreen/es3-router'
import { buildFilters } from './adapter/index'
import { SecondaryType } from './adapter/interface'
import themeConfig from '../../config/theme-config'
import TopView from '../../components/top-view.vue'
import FilterSidebar from './components/sidebar/index.vue'
import FilterContent from './components/content/index.vue'
import filterManager from './api/index'

const router = useESRouter()

// 筛选列表
const sidebarRef = ref()
const sidebarSinglePos = ref<number>(-1)
const sidebarBlockFocusDir = ref()
// 筛选内容
const contentRef = ref()
const contentDeny = ref<1 | 2>(1)

function onESCreate(params: { screenId: string; defaultSecondaryId?: string }) {
  params.screenId = '1848555233454727169'
  params.defaultSecondaryId = '1848554924032532482' // 默认选中的二级筛选项ID
  loadFilters(params.screenId, params.defaultSecondaryId)
}

function loadFilters(primaryId: string, defaultSecondaryId: string) {
  filterManager.getFilters(primaryId).then((filters) => {
    const { secondaries, tertiaries } = buildFilters(primaryId, filters)
    // 设置左侧列表默认选中
    const index = secondaries.findIndex((item) => item.id === defaultSecondaryId)
    sidebarSinglePos.value = index !== -1 ? index : 1
    lastPosition = sidebarSinglePos.value
    // 初始化二级列表
    sidebarRef.value?.init(secondaries)
    // 初始化三级列表
    contentRef.value?.init(primaryId, tertiaries, defaultSecondaryId)
  })
}

let lastPosition = sidebarSinglePos.value
let listTimer: any = -1
function onListItemFocused(evt) {
  if (evt.isFocused && evt.position != lastPosition) {
    // 禁止焦点向右
    setNextFocusNameRight('')
    clearTimeout(listTimer)
    listTimer = setTimeout(() => {
      lastPosition = evt.position
      sidebarSinglePos.value = lastPosition
      contentRef.value?.loadContents(evt.item.id, evt.item.type === SecondaryType.FILTER, evt.item.type === SecondaryType.TEXT)
    }, 300)
  }
}

function setNextFocusNameRight(s: string) {
  contentDeny.value = s === '' ? 2 : 1
  sidebarRef.value?.setNextFocusNameRight(s)
}

function onBackPressed() {
  if (contentRef.value?.onBackPressed()) {
    router.back()
  }
}

defineExpose({ onESCreate, onBackPressed })
</script>

<style scoped lang="scss" src="./scss/filter.scss"></style>
