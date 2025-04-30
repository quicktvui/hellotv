<template>
  <qt-view
    class="filter-main-contents-grid-item-h"
    :style="{ width: $props.width, height: $props.height }"
    :focusable="true"
    :focusScale="themeConfig.placeHolderFocusScale"
    eventFocus
    eventClick
  >
    <!-- 外层这个div的作用是模拟placeholder, 如果没有启动placeholder, 把背景色加到图片上, 有时会闪一下页面背景色 -->
    <qt-view style="background-color: rgba(255, 255, 255, 0.1); border-radius: 16px" :focusable="false" :duplicateParentState="true">
      <!-- 封面 -->
      <qt-image
        class="filter-main-contents-grid-item-h-img"
        :style="{ width: $props.width, height: $props.imgHeight, borderRadius: `${themeConfig.focusBorderCorner}px` }"
        src="${cover}"
        :postDelay="100"
        :enableFocusBorder="true"
        :focusable="false"
        :duplicateParentState="true"
      ></qt-image>
    </qt-view>
    <!-- 评分 -->
    <qt-view
      class="filter-main-contents-grid-item-h-score"
      :style="{ width: $props.width }"
      :gradientBackground="scoreGradient"
      :focusable="false"
    >
      <qt-text class="filter-main-contents-grid-item-h-score-text" text="${score}" :focusable="false"></qt-text>
    </qt-view>
    <!-- 标题 -->
    <qt-text
      class="filter-main-contents-grid-item-h-text"
      :style="{ width: $props.width }"
      text="${title}"
      :paddingRect="[12, 0, 12, 0]"
      :boldOnFocus="true"
      :lines="1"
      :ellipsizeMode="4"
      :focusable="false"
      :duplicateParentState="true"
      :horizontalFadingEdgeEnabled="true"
    ></qt-text>
  </qt-view>
</template>

<script setup lang="ts" name="GridItemH">
import themeConfig from '../../../../config/theme-config'

defineProps({
  width: {
    type: Number,
    default: 320
  },
  height: {
    type: Number,
    default: 226
  },
  imgHeight: {
    type: Number,
    default: 180
  }
})

// 评分背景色
const scoreGradient = {
  colors: ['#00000000', '#CC000000'],
  orientation: 0,
  cornerRadii4: [0, 0, themeConfig.focusBorderCorner, themeConfig.focusBorderCorner]
}
</script>

<style scoped lang="scss" src="../../scss/filter-content-grid-item.scss"></style>
