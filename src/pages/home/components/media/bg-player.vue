<template>
  <div class="bg-player-root-css" :clipChildren="false">
    <qt-replace-child
      class="bg-player-replace-child"
      sid="bgPlayerReplaceChildSid"
      :markChildSID="TabContentConfig.homeBgPlaySid"
      :replaceOnVisibilityChanged="false"
      :focusable="false"
      :clipChildren="false"
    >
    </qt-replace-child>
    <!--  此div的作用是让bg_player在一开始的时候不显示，否则如果瀑布流首屏配置了播放器，就会先闪现在左上角一下-->
    <div class="bg-player-parent-css" sid="TabContentConfig.homeBgPlaySid">
      <div
        class="bg-player-window"
        v-if="playerWindowInit"
        :sid="TabContentConfig.homeBgPlaySid"
        :style="{ width: `${playerWindowWidth}px`, height: `${playerWindowHeight}px` }"
        :fillParent="true"
        :clipChildren="false"
        :focusable="false"
      >
        <media-player-view
          class="bg-player-view"
          ref="bgPlayerViewRef"
          :clipChildren="false"
          :playerLeft="playerLeft"
          :playerTop="playerTop"
          :isShowPlayerController="false"
          @onPlayerPlayMedia="onPlayerPlayMedia"
          @onPlayerPlaying="onPlayerPlaying"
          @onPlayerCompleted="onPlayerCompleted"
          @onPlayerError="onPlayerError"
        />
      </div>
    </div>
    <!-- 背景图-->
    <bg-animation
      class="bg-player-background-img"
      :bgStyle="{ width: playerWidth, height: playerHeight, left: playerLeft, top: playerTop }"
      ref="bgPlayerBackgroundImgRef"
      :visible="bgPlayerType !== HomePlayType.TYPE_4K"
      :focusable="false"
    />
    <!-- 全屏背景遮罩-->
    <div
      class="bg-player-mask"
      v-if="!isShowShadow"
      :visible="bgPlayerType === HomePlayType.TYPE_BG"
      :bgStyle="{ width: playerWidth, height: playerHeight, left: playerLeft, top: playerTop }"
      :focusable="false"
    />
    <!-- 背景阴影 -->
    <img
      class="bg-player-shadow"
      v-if="isShowShadow && playerWidth && playerHeight"
      :style="{ width: playerWidth + 'px', height: playerHeight + 'px', left: playerLeft, top: playerTop }"
      :focusable="false"
      :src="bg_shadow"
    />

    <!-- 小窗列表 -->
    <qt-view
      class="bg-player-list"
      :style="{ width: `${playerWindowWidth}px`, height: `${playerWindowHeight}px` }"
      :visible="bgPlayerType === HomePlayType.TYPE_CELL_LIST"
      :clipChildren="true"
    >
      <!-- 加载中 -->
      <qt-view class="bg-player-list-loading" :visible="curPlayState !== PlayerState.STATE_PLAYING" :focusable="false">
        <qt-loading-view style="width: 100px; height: 100px" color="#ffffff" :focusable="false" />
        <qt-text class="bg-player-list-loading-text" text="加载中..." gravity="center" :focusable="false"></qt-text>
      </qt-view>

      <qt-list-view
        style="width: 403px; height: 510px; background-color: transparent; margin-left: 907px"
        :listData="cellListData"
        :verticalFadingEdgeEnabled="true"
        @item-click="onItemClick"
        @item-focused="onItemFocus"
      >
        <!-- 文字 -->
        <qt-view class="bg-player-list-item" :type="1" :focusable="true" :enableFocusBorder="true" eventClick eventFocus>
          <qt-text
            class="bg-player-list-item-text"
            text="${text}"
            gravity="center|start"
            :paddingRect="[20, 0, 20, 0]"
            :boldOnFocus="true"
            :lines="2"
            :ellipsizeMode="4"
            :focusable="false"
            :duplicateParentState="true"
          ></qt-text>
        </qt-view>
      </qt-list-view>
    </qt-view>
  </div>
</template>

<script lang="ts" setup name="bg-player">
import { ESKeyEvent, useESEventBus } from '@extscreen/es3-core'
import { ESPlayerPlayMode } from '@extscreen/es3-player'
import { ESMediaItem } from '@extscreen/es3-player-manager'
import { qtRef, QTListViewItem, VirtualView } from '@quicktvui/quicktvui3'
import { onMounted, ref } from 'vue'
import bg_shadow from '../../../../assets/home/bg_shadow.png'
import BgAnimation from '../../../../components/bg-animation.vue'
import { IMediaList } from '../../../../components/media/build-data/media-imp'
import MediaPlayerView from '../../../../components/media/view/media-player-view.vue'
import BuildConfig from '../../../../config/build-config'
import { createHomePlayerInterceptor } from '../../adapter/media/create-home-player-interceptor'
import { HomePlayData, HomePlayType, PlayerState } from '../../adapter/media/home-media-imp'
import TabContentConfig from '../../adapter/tab-content/tab-content-config'

const esEventBus = useESEventBus()
const bgPlayerBackgroundImgRef = ref()
const bgPlayerViewRef = ref()
//播放窗口初始化
const playerWindowInit = ref(false)
//播放器窗口大小
const playerWindowWidth = ref(0)
const playerWindowHeight = ref(0)
//播放器大小
const playerWidth = ref(0)
const playerHeight = ref(0)
//播放器偏移量
const playerLeft = ref<number>(0)
const playerTop = ref<number>(0)
//播放类型
const bgPlayerType = ref(HomePlayType.TYPE_UNDEFINED)
//播放拦截器
const playerInterceptor = createHomePlayerInterceptor()
//是否显示边框阴影
const isShowShadow = ref(false)
//小窗列表数据
const cellListData = qtRef<QTListViewItem[]>()
//播放状态
let curPlayState = PlayerState.STATE_WAIT
//生命周期
let lifeCycle = ''
//延时器
let delayInitPlayTimer: any = -1
let delayPlayTimer: any = -1
let dismissCoverTimer: any = -1
//当前已经加载的背景图
let curCover = ''
/********** 4K ************/
let beforeSid = ''
let sid = ''
let nextSid = ''

onMounted(() => {
  esEventBus.on('bg-player-life-cycle', updateLifeCycle)
})
/**
 * 更新生命周期
 * @param lifeCycleName
 */
const updateLifeCycle = (lifeCycleName: string) => {
  lifeCycle = lifeCycleName
  if (lifeCycleName === 'onESDestroy') {
    esEventBus.off('bg-player-life-cycle')
  }
}
/**
 * 设置播放状态
 * @param state
 */
const setPlayState = (state: PlayerState) => {
  curPlayState = state
}
/**
 * 初始化播放
 * @param playInfo
 */
const initPlay = (playInfo: HomePlayData) => {
  if (!playInfo) return
  //初始化数据
  resetPlayingData()
  //解析基础数据
  decodePlayInfo(playInfo)
  //获取播放数据
  const playerData = playInfo.playerData
  if (playerData && playerData.length > 0) {
    // 小窗列表数据
    if (bgPlayerType.value === HomePlayType.TYPE_CELL_LIST) {
      cellListData.value = playerData.map((item) => {
        return {
          type: 1,
          text: item.title
        }
      })
      qt.log.e('ok->cellListData', cellListData.value)
    } else {
      //设置背景
      const cover = playerData[0].cover || ''
      setBgImage(cover)
    }

    //准备播放数据
    let delayToPlay = 400
    if (!playerWindowInit.value) {
      playerWindowInit.value = true
      delayToPlay += 800
    }
    delayInitPlayTimer = setTimeout(() => {
      if (curPlayState === PlayerState.STATE_STOP) {
        return
      }
      if (lifeCycle !== 'onESStop') {
        play(playerData, true)
      }
    }, delayToPlay)
  }
}
/**
 * 重置数据
 */
const resetPlayingData = () => {
  clearPlayTimer()
  if (curPlayState === PlayerState.STATE_PLAYING) {
    pause()
    stop()
  }
}
const clearPlayTimer = () => {
  if (delayInitPlayTimer) clearTimeout(delayInitPlayTimer)
}
/**
 * 解析播放尺寸数据
 */
const decodePlayInfo = (playInfo: HomePlayData) => {
  //playerType类型赋值要放在设置图片之前
  bgPlayerType.value = playInfo.type
  playerWindowWidth.value = playInfo.windowWidth
  playerWindowHeight.value = playInfo.windowHeight
  playerWidth.value = playInfo.playerWidth
  playerHeight.value = playInfo.playerHeight
  playerLeft.value = playInfo.playerLeft
  playerTop.value = playInfo.playerTop
}
/**
 * 设置背景图
 * @param bgImg
 * @param isLoadCur
 */
const setBgImage = (bgImg: string, isLoadCur: boolean = false) => {
  if (bgPlayerType.value === HomePlayType.TYPE_4K || bgPlayerType.value === HomePlayType.TYPE_CELL) {
    //4k和小窗图片在格子上设置
    bgPlayerBackgroundImgRef.value.clearImg()
    return
  }
  //防止即将播放的时候 切换背景播放导致背景出不来
  clearTimeout(dismissCoverTimer)
  if (isLoadCur) {
    bgImg = curCover
  } else if (bgImg === curCover) {
    return
  }
  curCover = bgImg
  if (bgImg) {
    bgPlayerBackgroundImgRef.value.setImg(bgImg)
  } else {
    bgPlayerBackgroundImgRef.value.clearImg()
  }
}

const play = (playerData: Array<IMediaList>, isSetWindowChange: boolean = false) => {
  //低端机 且 非全屏播放 不播
  if (BuildConfig.isLowEndDev && bgPlayerType.value !== HomePlayType.TYPE_BG) return
  bgPlayerViewRef.value?.resetMediaList()
  const list = bgPlayerViewRef.value?.initPlayData(playerData, ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_REPEAT, [playerInterceptor])
  clearTimeout(delayPlayTimer)
  delayPlayTimer = setTimeout(() => {
    bgPlayerViewRef.value.playMediaList(list)
    bgPlayerViewRef.value.setSize(playerWidth.value, playerHeight.value)
  }, 200)
  if (isSetWindowChange) {
    if (bgPlayerType.value == HomePlayType.TYPE_BG) {
      bgPlayerViewRef.value?.setFullWindow()
    } else {
      bgPlayerViewRef.value?.setSmallWindow()
    }
  }
}
const start = () => {
  if (!BuildConfig.isLowEndDev || bgPlayerType.value == HomePlayType.TYPE_BG) bgPlayerViewRef.value?.start(0)
  curPlayState = PlayerState.STATE_START
}
const pause = () => {
  if ((!BuildConfig.isLowEndDev || bgPlayerType.value == HomePlayType.TYPE_BG) && curPlayState === PlayerState.STATE_PLAYING) {
    bgPlayerViewRef.value?.pause()
  }
  curPlayState = PlayerState.STATE_PAUSE
}
const stop = () => {
  if (!BuildConfig.isLowEndDev || bgPlayerType.value == HomePlayType.TYPE_BG) {
    bgPlayerViewRef.value?.stop()
  }
  curPlayState = PlayerState.STATE_STOP
}
const resume = () => {
  if (!BuildConfig.isLowEndDev || bgPlayerType.value == HomePlayType.TYPE_BG) bgPlayerViewRef.value?.resume()
  curPlayState = PlayerState.STATE_RESUME
}
const reset = () => {
  if (!BuildConfig.isLowEndDev || bgPlayerType.value == HomePlayType.TYPE_BG) bgPlayerViewRef.value?.reset()
  curPlayState = PlayerState.STATE_RESET
}
const release = () => {
  if (!BuildConfig.isLowEndDev || bgPlayerType.value == HomePlayType.TYPE_BG) bgPlayerViewRef.value?.release()
  curPlayState = PlayerState.STATE_RELEASE
}
const onPlayerPlayMedia = (mediaItem: ESMediaItem) => {
  //4K 逻辑
  if (bgPlayerType.value === HomePlayType.TYPE_4K) {
    beforeSid = mediaItem.beforeSid
    sid = mediaItem.sid
    nextSid = mediaItem.nextSid
    change4KVisible(beforeSid, 'visible')
    change4KVisible(nextSid, 'visible')
  }
}
const onPlayerPlaying = () => {
  clearTimeout(dismissCoverTimer)
  //防止因用户操作过快导致视频切换后，还继续播放
  if (curPlayState === PlayerState.STATE_PAUSE || curPlayState === PlayerState.STATE_STOP) {
    pause()
    stop()
    return
  }
  curPlayState = PlayerState.STATE_PLAYING
  requestDismissCover(600)
}

const onPlayerCompleted = () => {}
const onPlayerError = () => {
  pause()
  stop()
}
const change4KVisible = (sid: string, visible: string) => {
  VirtualView.call(sid, 'changeVisibility', [`${visible}`])
}
const requestDismissCover = (delay = 1000) => {
  if (bgPlayerType.value === HomePlayType.TYPE_4K) {
    change4KVisible(sid, 'invisible')
    VirtualView.call(TabContentConfig.homeBgPlaySid, 'changeAlpha', [1])
  }
  clearTimeout(dismissCoverTimer)
  dismissCoverTimer = setTimeout(() => {
    bgPlayerBackgroundImgRef.value?.clearImg()
  }, delay)
}

const onItemClick = (item: any) => {
  qt.log.e('ok->bgPlayer-onItemClick', item)
}

const onItemFocus = (item: any) => {
  qt.log.e('ok->bgPlayer-onItemFocus', item)
}

const destroy = () => {
  clearPlayTimer()
  pause()
  stop()
  release()
}
const onKeyDown = (keyEvent: ESKeyEvent): boolean => {
  return bgPlayerViewRef.value?.onKeyDown(keyEvent)
}
const onKeyUp = (keyEvent: ESKeyEvent): boolean => {
  return bgPlayerViewRef.value?.onKeyUp(keyEvent)
}
const onBackPressed = () => {
  bgPlayerViewRef.value?.onBackPressed()
}
const changeShadow = (boo: boolean) => {
  isShowShadow.value = boo
}
defineExpose({
  playerWindowInit,
  initPlay,
  play,
  start,
  pause,
  stop,
  resume,
  reset,
  release,
  setPlayState,
  setBgImage,
  onKeyDown,
  onKeyUp,
  onBackPressed,
  changeShadow,
  destroy
})
</script>

<style lang="scss" src="../../scss/bg-player.scss"></style>
