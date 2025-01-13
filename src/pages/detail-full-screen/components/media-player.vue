<template>
  <media-player-view
    ref="playerManagerRef"
    class="media-def-player"
    :initPlayerWindowType="2"
    :isShowPlayerController="true"
    :menuList="[]"
    @onPlayerPlayMedia="onPlayerPlayMedia"
    @onPlayerCompleted="onPlayerCompleted"
    @onPlayerInterceptError="onPlayerInterceptError"
    @onPlayerProgressChanged="onPlayerProgressChanged"
    @onPlayerPlaying="onPlayerPlaying"
    @onPlayerNoMediaCanPlay="onPlayerNoMediaCanPlay"
    @onPlayerPlayMediaListModeChanged="onPlayerPlayMediaListModeChanged"
  />
</template>

<script setup lang='ts' name='media-player'>
// import { onBeforeUnmount, ref, onMounted, nextTick, toRaw } from 'vue'
// import { ESKeyEvent } from "@extscreen/es3-core";
// import BuildConfig from "../../../config/build-config";
// import detailManager from '../../../api/detail/detail-manager'
import MediaPlayerView from '../../../components/media/view/media-player-view.vue'
  // const TAG = 'DetailFullScreenMediaPlayer'

  const onPlayerPlayMedia = () => {}
  const onPlayerCompleted = () => {}
  const onPlayerInterceptError = () => {}
  const onPlayerProgressChanged = () => {}
  const onPlayerPlaying = () => {}
  const onPlayerNoMediaCanPlay = () => {}
  const onPlayerPlayMediaListModeChanged = () => {}
  defineExpose({

  })
</script>

<style lang='scss' scoped>
.media-def-player{
  position: absolute;
  z-index: 1;
  background-color: transparent;
}
</style>
