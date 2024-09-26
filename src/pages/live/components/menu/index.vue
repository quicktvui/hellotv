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
        <qt-view class="menu-body-list-item" :type="1" :focusable="true" eventFocus>
          <qt-image class="menu-body-list-item-img" :src="icService" :focusable="false"></qt-image>
        </qt-view>
        <!-- 文字 -->
        <qt-view class="menu-body-list-item" :type="2" :focusable="true" eventFocus>
          <qt-text
            class="menu-body-list-item-text"
            text="${name}"
            typeface="bold"
            gravity="center"
            :focusable="false"
            duplicateParentState
          ></qt-text>
        </qt-view>
        <!-- 图标、文字 -->
        <qt-view class="menu-body-list-item" :type="3" :focusable="true" eventFocus>
          <qt-view style="background-color: transparent; flex-direction: row; align-items: center" :focusable="false" duplicateParentState>
            <qt-image class="menu-body-list-item-icon" :src="icMine" :focusable="false"></qt-image>
            <qt-text
              class="menu-body-list-item-text"
              style="width: 144px"
              text="${name}"
              typeface="bold"
              gravity="center"
              :focusable="false"
              duplicateParentState
            ></qt-text>
          </qt-view>
        </qt-view>
      </qt-list-view>

      <!-- 二级菜单 -->
      <qt-view v-show="showSecondList">
        <qt-list-view
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
          <qt-view class="menu-body-list-item" style="width: 400px" :type="1" :focusable="true" eventFocus>
            <qt-view
              style="background-color: transparent; flex-direction: row; align-items: center"
              :focusable="false"
              duplicateParentState
            >
              <qt-text
                class="menu-body-list-item-text"
                style="width: 110px; height: 52px"
                text="${id}"
                gravity="center"
                :focusable="false"
                duplicateParentState
              ></qt-text>
              <qt-view style="width: 270px; background-color: transparent" :focusable="false" duplicateParentState>
                <qt-text
                  class="menu-body-list-item-text"
                  style="width: 270px; height: 40px; font-size: 32px; line-height: 40px"
                  text="${name}"
                  gravity="center|start"
                  :focusable="false"
                  :lines="1"
                  :ellipsizeMode="2"
                  duplicateParentState
                ></qt-text>
                <qt-text
                  class="menu-body-list-item-text"
                  style="width: 230px; height: 40px; font-size: 24px"
                  text="${program}"
                  gravity="center|start"
                  :focusable="false"
                  :lines="1"
                  :ellipsizeMode="4"
                  duplicateParentState
                ></qt-text>
              </qt-view>
            </qt-view>
            <!-- 播放图标 -->
            <play-mark
              showIf="${isPlaying}"
              style="width: 20px; height: 20px; position: absolute; right: 19px; bottom: 26px"
              :markColor="'#FFFFFF'"
              :gap="-1"
              :focusable="false"
            />
          </qt-view>
        </qt-list-view>
      </qt-view>

      <!-- 三级菜单 -->
      <qt-view v-if="showThirdList">
        <qt-list-view
          class="menu-body-list"
          style="width: 417px"
          ref="thirdListRef"
          padding="17,72,0,0"
          :enableSelectOnFocus="false"
          :blockFocusDirections="['up', 'down']"
        >
          <qt-view class="menu-body-list-item" style="width: 380px" :type="1" :focusable="true">
            <qt-view style="background-color: transparent" :focusable="false" duplicateParentState>
              <qt-text
                class="menu-body-list-item-text"
                style="width: 296px; font-size: 32px; height: 52px"
                text="${program}"
                gravity="center|start"
                :focusable="false"
                duplicateParentState
              ></qt-text>
              <qt-view
                style="background-color: transparent; flex-direction: row; align-items: center"
                :focusable="false"
                duplicateParentState
              >
                <qt-text
                  class="menu-body-list-item-text"
                  style="width: 154px; height: 40px; font-size: 24px"
                  text="${time}"
                  gravity="center|start"
                  :focusable="false"
                  duplicateParentState
                ></qt-text>
                <qt-text
                  class="menu-body-list-item-text"
                  style="width: 96px; height: 40px; font-size: 24px"
                  text="${tips}"
                  gravity="center|start"
                  :focusable="false"
                  duplicateParentState
                ></qt-text>
              </qt-view>
            </qt-view>
            <play-mark
              showIf="${isPlaying}"
              style="width: 20px; height: 20px; position: absolute; right: 14px; bottom: 20px"
              :markColor="'#FFFFFF'"
              :gap="-1"
              :focusable="false"
            />
          </qt-view>
        </qt-list-view>
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
import { QTIListView } from '@quicktvui/quicktvui3'
import { mockPrograms } from '../../mock/program'
import icService from '../../../../assets/live/ic-service.png'
import icMine from '../../../../assets/live/ic-mine.png'
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

let curChannelId: string = ''
function onSecondListFocus(e) {
  if (e.isFocused) {
    isInit.value = false
    firstListRef.value?.setItemSelected(e.item.categoryId, true)
    showThirdList.value = false
    curChannelId = e.item.id
  }
}

function onKeyDown(keyEvent: ESKeyEvent) {
  switch (keyEvent.keyCode) {
    case ESKeyCode.ES_KEYCODE_DPAD_RIGHT:
      if (showSecondList.value && !showThirdList.value) {
        showThirdList.value = true
        setTimeout(() => {
          thirdListRef.value?.init(mockPrograms[curChannelId])
        }, 300)
      }
      break
  }
}

defineExpose({ onKeyDown })
</script>

<style scoped>
.menu {
  width: 1920px;
  height: 1080px;
  background-color: transparent;
}

.menu-body {
  width: 1126px;
  height: 1080px;
  background-color: transparent;
  flex-direction: row;
}

.menu-body-list {
  width: 300px;
  height: 1080px;
  background-color: #1b1b1b99;
}

.menu-body-list-item {
  width: 240px;
  height: 108px;
  background-color: transparent;
  border-radius: 12px;
  align-items: center;
  justify-content: center;
  focus-background-color: #3098ffff;
}

.menu-body-list-item-img {
  width: 151px;
  height: 37px;
  background-color: transparent;
}

.menu-body-list-item-text {
  width: 240px;
  height: 108px;
  background-color: transparent;
  color: rgba(255, 255, 255, 0.7);
  font-size: 36px;
  focus-color: #ffffff;
  select-color: #3098ffff;
}

.menu-body-list-item-icon {
  width: 30px;
  height: 38px;
  background-color: transparent;
  margin-right: 5px;
}

.menu-body-ext {
  width: 132px;
  height: 1080px;
  background-color: transparent;
}

.menu-back {
  width: 293px;
  height: 52px;
  background-color: transparent;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: absolute;
  right: 100px;
  bottom: 80px;
}

.menu-back span {
  font-size: 36px;
  color: #ffffff;
}

.menu-back-icon {
  width: 35px;
  height: 35px;
  margin-top: 4px;
  margin-left: 2px;
  margin-right: 2px;
}
</style>
