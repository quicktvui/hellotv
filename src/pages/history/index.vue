<template>
  <qt-view class="history" :gradientBackground="{ colors: themeConfig.rootBgGradientColor, orientation: 4 }">
    <!-- 左侧列表 -->
    <qt-view class="history-sidebar">
      <qt-text class="history-sidebar-tips" text="全部记录" gravity="center" :focusable="false"></qt-text>
      <qt-ul class="history-sidebar" :items="sidebarData">
        <template #item="{ item }">
          <qt-view class="history-sidebar-item" :type="1" :focusable="true" @focus="onSidebarItemFocus">
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
    <qt-view class="history-content" style="padding-left: 80px; padding-top: 106px">
      <qt-ul class="history-content" :items="contentData" :spanCount="4" :clipChildren="false">
        <template #item="{ item }">
          <!-- 常规 -->
          <qt-view class="history-content-item" v-if="item.type === 1" :focusable="true" @click="onContentItemClick">
            <qt-image
              style="width: 325px; height: 186px; background-color: transparent; border-radius: 16px"
              :src="item.image"
              :enableFocusBorder="true"
              :focusable="false"
              :duplicateParentState="true"
            ></qt-image>
            <qt-view style="height: 40px; background-color: transparent; margin-top: 11px" :focusable="false" :duplicateParentState="true">
              <qt-text
                class="history-content-item-title"
                :text="item.title"
                gravity="center|start"
                :showOnState="['normal', 'selected']"
                :focusable="false"
                :duplicateParentState="true"
              ></qt-text>
              <qt-text
                class="history-content-item-title"
                :text="item.title"
                gravity="center|start"
                :showOnState="'focused'"
                :focusable="false"
                :duplicateParentState="true"
              ></qt-text>
            </qt-view>
            <qt-text
              class="history-content-item-progress"
              :text="'看至 ' + item.progress"
              gravity="center|start"
              :focusable="false"
            ></qt-text>
          </qt-view>
          <!-- 到底提示 -->
          <qt-view class="history-content-item-end" v-else :focusable="false">
            <qt-text
              class="history-content-item-end-text"
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
import { numberToChinese } from '../../tools/index'
import themeConfig from '../../config/theme-config'

const toast = useESToast()
const sidebarData = ref<QTListViewItem[]>([])
const contentData = ref<QTListViewItem[]>([])

onMounted(() => {
  sidebarData.value = [
    { type: 1, itemSize: 106, text: '观看历史' },
    { type: 1, itemSize: 106, text: '我的收藏' },
    { type: 1, itemSize: 106, text: '已购内容' }
  ]

  let arr: any = []
  for (let i = 1; i <= 100; i++) {
    arr.push({
      type: 1,
      itemSize: 186,
      title: `第${numberToChinese(i)}回`,
      progress: `${i}%`,
      image: 'https://extcdn.hsrc.tv/channelzero_image/2023/12/15/5e84c591-038c-47d1-a266-46058d229d3b.png',
      decoration: { right: 40, bottom: 40 }
    })
  }
  arr.push({ type: 1000, itemSize: 100 })
  contentData.value = arr
})

function onSidebarItemFocus(evt) {
  console.log('ok->focus', evt)
  if (evt.isFocused) {
    toast.showToast('焦点事件')
  }
}

function onContentItemClick(evt) {
  console.log('ok->click', evt)
  toast.showToast('点击事件')
}
</script>

<style scoped lang="scss" src="./scss/history.scss"></style>
