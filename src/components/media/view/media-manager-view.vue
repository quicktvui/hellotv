<template>
  <div class='media-manager-root-css' :focusable='false'
       :style='{width:`${playerWidth}px`,height:`${playerHeight}px`}'
       :blockFocusDirections="['left', 'right', 'down', 'up']"
       :showDialog='isFullWindow && isShowManagerView'>
    <!-- 底部菜单 View-->
    <div class='media-manager-bg-css' :visible='isShowBottomView'
         :style='{width:`${playerWidth}px`,height:`540px`}'
         :focusable='false'
         :gradientBackground='{ colors: ThemeConfig.tabContentFloatBgColor, orientation: 4 }'>
      <!-- 播放标题-->
      <span class='media-manager-title-css main-title-css' :visible='!isShowSeekBarTip'
            :focusable='false'>{{ mediaMainTitle }}</span>
      <!-- 播放副标题-->
      <span class='media-manager-title-css sub-title-css' v-if='mediaSubTitle'
            :visible='!isShowSeekBarTip' :focusable='false'>{{ mediaSubTitle }}</span>
      <!-- 进度条-->
      <div class='media-manager-progress-root-css' :focusable='false'
           :autofocus='autofocusType === 0'>
        <!-- 播放状态-->
        <div class='media-manager-play-state-root-css' :focusable='false'>
          <img class='media-manager-img-play-state-css'
               :focusable='false'
               :visible='!isPlayerPlaying'
               :src='playIcon' />
          <img class='media-manager-img-play-state-css'
               :focusable='false'
               :visible='isPlayerPlaying'
               :src='pauseIcon' />
        </div>
        <qt-seek-bar
          class='media-manager-seekbar-css'
          ref='mediaManagerSeekBarRef'
          name='seekBar'
          :color="{ startColor: '#FF6699', endColor: '#FF6699' }"
          :nextFocusName="{ down: 'mediaControlView',left: 'seekBar',right:'seekBar'}"
          :focusable='true'
          @onSeekStart='onSeekBarSeekStart'
          @onSeekStop='onSeekBarSeekStop'
          @focus='onSeekbarFocusChanged'
        />
      </div>
      <!-- 底部按钮组-->
      <div class='media-manager-setting-root-css' :autofocus='autofocusType === 1'>
        <media-menu-view v-if='isShowList'
                         :visible='!isShowSeekBarTip'
                         ref='mediaMenuViewRef'
                         name='mediaMenuView'
                         :nextFocusName="{ up: 'seekBar'}"
                         :menu-list='menuList'
                         @onItemFocused='onItemFocused'
                         @onItemClicked='onItemClicked' />
        <!-- 进度提示-->
        <div class='media-manager-text-root-css' :focusable='false'>
        <span class='media-manager-progress-text-css' style='color:#BFBFBF'
              :numberOfLines='1' :focusable='false'>{{ ' / ' + duration }}</span>
          <span class='media-manager-progress-text-css'
                style='color: white; margin-right: 5px;' :numberOfLines='1'
                :focusable='false'>{{ progress }}</span>
        </div>
      </div>
      <!-- 倍速-->
      <media-menu-detail-view
        ref='mediaMenuSpeedRateRef'
        :itemName='PlayMenuNameFlag.RATE_ITEM'
        title='倍速'
        @onItemClicked='onItemClicked'
      />
      <!-- 清晰度-->
      <!--      <media-menu-detail-view-->
      <!--        ref='mediaMenuDefinitionRef'-->
      <!--        :item-name='PlayMenuNameFlag.DEFINITION_ITEM'-->
      <!--        title='清晰度'-->
      <!--        @onItemClicked="onItemClicked"-->
      <!--      />-->
      <media-menu-detail-view
        ref='mediaMenuModeRef'
        :itemName='PlayMenuNameFlag.SETTING_ITEM'
        title='设置'
        @onItemClicked='onItemClicked'
      />
    </div>
  </div>

</template>

<script lang='ts' setup name='MediaManagerView'>

import { ESKeyCode, ESKeyEvent, ESLogLevel, useESLog, useESToast } from '@extscreen/es3-core'
import {
  ESPlayerDefinition,
  ESPlayerPlayMode,
  ESPlayerRate,
  ESPlayerWindowType
} from '@extscreen/es3-player'
import { ESIPlayerManager, ESMediaItem } from '@extscreen/es3-player-manager'
import { QTISeekBar, QTSeekBarMode } from '@quicktvui/quicktvui3'
import { onMounted, ref } from 'vue'
import ThemeConfig from '../../../config/theme-config.ts'
import playIcon from '../../../assets/component-media/ic_media_btn_play.png'
import pauseIcon from '../../../assets/component-media/ic_media_btn_pause.png'
import {
  buildModes, buildPlayRates,
  getCurModeIndex,
  getCurRateIndex,
  IMediaViewState,
  s_to_hs
} from '../build-data/media-control-adapter'
import { IMediaMenu, PlayMenuNameFlag } from '../build-data/media-imp'
import MediaMenuDetailView from './media-menu-detail-view.vue'
import MediaMenuView from './media-menu-view.vue'
import BuildConfig from "../../../config/build-config.ts"

const TAG = "MEDIA_MANAGER_VIEW"
const log = useESLog()
const toast = useESToast()
/*******************组件声明******************/
//进度条
const mediaManagerSeekBarRef = ref<QTISeekBar>()
//底部按钮组
const mediaMenuViewRef = ref()
//倍速
const mediaMenuSpeedRateRef = ref()
//清晰度
// const mediaMenuDefinitionRef = ref()
//播放模式
const mediaMenuModeRef = ref()
//当前 控制菜单的 ref
let curControlRef
/*******************播放器相关******************/
//播放管理类
let playerManager: ESIPlayerManager
//播放器宽高
const playerWidth = ref<number>(0)
const playerHeight = ref<number>(0)
//播放器全屏状态
const isFullWindow = ref<boolean>(false)
//播放中/播放暂停状态
const isPlayerPlaying = ref<boolean>(false)
//进度条展示值---当前时长
const d_time_str = '00:00'
const progress = ref<string>(d_time_str)
//进度条展示值---总时长
const duration = ref<string>(d_time_str)

let autofocusType = ref(0)
//当前视频总时长
let curDuration = 0
//防止快进快退当前展示时长频繁修改
let isSeeking = false
//播放标题
let mediaMainTitle = ref('')
//播放副标题
let mediaSubTitle = ref('')

/********************数据***************************/
//主动控制当前控制 View 是否展示 默认隐藏
let isShowManagerView = ref(false)
//底部菜单列表是否展示 默认显示
let isShowBottomView = ref(true)
//控制进度条快进快退提示信息是否展示
let isShowSeekBarTip = ref(false)
// 当前 view 显示隐藏状态
let viewState: IMediaViewState | undefined = IMediaViewState.STATE_MANAGER_VIEW_DISMISS
// manager view 隐藏延时器
let dismissTimer: NodeJS.Timeout
// 速率原始列表
let rateList: Array<ESPlayerRate>
// 当前速率
let rate: ESPlayerRate
// 清晰度原始列表
// let definitionList: Array<ESPlayerDefinition>
// 当前清晰度
// let definition: ESPlayerDefinition
// 播放模式原始列表
let playModeList: Array<ESPlayerPlayMode>
// 当前播放模式
let playMode: ESPlayerPlayMode
// 底部菜单列表 点击位置
let curMenuClickPosition = -1
let bottomViewFocus = false
//菜单数据
let menuList = ref<Array<IMediaMenu>>()
//初始菜单创建标志
let isShowList = ref(false)
onMounted(() => {
  initSeekBar()
})
/**
 * 初始化进度条数据
 */
const initSeekBar = () => {
  mediaManagerSeekBarRef.value?.setSeekBarMode(QTSeekBarMode.QT_SEEK_BAR_MODE_SINGLE)
  mediaManagerSeekBarRef.value?.setProgressHeight(18)
  mediaManagerSeekBarRef.value?.setProgressRadius(9)
  mediaManagerSeekBarRef.value?.setThumbWidth(60)
  mediaManagerSeekBarRef.value?.setThumbHeight(60)
  mediaManagerSeekBarRef.value?.setLeftThumbUrl('https://bilibilisx.huan.tv/upload/public/icon/ic_thumb.png')
  mediaManagerSeekBarRef.value?.setLeftThumbInactivatedDrawable({
    colors: ['#00000000', '#00000000'],
    cornerRadius: 4
  })
  // mediaManagerSeekBarRef.value?.setLeftThumbInactivatedUrl('https://bilibilisx.huan.tv/upload/public/icon/ic_thumb.png');

}
/**
 * 初始化菜单数据
 * @param menuData
 */
const initMenuList = (menuData: Array<IMediaMenu>) => {
  menuList.value = menuData
  //初始化底部菜单列表
  isShowList.value = true
}
/**
 * 设置 view 是否展示
 * @param isShow
 */
const setShowView = (isShow: boolean): void => {
  isShowManagerView.value = isShow
}
const getId = () => {
  return 'MediaManagerView'
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
const onPlayerPlayMedia = (mediaItem: ESMediaItem): void => {
  //初始化进度条数据
  if (curDuration && curDuration > 0) {
    curDuration = 0
    mediaManagerSeekBarRef.value?.setProgress(0)
  }
  progress.value = d_time_str
  duration.value = d_time_str
  if (mediaItem) {
    const albumName = mediaItem?.albumName
    mediaMainTitle.value = (albumName ? albumName + '-' : '') + mediaItem.title
    mediaSubTitle.value = mediaItem.subTitle
  }
}
/**
 * 开始播放 回调
 */
const onPlayerPlaying = (): void => {
  isPlayerPlaying.value = true
}
/**
 * 播放暂停 回调
 */
const onPlayerPaused = (): void => {
  isPlayerPlaying.value = false
}
/**
 * 调用 setSize 触发窗口尺寸改变 回调
 * @param width
 * @param height
 */
const onPlayerWindowSizeChanged = (width: number, height: number): void => {
  playerWidth.value = width
  playerHeight.value = height
  isFullWindow.value = ((width === 1920 && height === 1080) || (width === 1280 && height === 720))
}
/**
 * 调用 setFullWindow/setSmallWindow/setFloatWindow 触发窗口类型改变 回调
 * @param windowType
 */
const onPlayerWindowTypeChanged = (windowType: ESPlayerWindowType): void => {
  isFullWindow.value = (windowType == ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL)
}
/**
 * 播放进度改变 回调
 * @param p 播放进度 单位：毫秒
 */
const onPlayerProgressChanged = (p: number): void => {
  if (isSeeking) {
    return
  }
  mediaManagerSeekBarRef.value?.setProgress(p)
  progress.value = s_to_hs(Math.floor(p / 1000))
}
/**
 * 当前总播放时长 回调
 * @param d 总时长 单位：毫秒
 */
const onPlayerDurationChanged = (d: number): void => {
  if (isSeeking) {
    return
  }
  curDuration = d
  mediaManagerSeekBarRef.value?.setMaxProgress(d)
  duration.value = s_to_hs(Math.floor(d / 1000))
}

/**
 * 进度条快进快退开始 回调
 * @param progress
 */
const onSeekBarSeekStart = (progress) => {
  isSeeking = true
  viewState = IMediaViewState.STATE_SEEK_BAR_START
  resetShowViewState()
}
/**
 * 进度条快进快退结束 回调
 * @param progress
 */
const onSeekBarSeekStop = (progress) => {
  if (log.isLoggable(ESLogLevel.DEBUG)) {
    log.e(TAG, "-------onSeekBarSeekStop-------->>>>>", progress)
  }
  isSeeking = false
  viewState = IMediaViewState.STATE_SEEK_BAR_END
  resetShowViewState(IMediaViewState.STATE_MANAGER_VIEW_SHOW)
  if (playerManager && progress >= 0) {
    playerManager.seekTo(progress)
  }
}
/**
 * 进度条焦点改变 回调
 * @param event
 */
const onSeekbarFocusChanged = (event) => {
  if (log.isLoggable(ESLogLevel.DEBUG)) {
    log.e(TAG, "-------onSeekbarFocusChanged-------->>>>>", event)
  }
  let focused = event.isFocused;
  mediaManagerSeekBarRef.value?.setThumbActivate(focused);
}
/**
 * 播放速率 回调
 * @param list 速率列表
 */
const onPlayerPlayRateListChanged = (list: Array<ESPlayerRate>): void=> {
  rateList = BuildConfig.isLowEndDev ? [ESPlayerRate.ES_PLAYER_RATE_1] : list
  mediaMenuSpeedRateRef.value.setList(buildPlayRates(rateList))
}
/**
 * 当前速率 回调
 * @param r
 */
const onPlayerPlayRateChanged = (r: ESPlayerRate): void=> {
  rate = r
  initRateItemSelected()
}
/**
 * 播放清晰度 回调 需要播放数据中设置播放清晰度{{uri:"",definition:1}}
 * @param list 播放清晰度列表
 */
const onPlayerDefinitionListChanged = (list: Array<ESPlayerDefinition>): void => {
  // definitionList = list
  // mediaControlDefinitionRef.value.setList(buildDefinitions(definitionList))
}
/**
 * 当前清晰度 回调
 * @param d
 */
const onPlayerDefinitionChanged = (d: ESPlayerDefinition): void => {
  // definition = d
  // initDefinitionItemSelected()
}
/**
 * 播放模式列表 回调
 * @param modeList
 */
const onPlayerPlayMediaListModeListChanged = (modeList: Array<ESPlayerPlayMode>): void=> {
  //获取 2 中播放模式展示
  if (modeList && modeList.length>0){
    playModeList = modeList.filter(mode=>{
      return mode === ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_REPEAT
        || mode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_LOOP
        || mode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ORDER
    })
  }
  if (playModeList && playModeList.length > 0){
    mediaMenuModeRef.value.setList(buildModes(playModeList))
  }
}
/**
 * 当前播放模式 回调
 * @param mode
 */
const onPlayerPlayMediaListModeChanged = (mode: ESPlayerPlayMode): void => {
  playMode = mode
  initModeItemSelected()
}
/**
 * 初始化速率默认选中项
 */
const initRateItemSelected = ()=>{
  if (rateList){
    const index = getCurRateIndex(rate,rateList)
    mediaMenuSpeedRateRef.value.setSelectedIndex(index)
    //更新当前底部列表中速率项的值
    if (!mediaMenuSpeedRateRef.value.initMenu){
      const menuRateP = menuList.value?.findIndex(mlItem=>mlItem.nameFlag == PlayMenuNameFlag.RATE)//resultMap.get(PlayMenuNameFlag.RATE)
      if(menuRateP!=undefined && menuRateP>-1){//解决-底部按钮出现两个倍速的问题
        const mRate = (rate == 1 ? "1.0" : rate)
        if(menuList.value && menuList.value?.length){
          menuList.value?.[menuRateP as number].name = `倍速 ${mRate}x`//解决-切换选集后倍速不正确的问题
        }
        mediaMenuViewRef.value.update(menuRateP,`倍速 ${mRate}x`)
      }
    }
  }
}
/**
 * 初始化清晰度默认选中项
 */
// const initDefinitionItemSelected = ()=>{
//   if (definitionList){
//     const index = getCurDefinitionIndex(definition,definitionList)
//     mediaMenuDefinitionRef.value.setSelectedIndex(index)
//     //更新当前底部列表中清晰度项的值
//     if (!mediaMenuDefinitionRef.value.initMenu){
//       const menuDefinitionP = resultMap.get(PlayMenuNameFlag.DEFINITION)
//       const str = decodeDefinition(definition)
//       mediaMenuViewRef.value.update(menuDefinitionP,str)
//     }
//   }
// }
/**
 * 初始化播放模式默认选中项
 */
const initModeItemSelected = ()=>{
  if (playModeList){
    const index = getCurModeIndex(playMode,playModeList)
    mediaMenuModeRef.value.setSelectedIndex(index)
  }
}

/**
 * 底部菜单 item 焦点 事件
 * @param focused 是否有焦点
 * @param name 焦点 Item 名称
 */
const onItemFocused = (focused, name) => {
  bottomViewFocus = focused
  switch(name){
    case PlayMenuNameFlag.RATE:
      if (focused){
        initRightRateMenu()
      }
      break;
    // case PlayMenuNameFlag.DEFINITION:
    //   if (focused){
    //     initRightDefinition()
    //   }
    //   break;
    case PlayMenuNameFlag.SETTING:
      if (focused){
        initRightMode()
      }
      break;
  }
}
/**
 * 初始化速率列表
 */
const initRightRateMenu = ()=>{
  if (mediaMenuSpeedRateRef.value.initMenu)return
  mediaMenuSpeedRateRef.value.init()
}
/**
 * 初始化清晰度列表
 */
// const initRightDefinition=()=>{
//   if (mediaMenuDefinitionRef.value.initMenu)return
//   mediaMenuDefinitionRef.value.init()
// }
/**
 * 初始化播放模式
 */
const initRightMode=()=>{
  if (mediaMenuModeRef.value.initMenu)return
  mediaMenuModeRef.value.init()
}
/**
 * 底部菜单/右侧菜单 item 点击 事件
 * @param name 是否有焦点
 * @param e 焦点 Item 名称
 */
const onItemClicked = (name, e, isSameLocation?: number) => {
  switch(name){
    case PlayMenuNameFlag.NEXT:
      if (playerManager) {
        playerManager?.stop()
        curDuration = 0
        mediaManagerSeekBarRef.value?.setProgress(0);
        // 播放下一集先设置回当前速率
        playerManager?.setPlayRate(rate)
        playerManager.playNextMedia()
        setPlayerViewStateDismiss()
      }
      break;
    case PlayMenuNameFlag.EPISODES:
      //todo 跳转待实现
      // router.push({
      //   name: 'detail2',
      //   params: {packageId:cid}
      // })
      setPlayerViewStateDismiss()
      break;
    case PlayMenuNameFlag.RATE:
      curControlRef = mediaMenuSpeedRateRef
      curMenuClickPosition = e.position
      viewState = IMediaViewState.STATE_MENU_RATE_VIEW_SHOW
      resetShowViewState()
      break;
    // case PlayMenuNameFlag.DEFINITION:
    //   curControlRef = mediaMenuDefinitionRef
    //   curMenuClickPosition = e.position
    //   viewState = IMediaViewState.STATE_MENU_DEFINITION_VIEW_SHOW
    //   resetShowViewState()
    //   break;
    case PlayMenuNameFlag.SETTING:
      curControlRef = mediaMenuModeRef
      curMenuClickPosition = e.position
      viewState = IMediaViewState.STATE_MENU_MODE_VIEW_SHOW
      resetShowViewState()
      break;
    case PlayMenuNameFlag.RATE_ITEM:
      viewState = IMediaViewState.STATE_MENU_RATE_VIEW_DISMISS
      if (!isSameLocation){
        const _ratePosition = menuList.value?.findIndex(mlItem=>mlItem.nameFlag == PlayMenuNameFlag.RATE)
        if(_ratePosition!=undefined && _ratePosition>-1){
          mediaMenuViewRef.value.update(_ratePosition,`倍速${e.text}`)
          if(menuList.value&&menuList.value?.length){
            menuList.value?.[_ratePosition as number].name = `倍速${e.text}`//解决-切换选集后倍速不正确的问题
          }
        }
        playerManager?.setPlayRate(e.rate)
        toast.showToast("切换成功")//+e.rate
      }
      if (!isPlayerPlaying.value) {
        playerManager.start(0)
        isPlayerPlaying.value = true
      }
      resetShowViewState(IMediaViewState.STATE_MANAGER_VIEW_DISMISS)
      break;
    // case PlayMenuNameFlag.DEFINITION_ITEM:
    //   viewState = IMediaViewState.STATE_MENU_DEFINITION_VIEW_DISMISS
    //   if (!isSameLocation){
    //     mediaMenuViewRef.value.update(curMenuClickPosition,e.text)
    //     playerManager?.setDefinition(e.definition)
    //     toast.showToast("切换成功")
    //   }
    //   if (!isPlayerPlaying.value) {
    //     playerManager.start(0)
    //     isPlayerPlaying.value = true
    //   }
    //   resetShowViewState(IMediaViewState.STATE_MANAGER_VIEW_DISMISS)
    //   break;
    case PlayMenuNameFlag.SETTING_ITEM:
      viewState = IMediaViewState.STATE_MENU_MODE_VIEW_DISMISS
      if (!isSameLocation){
        playerManager?.setPlayMediaListMode(e.mode)
        toast.showToast("切换成功")
      }
      if (!isPlayerPlaying.value) {
        playerManager.start(0)
        isPlayerPlaying.value = true
      }
      resetShowViewState(IMediaViewState.STATE_MANAGER_VIEW_DISMISS)
      break;
    default:
      // eventBus.emit(bottomMenuClickEventBusName,e)
      setPlayerViewStateDismiss()
      break;
  }
}

/**
 * 重置当前 View 展示状态
 * @param ref
 * @param position
 */
const resetShowViewState = (waitStatus?:IMediaViewState)=>{
  switch (viewState){
    case IMediaViewState.STATE_MANAGER_VIEW_SHOW:
      isShowManagerView.value = true
      isShowBottomView.value = true
      if (curControlRef && curControlRef.value.getViewShowState()){
        curControlRef.value.dismissView()
      }
      break;
    case IMediaViewState.STATE_MANAGER_VIEW_DISMISS:
      isShowManagerView.value = false
      isShowBottomView.value = true
      isShowSeekBarTip.value = false
      if (curControlRef && curControlRef.value.getViewShowState()){
        curControlRef.value.dismissView()
      }
      break;
    case IMediaViewState.STATE_MENU_RATE_VIEW_SHOW:
    case IMediaViewState.STATE_MENU_DEFINITION_VIEW_SHOW:
    case IMediaViewState.STATE_MENU_MODE_VIEW_SHOW:
      curControlRef.value.showView()
      isShowBottomView.value = false
      break;
    case IMediaViewState.STATE_MENU_RATE_VIEW_DISMISS:
    case IMediaViewState.STATE_MENU_DEFINITION_VIEW_DISMISS:
    case IMediaViewState.STATE_MENU_MODE_VIEW_DISMISS:
      if (curControlRef.value.getViewShowState()){
        curControlRef.value.dismissView()
      }
      if (waitStatus === IMediaViewState.STATE_MANAGER_VIEW_DISMISS){
        setPlayerViewStateDismiss()
      }
      break;
    case IMediaViewState.STATE_SEEK_BAR_START:
      isShowSeekBarTip.value = true
      break;
    case IMediaViewState.STATE_SEEK_BAR_END:
      viewState = waitStatus
      break;
  }
}
/**
 * 当前 manager view 是否隐藏
 */
function isPlayerViewStateDismiss(){
  return IMediaViewState.STATE_MANAGER_VIEW_DISMISS === viewState
}
/**
 * 右侧菜单是否展示
 */
function isMenuViewStateShow(){
  return IMediaViewState.STATE_MENU_RATE_VIEW_SHOW === viewState
    || IMediaViewState.STATE_MENU_DEFINITION_VIEW_SHOW === viewState
    || IMediaViewState.STATE_MENU_MODE_VIEW_SHOW === viewState
}
/**
 * 当前 manager view 是否显示
 */
function isPlayerViewStateShow(){
  return IMediaViewState.STATE_MANAGER_VIEW_SHOW === viewState || IMediaViewState.STATE_SEEK_BAR_START === viewState
}
/**
 * 设置当前 manager view 显示
 */
function setPlayerViewStateShow(){
  viewState = IMediaViewState.STATE_MANAGER_VIEW_SHOW
  resetShowViewState()
  //这里通过autofocus来请求焦点，去掉此处调用
  // requestFocus()
}
/**
 * 设置当前 manager view 隐藏
 */
function setPlayerViewStateDismiss() {
  viewState = IMediaViewState.STATE_MANAGER_VIEW_DISMISS
  resetShowViewState()
}
/**
 * 设置当前 view 隐藏
 * @param delay 延时
 */
function setPlayerViewStateDismissDelay(delay:number=4000){
  clearDismissTimer()
  dismissTimer = setTimeout(()=>{
    setPlayerViewStateDismiss()
  },delay)
}
/**
 * 清除定时器
 */
function clearDismissTimer() {
  if (dismissTimer) {
    clearTimeout(dismissTimer);
  }
}
function onKeyDown(keyEvent: ESKeyEvent):boolean{
  if (playerManager && playerManager.getWindowType() != ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL) {
    return false
  }
  if (isPlayerPlaying.value){
    setPlayerViewStateDismissDelay(4000)
  }
  switch (keyEvent.keyCode) {
    case ESKeyCode.ES_KEYCODE_DPAD_CENTER:
    case ESKeyCode.ES_KEYCODE_ENTER:
      if (isPlayerViewStateDismiss()){
        setPlayerViewStateShow()
      }
      if (isMenuViewStateShow()){
        return true
      }
      if (isPlayerViewStateShow()){
        if (bottomViewFocus){
          return true
        }
        if (isPlayerPlaying.value) {
          playerManager.pause()
          isPlayerPlaying.value = false
          clearDismissTimer()
        } else {
          playerManager.start(0)
          isPlayerPlaying.value = true
        }
        return true
      }
      break;
    case ESKeyCode.ES_KEYCODE_DPAD_LEFT:
    case ESKeyCode.ES_KEYCODE_DPAD_RIGHT:
      autofocusType.value = 0;
      if (isPlayerViewStateDismiss()) {
        setPlayerViewStateShow()
        return true
      }
      if (isPlayerViewStateShow()){
        if (mediaManagerSeekBarRef.value?.isFocused()  && curDuration > 0){
          mediaManagerSeekBarRef.value?.startSeek(keyEvent.keyCode === ESKeyCode.ES_KEYCODE_DPAD_RIGHT)
        }
        return true
      }
      break;
    case ESKeyCode.ES_KEYCODE_DPAD_DOWN:
      autofocusType.value = 1;
      if (isPlayerViewStateDismiss()){
        setPlayerViewStateShow()
      }
      break;
  }
  return true
}

function onKeyUp(keyEvent: ESKeyEvent):boolean{
  if (playerManager.getWindowType() != ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL) {
    return false
  }
  if (isPlayerPlaying.value || isMenuViewStateShow() || viewState === IMediaViewState.STATE_SEEK_BAR_START){
    const delay = viewState === IMediaViewState.STATE_SEEK_BAR_START ? 3000 : 4000
    setPlayerViewStateDismissDelay(delay)
  }
  switch(keyEvent.keyCode){
    case ESKeyCode.ES_KEYCODE_DPAD_LEFT:
    case ESKeyCode.ES_KEYCODE_DPAD_RIGHT:
      if (isPlayerViewStateShow() && mediaManagerSeekBarRef.value?.isFocused() && curDuration > 0){
        mediaManagerSeekBarRef.value?.stopSeek()
      }
      isSeeking = false
      return true
  }
  return true
}

function onBackPressed():boolean{
  if (playerManager.getWindowType() != ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL) {
    return false
  }
  if (isMenuViewStateShow()){
    setPlayerViewStateDismiss()
    return true
  }
  if (!isPlayerPlaying.value) {
    isPlayerPlaying.value = true
    playerManager.start(0)
    setPlayerViewStateDismissDelay(4000)//暂停播放，再恢复播放时，4秒后隐藏控制条
    return true
  }
  if (isPlayerViewStateShow()){
    setPlayerViewStateDismiss()
    return true
  }
  return false
}

function isViewShow():boolean{
  return isFullWindow.value && isShowManagerView.value
}
const replyRate = (r?:any)=>{
  playerManager?.setPlayRate(r || rate)//恢复播放倍速为上次设置的值
}
const clear = ()=>{
  playerManager?.setPlayRate(ESPlayerRate.ES_PLAYER_RATE_1)//页面退出时，恢复播放倍速为1.0
}
defineExpose({
  getId,
  initMenuList,
  setShowView,
  setPlayerManager,
  getPlayerManager,
  onPlayerPlayMedia,
  onPlayerPlaying,
  onPlayerPaused,
  onPlayerWindowSizeChanged,
  onPlayerWindowTypeChanged,
  onPlayerProgressChanged,
  onPlayerDurationChanged,
  onSeekBarSeekStart,
  onSeekBarSeekStop,
  onSeekbarFocusChanged,
  onPlayerPlayRateListChanged,
  onPlayerPlayRateChanged,
  onPlayerDefinitionListChanged,
  onPlayerDefinitionChanged,
  onPlayerPlayMediaListModeListChanged,
  onPlayerPlayMediaListModeChanged,
  onItemFocused,
  onItemClicked,
  onKeyDown,
  onKeyUp,
  onBackPressed
})

</script>

<style lang='scss' src='./scss/media-manager.scss'>

</style>
