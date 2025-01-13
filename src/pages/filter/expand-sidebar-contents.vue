<template>
  <qt-view class="filter" :gradientBackground="{ colors: themeConfig.rootBgGradientColor, orientation: 4 }">
    <!-- 焦点占位, 解决页面跳焦的问题 -->
    <qt-view class="filter-focus-placeholder" :focusable="true"></qt-view>
    <!-- 顶部按钮 -->
    <top-view name="topView" :logoRight="true" :nextFocusName="{ down: 'sidebarList' }" :blockFocusDirections="['left', 'up']" />
    <!-- 内容主体 -->
    <scroll-view name="filterScroll" makeChildVisibleType="none" :horizontal="true" :onScrollEnable="true" :initialContentOffset="210">
      <qt-view class="filter-body" :clipChildren="true">
        <!-- 筛选列表扩展项 -->
        <filter-expand
          ref="expandRef"
          :blockFocusDir="expandBlockFocusDir"
          :singleSelectPos="expandSinglePos"
          :expandAvailable="expandAvailable"
          :triggerTask="triggerTask"
          @onListItemFocused="onExtListItemFocused"
        />
        <!-- 筛选列表 -->
        <filter-sidebar
          ref="sidebarRef"
          :blockFocusDir="sidebarBlockFocusDir"
          :singleSelectPos="sidebarSinglePos"
          :listItemTextStyle="{ width: `222px`, marginLeft: `98px` }"
          :listItemTextGravity="'center|start'"
          @onListItemFocused="onListItemFocused"
        />
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
import { SecondaryType } from './adapter/interface'
import themeConfig from '../../config/theme-config'
import TopView from '../../components/top-view.vue'
import FilterExpand from './components/expand/index.vue'
import FilterSidebar from './components/sidebar/index.vue'
import FilterContent from './components/content/index.vue'
import filterManager from '../../api/filter/index'

const router = useESRouter()

// 扩展列表
const expandRef = ref()
const expandSinglePos = ref<number>(0)
const expandBlockFocusDir = ref()
const expandAvailable = ref<boolean>(false)
// 筛选列表
const sidebarRef = ref()
const sidebarSinglePos = ref<number>(0)
const sidebarBlockFocusDir = ref()
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

function onESCreate(params: { screenId: string }) {
  loadFilters(params.screenId || '1848555233454727169', true)
}

function loadFilters(primaryId: string, initExpand?: boolean) {
  filterManager.getFilters(primaryId).then((filters) => {
    // 设置焦点向右方向
    setExpandNextFocusNameRight('sidebarList')

    const { primaries, secondaries, tertiaries } = buildFilters(primaryId, filters)
    // 初始化一级列表
    if (initExpand) {
      expandRef.value?.init(primaries)
    }
    // 初始化二级列表
    sidebarRef.value?.init(secondaries)
    // 初始化三级列表
    contentRef.value?.init(primaryId, tertiaries)
  })
}

let lastExtPosition = expandSinglePos.value
let extListTimer: any = -1
function onExtListItemFocused(evt) {
  if (evt.isFocused && evt.position != lastExtPosition) {
    // 禁止焦点向右
    setExpandNextFocusNameRight('')
    clearTimeout(extListTimer)
    extListTimer = setTimeout(() => {
      lastExtPosition = evt.position
      loadFilters(evt.item.id)
    }, 300)
  }
}

let lastPosition = sidebarSinglePos.value
let listTimer: any = -1
function onListItemFocused(evt) {
  if (evt.isFocused) {
    expandAvailable.value = evt.item.type === SecondaryType.FILTER_TITLE

    if (evt.position != lastPosition) {
      // 禁止焦点向右
      setNextFocusNameRight('')
      clearTimeout(listTimer)
      listTimer = setTimeout(() => {
        lastPosition = evt.position
        contentRef.value?.loadContents(evt.item.id, expandAvailable.value, evt.item.type === SecondaryType.TEXT)
      }, 300)
    }
  }
}

function setExpandNextFocusNameRight(s: string) {
  expandBlockFocusDir.value = s === '' ? ['right'] : []
  expandRef.value?.setNextFocusNameRight(s)
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

<style scoped lang="scss" src="./scss/filter.scss"></style>
