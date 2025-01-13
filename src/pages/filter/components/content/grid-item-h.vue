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
      :style="{ width: $props.width, height: $props.imgHeight, borderRadius: `${themeConfig.focusBorderCorner}px` }"
      src="${cover}"
      :postDelay="100"
      :enableFocusBorder="true"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-image>
    <!-- 标题 -->
    <qt-view style="background-color: transparent" :focusable="false" :duplicateParentState="true">
      <qt-text
        class="filter-main-contents-grid-item-h-text"
        :style="{ width: $props.width }"
        text="${title}"
        :showOnState="['normal', 'selected']"
        :lines="1"
        :ellipsizeMode="4"
        :focusable="false"
        :duplicateParentState="true"
      ></qt-text>
      <qt-text
        class="filter-main-contents-grid-item-h-text"
        :style="{ width: $props.width }"
        text="${title}"
        typeface="bold"
        :showOnState="'focused'"
        :lines="1"
        :ellipsizeMode="4"
        :focusable="false"
        :duplicateParentState="true"
      ></qt-text>
    </qt-view>
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
</script>

<style scoped lang="scss" src="../../scss/filter-content-grid-item.scss"></style>
