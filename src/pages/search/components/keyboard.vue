<template>
  <qt-view class="search-keyboard">
    <!-- 输入框 -->
    <qt-view class="search-keyboard-input">
      <qt-image class="search-keyboard-input-icon" :src="icSearch" :focusable="false"></qt-image>
      <qt-text class="search-keyboard-input-text" :textSpan="inputText"></qt-text>
    </qt-view>
    <!-- 输入框底部横线 -->
    <qt-view class="search-keyboard-input-bottom"></qt-view>
    <!-- 按钮区域 -->
    <qt-view class="search-keyboard-btns">
      <qt-button
        text="清空"
        :style="btnStyle"
        :textStyle="textStyle"
        :icon="icClear"
        :focusIcon="icClearFocused"
        @click="onBtnClick('clear')"
      />
      <qt-button
        text="退格"
        :style="btnStyle"
        :textStyle="textStyle"
        :icon="icBack"
        :focusIcon="icBackFocused"
        @click="onBtnClick('back')"
      />
    </qt-view>
    <!-- 键盘区域 -->
    <qt-grid-view class="search-keyboard-grid" ref="gridRef" :spanCount="6" :autofocusPosition="14" @item-click="onGridItemClick">
      <qt-view :type="1" class="search-keyboard-grid-item" :focusable="true" eventFocus eventClick>
        <qt-text
          class="search-keyboard-grid-item-text"
          autoWidth
          autoHeight
          text="${text}"
          gravity="center"
          :focusable="false"
          :duplicateParentState="true"
        ></qt-text>
      </qt-view>
    </qt-grid-view>
  </qt-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useESToast } from '@extscreen/es3-core'
import { QTIGridView, QTListViewItem } from '@quicktvui/quicktvui3'
import icSearch from '../../../assets/search/ic_search.png'
import icClear from '../../../assets/search/ic_clear.png'
import icClearFocused from '../../../assets/search/ic_clear_focused.png'
import icBack from '../../../assets/search/ic_back.png'
import icBackFocused from '../../../assets/search/ic_back_focused.png'

const inputText = {
  text: '输入片名的首字母或全拼搜索',
  spanAttr: [
    { type: 'color', value: ['#FFFFFF', 5, 8] },
    { type: 'color', value: ['#FFFFFF', 9, 11] }
  ]
}
const btnStyle = {
  width: `160px`,
  height: `60px`,
  borderRadius: `30px`,
  backgroundColor: 'transparent',
  focusBackgroundColor: '#FFFFFF'
}
const textStyle = {
  color: '#FFFFFF',
  fontSize: `30px`,
  focusColor: '#13161B'
}

const toast = useESToast()
const gridRef = ref<QTIGridView>()

function init() {
  const keyboardItems: QTListViewItem[] = []
  // 输出 A-Z
  for (let i = 65; i <= 90; i++) {
    keyboardItems.push({ type: 1, text: String.fromCharCode(i) })
  }
  // 输出 0-9
  for (let i = 48; i <= 57; i++) {
    keyboardItems.push({ type: 1, text: String.fromCharCode(i) })
  }
  gridRef.value?.init(keyboardItems)
}

function onBtnClick(name: 'clear' | 'back') {
  toast.showToast(`${name}`)
}

function onGridItemClick(evt) {
  toast.showToast(`${evt.item.text}`)
}

defineExpose({ init })
</script>

<style scoped lang="scss">
.search-keyboard {
  width: 634px;
  height: 1080px;
  background-color: transparent;
  align-items: center;
}

.search-keyboard-input {
  width: 466px;
  height: 40px;
  background-color: transparent;
  margin-top: 103px;
  flex-direction: row;
  align-items: center;
}

.search-keyboard-input-icon {
  width: 36px;
  height: 36px;
  background-color: transparent;
}

.search-keyboard-input-text {
  width: 400px;
  height: 40px;
  background-color: transparent;
  margin-left: 30px;
  color: rgba(255, 255, 255, 0.35);
  font-size: 30px;
}

.search-keyboard-input-bottom {
  width: 466px;
  height: 1px;
  background-color: rgba(255, 255, 255, 0.22);
  margin-top: 13px;
}

.search-keyboard-btns {
  width: 466px;
  height: 60px;
  background-color: transparent;
  margin-top: 25px;
  flex-direction: row;
  justify-content: space-between;
}

.search-keyboard-grid {
  width: 530px;
  height: 530px;
  background-color: transparent;
  margin-top: 40px;
}

.search-keyboard-grid-item {
  width: 88px;
  height: 88px;
  background-color: transparent;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  focus-background-color: $gl-theme-btn-bg-focus-color;
}

.search-keyboard-grid-item-text {
  color: white;
  font-size: 40px;
  focus-color: $text-focus-color;
}
</style>
