<template>
  <qt-view class="player">
    <!-- 播放器 -->
    <ESPlayerManager ref="playerManager" :playerList="playerListRef" :initPlayerWindowType="2" @onPlayerPlaying="onPlayerPlaying" />
    <!-- 切台提示 -->
    <tips v-show="showTips" />
  </qt-view>
</template>

<script setup lang="ts">
import { ref, markRaw, onMounted } from 'vue'
import { useESToast, ESKeyEvent, ESKeyCode } from '@extscreen/es3-core'
import { ESPlayerManager, ESIPlayerManager, ESMediaItem } from '@extscreen/es3-player-manager'
import { ESPlayerPlayMode } from '@extscreen/es3-player'
import { ESVideoPlayer } from '@extscreen/es3-video-player'
import tips from './tips.vue'

const toast = useESToast()
const playerManager = ref<ESIPlayerManager>()
const playerListRef = ref([markRaw(ESVideoPlayer)])

const showTips = ref(false)

const mediaList: ESMediaItem[] = [
  {
    mediaSourceList: {
      index: 0,
      list: [{ uri: 'http://qcloudcdn.a311.ottcn.com/channelzero/2024/02/06/004d30f9-1d06-4ee4-9d96-bb5fdb14f52f.mp4' }]
    }
  },
  {
    mediaSourceList: {
      index: 0,
      list: [{ uri: 'http://qcloudcdn.a311.ottcn.com/channelzero/2024/01/29/6f0a3144-7f22-4f9d-9691-cc7f2263e2fd.mp4' }]
    }
  },
  {
    mediaSourceList: {
      index: 0,
      list: [
        { uri: 'http://qcloudcdn.a311.ottcn.com/data_center/videos/SHORT/DEFAULT/2023/08/25/7d3623ae-c002-4929-b5a2-fe10bca06bfc.mp4' }
      ]
    }
  }
]

onMounted(() => {
  playerManager.value?.initialize()
  playerManager.value?.setPlayMediaListMode(ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_LOOP)
  playerManager.value?.playMediaList({ index: 0, list: mediaList })
})

function onPlayerPlaying() {
  const curMedia = playerManager.value?.getPlayingMedia() as ESMediaItem
  console.log('huan-xxx', curMedia)

  showTips.value = true
  setTimeout(() => (showTips.value = false), 10 * 1000)
}

function onKeyDown(keyEvent: ESKeyEvent) {
  switch (keyEvent.keyCode) {
    case ESKeyCode.ES_KEYCODE_DPAD_UP:
      toast.showToast('播放上一个')
      break
    case ESKeyCode.ES_KEYCODE_DPAD_DOWN:
      toast.showToast('播放下一个')
      playerManager.value?.playNextMedia()
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
