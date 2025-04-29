<template>
  <qt-view class="filter-main-contents-grid-item-v" :focusable="true" :focusScale="themeConfig.placeHolderFocusScale" eventFocus eventClick>
    <!-- 外层这个div的作用是模拟placeholder, 如果没有启动placeholder, 把背景色加到图片上, 有时会闪一下页面背景色 -->
    <qt-view style="background-color: rgba(255, 255, 255, 0.1); border-radius: 16px" :focusable="false" :duplicateParentState="true">
      <!-- 封面 -->
      <qt-image
        class="filter-main-contents-grid-item-v-img"
        :style="{ borderRadius: `${themeConfig.focusBorderCorner}px` }"
        src="${cover}"
        :postDelay="100"
        :enableFocusBorder="true"
        :focusable="false"
        :duplicateParentState="true"
      ></qt-image>
    </qt-view>
    <!-- 评分 -->
    <qt-view class="filter-main-contents-grid-item-v-score" :gradientBackground="scoreGradient" :focusable="false">
      <qt-text class="filter-main-contents-grid-item-v-score-text" text="${score}" :focusable="false"></qt-text>
    </qt-view>
    <!-- 标题 -->
    <qt-text
      class="filter-main-contents-grid-item-v-text"
      text="${title}"
      :paddingRect="[12, 0, 12, 0]"
      :boldOnFocus="true"
      :horizontalFadingEdgeEnabled="true"
      :lines="1"
      :ellipsizeMode="4"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-text>
  </qt-view>
</template>

<script setup lang="ts" name="GridItemV">
import themeConfig from '../../../../config/theme-config'

// 评分背景色
const scoreGradient = {
  colors: ['#00000000', '#CC000000'],
  orientation: 0,
  cornerRadii4: [0, 0, themeConfig.focusBorderCorner, themeConfig.focusBorderCorner]
}
</script>

<style scoped lang="scss" src="../../scss/filter-content-grid-item.scss"></style>
