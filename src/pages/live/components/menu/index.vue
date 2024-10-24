<template>
  <qt-view class="menu">
    <!-- 菜单 -->
    <qt-view class="menu-body">
      <!-- 一级菜单 -->
      <qt-list-view
        class="menu-body-list"
        style="width: 309px"
        ref="firstListRef"
        padding="52,72,17,0"
        :focusable="false"
        :skipRequestFocus="true"
        :singleSelectPosition="autoselectPosition"
        :blockFocusDirections="['up', 'down']"
        @item-focused="onFirstListFocus"
      >
        <!-- 图片 -->
        <firstListItemImg />
        <!-- 文字 -->
        <firstListItemText />
        <!-- 图标、文字 -->
        <firstListItemIconText />
      </qt-list-view>

      <!-- 二级菜单 -->
      <qt-list-view
        :visibility="showSecondList ? 'visible' : 'invisible'"
        class="menu-body-list"
        style="width: 400px"
        ref="secondListRef"
        padding="0,72,0,0"
        :skipRequestFocus="true"
        :enableSelectOnFocus="false"
        :autofocusPosition="autofocusPosition"
        :autoscroll="[secondListScrollPos, 432]"
        :singleSelectPosition="secondListSelectPos"
        :blockFocusDirections="['up', 'down']"
        @item-focused="onSecondListFocus"
        @item-click="onSecondListClick"
      >
        <!-- 综合 -->
        <secondListItem />
      </qt-list-view>

      <!-- 三级菜单 -->
      <qt-view v-if="showThirdList">
        <!-- 数据列表 -->
        <qt-list-view
          v-if="thirdListData"
          class="menu-body-list"
          style="width: 417px"
          ref="thirdListRef"
          padding="17,72,0,0"
          :enableSelectOnFocus="false"
          :blockFocusDirections="['up', 'down']"
          @item-focused="onThirdListFocus"
          @item-click="onThirdListClick"
        >
          <!-- 综合 -->
          <thirdListItem />
        </qt-list-view>

        <!-- 暂无数据 -->
        <qt-view v-else class="menu-body-list" style="align-items: center; justify-content: center">
          <qt-text class="menu-body-list-nodata" text="暂无节目信息" gravity="center"></qt-text>
        </qt-view>
      </qt-view>

      <!-- 向右扩展 -->
      <qt-view v-show="showSecondList && !showThirdList" class="menu-body-ext">
        <qt-image style="width: 132px; height: 1080px" :src="icMenuExt" :focusable="false"></qt-image>
        <qt-image
          style="width: 24px; height: 24px; position: absolute; top: 528px; right: 8px"
          :src="icMenuExtArrow"
          :focusable="false"
        ></qt-image>
        <qt-text
          style="width: 36px; height: 184px; color: #ffffff; font-size: 36px; position: absolute; top: 448px; left: 28px"
          text="节目信息"
          :focusable="false"
        ></qt-text>
      </qt-view>
    </qt-view>

    <!-- 返回提示 -->
    <qt-view class="menu-back">
      <span>按</span>
      <img class="menu-back-icon" :src="icBack" :focusable="false" />
      <span>键可全屏观看</span>
    </qt-view>
  </qt-view>
</template>

<script setup lang="ts" name="channelMenu">
import { onMounted, onUnmounted, ref } from 'vue'
import { useESToast, ESKeyEvent, ESKeyCode, useESEventBus } from '@extscreen/es3-core'
import { QTIListView, QTListViewItem } from '@quicktvui/quicktvui3'
import firstListItemImg from './first-list-item-img.vue'
import firstListItemText from './first-list-item-text.vue'
import firstListItemIconText from './first-list-item-icon-text.vue'
import secondListItem from './second-list-item.vue'
import thirdListItem from './third-list-item.vue'
import icMenuExt from '../../../../assets/live/ic-menu-ext.png'
import icMenuExtArrow from '../../../../assets/live/ic-menu-ext-arrow.png'
import icBack from '../../../../assets/live/ic-back.png'

const emits = defineEmits(['loadPrograms', 'playMediaByIndex', 'closeMenu'])

const toast = useESToast()
const eventBus = useESEventBus()
onMounted(() => {
  eventBus.on('setPlayIndex', (index: number) => {
    secondListData.forEach((el, elIndex) => {
      if (elIndex === index) {
        el.isPlaying = true
        autoselectPosition.value = el.categoryIndex
        autofocusPosition.value = elIndex
        secondListSelectPos.value = elIndex
      } else {
        el.isPlaying = false
      }
    })
  })
})
onUnmounted(() => {
  eventBus.off('setPlayIndex')
})

const autoselectPosition = ref(1)
const autofocusPosition = ref(0)
const firstListRef = ref<QTIListView>()
const secondListRef = ref<QTIListView>()
const secondListScrollPos = ref(0)
const secondListSelectPos = ref(0)
const thirdListRef = ref<QTIListView>()

const showSecondList = ref(true)
const showThirdList = ref(false)

let secondListData: QTListViewItem[] = []
let thirdListData: QTListViewItem[] = []

function init(params: { categories: QTListViewItem[]; channels: QTListViewItem[] }) {
  firstListRef.value?.init(params.categories)
  secondListData = secondListRef.value?.init(params.channels) as QTListViewItem[]
}

let closeTimer: any = -1
function close() {
  clearTimeout(closeTimer)
  closeTimer = setTimeout(() => emits('closeMenu'), 8000)
}

function onFirstListFocus(e) {
  if (e.isFocused) {
    close()
    showThirdList.value = false
    switch (e.item.type) {
      case 1:
      case 3:
        showSecondList.value = false
        break
      default:
        showSecondList.value = true
        secondListScrollPos.value = e.item.startIndex
    }
  }
}

let secondListActive = false
let curChannel: QTListViewItem = {} as QTListViewItem
let secondListTimer: any = -1
function onSecondListFocus(e) {
  close()
  clearTimeout(secondListTimer)
  secondListTimer = setTimeout(() => {
    if (e.isFocused) {
      secondListActive = true
      curChannel = e.item
      firstListRef.value?.setItemSelected(curChannel.categoryIndex, true)
      showThirdList.value = false
    } else {
      secondListActive = false
    }
  }, 300)
}

function onSecondListClick(e) {
  emits('playMediaByIndex', e.index)
}

function onThirdListFocus(e) {
  if (e.isFocused) close()
}

function onThirdListClick(e) {
  if (e.item.isPlaying) {
    emits('closeMenu')
  } else {
    toast.showToast('节目尚未开始，请您稍后再看')
  }
}

function onKeyDown(keyEvent: ESKeyEvent) {
  switch (keyEvent.keyCode) {
    case ESKeyCode.ES_KEYCODE_DPAD_RIGHT:
      if (secondListActive && !showThirdList.value) {
        emits('loadPrograms', curChannel.id, (programs: QTListViewItem[]) => {
          thirdListData = programs
        })
        showThirdList.value = true
        if (thirdListData) {
          setTimeout(() => thirdListRef.value?.init(thirdListData), 300)
        }
      }
      break
  }
}

function onBackPressed() {
  showSecondList.value = true
  showThirdList.value = false
}

defineExpose({ init, onKeyDown, onBackPressed })
</script>

<style scoped src="../../css/menu.css"></style>
