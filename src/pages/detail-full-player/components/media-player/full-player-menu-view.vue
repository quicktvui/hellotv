<template>
  <qt-view class='full-player-menu-view'
           name='mediaRoot' :focusable="false">
    <!-- 顶部条 -->
    <qt-view class="full-player-menu-view-title"
             v-if="isTitleBarShowing"
             :gradientBackground="{ colors: ['#E6000000', '#00000000'] }">
      <qt-text class="full-player-menu-view-title-text"
               :focusable="false" :fontSize="30" :text="mediaTitle"/>
    </qt-view>
    <!-- 底部进度条 -->
    <qt-view class='full-player-menu-view-bottom' :visible='isProgressShowing'>
      <!-- 进度条背景渐变 -->
      <qt-view class="full-player-menu-view-bottom-bg"
               :gradientBackground="{ colors: ['#00000000', '#E6000000'] }" />
      <div class="full-player-menu-view-state-progress" >
        <!-- 播放状态 -->
        <div class='full-player-menu-state-img'>
          <img :visible="!isPlayerPlaying" :focusable="false" :src="playIcon"
                postDelay="100" />
          <img :visible="isPlayerPlaying" :focusable="false" :src="pauseIcon"
                postDelay="100" />
        </div>
<!--        进度条-->
        <div class='full-player-menu-progress' :autofocus="autofocusType === 0">
          <qt-text class='full-player-menu-progress-text' :focusable='false' gravity="center" :fontSize="30" :text="progress" />
          <qt-seek-bar
            class='full-player-menu-progress-seekbar'
            ref="seekBarRef"
            name="seekBar"
            :blockFocusDirections='["left","right","up"]'
            :color="{ startColor: '#FFFFFF', endColor: '#FFFFFF' }"
            :nextFocusName="{ left: 'seekBar',right:'seekBar'}"
            :focusable='true'
            @onSeekStart='onSeekBarSeekStart'
            @onSeekStop="onSeekBarSeekStop"
            @focus="onSeekbarFocusChanged"
          />
          <qt-text class="full-player-menu-progress-text" :focusable="false"
                   gravity="center" :fontSize="30" :text="duration"/>
        </div>
<!--        下一个按钮-->
        <div class='full-player-menu-next'
             :nextFocusName="{up: 'seekBar',down: 'nextButton',
              right: 'nextButton',left: 'nextButton'}"
             :focusable="true" name="nextButton"
             :visible="mediaSeriesVisible"
             @click="onNextButtonClicked"
             @focus="onNextButtonFocusChanged"
        >
          <div class="full-player-menu-next-text-focus" :focusable="false"
               showOnState="focused" duplicateParentState
               :gradientBackground="{
                colors: ThemeConfig.btnGradientFocusColor,
                cornerRadius: 8, orientation: 6 }">
          </div>
          <qt-text class="full-player-menu-next-text" gravity="center" typeface="bold" :focusable="false"
                   duplicateParentState :fontSize="30" text="下一个" />
        </div>
      </div>

    </qt-view>
    <!-- 底部菜单 -->
    <qt-view class='full-player-menu-list' :visible='isMenuShowing' >
      <qt-view class='full-player-menu-list-bg' :gradientBackground="{ colors: ['#00000000', '#E6000000'] }"/>
      <qt-collapse ref="mediaCollapseRef"
                   :visible="isMenuShowing"
                   v-if="mediaCollapseMenuInit"
                   class="full-player-menu-list-collapse">
        <media-collapse-order
          ref="mediaCollapseOrderRef"
          :blockFocusDirections="['left', 'right', 'down', 'up']"
          name="mediaCollapseOrder"
          @onCollapseItemFocused="onCollapseItemOrderFocused"
          @onCollapseItemClicked="onCollapseItemOrderClicked"/>
        <media-collapse-speed
          ref="mediaCollapseSpeedRef"
          :blockFocusDirections="['left', 'right', 'up']"
          name="mediaCollapseSpeed"
          @onCollapseItemFocused="onCollapseItemSpeedFocused"
          @onCollapseItemClicked="onCollapseItemSpeedClicked"/>
        <media-collapse-definition
          ref="mediaCollapseDefinitionRef"
          :blockFocusDirections="['left', 'right']"
          name="mediaCollapseDefinition"
          @onCollapseItemFocused="onCollapseItemDefinitionFocused"
          @onCollapseItemClicked="onCollapseItemDefinitionClicked"/>
        <media-collapse-media-series
          ref="mediaCollapseMediaSeriesRef"
          :blockFocusDirections="['left', 'right', 'down']"
          name="mediaCollapseMediaSeries"
          @onMediaSeriesGroupItemFocus="onMediaSeriesGroupItemFocus"
          @onMediaSeriesItemFocus="onMediaSeriesItemFocus"
          @onMediaSeriesItemClick="onMediaSeriesItemClick"
        />


      </qt-collapse>

    </qt-view>

  </qt-view>

</template>

<script lang='ts' setup>
import { ESKeyCode, ESKeyEvent, ESLogLevel, useESEventBus } from '@extscreen/es3-core'
import { ESPlayerDefinition, ESPlayerPlayMode, ESPlayerRate } from '@extscreen/es3-player'
import { ESIPlayerManager, ESMediaItem } from '@extscreen/es3-player-manager'
import { QTCollapse, QTICollapse, QTISeekBar, QTListViewItem } from '@quicktvui/quicktvui3'
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import BuildConfig from '../../../../config/build-config'
import ThemeConfig from "../../../../config/theme-config";
import playIcon from '../../../../assets/detail/ic_media_player_play.png'
import pauseIcon from '../../../../assets/detail/ic_media_player_pause.png'
import {
  IMediaViewState, s_to_hs
} from '../../../../components/media/build-data/media-control-adapter'
import {
  IMediaCollapseItemListView,
  IMediaCollapseMediaSeriesView,
  IMediaItem, IMediaPlayerViewState
} from '../../../detail/adapter/interface'
import {
  buildCollapseMenu, buildDefinitionList,
  buildPlayModeList, buildPlayRateList, getDefinitionIndex,
  getPlayModeIndex, getPlayRateIndex
} from '../../../detail/adapter/media-player'
import MediaCollapseDefinition
  from '../../../detail/components/media-player/collapse/media-collapse-definition.vue'
import MediaCollapseMediaSeries
  from '../../../detail/components/media-player/collapse/media-collapse-media-series.vue'
import MediaCollapseOrder
  from '../../../detail/components/media-player/collapse/media-collapse-order.vue'
import MediaCollapseSpeed
  from '../../../detail/components/media-player/collapse/media-collapse-speed.vue'

defineOptions({
  name: 'FullPlayerMenuView'
})
const eventBus = useESEventBus()
/***************组件声明********************/
const seekBarRef = ref<QTISeekBar>()
const mediaCollapseRef = ref<QTICollapse>()
const mediaCollapseOrderRef = ref<IMediaCollapseItemListView>()
const mediaCollapseSpeedRef = ref<IMediaCollapseItemListView>()
const mediaCollapseDefinitionRef = ref<IMediaCollapseItemListView>()
const mediaCollapseMediaSeriesRef = ref<IMediaCollapseMediaSeriesView>()

/**************播放器相关**********************/
//播放管理类
let playerManager: ESIPlayerManager
const isPlayerPlaying = ref<boolean>(true)
const progress = ref<string>('00:00')
const duration = ref<string>('00:00')

const autofocusType = ref(0)
//防止快进快退当前展示时长频繁修改
let isSeeking = false
const mediaTitle = ref<string>('')
const isTitleBarShowing = ref<boolean>(true)
/********************数据***************************/

const isProgressShowing = ref<boolean>(false)
const mediaSeriesVisible = ref<boolean>(true)
const isMenuShowing = ref<boolean>(false)
const mediaCollapseMenuInit = ref<boolean>(false)
const viewState = ref<number>(1)

//当前视频总时长
let curDuration = 0
let collapse: QTCollapse
let collapseItemIndex = 0
let collapseItemList: any = []
let playMode: ESPlayerPlayMode
let playModeList: Array<ESPlayerPlayMode>
let rate: ESPlayerRate
let rateList: Array<ESPlayerRate>
let definition: ESPlayerDefinition
let definitionList: Array<ESPlayerDefinition>
let nextButtonFocused = false
let mediaListGroupItemFocused = false
// manager view 隐藏延时器
let dismissTimer: any

watch(()=>[mediaCollapseRef]as const,([newV],[oldV])=>{
  if (newV){
    collapse = buildCollapseMenu(true)
    collapseItemIndex = collapse.defaultIndex ?? 0
    collapseItemList = collapse.itemList
    mediaCollapseRef.value?.init(collapse)
  }
} )

onMounted(()=>{
  initSeekBar()
  initCollapseMenu()
  eventBus.on('onFullPlayerMediaListLoad',collapseMediaLoadData)
})
onUnmounted(()=>{
  eventBus.off('onFullPlayerMediaListLoad',)
})
const initSeekBar = ()=>{
  seekBarRef.value?.setSeekBarMode(1);
  seekBarRef.value?.setProgressHeight(12);
  seekBarRef.value?.setProgressRadius(6);
  seekBarRef.value?.setThumbWidth(60)
  seekBarRef.value?.setThumbHeight(60)
  seekBarRef.value?.setLeftThumbUrl('http://extcdn.hsrc.tv/extend_screen/images/default/ic_1905_thumb.png')
  seekBarRef.value?.setLeftThumbInactivatedDrawable({
    colors: ['#00000000', '#00000000'],
    cornerRadius: 4
  })
}
const initCollapseMenu = () => {
  if (!mediaCollapseMenuInit.value) {
    mediaCollapseMenuInit.value = true
  }
}

const collapseMediaLoadData = (page:number,mediaList:Array<IMediaItem>)=>{
  if (mediaCollapseMenuInit.value){
    nextTick(()=>{
      mediaCollapseMediaSeriesRef.value?.setListData(page-1,mediaList)
    })
  }

}

const onNextButtonClicked = () => {
  // if (player) player.playNextMedia()
}
const onNextButtonFocusChanged = (e) => {
  // nextButtonFocused = e.isFocused
}
const onCollapseItemOrderFocused = () => {
  mediaListGroupItemFocused = false
}
const onCollapseItemOrderClicked = (index: number, item: QTListViewItem) => {
  // if (playMode == item.mode) return
  // player?.setPlayMediaListMode(item.mode)
}
const onCollapseItemSpeedFocused = () => {
  mediaListGroupItemFocused = false
}
const onCollapseItemSpeedClicked = (index: number, item: QTListViewItem) => {
  // if (rate == item.rate) return
  // player?.setPlayRate(item.rate)
}
const onCollapseItemDefinitionFocused = () => {
  mediaListGroupItemFocused = false
}
const onCollapseItemDefinitionClicked = (index: number, item: QTListViewItem) => {
  // if (definition == item.definition) return
  // player?.setDefinition(item.definition)
}
const onMediaSeriesGroupItemFocus = (index: number) => {
  mediaListGroupItemFocused = true
}
const onMediaSeriesItemFocus = (index: number) => {
  mediaListGroupItemFocused = false
}
const onMediaSeriesItemClick = (index: number, item: QTListViewItem) => {
  // player?.stop()
  // player?.playMediaById(item.id)
}
/**
 *  设置播放管理类 回调
 * @param value
 */
const setPlayerManager = (value: ESIPlayerManager): void => {
  playerManager = value
}
/**
 *  获取播放管理类
 * @param value
 */
const getPlayerManager = (): ESIPlayerManager => {
  return playerManager
}
/**
 * 进度条快进快退开始 回调
 * @param progress
 */
const onSeekBarSeekStart = (progress) => {
  isSeeking = true
}
/**
 * 进度条快进快退结束 回调
 * @param progress
 */
const onSeekBarSeekStop = (progress) => {

  isSeeking = false
  if (playerManager && progress >= 0) {
    playerManager.seekTo(progress)
  }
}
/**
 * 进度条焦点改变 回调
 * @param event
 */
const onSeekbarFocusChanged = (event) => {
  // let focused = event.isFocused
  // seekBarRef.value?.setThumbActivate(focused)
}
/**
 * 播放模式列表 回调
 * @param modeList
 */
const onPlayerPlayMediaListModeListChanged = (modeList: Array<ESPlayerPlayMode>): void => {
  if (modeList && modeList.length > 0) {
    playModeList = modeList.filter(mode => {
      return mode === ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_REPEAT
        || mode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_LOOP
        || mode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ORDER
    })
  }
  if (playModeList && playModeList.length > 0){
    const buildModeList = buildPlayModeList(playModeList)
    mediaCollapseOrderRef.value?.setListData(buildModeList)
  }
}
/**
 * 当前播放模式 回调
 * @param mode
 */
const onPlayerPlayMediaListModeChanged = (mode: ESPlayerPlayMode): void => {
  playMode = mode
  setModeItemSelected()
}
/**
 * 初始化播放模式默认选中项
 */
const setModeItemSelected = () => {
  if (playModeList) {
    const index = getPlayModeIndex(playMode, playModeList)
    mediaCollapseOrderRef.value?.setItemSelected(index)
  }
}
/**
 * 播放速率 回调
 * @param list 速率列表
 */
const onPlayerPlayRateListChanged = (list: Array<ESPlayerRate>): void => {
  rateList = BuildConfig.isLowEndDev ? [ESPlayerRate.ES_PLAYER_RATE_1] : list
  if (rateList && rateList.length > 0){
    const buildRateList = buildPlayRateList(rateList)
    mediaCollapseSpeedRef.value?.setListData(buildRateList)
  }
}
/**
 * 当前速率 回调
 * @param r
 */
const onPlayerPlayRateChanged = (r: ESPlayerRate): void => {
  rate = r
  setRateItemSelected()
}
/**
 * 初始化速率默认选中项
 */
const setRateItemSelected = () => {
  if (rateList){
    const index = getPlayRateIndex(rate, rateList)
    if (index > -1) {
      mediaCollapseSpeedRef.value?.setItemSelected(index)
    }
  }
}
/**
 * 播放清晰度 回调 需要播放数据中设置播放清晰度{{uri:"",definition:1}}
 * @param list 播放清晰度列表
 */
const onPlayerDefinitionListChanged = (list: Array<ESPlayerDefinition>): void => {
  definitionList = list
  if (definitionList && definitionList.length > 0){
    const buildDefinitionList = buildDefinitionList(definitionList)
    mediaCollapseDefinitionRef.value?.setListData(buildDefinitionList)
  }
}
/**
 * 当前清晰度 回调
 * @param d
 */
const onPlayerDefinitionChanged = (d: ESPlayerDefinition): void => {
  definition = d
  setDefinitionItemSelected()
}
/**
 * 初始化清晰度默认选中项
 */
const setDefinitionItemSelected = ()=>{
  if (definitionList) {
    const index = getDefinitionIndex(definition, definitionList)
    if (index > -1) {
      mediaCollapseDefinitionRef.value?.setItemSelected(index)
    }
  }
}
/**
 * 设置当前 view 隐藏
 * @param delay 延时
 */
function setPlayerViewStateDismissDelay(delay: number = 4000) {
  clearDismissTimer()
  dismissTimer = setTimeout(() => {
    setPlayerViewStateDismiss()
  }, delay)
}
/**
 * 清除定时器
 */
function clearDismissTimer() {
  if (dismissTimer) {
    clearTimeout(dismissTimer)
  }
}
const onKeyDown = (keyEvent:ESKeyEvent):boolean =>{
  if (isPlayerPlaying.value){
    setPlayerViewStateDismissDelay(4000)
  }
  switch (keyEvent.keyCode) {
    case ESKeyCode.ES_KEYCODE_DPAD_CENTER:
    case ESKeyCode.ES_KEYCODE_ENTER:
      if (isPlayerViewStateDismiss()){
        setPlayerViewStateProgress()
      }
      if (isPlayerViewStateProgress()) {
        if (isPlayerPlaying.value) {
          playerManager.pause()
          isPlayerPlaying.value = false
        } else {
          playerManager.start(0)
          isPlayerPlaying.value = true
        }
        return true
      }
      break;
    case ESKeyCode.ES_KEYCODE_DPAD_LEFT:
    case ESKeyCode.ES_KEYCODE_DPAD_RIGHT:
      autofocusType.value = 0
      if (isPlayerViewStateDismiss()) {
        setPlayerViewStateProgress()
        return true
      }
      if (isPlayerViewStateProgress()) {
        if (seekBarRef.value?.isFocused() && curDuration > 0){
          seekBarRef.value?.startSeek(keyEvent.keyCode === ESKeyCode.ES_KEYCODE_DPAD_RIGHT)
        }
        return true
      }
      break;
  }
}
const onKeyUp = (keyEvent:ESKeyEvent):boolean =>{
  setPlayerViewStateDismissDelay(5000)
  switch (keyEvent.keyCode) {
    case ESKeyCode.ES_KEYCODE_DPAD_LEFT:
    case ESKeyCode.ES_KEYCODE_DPAD_RIGHT:
      if (isPlayerViewStateProgress() && seekBarRef.value?.isFocused() && curDuration > 0) {
        seekBarRef.value?.stopSeek()
      }
      isSeeking = false
      return true
  }
  return true

}
const onBackPressed = () =>{

}
const onPlayerPlayMedia = (mediaItem: ESMediaItem): void => {
  if (curDuration && curDuration > 0) {
    curDuration = 0
    seekBarRef.value?.setProgress(0)
  }
  progress.value = '00:00'
  duration.value = '00:00'
  mediaTitle.value = mediaItem.title
  setCollapseItemMediaListSelected(mediaItem.index)
}
const onPlayerPrepared = (): void => {
  initPlayerViewState(1)
}
const onPlayerPlaying = (): void => {
  isPlayerPlaying.value = true
}
/**
 * 播放进度改变 回调
 * @param p 播放进度 单位：毫秒
 */
const onPlayerProgressChanged = (p: number): void => {
  if (isSeeking) {
    return
  }
  seekBarRef.value?.setProgress(p)
  progress.value = s_to_hs(Math.floor(p / 1000))
}
const onPlayerDurationChanged = (d: number): void => {
  if (isSeeking) {
    return
  }
  curDuration = d
  seekBarRef.value?.setMaxProgress(d)
  duration.value = s_to_hs(Math.floor(d / 1000))
}
const setCollapseItemMediaListSelected = (index)=>{
  if (index > -1){
    mediaCollapseMediaSeriesRef.value?.setItemSelected(index)
  }
}

const isPlayerViewStateMenu = () => {
  return IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_MENU === viewState.value;
}
const isPlayerViewStateDismiss = () => {
  return IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_DISMISS === viewState.value;
}
const isPlayerViewStateProgress = () => {
  return IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_PROGRESS === viewState.value;
}
const setPlayerViewStateDismiss = () => {
  const lastViewState = viewState.value
  viewState.value = IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_DISMISS
  initPlayerViewState(lastViewState);
}
const setPlayerViewStateProgress = () => {
  const lastViewState = viewState.value
  viewState.value = IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_PROGRESS
  initPlayerViewState(lastViewState);
}
const initPlayerViewState = (lastViewState: number) => {
  switch (viewState.value) {
    case IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_DISMISS:
      isTitleBarShowing.value = false
      isMenuShowing.value = false
      isProgressShowing.value = false
      mediaListGroupItemFocused = false
      if (lastViewState == IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_MENU) {
        mediaCollapseRef.value?.collapse()
        collapseItemIndex = collapse.defaultIndex ?? 0
      }
      break
    case IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_MENU:
      isMenuShowing.value = true
      isProgressShowing.value = false
      if (!mediaCollapseMenuInit.value) {
        initCollapseMenu()
      }
      mediaCollapseRef.value?.expandItem(collapseItemIndex)
      break
    case IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_PROGRESS:
      isMenuShowing.value = false
      isTitleBarShowing.value = true
      isProgressShowing.value = true
      mediaListGroupItemFocused = false
      if (lastViewState == IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_MENU) {
        mediaCollapseRef.value?.collapse()
        collapseItemIndex = collapse.defaultIndex ?? 0
      }
      break
  }
  if (viewState.value !== IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_DISMISS){
    setPlayerViewStateDismissDelay(5000)
  }
}
const setPlayerViewStateMenu = () => {
  const lastViewState = viewState.value
  viewState.value = IMediaPlayerViewState.MEDIA_PLAYER_VIEW_STATE_MENU
  initPlayerViewState(lastViewState);
}
defineExpose({
  setPlayerManager,
  getPlayerManager,
  onPlayerPlayMedia,
  onPlayerPrepared,
  onPlayerPlaying,
  onPlayerProgressChanged,
  onPlayerDurationChanged,
  onSeekBarSeekStart,
  onSeekBarSeekStop,
  onSeekbarFocusChanged,
  onPlayerPlayRateListChanged,
  onPlayerPlayRateChanged,
  onPlayerPlayMediaListModeListChanged,
  onPlayerPlayMediaListModeChanged,
  onKeyDown,
  onKeyUp
})

</script>

<style lang='scss'>
.full-player-menu-view{
  background-color: transparent;
  width: 1920px;
  height: 1080px;
}
.full-player-menu-view-title {
  background-color: transparent;
  .full-player-menu-view-title-text{
    width: 1740px;
    height: 50px;
    font-size: 44px;
    font-weight: 400;
    color: white;
    margin-left: 90px;
    margin-top: 50px;
  }
}
.full-player-menu-view-bottom{
  width: 1920px;
  height: 700px;
  background-color: transparent;
  position: absolute;
  bottom: 0;
  left: 0;
  align-items: flex-start;
  justify-content: flex-end;
  .full-player-menu-view-bottom-bg {
    width: 1920px;
    height: 700px;
    background-color: transparent;
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .full-player-menu-view-state-progress{
    align-items: flex-start;
    justify-content: flex-end;
    background-color: transparent;
    .full-player-menu-state-img{
      width: 80px;
      height: 80px;
      margin-left: 90px;
      margin-bottom: 14px;
      background-color: transparent;
      >img {
        width: 80px;
        height: 80px;
        position:absolute;
      }
    }
    .full-player-menu-progress{
      width: 1740px;
      height: 60px;
      flex-direction: row;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 25px;
      margin-left: 90px;
      .full-player-menu-progress-text{
        width: 100px;
        height: 60px;
        font-size: 30px;
        font-weight: 400;
        color: white;
      }
      .full-player-menu-progress-seekbar{
        width: 1512px;
        height: 60px;
        margin-left: 20px;
        margin-right: 20px;
        background-color: transparent;
      }
    }
    .full-player-menu-next{
      width: 130px;
      height: 60px;
      margin-left: 90px;
      margin-bottom: 40px;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      .full-player-menu-next-text-focus{
        width: 130px;
        height: 60px;
        background-color: transparent;
        border-radius: 8px;
        position: absolute;
      }
      .full-player-menu-next-text{
        width: 130px;
        height: 60px;
        font-size: 30px;
        font-weight: 400;
        color: white;
        focus-color: #000;
      }
    }
  }
}
.full-player-menu-list{
  width: 1920px;
  height: 700px;
  background-color: transparent;
  position: absolute;
  bottom: 0;
  left: 0;
  align-items: flex-start;
  justify-content: flex-end;
  .full-player-menu-list-bg{
    width: 1920px;
    height: 640px;
    position: absolute;
    left: 0;
    background-color: transparent;
  }
  .full-player-menu-list-collapse{
    width: 1920px;
    height: 640px;
    position: absolute;
    left: 0;
    background-color: transparent;
  }
}
</style>
