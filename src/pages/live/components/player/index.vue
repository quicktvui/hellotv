<template>
  <qt-view class="player">
    <!-- 播放器 -->
    <ESPlayerManager
      ref="playerManager"
      :playerList="playerListRef"
      :initPlayerWindowType="2"
      @onPlayerBufferStart="onPlayerBufferStart"
      @onPlayerBufferEnd="onPlayerBufferEnd"
      @onPlayerPlaying="onPlayerPlaying"
      @onPlayerError="onPlayerError"
    />
    <!-- 加载中 -->
    <loading :visibility="showLoading ? 'visible' : 'invisible'" />
    <!-- 播放失败 -->
    <error :visibility="playerError ? 'visible' : 'invisible'" />
    <!-- 切台提示 -->
    <tips :visibility="showTips ? 'visible' : 'invisible'" ref="tipsRef" />
  </qt-view>
</template>

<script setup lang="ts">
import { ref, watch, markRaw, nextTick } from 'vue'
import { Native } from '@extscreen/es3-vue'
import { ESKeyEvent, ESKeyCode, useESEventBus } from '@extscreen/es3-core'
import { ESPlayerManager, ESIPlayerManager, ESMediaItem } from '@extscreen/es3-player-manager'
import { ESPlayerPlayMode } from '@extscreen/es3-player'
import { ESVideoPlayer } from '@extscreen/es3-video-player'
import loading from './loading.vue'
import error from './error.vue'
import tips from './tips.vue'

const emits = defineEmits(['closeMenu'])

const eventBus = useESEventBus()

const showLoading = ref(false)
watch(
  () => showLoading.value,
  (b) => {
    if (b) {
      Native.callNative('ESNetworkSpeedModule', 'showNetSpeed')
    } else {
      Native.callNative('ESNetworkSpeedModule', 'stopNetSpeed')
    }
  }
)

const playerError = ref(false)
const playerManager = ref<ESIPlayerManager>()
const playerListRef = ref([markRaw(ESVideoPlayer)])
const tipsRef = ref()
const showTips = ref(false)

let mediaList: ESMediaItem[] = []
let curPlayIndex: number = 0

function init(params: { mediaList: [] }) {
  mediaList = params.mediaList
  // 初始化播放器
  showLoading.value = true
  playerManager.value?.initialize()
  playerManager.value?.setPlayMediaListMode(ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_LOOP)
  playerManager.value?.playMediaList({ index: 0, list: mediaList })
}

let showTipsTimer: any = -1
function setPlayInfo(playIndex: number) {
  const nextMedia = mediaList[playIndex]
  tipsRef.value?.setPlayInfo({
    channelId: nextMedia.channelId,
    channelName: nextMedia.channelName,
    isVip: nextMedia.isVip,
    program: nextMedia.program,
    nextProgram: nextMedia.nextProgram
  })
  nextTick(() => {
    clearTimeout(showTipsTimer)
    showTips.value = true
    showTipsTimer = setTimeout(() => (showTips.value = false), 10000)
  })
}

function playMediaByIndex(index: number) {
  if (index != curPlayIndex) {
    showTips.value = false
    showLoading.value = true
    playerError.value = false
    playerManager.value?.playMediaByIndex(index)
  }
  emits('closeMenu')
  setPlayInfo(index)
}

function onPlayerBufferStart() {
  showLoading.value = true
}

function onPlayerBufferEnd() {
  showLoading.value = false
}

function onPlayerPlaying() {
  showLoading.value = false
  curPlayIndex = playerManager.value?.getPlayingMediaIndex() || 0
  setPlayInfo(curPlayIndex)
  eventBus.emit('setPlayIndex', curPlayIndex)
}

function onPlayerError() {
  showLoading.value = false
  playerError.value = true
  playerManager.value?.stop()
}

function onKeyDown(keyEvent: ESKeyEvent) {
  let playIndex = playerManager.value?.getPlayingMediaIndex() || 0
  switch (keyEvent.keyCode) {
    case ESKeyCode.ES_KEYCODE_DPAD_UP:
      playMediaByIndex(--playIndex < 0 ? mediaList.length - 1 : playIndex)
      break
    case ESKeyCode.ES_KEYCODE_DPAD_DOWN:
      playMediaByIndex(++playIndex >= mediaList.length ? 0 : playIndex)
      break
  }
}

defineExpose({ init, playMediaByIndex, onKeyDown })
</script>

<style scoped>
.player {
  width: 1920px;
  height: 1080px;
  background-color: transparent;
  position: absolute;
}
</style>
