<template>
  <qt-view class="history-raw" :gradientBackground="{ colors: themeConfig.bgGradientColor, orientation: 4 }">
    <!-- 焦点占位, 解决页面跳焦的问题 -->
    <qt-view class="history-raw-focus-placeholder" :focusable="true"></qt-view>
    <!-- 左侧列表 -->
    <qt-view class="history-raw-sidebar" :descendantFocusability="isEditing ? 2 : 1" :blockFocusDirections="['up']">
      <!-- 顶部提示 -->
      <qt-text class="history-raw-sidebar-tips" text="全部记录" gravity="center|end" typeface="bold" :focusable="false"></qt-text>
      <!-- 数据渲染 -->
      <qt-list-view
        class="history-raw-sidebar-list"
        ref="sidebarRef"
        sid="sidebar"
        :listData="sidebarData"
        :autofocusPosition="sidebarDefaultPos"
        :clipChildren="false"
        @item-focused="onSidebarItemFocus"
      >
        <qt-view class="history-raw-sidebar-list-item" :type="ContentType.HORIZONTAL" :focusable="true" eventFocus eventClick>
          <qt-text
            class="history-raw-sidebar-list-item-text"
            text="${text}"
            gravity="center|end"
            :showOnState="'normal'"
            :focusable="false"
            :duplicateParentState="true"
          ></qt-text>
          <qt-text
            class="history-raw-sidebar-list-item-text"
            text="${text}"
            gravity="center|end"
            typeface="bold"
            :showOnState="['focused', 'selected']"
            :focusable="false"
            :duplicateParentState="true"
          ></qt-text>
        </qt-view>
      </qt-list-view>
    </qt-view>

    <!-- 右侧列表 -->
    <qt-view class="history-raw-content" :clipChildren="true" :descendantFocusability="contentDeny" :blockFocusDirections="['up']">
      <!-- 数据管理 -->
      <qt-view v-if="isEditing" class="history-raw-content-btns" sid="btns" :blockFocusDirections="['left']">
        <qt-view class="history-raw-content-btns-item" style="margin-right: 30px" :focusable="true" @click="onBtnClick('cancel')">
          <qt-text
            class="history-raw-content-btns-item-text"
            text="取消"
            gravity="center"
            :ellipsizeMode="4"
            :boldOnFocus="true"
            :focusable="false"
            :duplicateParentState="true"
          ></qt-text>
        </qt-view>
        <qt-view class="history-raw-content-btns-item" :focusable="true" @click="onBtnClick('clear')">
          <qt-text
            class="history-raw-content-btns-item-text"
            text="一键清空"
            gravity="center"
            :ellipsizeMode="4"
            :boldOnFocus="true"
            :focusable="false"
            :duplicateParentState="true"
          ></qt-text>
        </qt-view>
      </qt-view>
      <qt-text v-else class="history-raw-content-tips" text="按【菜单键】或长按【OK键】管理记录" gravity="center|end"></qt-text>

      <!-- 半屏loading -->
      <qt-view
        v-if="isLoading"
        class="history-raw-content-loading"
        :gradientBackground="{ colors: ['#1A2029', '#00040B'], orientation: 0 }"
      >
        <qt-loading-view style="height: 100px; width: 100px" color="rgba(21,122,252,0.3)" :focusable="false"></qt-loading-view>
      </qt-view>

      <!-- 暂无数据 -->
      <qt-view v-if="isEmpty" class="history-raw-content-empty">
        <qt-image style="width: 160px; height: 142px; margin-bottom: 25px" :src="icEmpty"></qt-image>
        <qt-text class="history-raw-content-empty-text" text="暂无数据" gravity="center"></qt-text>
      </qt-view>

      <!-- 数据渲染 -->
      <qt-grid-view
        v-if="showGridView"
        class="history-raw-content-grid"
        ref="gridRef"
        :listData="contentData"
        :useDiff="true"
        :spanCount="config.gridSpanCount"
        :clipChildren="false"
        :verticalFadingEdgeEnabled="true"
        :nextFocusUpSID="'btns'"
        :nextFocusLeftSID="'sidebar'"
        :enableItemAnimator="false"
        :refocusType="'KeepPosition'"
        :openPage="true"
        :preloadNo="12"
        :listenBoundEvent="true"
        :listenHasFocusChange="true"
        :loadMore="onContentloadMore"
        @item-focused="onContentItemFocus"
        @item-click="onContentItemClick"
        @scroll-state-changed="onScrollStateChanged"
      >
        <!-- 常规 -->
        <grid-item-horizontal
          :type="ContentType.HORIZONTAL"
          :style="{ width: `325px`, height: lastIndex === 0 ? `266px` : `232px` }"
          :imageStyle="{ width: `325px`, height: `186px`, borderRadius: `${themeConfig.focusBorderCorner}px` }"
          :placeholderLayout="[-5, -5, 325, 186]"
        />
        <grid-item-vertical :type="ContentType.VERTICAL" :style="{ width: `260px`, height: lastIndex === 0 ? `448px` : `414px` }" />
        <!-- 分页样式 -->
        <template #loading>
          <qt-view
            style="width: 1460px; height: 100px; background-color: transparent; align-items: center; justify-content: center"
            :type="1002"
            :focusable="false"
            :disablePlaceholder="true"
          >
            <qt-loading-view style="height: 40px; width: 40px" name="loading" color="rgba(255,255,255,0.3)" :focusable="false" />
          </qt-view>
        </template>
        <!-- 到底提示 -->
        <template #footer>
          <qt-text
            class="history-raw-content-grid-item-end-text"
            :type="ContentType.End"
            text="已经到底啦，按【返回键】回到顶部"
            gravity="center"
            :focusable="false"
            :disablePlaceholder="true"
          ></qt-text>
        </template>
      </qt-grid-view>
    </qt-view>
  </qt-view>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { ESKeyEvent, useESEventBus, useESToast } from '@extscreen/es3-core'
import { useESRouter } from '@extscreen/es3-router'
import { qtRef, QTIListView, QTListViewItem } from '@quicktvui/quicktvui3'
import { buildContents, buildEndContent } from './adapter/index'
import { ContentType } from './adapter/interface'
import gridItemHorizontal from '../../components/grid-item-horizontal.vue'
import gridItemVertical from '../../components/grid-item-vertical.vue'
import historyManager from './api/index'
import launch from '../../tools/launch'
import icEmpty from '../../assets/history/ic_empty.png'
import themeConfig from '../../config/theme-config'
import config from './config'

const toast = useESToast()
const router = useESRouter()
const eventBus = useESEventBus()
const isLoading = ref<boolean>(false)
const isEmpty = ref<boolean>(false)
const isEditing = ref<boolean>(false)
const sidebarRef = ref<QTIListView>()
const sidebarData = qtRef<QTListViewItem[]>()
const sidebarDefaultPos = ref<number>(0)
const gridRef = ref<QTIListView>()
const showGridView = ref<boolean>(true)
const contentDeny = ref<number>(1)
const contentData = qtRef<QTListViewItem[]>([])
const lastIndex = ref<number>(-1)

let page = 1
let stopPage = false

watch(
  () => isEditing.value,
  (newVal) => {
    updateGridItemShowDeleteCoverState(newVal)
  }
)

function onESCreate({ menuIndex = 0 } = {}) {
  eventBus.on('clearPageData', clearPageData)
  // 设置默认焦点
  sidebarDefaultPos.value = Number(menuIndex)
  // 初始化左侧列表
  sidebarData.value = [
    { type: 1, id: 1, text: '观看历史' },
    { type: 1, id: 2, text: '我的收藏' }
  ]
}

onUnmounted(() => {
  eventBus.off('clearPageData')
})

let lastFocusName = ''
let sidebarTimer: any = -1
function onSidebarItemFocus(evt) {
  if (evt.isFocused) {
    lastFocusName = 'sidebar'

    // 屏蔽右侧焦点
    contentDeny.value = 2

    clearTimeout(sidebarTimer)
    sidebarTimer = setTimeout(() => {
      if (lastIndex.value !== evt.position) {
        page = 1
        stopPage = false
        isResume = false
        lastIndex.value = evt.position
        isLoading.value = true
        showGridView.value = false
        contentData.value.splice(0)
        // 加载新数据
        setTimeout(() => {
          showGridView.value = true
          loadRecords(lastIndex.value)
        }, 300)
      } else {
        contentDeny.value = 1
      }
    }, 300)
  }
}

let lastGridItemIndex = -1
function onContentItemFocus(evt) {
  if (evt.isFocused) {
    lastFocusName = 'content'
    lastGridItemIndex = evt.position
    // 更新节点删除遮罩状态
    updateGridItemShowDeleteCoverState(isEditing.value)
  }
}

let deleteTimer: any = -1
function checkAndHandleDeletion() {
  // 等于13条删除到底提示
  if (contentData.value.length === 13) {
    clearTimeout(deleteTimer)
    deleteTimer = setTimeout(() => {
      contentData.value.splice(12, 1)
    }, 300)
  }

  // 全部删除完毕
  if (contentData.value.length === 0) {
    isEditing.value = false
    isEmpty.value = true
    offsetY = 0
    setTimeout(() => {
      sidebarRef.value?.setItemFocused(lastIndex.value)
    }, 300)
  }
}

function onContentItemClick(evt) {
  if (isEditing.value) {
    historyManager
      .delRecords('xxx', lastIndex.value === 0 ? 'history' : 'favorite', contentData.value[evt.position].id)
      .then(() => {
        contentData.value.splice(evt.position, 1)
        checkAndHandleDeletion()
      })
      .catch(() => {
        toast.showToast('删除失败')
      })
  } else {
    isResume = true
    launch.launchDetail(contentData.value[evt.position].id)
  }
}

let loadingDelayTimer: any = -1
async function loadRecords(menuIndex: number, page: number = 1, limit: number = config.contentsLimit) {
  const records = await historyManager.getRecords('xxx', menuIndex === 0 ? 'history' : 'favorite', page, limit)
  if (page === 1) {
    contentData.value = buildContents(records, lastIndex.value)
  } else {
    contentData.value.push(...buildContents(records, lastIndex.value))
  }

  // 停止分页
  if (contentData.value.length < config.contentsLimit * page) {
    gridRef.value?.stopPage()
    stopPage = true
    // 到底提示
    if (contentData.value.length > 12) {
      contentData.value.push(buildEndContent())
    }
  }

  // 暂无数据
  isEmpty.value = contentData.value.length === 0

  // 延迟关闭loading
  clearTimeout(loadingDelayTimer)
  loadingDelayTimer = setTimeout(() => {
    isLoading.value = false
    contentDeny.value = 1

    // 重刷数据时主动设置焦点
    if (isResume && lastFocusName === 'content') {
      gridRef.value?.scrollToFocused(0)
    }
  }, 300)
}

function onContentloadMore() {
  if (!stopPage) {
    loadRecords(lastIndex.value, ++page)
  }
}

let offsetY = 0
function onScrollStateChanged(evt) {
  offsetY = evt.offsetY
}

let cancelTimer: any = -1
function cancelEdit() {
  isEditing.value = false
  contentData.value.map((item) => (item.showDeleteCover = false))
  clearTimeout(cancelTimer)
  cancelTimer = setTimeout(() => {
    gridRef.value?.setItemFocused(lastGridItemIndex)
  }, 150)
}

function onBtnClick(name: 'cancel' | 'clear') {
  if (name === 'cancel') {
    cancelEdit()
  } else {
    isResume = false
    router.push({
      name: 'confirm',
      params: { text: '清空之后什么都没有了哦～', btnL: '确定', btnR: '取消', menuIndex: lastIndex.value, clearHistory: true }
    })
  }
}

// 更新节点删除遮罩状态
function updateGridItemShowDeleteCoverState(bool: boolean) {
  // 检查 contentData 是否为空或 lastGridItemIndex 是否超出范围
  if (!contentData.value || lastGridItemIndex < 0 || lastGridItemIndex >= contentData.value.length) {
    qt.log.e('ok->', 'Invalid index or contentData not initialized.')
  } else {
    // 更新指定网格项的删除遮罩状态
    contentData.value[lastGridItemIndex].showDeleteCover = bool
  }
}

let clearTimer: any = -1
function clearPageData() {
  isEmpty.value = true
  isEditing.value = false
  // 清空本地数据
  contentData.value = []
  // 设置默认焦点
  clearTimeout(clearTimer)
  clearTimer = setTimeout(() => {
    sidebarRef.value?.setItemFocused(lastIndex.value)
  }, 200)
}

let oKCounter = 0
let leftCounter = 0
function onKeyDown(keyEvent: ESKeyEvent) {
  if (lastFocusName === 'content') {
    switch (keyEvent.keyCode) {
      case 82: // 菜单键
        isEditing.value = true
        break
      case 23: // 长按OK键
        if ((oKCounter++, oKCounter > 10)) {
          isEditing.value = true
          oKCounter = 0
        }
        break
      default:
        oKCounter = 0
    }
  } else if (lastFocusName === 'sidebar' && keyEvent.keyCode === 21) {
    if ((leftCounter++, leftCounter > 10)) {
      toast.showToast('生成数据')
      leftCounter = 0
      historyManager.generateRecords('xxx', lastIndex.value === 0 ? 'history' : 'favorite')
    }
  } else {
    leftCounter = 0
  }
}

let isResume = false
function onESResume() {
  // 重刷数据
  if (isResume) {
    page = 1
    stopPage = false
    isLoading.value = true
    loadRecords(lastIndex.value)
  }
}

function onBackPressed() {
  // 编辑状态检查
  if (isEditing.value) {
    cancelEdit()
    return
  }

  // 右侧内容滚动状态检查
  if (offsetY > 0) {
    gridRef.value?.scrollToFocused(0)
    return
  }

  // 左侧列表焦点
  if (lastFocusName !== 'sidebar') {
    sidebarRef.value?.setItemFocused(lastIndex.value)
    return
  }

  router.back()
}

defineExpose({ onESCreate, onKeyDown, onESResume, onBackPressed })
</script>

<style scoped lang="scss" src="./scss/history-raw.scss"></style>
