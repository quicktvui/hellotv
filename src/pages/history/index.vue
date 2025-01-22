<template>
  <qt-view class="history" :gradientBackground="{ colors: themeConfig.rootBgGradientColor, orientation: 4 }">
    <!-- 左侧列表 -->
    <qt-view class="history-sidebar">
      <qt-text class="history-sidebar-tips" text="全部记录" gravity="center" :focusable="false"></qt-text>
      <qt-ul class="history-sidebar" :items="sidebarData">
        <template #item="{ index, item }">
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
      <!-- 右侧提示词 -->
      <qt-text class="history-content-tips" text="按【菜单键】或长按【OK键】管理记录" gravity="center|end"></qt-text>
      <qt-ul class="history-content-ul" :items="contentData" :spanCount="4" :clipChildren="false" :verticalFadingEdgeEnabled="true">
        <template #item="{ index, item }">
          <!-- 常规 -->
          <qt-view class="history-content-ul-item" v-if="item.type === 1" :focusable="true" @click="onContentItemClick(index)">
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
          <qt-view class="history-content-ul-item-end" v-else :focusable="false">
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
import { useESToast } from '@extscreen/es3-core'
import { QTListViewItem } from '@quicktvui/quicktvui3'
import { buildMockData } from './mock'
import themeConfig from '../../config/theme-config'

const toast = useESToast()
const sidebarData = ref<QTListViewItem[]>([])
const contentData = ref<QTListViewItem[]>([])

onMounted(() => {
  sidebarData.value = [
    { type: 1, itemSize: 106, id: 1, text: '观看历史' },
    { type: 1, itemSize: 106, id: 2, text: '我的收藏' },
    { type: 1, itemSize: 106, id: 3, text: '已购内容' }
  ]
  contentData.value = buildMockData()
})

function onSidebarItemFocus(e, index) {
  if (e.isFocused) {
    toast.showToast('焦点事件')
  }
}

function onContentItemClick(index) {
  toast.showToast(`点击事件->${index}`)
}
</script>

<style scoped lang="scss" src="./scss/history.scss"></style>
