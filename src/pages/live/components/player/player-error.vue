<template>
  <qt-view class="player-error">
    <qt-text class="player-error-text" style="width: 226px" text="播放失败 请按" gravity="center"></qt-text>
    <qt-image style="width: 46px; height: 46px; margin-top: 4px; margin-left: 4px; margin-right: 4px" :src="icKey"></qt-image>
    <qt-text class="player-error-text" style="width: 216px" text="切换其他节目" gravity="center"></qt-text>
  </qt-view>
</template>

<script setup lang="ts">
import icKey from '../../../../assets/live/ic-key.png'
</script>

<style scoped>
.player-error {
  width: 1920px;
  height: 1080px;
  background-color: #0b0f10;
  position: absolute;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.player-error-text {
  height: 46px;
  color: #ffffff;
  font-size: 36px;
}
</style>
