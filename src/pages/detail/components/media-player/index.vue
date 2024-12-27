<template>
  <qt-view 
    name='media-player' 
    class="media-player" 
    ref='playerParent' 
    sid='playerParent' 
    :focusable='false'>
    <!-- player-manager 播放管理器 -->
    <es-player-manager
      class="player-manager-css"
      ref="playerManager"
      :visible="controlPlayViewShow"
      :smallWindowWidth="890"
      :smallWindowHeight="500"
      :floatWindowWidth="floatWindowWidth"
      :floatWindowHeight="floatWindowHeight"
      :initPlayerWindowType="1"
      playerBackgroundColor="transparent"
      :playMediaAuto="false"
      :focusable='false'
      :playerList="playerListRef"
      :playerViewList="playerViewListRef"
      :style="{ left: playerLeft, top: playerTop }"
      @onPlayerPlayMedia="onPlayerPlayMedia"
      @onPlayerPlaying="onPlayerPlaying"
      @onPlayerPaused="onPlayerPaused"
      @onPlayerStopped="onPlayerStopped"
      @onPlayerWindowTypeChanged="onPlayerWindowTypeChanged"
      @onPlayerInterceptSuccess="onPlayerInterceptSuccess"
      @onPlayerInterceptError="onPlayerInterceptError"
      @onPlayerProgressChanged="onPlayerProgressChangedFn"
      @onPlayerDurationChanged="onPlayerDurationChangedFn">
    </es-player-manager>
  </qt-view>
</template>
      
<script setup lang='ts' name='MediaPlayer'>
import { ref, markRaw } from 'vue'
import { ESLogLevel, useESEventBus, useESLog } from "@extscreen/es3-core";
import { useESRouter } from '@extscreen/es3-router'
import { qtRef, QTIMediaSeries, QTMediaSeriesEvent} from '@quicktvui/quicktvui3'
import ThemeConfig from "../../../../config/theme-config";
import BuildConfig from "../../../../config/build-config";
import detailManager from '../../../../api/detail/detail-manager'
import request from '../../../../api/request/request-manager'
import {
  ESIPlayerManager, 
  ESMediaItem,
  ESMediaItemList,
  ESPlayerManager,
  useESPlayerManagerPlayModeManager
} from "@extscreen/es3-player-manager";
import {
  ESPlayerInterceptError,
  ESPlayerInterceptResult,
  ESPlayerPlayMode,
  ESPlayerWindowType,
  ESPlayerRate,
  useESPlayerRateManager
} from "@extscreen/es3-player"
import { ESVideoPlayer } from "@extscreen/es3-video-player";
import { IMedia, IMediaSeriesItem } from '../../adapter/interface'
import MediaPlayerSmallView from './media-player-small-view.vue'

  const TAG = 'MediaSeriesView'
  const emits = defineEmits(['onMediaSeriesListItemLoad'])
  const log = useESLog()
  const router = useESRouter()
  let media: IMedia

  let playerParent = ref()
  let controlPlayViewShow = ref(true)
  const floatWindowWidth = ref<number>(BuildConfig.isLowEndDev ? 0 : 502)
  const floatWindowHeight = ref<number>(BuildConfig.isLowEndDev ? 0 : 283)
  const playerViewList =  [
    // markRaw(ESMediaPlayerView),
    markRaw(MediaPlayerSmallView),
  ]
  const playerManager = ref<ESIPlayerManager>()
  const playerList = [markRaw(ESVideoPlayer)]
  const playerListRef = ref(playerList)
  const playerViewListRef = ref(playerViewList)
  const playModeManager = useESPlayerManagerPlayModeManager()
  const playerRateManager = useESPlayerRateManager()
  const playerLeft = ref<number>(90)
  const top = 90
  const playerTop = ref<number>(top)

  const init = (detailInfo: IMedia) => {}
  const onPlayerPlayMedia = () => {}
  const onPlayerPlaying = () => {}
  const onPlayerPaused = () => {}
  const onPlayerStopped = () => {}
  const onPlayerWindowTypeChanged = () => {}
  const onPlayerInterceptSuccess = () => {}
  const onPlayerInterceptError = () => {}
  const onPlayerProgressChangedFn = () => {}
  const onPlayerDurationChangedFn = () => {}
    
  defineExpose({
    init,
  })
  </script>
      
<style lang='scss' scoped>
.media-player{
  width: 1920px;
  height: 1080px;
  background-color: transparent;
  .player-manager-css{
    position: absolute;
    background-color: black;
  }
}
</style>
        