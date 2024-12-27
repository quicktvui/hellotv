<template>
  <qt-view class="filter-main-contents-grid-item-v" :focusable="true" eventFocus eventClick>
    <!-- 封面 -->
    <qt-image
      class="filter-main-contents-grid-item-v-img"
      :style="{ borderRadius: borderRadius }"
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
import ThemeConfig from '../../../../config/theme-config'

const borderRadius = ThemeConfig.focusBorderCorner + 'px'
</script>

<style scoped lang="scss">
.filter-main-contents-grid-item-v {
  width: 260px;
  height: 414px;
  background-color: transparent;
}

.filter-main-contents-grid-item-v-img {
  width: 260px;
  height: 368px;
  background-color: transparent;
  margin-bottom: 11px;
}

.filter-main-contents-grid-item-v-text {
  position: absolute;
  width: 260px;
  height: 40px;
  background-color: transparent;
  font-size: 30px;
  color: $text-normal-color;
  focus-color: #ffffff;
}
</style>
