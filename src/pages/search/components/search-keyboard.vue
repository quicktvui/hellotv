<template>
  <qt-view class="search-keyboard">
    <!-- 输入框 -->
    <qt-view class="search-keyboard-input">
      <qt-image class="search-keyboard-input-icon" :src="icSearch" :focusable="false"></qt-image>
      <qt-text
        v-if="inputText.length > 0"
        class="search-keyboard-input-text"
        style="color: white; font-size: 40px"
        :text="inputText"
        gravity="center|start"
      ></qt-text>
      <qt-text v-else class="search-keyboard-input-text" :textSpan="defaultText"></qt-text>
    </qt-view>
    <!-- 输入框底部横线 -->
    <qt-view class="search-keyboard-input-bottom"></qt-view>
    <!-- 按钮区域 -->
    <qt-view class="search-keyboard-btns" :blockFocusDirections="['up']">
      <qt-button
        class="search-keyboard-btn"
        text="清空"
        nextFocusDownSID="keyboardGrid"
        :textStyle="textStyle"
        :icon="icClear"
        :focusIcon="icClearFocused"
        @click="onBtnClick('clear')"
      />
      <qt-button
        class="search-keyboard-btn"
        text="退格"
        nextFocusDownSID="keyboardGrid"
        :textStyle="textStyle"
        :icon="icBack"
        :focusIcon="icBackFocused"
        @click="onBtnClick('back')"
      />
    </qt-view>
    <!-- 键盘区域 -->
    <qt-grid-view
      class="search-keyboard-grid"
      ref="gridRef"
      sid="keyboardGrid"
      name="keyboardGrid"
      :focusMemory="false"
      :spanCount="6"
      :autofocusPosition="14"
      :nextFocusName="{ right: 'keywordList' }"
      :blockFocusDirections="['down']"
      @item-click="onGridItemClick"
    >
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
import { ref, watch, onMounted } from 'vue'
import { QTIGridView, QTListViewItem } from '@quicktvui/quicktvui3'
import ThemeConfig from '../../../config/theme-config'
import icSearch from '../../../assets/search/ic_search.png'
import icClear from '../../../assets/search/ic_clear.png'
import icClearFocused from '../../../assets/search/ic_clear_focused.png'
import icBack from '../../../assets/search/ic_back.png'
import icBackFocused from '../../../assets/search/ic_back_focused.png'

const emits = defineEmits(['updateInput'])

const gridRef = ref<QTIGridView>()
const inputText = ref<string>('')
const defaultText = {
  text: '输入片名的首字母或全拼搜索',
  spanAttr: [
    { type: 'color', value: ['#FFFFFF', 5, 8] },
    { type: 'color', value: ['#FFFFFF', 9, 11] }
  ]
}

const textStyle = {
  color: '#FFFFFF',
  fontSize: `30px`,
  focusColor: ThemeConfig.textFocusColor
}

onMounted(() => {
  const keyboardItems: QTListViewItem[] = []
  // 输出 A-Z
  for (let i = 65; i <= 90; i++) {
    keyboardItems.push({ type: 1, text: String.fromCharCode(i) })
  }
  // 输出 0-9
  for (let i = 48; i <= 57; i++) {
    keyboardItems.push({ type: 1, text: String.fromCharCode(i) })
  }
  // 初始化键盘
  gridRef.value?.init(keyboardItems)
})

watch(
  () => inputText.value,
  () => {
    emits('updateInput', inputText.value)
  }
)

function onBtnClick(name: 'clear' | 'back') {
  switch (name) {
    case 'clear':
      inputText.value = ''
      break
    case 'back':
      if (inputText.value.length > 0) {
        inputText.value = inputText.value.slice(0, inputText.value.length - 1)
      }
      break
  }
}

function onGridItemClick(evt) {
  inputText.value += evt.item.text
}

function onBackPressed() {
  gridRef.value?.setItemFocused(14)
}

defineExpose({ onBackPressed })
</script>

<style scoped lang="scss" src="../scss/search-keyboard.scss"></style>
