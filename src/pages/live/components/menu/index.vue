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
        :autofocusPosition="isInit ? 0 : -1"
        :enableSelectOnFocus="false"
        :autoscroll="[secondListItemScrollPos, 432]"
        :blockFocusDirections="['up', 'down']"
        @item-focused="onSecondListFocus"
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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ESKeyEvent, ESKeyCode } from '@extscreen/es3-core'
import { QTIListView, QTListViewItem } from '@quicktvui/quicktvui3'
import { mockPrograms } from '../../mock/program'
import firstListItemImg from './first-list-item-img.vue'
import firstListItemText from './first-list-item-text.vue'
import firstListItemIconText from './first-list-item-icon-text.vue'
import secondListItem from './second-list-item.vue'
import thirdListItem from './third-list-item.vue'
import icMenuExt from '../../../../assets/live/ic-menu-ext.png'
import icMenuExtArrow from '../../../../assets/live/ic-menu-ext-arrow.png'
import icBack from '../../../../assets/live/ic-back.png'

const isInit = ref(true)
const firstListRef = ref<QTIListView>()
const secondListRef = ref<QTIListView>()
const secondListItemScrollPos = ref(0)
const thirdListRef = ref<QTIListView>()

const showSecondList = ref(true)
const showThirdList = ref(false)

let thirdListData: QTListViewItem[] = []

onMounted(() => {
  firstListRef.value?.init([
    { type: 1, name: '开通服务' },
    { type: 2, id: 1, name: '央视频道', startIndex: 0 },
    { type: 2, id: 2, name: '卫视频道', startIndex: 3 },
    { type: 2, id: 3, name: '热门频道', startIndex: 6 },
    { type: 3, name: '个人中心' }
  ])
  secondListRef.value?.init([
    { type: 1, categoryId: 1, id: '001', name: 'CCTV-1高清', program: '我的阿勒泰02', isVip: true },
    { type: 1, categoryId: 1, id: '002', name: 'CCTV-2高清', program: '舌尖上的中国' },
    { type: 1, categoryId: 1, id: '003', name: 'CCTV-3高清', program: '在中国大地上边走边边边边边', isPlaying: true },
    { type: 1, categoryId: 2, id: '004', name: 'CCTV-4高清', program: '边水往事08' },
    { type: 1, categoryId: 2, id: '005', name: 'CCTV-5高清', program: '边水往事09' },
    { type: 1, categoryId: 2, id: '006', name: 'CCTV-6高清', program: '龙的传人' },
    { type: 1, categoryId: 3, id: '007', name: 'CCTV-7高清', program: '新闻联播' },
    { type: 1, categoryId: 3, id: '008', name: 'CCTV-8高清', program: '国足0-7大败日本' },
    { type: 1, categoryId: 3, id: '009', name: 'CCTV-9高清', program: '大头儿子小头爸爸' },
    { type: 1, categoryId: 3, id: '010', name: 'CCTV-10高清', program: '家有喜事2022' }
  ])
})

function onFirstListFocus(e) {
  if (e.isFocused) {
    showThirdList.value = false
    switch (e.item.type) {
      case 1:
      case 3:
        showSecondList.value = false
        break
      default:
        showSecondList.value = true
        secondListItemScrollPos.value = e.item.startIndex
    }
  }
}

let secondListActive = false
let curChannel: QTListViewItem = {} as QTListViewItem
function onSecondListFocus(e) {
  if (e.isFocused) {
    secondListActive = true
    curChannel = e.item
    isInit.value = false
    firstListRef.value?.setItemSelected(curChannel.categoryId, true)
    showThirdList.value = false
  } else {
    secondListActive = false
  }
}

function onKeyDown(keyEvent: ESKeyEvent) {
  switch (keyEvent.keyCode) {
    case ESKeyCode.ES_KEYCODE_DPAD_RIGHT:
      if (secondListActive && !showThirdList.value) {
        showThirdList.value = true
        thirdListData = mockPrograms[curChannel.id]
        if (thirdListData) {
          setTimeout(() => thirdListRef.value?.init(thirdListData), 300)
        }
      }
      break
  }
}

defineExpose({ onKeyDown })
</script>

<style scoped src="../../css/menu.css"></style>
