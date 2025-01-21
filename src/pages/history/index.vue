<template>
  <qt-view class="history" :gradientBackground="{ colors: themeConfig.rootBgGradientColor, orientation: 4 }">
    <!-- 左侧列表 -->
    <qt-view class="history-sidebar">
      <qt-ul class="history-sidebar" ref="sidebarRef" :items="sidebarData" @item-focused="onSidebarItemFocus">
        <template #item="{ item }">
          <qt-view class="history-sidebar-item" :type="1" :focusable="true" eventFocus eventClick>
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
    <qt-view class="history-content"></qt-view>
  </qt-view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useESToast } from '@extscreen/es3-core'
import { QTListViewItem } from '@quicktvui/quicktvui3'
import themeConfig from '../../config/theme-config'

const toast = useESToast()
const sidebarRef = ref()
const sidebarData = ref<QTListViewItem[]>([])

onMounted(() => {
  sidebarData.value = [
    { type: 1, itemSize: 106, text: '观看历史' },
    { type: 1, itemSize: 106, text: '我的收藏' },
    { type: 1, itemSize: 106, text: '已购内容' }
  ]
})

function onSidebarItemFocus(evt) {
  console.log('ok->', evt)
  if (evt.isFocused) {
    toast.showToast(`${evt.item.text}`)
  }
}
</script>

<style scoped lang="scss" src="./scss/history.scss"></style>
