<template>
  <qt-view class="player-loading">
    <qt-loading-view style="width: 100px; height: 100px"></qt-loading-view>
    <qt-text class="player-loading-text" :text="netSpeed" gravity="center"></qt-text>
  </qt-view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { EventBus } from '@extscreen/es3-vue'

const netSpeed = ref('0.0KB/s 正在缓冲...')

onMounted(() => {
  EventBus.$on('NetSpeed', onNetWorkTipChanged)
})
onUnmounted(() => {
  EventBus.$off('NetSpeed')
})

function onNetWorkTipChanged(e) {
  const mb = Number(e.speedMbps)
  const kb = Number(e.speedKbps)
  netSpeed.value = (mb >= 1 ? mb + 'MB/s' : kb + 'KB/s') + ' 正在缓冲...'
}
</script>

<style scoped>
.player-loading {
  width: 1920px;
  height: 1080px;
  background-color: #0b0f10;
  position: absolute;
  align-items: center;
  justify-content: center;
}

.player-loading-text {
  width: 260px;
  height: 30px;
  background-color: transparent;
  margin-top: 35px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 24px;
}
</style>
