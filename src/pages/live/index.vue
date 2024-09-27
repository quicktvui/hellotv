<template>
  <qt-view class="live">
    <!-- 全屏播放 -->
    <!-- 频道列表 -->
    <channelMenu v-show="showMenu" ref="menuRef" />
  </qt-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ESKeyEvent, ESKeyCode, useESToast } from '@extscreen/es3-core'
import { useESRouter } from '@extscreen/es3-router'
import channelMenu from './components/menu/index.vue'

const toast = useESToast()
const router = useESRouter()
const menuRef = ref()
const showMenu = ref(false)

function onKeyDown(keyEvent: ESKeyEvent) {
  switch (keyEvent.keyCode) {
    case ESKeyCode.ES_KEYCODE_DPAD_UP:
      if (!showMenu.value) {
        toast.showToast('播放上一个')
      } else {
        isBack = false
      }
      break
    case ESKeyCode.ES_KEYCODE_DPAD_DOWN:
      if (!showMenu.value) {
        toast.showToast('播放下一个')
      } else {
        isBack = false
      }
      break
    case ESKeyCode.ES_KEYCODE_DPAD_LEFT:
      showMenu.value = true
      break
    case ESKeyCode.ES_KEYCODE_DPAD_RIGHT:
      if (showMenu.value) {
        menuRef.value.onKeyDown(keyEvent)
      } else {
        isBack = false
        toast.showToast('打开支付页')
      }
  }
}

let isBack = false
function onBackPressed() {
  if (showMenu.value) {
    isBack = false
    showMenu.value = false
  } else {
    if (isBack) {
      router.back()
    } else {
      isBack = true
      toast.showToast('再按一次返回退出')
    }
  }
}

defineExpose({ onKeyDown, onBackPressed })
</script>

<style scoped>
.live {
  width: 1920px;
  height: 1080px;
  background-color: transparent;
}
</style>
