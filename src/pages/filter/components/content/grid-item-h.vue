<template>
  <qt-view class="filter-main-contents-grid-item-h" :focusable="true">
    <qt-image
      class="filter-main-contents-grid-item-h-img"
      :style="{ borderRadius: borderRadius }"
      src="${cover}"
      :focusable="false"
    ></qt-image>
    <qt-text class="filter-main-contents-grid-item-h-text" text="${title}" duplicateParentState></qt-text>
    <qt-text
      class="filter-main-contents-grid-item-h-text"
      style="font-size: 24px; color: rgba(255, 255, 255, 0.5)"
      text="${subTitle}"
    ></qt-text>
  </qt-view>
</template>

<script setup lang="ts" name="GridItemH">
import ThemeConfig from '../../../../config/theme-config'

const borderRadius = ThemeConfig.focusBorderCorner + 'px'
</script>

<style scoped>
.filter-main-contents-grid-item-h {
  width: 325px;
  height: 263px;
  background-color: transparent;
}

.filter-main-contents-grid-item-h-img {
  width: 325px;
  height: 183px;
  background-color: gray;
}

.filter-main-contents-grid-item-h-text {
  width: 325px;
  height: 40px;
  background-color: transparent;
  font-size: 30px;
  color: rgba(255, 255, 255, 0.55);
  focus-color: #ffffff;
}
</style>
