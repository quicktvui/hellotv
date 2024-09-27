<template>
  <qt-view class="live">
    <!-- 全屏播放 -->
    <player ref="playerRef" />
    <!-- 占位填充 -->
    <qt-view style="width: 1920px; height: 1080px; background-color: transparent"></qt-view>
    <!-- 频道列表 -->
    <channelMenu v-show="showMenu" ref="menuRef" />
  </qt-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ESKeyEvent, ESKeyCode, useESToast } from '@extscreen/es3-core'
import { useESRouter } from '@extscreen/es3-router'
import player from './components/player/index.vue'
import channelMenu from './components/menu/index.vue'

const toast = useESToast()
const router = useESRouter()
const playerRef = ref()
const menuRef = ref()
const showMenu = ref(false)

function onKeyDown(keyEvent: ESKeyEvent) {
  switch (keyEvent.keyCode) {
    case ESKeyCode.ES_KEYCODE_DPAD_UP:
      if (!showMenu.value) {
        playerRef.value.onKeyDown(keyEvent)
      }
      break
    case ESKeyCode.ES_KEYCODE_DPAD_DOWN:
      if (!showMenu.value) {
        playerRef.value.onKeyDown(keyEvent)
      }
      break
    case ESKeyCode.ES_KEYCODE_DPAD_LEFT:
      showMenu.value = true
      break
    case ESKeyCode.ES_KEYCODE_DPAD_RIGHT:
      if (showMenu.value) {
        menuRef.value.onKeyDown(keyEvent)
      } else {
        toast.showToast('打开支付页')
      }
      break
    case ESKeyCode.ES_KEYCODE_DPAD_CENTER:
      toast.showToast('等待功能完善...')
      break
  }
}

function onKeyUp(keyEvent: ESKeyEvent) {
  if (keyEvent.keyCode != ESKeyCode.ES_KEYCODE_BACK) {
    isBack = false
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

defineExpose({ onKeyDown, onKeyUp, onBackPressed })
</script>

<style scoped>
.live {
  width: 1920px;
  height: 1080px;
  background-color: transparent;
}
</style>
