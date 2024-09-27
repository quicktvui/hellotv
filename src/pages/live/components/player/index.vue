<template>
  <qt-view class="player" :gradientBackground="{ colors: ['#FF2C2C2C', '#FF0F1518'], orientation: 0 }">
    <!-- 播放器 -->
    <ESPlayerManager ref="playerManager" :playerList="playerListRef" :initPlayerWindowType="2" @onPlayerPlaying="onPlayerPlaying" />
    <!-- 切台提示 -->
    <tips v-show="showTips" ref="tipsRef" />
  </qt-view>
</template>

<script setup lang="ts">
import { ref, markRaw, onMounted, nextTick } from 'vue'
import { ESKeyEvent, ESKeyCode } from '@extscreen/es3-core'
import { ESPlayerManager, ESIPlayerManager, ESMediaItem } from '@extscreen/es3-player-manager'
import { ESPlayerPlayMode } from '@extscreen/es3-player'
import { ESVideoPlayer } from '@extscreen/es3-video-player'
import tips from './tips.vue'

const playerManager = ref<ESIPlayerManager>()
const playerListRef = ref([markRaw(ESVideoPlayer)])
const tipsRef = ref()
const showTips = ref(false)

const mediaList: ESMediaItem[] = [
  {
    channelId: '001',
    channelName: 'CCTV-1高清',
    program: '我的阿勒泰02',
    nextProgram: '边水往事08',
    mediaSourceList: {
      index: 0,
      list: [{ uri: 'http://qcloudcdn.a311.ottcn.com/channelzero/2024/02/06/004d30f9-1d06-4ee4-9d96-bb5fdb14f52f.mp4' }]
    }
  },
  {
    channelId: '002',
    channelName: 'CCTV-2高清',
    program: '舌尖上的中国',
    nextProgram: '大明王朝1566(28)',
    mediaSourceList: {
      index: 0,
      list: [{ uri: 'http://qcloudcdn.a311.ottcn.com/channelzero/2024/01/29/6f0a3144-7f22-4f9d-9691-cc7f2263e2fd.mp4' }]
    }
  },
  {
    channelId: '003',
    channelName: 'CCTV-3高清',
    program: '在中国大地上边走边看',
    nextProgram: '新闻联播',
    mediaSourceList: {
      index: 0,
      list: [{ uri: 'http://qcloudcdn.a311.ottcn.com/channelzero/2024/02/05/a87f2fd0-579c-4d4e-9bb7-4183f6bd3604.mp4' }]
    }
  }
]

onMounted(() => {
  playerManager.value?.initialize()
  playerManager.value?.setPlayMediaListMode(ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_LOOP)
  playerManager.value?.playMediaList({ index: 0, list: mediaList })
})

let showTipsTimer: any = -1
function setPlayInfo(playIndex: number) {
  const nextMedia = mediaList[playIndex]
  tipsRef.value?.setPlayInfo({
    channelId: nextMedia.channelId,
    channelName: nextMedia.channelName,
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
  playerManager.value?.playMediaByIndex(index)
  setPlayInfo(index)
}

function onPlayerPlaying() {
  setPlayInfo(playerManager.value?.getPlayingMediaIndex() || 0)
}

function onKeyDown(keyEvent: ESKeyEvent) {
  let curPlayIndex = playerManager.value?.getPlayingMediaIndex() || 0
  switch (keyEvent.keyCode) {
    case ESKeyCode.ES_KEYCODE_DPAD_UP:
      playMediaByIndex(--curPlayIndex < 0 ? mediaList.length - 1 : curPlayIndex)
      break
    case ESKeyCode.ES_KEYCODE_DPAD_DOWN:
      playMediaByIndex(++curPlayIndex >= mediaList.length ? 0 : curPlayIndex)
      break
  }
}

defineExpose({ onKeyDown })
</script>

<style scoped>
.player {
  width: 1920px;
  height: 1080px;
  background-color: transparent;
}
</style>
