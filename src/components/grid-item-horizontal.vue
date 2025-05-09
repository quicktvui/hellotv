<template>
  <qt-view
    class="grid-item-h"
    :style="$props.style"
    :focusable="true"
    :focusScale="themeConfig.placeHolderFocusScale"
    eventFocus
    eventClick
  >
    <!-- 焦点状态下的删除样式 -->
    <qt-view
      showIf="${showDeleteCover}"
      class="grid-item-h-delete"
      style="background-color: transparent"
      :focusable="false"
      :duplicateParentState="true"
    >
      <qt-view
        class="grid-item-h-delete"
        :style="$props.imageStyle"
        :showOnState="'focused'"
        :focusable="false"
        :duplicateParentState="true"
      >
        <qt-image style="width: 40px; height: 50px" :src="icDelete" :focusable="false"></qt-image>
      </qt-view>
    </qt-view>
    <!-- 外层这个div的作用是模拟placeholder, 如果没有启动placeholder, 把背景色加到图片上, 有时会闪一下页面背景色 -->
    <qt-view style="background-color: rgba(255, 255, 255, 0.1); border-radius: 16px" :focusable="false" :duplicateParentState="true">
      <!-- 封面 -->
      <qt-image
        class="grid-item-h-img"
        :style="$props.imageStyle"
        src="${cover}"
        :postDelay="100"
        :enableFocusBorder="true"
        :focusable="false"
        :duplicateParentState="true"
      ></qt-image>
    </qt-view>
    <!-- 评分 -->
    <qt-view
      showIf="${showRating}"
      class="grid-item-h-score"
      :style="{ width: $props.style?.width, top: `${$props.imageStyle?.height.replace('px', '') - 70}px` }"
      :gradientBackground="scoreGradient"
      :focusable="false"
    >
      <qt-text class="grid-item-h-score-text" text="${score}" :focusable="false"></qt-text>
    </qt-view>
    <!-- 标题 -->
    <qt-text
      class="grid-item-h-text"
      :style="{ width: $props.style?.width }"
      text="${title}"
      :paddingRect="[12, 0, 12, 0]"
      :boldOnFocus="true"
      :lines="1"
      :ellipsizeMode="4"
      :focusable="false"
      :duplicateParentState="true"
      :horizontalFadingEdgeEnabled="true"
    ></qt-text>
    <!-- 播放进度 -->
    <qt-text
      showIf="${showProgress}"
      class="grid-item-h-progress"
      :style="{ width: $props.style?.width }"
      text="${progress}"
      gravity="center|start"
      :paddingRect="[12, 0, 12, 0]"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-text>
  </qt-view>
</template>

<script setup lang="ts" name="GridItemH">
import themeConfig from '../config/theme-config'
import icDelete from '../assets/history/ic_delete.png'

defineProps({
  style: {
    type: Object,
    default: () => ({
      width: `320px`,
      height: `226px`
    })
  },
  imageStyle: {
    type: Object,
    default: () => ({
      width: `320px`,
      height: `180px`,
      borderRadius: `${themeConfig.focusBorderCorner}px`
    })
  }
})

// 评分背景色
const scoreGradient = {
  colors: ['#00000000', '#CC000000'],
  orientation: 0,
  cornerRadii4: [0, 0, themeConfig.focusBorderCorner, themeConfig.focusBorderCorner]
}
</script>

<style scoped lang="scss">
.grid-item-h {
  background-color: transparent;
}

.grid-item-h-delete {
  background-color: rgba(0, 0, 0, 0.65);
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0.01px;
  left: 0.01px;
  z-index: 100;
}

.grid-item-h-img {
  background-color: rgba(255, 255, 255, 0.1);
}

.grid-item-h-score {
  height: 70px;
  background-color: transparent;
  position: absolute;
}

.grid-item-h-score-text {
  width: 60px;
  height: 30px;
  background-color: transparent;
  margin-left: 16px;
  margin-top: 31px;
  color: #ff5415;
  font-size: 24px;
}

.grid-item-h-text {
  height: 40px;
  background-color: transparent;
  margin-top: 11px;
  color: rgba(255, 255, 255, 0.55);
  font-size: 30px;
  focus-color: white;
}

.grid-item-h-progress {
  height: 34px;
  background-color: transparent;
  color: rgba(255, 255, 255, 0.35);
  font-size: 24px;
  focus-color: rgba(255, 255, 255, 0.75);
}
</style>
