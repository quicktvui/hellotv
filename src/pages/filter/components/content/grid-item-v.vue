<template>
  <qt-view class="filter-main-contents-grid-item-v" :focusable="true" eventFocus eventClick>
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
    <!-- 标题 -->
    <qt-view style="background-color: transparent" :focusable="false" :duplicateParentState="true">
      <qt-text
        class="filter-main-contents-grid-item-v-text"
        text="${title}"
        :showOnState="['normal', 'selected']"
        :lines="1"
        :ellipsizeMode="4"
        :focusable="false"
        :duplicateParentState="true"
      ></qt-text>
      <qt-text
        class="filter-main-contents-grid-item-v-text"
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

<script setup lang="ts" name="GridItemV">
import themeConfig from '../../../../config/theme-config'
</script>

<style scoped lang="scss" src="../../scss/filter-content-grid-item.scss"></style>
