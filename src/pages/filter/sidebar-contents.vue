<template>
  <qt-view class="filter" :gradientBackground="{ colors: themeConfig.rootBgGradientColor, orientation: 4 }">
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
      <filter-content ref="contentRef" @setNextFocusNameRight="setNextFocusNameRight" />
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
import filterManager from '../../api/filter/index'

const router = useESRouter()

// 筛选列表
const sidebarRef = ref()
const sidebarSinglePos = ref<number>(1)
const sidebarBlockFocusDir = ref()
// 筛选内容
const contentRef = ref()

function onESCreate(params: { primaryId: string }) {
  loadFilters(params.primaryId || '1848555233454727169')
}

function loadFilters(primaryId: string) {
  filterManager.getFilters(primaryId).then((filters) => {
    const { secondaries, tertiaries } = buildFilters(primaryId, filters)
    // 初始化二级列表
    sidebarRef.value?.init(secondaries)
    // 初始化三级列表
    contentRef.value?.init(primaryId, tertiaries)
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
      contentRef.value?.loadContents(evt.item.id, evt.item.type === SecondaryType.FILTER, evt.item.type === SecondaryType.TEXT)
    }, 300)
  }
}

function setNextFocusNameRight(s: string) {
  sidebarBlockFocusDir.value = s === '' ? ['right'] : []
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

.filter-focus-placeholder {
  width: 1px;
  height: 1px;
  background-color: transparent;
  position: absolute;
  top: 0px;
  left: 0px;
}

.filter-body {
  width: 2130px;
  height: 960px;
  background-color: transparent;
  flex-direction: row;
}
</style>
