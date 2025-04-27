<template>
  <qt-view
    class="search-content-item-h"
    :focusable="true"
    :focusScale="themeConfig.placeHolderFocusScale"
    layout="${layout}"
    eventFocus
    eventClick
  >
    <qt-image
      class="search-content-item-img-h"
      src="${cover}"
      :postDelay="100"
      :enableFocusBorder="true"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-image>
    <!-- 评分 -->
    <qt-view
      class="search-content-item-score"
      :style="{ width: `410px`, height: `70px`, top: `161px` }"
      :gradientBackground="scoreGradient"
      :focusable="false"
    >
      <qt-text class="search-content-item-score-text" text="${score}" :focusable="false"></qt-text>
    </qt-view>
    <qt-text
      class="search-content-item-text"
      style="width: 386px; margin-top: 241px"
      text="${title}"
      gravity="center|start"
      :showOnState="['normal', 'selected']"
      :lines="1"
      :ellipsizeMode="2"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-text>
    <qt-text
      class="search-content-item-text"
      style="width: 386px; margin-top: 241px"
      text="${title}"
      typeface="bold"
      gravity="center|start"
      :horizontalFadingEdgeEnabled="true"
      :showOnState="'focused'"
      :lines="1"
      :ellipsizeMode="3"
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
