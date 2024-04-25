<template>
  <qt-view class="loading-error-main">
    <img class="loading-error-bg" :src="bgError">
    <img class="loading-error-img" :src="icLoadingError">
    <qt-view class="loading-error-info">
      <p>加载失败，请按 “</p>
      <p style="color: #3098FF;">菜单</p>
      <p> ” 键添加源或按 “</p>
      <p style="color: #3098FF;">上/下</p>
      <p> ” 键换台</p>
    </qt-view>
  </qt-view>
</template>

<script setup lang="ts">
import bgError from '../assets/live/bg-error.png'
import icLoadingError from '../assets/live/ic-loading-error.png'
</script>

<style scoped>
.loading-error-main {
  width: 1920px;
  height: 1080px;
  background-color: transparent;
  position: absolute;
  align-items: center;
  justify-content: center;
}

.loading-error-bg {
  width: 1920px;
  height: 1080px;
  position: absolute;
}

.loading-error-img {
  width: 480px;
  height: 320px;
}

.loading-error-info {
  width: 781px;
  height: 46px;
  background-color: transparent;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.loading-error-info p {
  color: white;
  font-size: 32px;
}
</style>
