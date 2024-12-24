<template>
  <qt-view class="filter-main-contents-grid-item-v" :focusable="true">
    <qt-image
      class="filter-main-contents-grid-item-v-img"
      :style="{ borderRadius: borderRadius }"
      src="${cover}"
      :focusable="false"
    ></qt-image>
    <qt-text class="filter-main-contents-grid-item-v-text" text="${title}" :focusable="false" duplicateParentState></qt-text>
  </qt-view>
</template>

<script setup lang="ts" name="GridItemV">
import ThemeConfig from '../../../../config/theme-config'

const borderRadius = ThemeConfig.focusBorderCorner + 'px'
</script>

<style scoped>
.filter-main-contents-grid-item-v {
  width: 260px;
  height: 414px;
  background-color: transparent;
}

.filter-main-contents-grid-item-v-img {
  width: 260px;
  height: 368px;
  background-color: gray;
  margin-bottom: 10px;
}

.filter-main-contents-grid-item-v-text {
  width: 260px;
  height: 40px;
  background-color: transparent;
  font-size: 30px;
  color: rgba(255, 255, 255, 0.55);
  focus-color: #ffffff;
}
</style>
