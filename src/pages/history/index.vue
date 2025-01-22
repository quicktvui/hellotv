<template>
  <qt-view class="history" :gradientBackground="{ colors: themeConfig.rootBgGradientColor, orientation: 4 }">
    <!-- 左侧列表 -->
    <qt-view class="history-sidebar">
      <!-- 顶部提示 -->
      <qt-text class="history-sidebar-tips" text="全部记录" gravity="center" :focusable="false"></qt-text>

      <!-- 数据渲染 -->
      <qt-ul class="history-sidebar" :items="sidebarData">
        <template #default="{ index, item }">
          <qt-view class="history-sidebar-item" :type="1" :focusable="true" @focus="(e) => onSidebarItemFocus(e, index)">
            <qt-text
              class="history-sidebar-item-text"
              :text="item.text"
              gravity="center"
              :showOnState="['normal', 'selected']"
              :focusable="false"
              :duplicateParentState="true"
            ></qt-text>
            <qt-text
              class="history-sidebar-item-text"
              :text="item.text"
              gravity="center"
              :showOnState="'focused'"
              :focusable="false"
              :duplicateParentState="true"
            ></qt-text>
          </qt-view>
        </template>
      </qt-ul>
    </qt-view>

    <!-- 右侧列表 -->
    <qt-view class="history-content" :clipChildren="true">
      <!-- 数据管理 -->
      <qt-view v-if="isEditing" class="history-content-btns">
        <qt-button text="取消" :style="btnStyle" :textStyle="textStyle" :focusScale="1" @click="onBtnClick('cancel')" />
        <qt-button text="一键清空" :style="btnStyle" :textStyle="textStyle" :focusScale="1" @click="onBtnClick('clear')" />
      </qt-view>
      <qt-text v-else class="history-content-tips" text="按【菜单键】或长按【OK键】管理记录" gravity="center|end"></qt-text>

      <!-- 半屏loading -->
      <qt-view v-if="isLoading" class="history-content-loading" :gradientBackground="{ colors: ['#1A2029', '#00040B'], orientation: 0 }">
        <qt-loading-view style="height: 100px; width: 100px" color="rgba(21,122,252,0.3)" :focusable="false"></qt-loading-view>
      </qt-view>

      <!-- 暂无数据 -->
      <qt-view v-if="isEmpty" class="history-content-empty">
        <qt-image style="width: 186px; height: 174px; margin-bottom: 35px" :src="icEmpty"></qt-image>
        <qt-text class="history-content-empty-text" text="暂无数据" gravity="center"></qt-text>
      </qt-view>

      <!-- 数据渲染 -->
      <qt-ul class="history-content-ul" :items="contentData" :spanCount="4" :clipChildren="false" :verticalFadingEdgeEnabled="true">
        <template #default="{ index, item }">
          <!-- 常规 -->
          <qt-view class="history-content-ul-item" v-if="item.type === 1" :focusable="true" @click="onContentItemClick(index)">
            <!-- 焦点状态下的删除样式 -->
            <qt-view
              class="history-content-ul-item-delete"
              v-if="isEditing"
              :showOnState="'focused'"
              :focusable="false"
              :duplicateParentState="true"
            >
              <qt-image style="width: 40px; height: 50px" :src="icDelete" :focusable="false"></qt-image>
            </qt-view>
            <qt-image
              style="width: 325px; height: 186px; background-color: transparent; border-radius: 16px"
              :src="item.image"
              :enableFocusBorder="true"
              :focusable="false"
              :duplicateParentState="true"
            ></qt-image>
            <qt-view style="height: 40px; background-color: transparent; margin-top: 11px" :focusable="false" :duplicateParentState="true">
              <qt-text
                class="history-content-ul-item-title"
                :text="item.title"
                gravity="center|start"
                :showOnState="['normal', 'selected']"
                :focusable="false"
                :duplicateParentState="true"
              ></qt-text>
              <qt-text
                class="history-content-ul-item-title"
                :text="item.title"
                gravity="center|start"
                :showOnState="'focused'"
                :focusable="false"
                :duplicateParentState="true"
              ></qt-text>
            </qt-view>
            <qt-text
              class="history-content-ul-item-progress"
              :text="'看至 ' + item.progress"
              gravity="center|start"
              :focusable="false"
            ></qt-text>
          </qt-view>
          <!-- 到底提示 -->
          <qt-view class="history-content-ul-item-end" v-if="item.type === 1000" :focusable="false">
            <qt-text
              class="history-content-ul-item-end-text"
              text="已经到底啦，按【返回键】回到顶部"
              gravity="center"
              :focusable="false"
            ></qt-text>
          </qt-view>
        </template>
      </qt-ul>
    </qt-view>
  </qt-view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ESKeyEvent, useESToast } from '@extscreen/es3-core'
import { useESRouter } from '@extscreen/es3-router'
import { QTListViewItem } from '@quicktvui/quicktvui3'
import { buildMockData } from './mock'
import icEmpty from '../../assets/history/ic_empty.png'
import icDelete from '../../assets/history/ic_delete.png'
import themeConfig from '../../config/theme-config'

const toast = useESToast()
const router = useESRouter()
const isLoading = ref<boolean>(false)
const isEmpty = ref<boolean>(false)
const isEditing = ref<boolean>(false)
const sidebarData = ref<QTListViewItem[]>([])
const contentData = ref<QTListViewItem[]>([])
const btnStyle = {
  width: `180px`,
  height: `60px`,
  borderRadius: `34px`,
  backgroundColor: 'rgba(255, 255, 255, 0.06)',
  focusBackgroundColor: '#FFFFFF',
  marginLeft: '30px'
}
const textStyle = {
  color: 'rgba(255, 255, 255, 0.55)',
  fontSize: `30px`,
  focusColor: '#13161B'
}

onMounted(() => {
  sidebarData.value = [
    { type: 1, itemSize: 106, id: 1, text: '观看历史' },
    { type: 1, itemSize: 106, id: 2, text: '我的收藏' },
    { type: 1, itemSize: 106, id: 3, text: '已购内容' }
  ]
  contentData.value = buildMockData()
})

let lastIndex = 0
let loadingDelayTimer: any = -1
function onSidebarItemFocus(evt, index) {
  if (evt.isFocused && lastIndex !== index) {
    lastIndex = index
    isLoading.value = true
    // switch (index) {
    //   case 0:
    //     contentData.value = buildMockData()
    //     break
    //   case 1:
    //     contentData.value = buildMockData(sidebarData.value[index].text, 10)
    //     break
    //   default:
    //     contentData.value = []
    // }
    isEmpty.value = contentData.value.length === 0

    // 延迟关闭loading
    clearTimeout(loadingDelayTimer)
    loadingDelayTimer = setTimeout(() => (isLoading.value = false), 300)
  }
}

function onContentItemClick(index) {
  if (isEditing.value) {
    contentData.value.splice(index, 1)
  } else {
    toast.showToast(`跳转->${index}`)
  }
}

function onBtnClick(name: 'cancel' | 'clear') {
  if (name === 'cancel') {
    isEditing.value = false
  } else {
    toast.showToast('弹窗二次确认')
  }
}

let oKCounter = 0
function onKeyDown(keyEvent: ESKeyEvent) {
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
}

function onBackPressed() {
  // 编辑状态检查
  if (isEditing.value) {
    isEditing.value = false
    return
  }

  router.back()
}

defineExpose({ onKeyDown, onBackPressed })
</script>

<style scoped lang="scss" src="./scss/history.scss"></style>
