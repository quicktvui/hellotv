<template>
  <qt-view
    class="filter-main-contents-grid-item-h"
    :style="{ width: $props.width, height: $props.height }"
    :focusable="true"
    eventFocus
    eventClick
  >
    <!-- 封面 -->
    <qt-image
      class="filter-main-contents-grid-item-h-img"
      :style="{ width: $props.width, height: $props.imgHeight, borderRadius: borderRadius }"
      src="${cover}"
      :postDelay="100"
      :enableFocusBorder="true"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-image>
    <!-- 标题 -->
    <qt-text
      class="filter-main-contents-grid-item-h-text"
      :style="{ width: $props.width }"
      text="${title}"
      :lines="1"
      :ellipsizeMode="4"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-text>
  </qt-view>
</template>

<script setup lang="ts" name="GridItemH">
import ThemeConfig from '../../../../config/theme-config'

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

const borderRadius = ThemeConfig.focusBorderCorner + 'px'
</script>

<style scoped>
.filter-main-contents-grid-item-h {
  width: 320px;
  height: 226px;
  background-color: transparent;
}

.filter-main-contents-grid-item-h-img {
  width: 320px;
  height: 180px;
  background-color: transparent;
  margin-bottom: 11px;
}

.filter-main-contents-grid-item-h-text {
  width: 320px;
  height: 40px;
  background-color: transparent;
  font-size: 30px;
  color: rgba(255, 255, 255, 0.55);
  focus-color: #ffffff;
}
</style>
