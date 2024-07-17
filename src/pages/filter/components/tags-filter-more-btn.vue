<template>
  <qt-view class="filter-more-btn" :focusable="true" eventFocus eventClick>
    <qt-view class="filter-more-btn-bg"
      :focusable="false" showOnState="focused" duplicateParentState
      :gradientBackground="{ colors: btnGradientFocusColor, cornerRadius: 30, orientation: 6 }">
    </qt-view>
    <qt-text class="filter-more-btn-text" text="更多筛选项" gravity="center" :focusable="false" duplicateParentState></qt-text>
    <qt-image class="filter-more-btn-img" :src="icExpandDown" :focusable="false"></qt-image>
  </qt-view>
</template>

<script setup>
import ThemeConfig from "../../../build/ThemeConfig";
import icExpandDown from '../../../assets/ic_expand_down.png'

const btnGradientFocusColor = ThemeConfig.btnGradientFocusColor
</script>

<style scoped>
.filter-more-btn {
  width: 200px;
  height: 60px;
  background-color: transparent;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.filter-more-btn-bg {
  width: 200px;
  height: 60px;
  background-color: transparent;
  position: absolute;
}

.filter-more-btn-text {
  width: 150px;
  height: 60px;
  background-color: transparent;
  color: #BFBFBF;
  font-size: 26px;
  focus-color: #FFFFFF;
}

.filter-more-btn-img {
  width: 20px;
  height: 20px;
  background-color: transparent;
}
</style>
