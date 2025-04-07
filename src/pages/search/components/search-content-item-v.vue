<template>
  <qt-view class="search-content-item-v" name="gridItem" :focusable="true" layout="${layout}" eventFocus eventClick>
    <qt-image
      class="search-content-item-img-v"
      src="${cover}"
      :postDelay="100"
      :enableFocusBorder="true"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-image>
    <!-- 评分 -->
    <qt-view
      class="search-content-item-score"
      :style="{ width: `261px`, height: `90px`, top: `278px` }"
      :gradientBackground="scoreGradient"
      :focusable="false"
    >
      <qt-text class="search-content-item-score-text" style="margin-top: 51px" text="${score}" :focusable="false"></qt-text>
    </qt-view>
    <qt-text
      class="search-content-item-text"
      style="width: 260px"
      text="${title}"
      gravity="center"
      :lines="1"
      :ellipsizeMode="4"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-text>
  </qt-view>
</template>

<script setup lang="ts">
import themeConfig from '../../../config/theme-config'

// 评分背景色
const scoreGradient = {
  colors: ['#00000000', '#CC000000'],
  orientation: 0,
  cornerRadii4: [0, 0, themeConfig.focusBorderCorner, themeConfig.focusBorderCorner]
}
</script>

<style scoped lang="scss" src="../scss/search-content.scss"></style>
