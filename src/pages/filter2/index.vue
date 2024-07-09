<template>
  <qt-view class="filter">
    <qt-view ref="headerRef" name="header" class="filter-header" :focusable="true" :enableFocusBorder="true">
      <qt-text class="filter-text" text="头部" gravity="center"></qt-text>
    </qt-view>
    <scroll-view ref="scrollRef" name="scrollRef" class="filter-scroll-view">
      <div class="filter-content">
        <!-- 左侧导航扩展 -->
        <qt-view class="filter-content-left-expand">
          <qt-text class="filter-text" text="左侧导航扩展" gravity="center"></qt-text>
          <qt-view style="width: 100px; height: 100px; background-color: red;" :focusable="true" :enableFocusBorder="true"></qt-view>
          <qt-view style="width: 100px; height: 100px; background-color: blue;" :focusable="true" :enableFocusBorder="true"></qt-view>
          <qt-view style="width: 100px; height: 100px; background-color: yellow;" :focusable="true" :enableFocusBorder="true"></qt-view>
        </qt-view>
        <!-- 左侧导航 -->
        <qt-view class="filter-content-left">
          <qt-text class="filter-text" text="左侧导航" gravity="center"></qt-text>
          <qt-view style="width: 100px; height: 100px; background-color: red;" :focusable="true" :enableFocusBorder="true"></qt-view>
          <qt-view style="width: 100px; height: 100px; background-color: blue;" :focusable="true" :enableFocusBorder="true"></qt-view>
          <qt-view style="width: 100px; height: 100px; background-color: yellow;" :focusable="true" :enableFocusBorder="true"></qt-view>
        </qt-view>
        <!-- 右侧结果 -->
        <qt-view class="filter-content-right" :focusable="true" :enableFocusBorder="true" @focus="onContentRightFocus">
          <qt-text class="filter-text" text="右侧结果" gravity="center"></qt-text>
        </qt-view>
      </div>
    </scroll-view>
  </qt-view>
</template>

<script lang="ts">
import { QTViewEvent } from '@quicktvui/quicktvui3'
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const headerRef = ref()
    const scrollRef = ref()

    let triggerTask = [
      {
        evnet: 'onFocusAcquired',
        target: 'scrollRef',
        function: 'scrollToWithOptions',
        params: [
          {
            x: 320, y: 0, duration: 300
          }
        ]
      },
      {
        event: 'onFocusLost',
        target: 'scrollRef',
        function: 'scrollToWithOptions',
        params: [
          {
            x: -320, y: 0, duration: 300
          }
        ]
      }
    ]

    function onESCreate() {
      headerRef.value?.requestFocus()
    }

    function onContentRightFocus(event: QTViewEvent) {
      if (event.isFocused) {
        scrollRef.value.scrollTo(320, 0, 300)
      } else {
        scrollRef.value.scrollTo(-320, 0, 300)
      }
    }

    return {
      headerRef,
      scrollRef,
      triggerTask,
      onESCreate,
      onContentRightFocus
    }
  }
})
</script>

<style scoped>
.filter {
  width: 1920px;
  height: 1080px;
  background-color: transparent;
}

.filter-header {
  width: 1920px;
  height: 120px;
  background-color: transparent;
  align-items: center;
  justify-content: center;
}

.filter-scroll-view {
  width: 1920px;
  height: 1080px;
  background-color: transparent;
}

.filter-content {
  width: 2560px;
  height: 1080px;
  background-color: transparent;
  flex-direction: row;
}

.filter-content-left-expand {
  width: 320px;
  height: 960px;
  background-color: transparent;
  align-items: center;
  justify-content: center;
}

.filter-content-left {
  width: 320px;
  height: 960px;
  background-color: transparent;
  align-items: center;
  justify-content: center;
}

.filter-content-right {
  width: 1600px;
  height: 960px;
  background-color: transparent;
  align-items: center;
  justify-content: center;
}

.filter-text {
  width: 300px;
  height: 100px;
  color: #FFFFFF;
  font-size: 36px;
}
</style>
