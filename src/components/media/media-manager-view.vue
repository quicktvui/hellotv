<template>
  <div class="media-manager-root-css" :focusable="false"
       :blockFocusDirections="['left', 'right', 'down', 'up']"
       :showDialog="isFullWindow && isShowManagerView"
       :style="{width:`${playerWidth}px`,height:`${playerHeight}px`}">
    <!-- 底部菜单 View-->
    <div class="media-manager-bg-css" :visible="isShowBottomView"
         :focusable="false"
         :gradientBackground="{colors: ['#E6000000', '#00000000'],  orientation: 4}"
         :style="{width:`${playerWidth}px`,height:`540px`}">
      <!-- 播放标题-->
      <span class="media-manager-title-css main-title-css" :focusable="false">{{mediaMainTitle}}</span>
      <!-- 播放副标题-->
      <span class="media-manager-title-css sub-title-css" :focusable="false">{{mediaSubTitle}}</span>
      <!-- 进度条-->
      <div class="media-manager-progress-root-css" :focusable="false" >
        <div class="media-manager-img-state-div-css" :focusable="false">
          <img class="media-manager-img-play-state-css"
               :focusable="false"
               :visible="!isPlayerPlaying"
               :src="playIcon"/>
          <img class="media-manager-img-play-state-css"
               :focusable="false"
               :visible="isPlayerPlaying"
               :src="pauseIcon"/>
        </div>
        <qt-seek-bar
          class="media-manager-seekbar-css"
          ref="mediaManagerSeekBarRef"
          name="seekBar"
          :color="{ startColor: '#FF6699', endColor: '#FF6699' }"
          :nextFocusName="{ down: 'mediaControlView',left: 'seekBar',right:'seekBar'}"
          :focusable="true"
          @onSeekStop="onSeekBarSeekStop"
          @focus="onSeekbarFocusChanged"
          :autofocus="true"
        />
      </div>
     <!-- 底部按钮组-->
      <div class="media-manager-setting-root-css">
        <media-control-view
          ref="mediaControlViewRef"
          name="mediaControlView"
          :menu-list="menuList"
          @onItemFocused="onItemFocused"
          @onItemClicked="onItemClicked"
        />
<!--    进度提示-->
        <div class="media-manager-text-root-css">
          <span class="media-manager-progress-text-css"
                style="color:#BFBFBF" :numberOfLines="1" :focusable="false">{{duration}}</span>
          <span class="media-manager-progress-text-css"
                style="color: white" :numberOfLines="1" :focusable="false">{{progress}}</span>
        </div>
      </div>
    </div>
    <!-- 倍速-->
    <speed-view
      ref="mediaControlSpeedRateRef"
      :item-name="RATE_ITEM"
      title="倍速"
      @onItemClicked="onItemClicked" />
    <!-- 清晰度-->
    <definition-view
      ref="mediaControlDefinitionRef"
      :item-name="DEFINITION_ITEM"
      title="清晰度"
      @onItemClicked="onItemClicked" />
    <!-- 播放模式-->
    <mode-view
      ref="mediaControlModeRef"
      :item-name="SETTING_ITEM"
      title="设置"
      @onItemClicked="onItemClicked" />
  </div>
</template>

<script lang="ts">
import { ESEventBus } from "@extscreen/es3-core/dist/src/eventbus/ESEventBus"
import {
  ESPlayerDefinition,
  ESPlayerPlayMode,
  ESPlayerRate,
  ESPlayerWindowType
} from "@extscreen/es3-player"
import { ESIPlayerManager, ESMediaItem } from "@extscreen/es3-player-manager"
import { QTISeekBar,QTSeekBarMode } from "@quicktvui/quicktvui3"
import { defineComponent } from "@vue/runtime-core"
import {
  ESKeyCode,
  ESKeyEvent,
  ESLogLevel,
  useESEventBus,
  useESLog,
  useESToast
} from "@extscreen/es3-core"
import { onMounted, ref } from "vue"
import playIcon from '../../assets/def_media/ic_def_media_player_play.png'
import pauseIcon from '../../assets/def_media/ic_def_media_player_pause.png'
import BuildConfig from "../../build/BuildConfig"
import { s_to_hs } from "../../tools/formatDate"
import {
  bottomMenuClickEventBusName,
  buildDefinitions, buildModes,
  buildPlayRates, decodeDefinition,
  getCurDefinitionIndex, getCurModeIndex,
  getCurRateIndex, initMenuList, PlayMenuNameFlag, resultMap
} from "./adapter/ControlDataAdapter"
import MediaControlView from "./media-control-view.vue"
import MediaManagerMenuView from "./media-manager-menu-view.vue"

const TAG = "MEDIA_DEF_MANAGER"

/**
 * 当前 View 中：速率，清晰度，播放模式都是在 底部菜单获取焦点后才创建
 * 阶梯加载 界面 node
 */
enum IMediaViewState{
  //整体 view 显示隐藏状态
  STATE_MANAGER_VIEW_DISMISS = 0,
  STATE_MANAGER_VIEW_SHOW = 1,
  //速率 view 显示隐藏状态
  STATE_MENU_RATE_VIEW_DISMISS = 2,
  STATE_MENU_RATE_VIEW_SHOW = 3,
  //清晰度 view 显示隐藏状态
  STATE_MENU_DEFINITION_VIEW_DISMISS = 4,
  STATE_MENU_DEFINITION_VIEW_SHOW = 5,
  //播放模式 view 显示隐藏状态
  STATE_MENU_MODE_VIEW_DISMISS = 6,
  STATE_MENU_MODE_VIEW_SHOW = 7,
}
export default defineComponent({
  name: "media-manager-view",
  components: { 'speed-view':MediaManagerMenuView,
                'definition-view':MediaManagerMenuView,
                'mode-view':MediaManagerMenuView,
                MediaControlView },
  props: {
    menuList:Array
  },
  setup(props, context) {
    const log = useESLog()
    const toast =useESToast()
    const eventBus:ESEventBus = useESEventBus()
    //进度条
    const mediaManagerSeekBarRef = ref<QTISeekBar>()
    //底部按钮
    const mediaControlViewRef = ref()
    //倍速
    const mediaControlSpeedRateRef = ref()
    //清晰度
    const mediaControlDefinitionRef = ref()
    //播放模式
    const mediaControlModeRef = ref()
    //当前 控制菜单的 ref
    let curControlRef

    //菜单子 view 别名
    const RATE_ITEM = PlayMenuNameFlag.RATE_ITEM
    const DEFINITION_ITEM = PlayMenuNameFlag.DEFINITION_ITEM
    const SETTING_ITEM = PlayMenuNameFlag.SETTING_ITEM
    /*******************播放器相关******************/
    //播放器宽高
    const playerWidth = ref<number>(0)
    const playerHeight = ref<number>(0)
    //播放器全屏状态
    const isFullWindow = ref<boolean>(false)
    //播放中/播放暂停状态
    const isPlayerPlaying = ref<boolean>(false)
    //进度条展示值---当前时长
    const progress = ref<string>('00:00')
    //进度条展示值---总时长
    const duration = ref<string>('00:00')
    //防止快进快退当前展示时长频繁修改
    let isSeeking =  false
    //播放管理类
    let player: ESIPlayerManager
    //播放标题
    let mediaMainTitle = ref("")
    //播放副标题
    let mediaSubTitle = ref("")
    /********************播放器相关 end***************************/
    //主动控制当前控制 View 是否展示 默认隐藏
    let isShowManagerView = ref(false)
    //底部菜单列表是否展示 默认显示
    let isShowBottomView = ref(true)
    // 当前 view 显示隐藏状态
    let viewState:IMediaViewState = 0
    // manager view 隐藏延时器
    let dismissTimer: NodeJS.Timeout

    // 速率原始列表
    let rateList: Array<ESPlayerRate>
    // 当前速率
    let rate: ESPlayerRate

    // 清晰度原始列表
    let definitionList: Array<ESPlayerDefinition>
    // 当前清晰度
    let definition: ESPlayerDefinition

    // 播放模式原始列表
    let playModeList: Array<ESPlayerPlayMode>
    // 当前播放模式
    let playMode: ESPlayerPlayMode
    // 底部菜单列表 点击位置
    let curMenuClickPosition = -1
    let bottomViewFocus = false

    /**
     * 设置 view 是否展示
     * @param isShow
     */
    function setShowView(isShow:boolean):void{
      isShowManagerView.value = isShow
    }
    /**
     * 进度条获取焦点
     */
    function requestFocus():void{
      setTimeout(()=>{
        mediaManagerSeekBarRef.value?.requestFocus()
      },500)
    }
    onMounted(()=>{
      //初始化底部菜单列表
      initMenuList(props.menuList)
      //初始化进度条
      mediaManagerSeekBarRef.value?.setSeekBarMode(QTSeekBarMode.QT_SEEK_BAR_MODE_SINGLE)
      mediaManagerSeekBarRef.value?.setProgressHeight(18)
      mediaManagerSeekBarRef.value?.setProgressRadius(9);
      mediaManagerSeekBarRef.value?.setThumbWidth(60);
      mediaManagerSeekBarRef.value?.setThumbHeight(60);
      // mediaManagerSeekBarRef.value?.setLeftThumbUrl('http://extcdn.hsrc.tv/channelzero_image/web_static/extend_screen/public_images/ic_play_series_tip.png');
      // mediaManagerSeekBarRef.value?.setLeftThumbInactivatedUrl('http://extcdn.hsrc.tv/channelzero_image/web_static/extend_screen/public_images/ic_play_series_tip.png');
    })
    function getId():string {
      return 'MediaManagerView'
    }
    /**
     *  设置播放管理类 回调
     * @param value
     */
    function setPlayerManager(value: ESIPlayerManager): void {
      player = value
    }
    function getPlayerManager(): ESIPlayerManager {
      return player
    }
    /**
     * 当前播放数据 回调
     * @param mediaItem
     */
    function onPlayerPlayMedia(mediaItem: ESMediaItem):void{
      if (mediaItem){
        mediaMainTitle.value = mediaItem.title
        mediaSubTitle.value = mediaItem.subTitle
      }
    }
    /**
     * 开始播放 回调
     */
    function onPlayerPlaying(): void {
      isPlayerPlaying.value = true
    }
    /**
     * 播放暂停 回调
     */
    function onPlayerPaused(): void {
      isPlayerPlaying.value = false
    }
    /**
     * 调用 setSize 触发窗口尺寸改变 回调
     * @param width
     * @param height
     */
    function onPlayerWindowSizeChanged(width: number, height: number): void {
      playerWidth.value = width
      playerHeight.value = height
    }
    /**
     * 调用 setFullWindow/setSmallWindow/setFloatWindow 触发窗口类型改变 回调
     * @param windowType
     */
    function onPlayerWindowTypeChanged(windowType: ESPlayerWindowType): void {
      isFullWindow.value = (windowType == ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL)
    }
    /**
     * 播放进度改变 回调
     * @param p 播放进度 单位：毫秒
     */
    function onPlayerProgressChanged(p: number): void {
      if (isSeeking) {
        return
      }
      mediaManagerSeekBarRef.value?.setProgress(p);
      progress.value = s_to_hs(Math.floor(p / 1000))
    }
    /**
     * 当前总播放时长 回调
     * @param d 总时长 单位：毫秒
     */
    function onPlayerDurationChanged(d: number): void {
      if (isSeeking) {
        return
      }
      mediaManagerSeekBarRef.value?.setMaxProgress(d);
      duration.value = "/"+s_to_hs(Math.floor(d / 1000))
    }
    /**
     * 进度条快进快退结束 回调
     * @param progress
     */
    function onSeekBarSeekStop(progress) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onSeekBarSeekStop-------->>>>>", progress)
      }
      isSeeking = false
      if (player && progress >= 0) {
        player.seekTo(progress)
      }
    }
    /**
     * 进度条焦点改变 回调
     * @param event
     */
    function onSeekbarFocusChanged(event) {
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
    function onPlayerPlayRateListChanged(list: Array<ESPlayerRate>): void {
      rateList = BuildConfig.isLowEndDev ? [ESPlayerRate.ES_PLAYER_RATE_1] : list
      mediaControlSpeedRateRef.value.setList(buildPlayRates(rateList))
    }
    /**
     * 当前速率 回调
     * @param r
     */
    function onPlayerPlayRateChanged(r: ESPlayerRate): void {
      rate = r
      initRateItemSelected()
    }
    /**
     * 播放清晰度 回调 需要播放数据中设置播放清晰度{{uri:"",definition:1}}
     * @param list 播放清晰度列表
     */
    function onPlayerDefinitionListChanged(list: Array<ESPlayerDefinition>): void {
      definitionList = list
      mediaControlDefinitionRef.value.setList(buildDefinitions(definitionList))
    }
    /**
     * 当前清晰度 回调
     * @param d
     */
    function onPlayerDefinitionChanged(d: ESPlayerDefinition): void {
      definition = d
      initDefinitionItemSelected()
    }
    /**
     * 播放模式列表 回调
     * @param modeList
     */
    function onPlayerPlayMediaListModeListChanged(modeList: Array<ESPlayerPlayMode>): void {
      //获取 2 中播放模式展示
      if (modeList && modeList.length>0){
        playModeList = modeList.filter(mode=>{
          return mode === ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_REPEAT
            || mode == ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_LOOP
        })
      }
      if (playModeList && playModeList.length > 0){
        mediaControlModeRef.value.setList(buildModes(playModeList))
      }
    }
    /**
     * 当前播放模式 回调
     * @param mode
     */
    function onPlayerPlayMediaListModeChanged(mode: ESPlayerPlayMode): void {
      playMode = mode
      initModeItemSelected()
    }
    /**
     * 初始化速率默认选中项
     */
    function initRateItemSelected(){
      if (rateList){
        const index = getCurRateIndex(rate,rateList)
        mediaControlSpeedRateRef.value.setSelectedIndex(index)
        //更新当前底部列表中速率项的值
        if (!mediaControlSpeedRateRef.value.initMenu){
          const menuRateP = resultMap.get(PlayMenuNameFlag.RATE)
          mediaControlViewRef.value.update(menuRateP,`倍速 ${rate}X`)
        }
      }
    }
    /**
     * 初始化清晰度默认选中项
     */
    function initDefinitionItemSelected(){
      if (definitionList){
        const index = getCurDefinitionIndex(definition,definitionList)
        mediaControlDefinitionRef.value.setSelectedIndex(index)
        //更新当前底部列表中清晰度项的值
        if (!mediaControlDefinitionRef.value.initMenu){
          const menuDefinitionP = resultMap.get(PlayMenuNameFlag.DEFINITION)
          const str = decodeDefinition(definition)
          mediaControlViewRef.value.update(menuDefinitionP,str)
        }
      }
    }
    /**
     * 初始化播放模式默认选中项
     */
    function initModeItemSelected(){
      if (playModeList){
        const index = getCurModeIndex(playMode,playModeList)
        mediaControlModeRef.value.setSelectedIndex(index)
      }
    }
    /**
     * 底部菜单 item 焦点 事件
     * @param focused 是否有焦点
     * @param name 焦点 Item 名称
     */
    function onItemFocused(focused,name){
      bottomViewFocus = focused
      switch(name){
        case PlayMenuNameFlag.RATE:
          if (focused){
            initRightRateMenu()
          }
          break;
        case PlayMenuNameFlag.DEFINITION:
          if (focused){
            initRightDefinition()
          }
          break;
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
    function initRightRateMenu(){
      if (mediaControlSpeedRateRef.value.initMenu)return
      mediaControlSpeedRateRef.value.init()
    }
    /**
     * 初始化清晰度列表
     */
    function initRightDefinition(){
      if (mediaControlDefinitionRef.value.initMenu)return
      mediaControlDefinitionRef.value.init()
    }
    /**
     * 初始化播放模式
     */
    function initRightMode(){
      if (mediaControlModeRef.value.initMenu)return
      mediaControlModeRef.value.init()
    }
    /**
     * 底部菜单/右侧菜单 item 点击 事件
     * @param name 是否有焦点
     * @param e 焦点 Item 名称
     */
    function onItemClicked(name,e,isSameLocation?:number){
      switch(name){
        case PlayMenuNameFlag.NEXT:
        case PlayMenuNameFlag.EPISODES:
          eventBus.emit(bottomMenuClickEventBusName,e)
          break;
        case PlayMenuNameFlag.RATE:
          curControlRef = mediaControlSpeedRateRef
          curMenuClickPosition = e.position
          viewState = IMediaViewState.STATE_MENU_RATE_VIEW_SHOW
          resetShowViewState()
          break;
        case PlayMenuNameFlag.DEFINITION:
          curControlRef = mediaControlDefinitionRef
          curMenuClickPosition = e.position
          viewState = IMediaViewState.STATE_MENU_DEFINITION_VIEW_SHOW
          resetShowViewState()
          break;
        case PlayMenuNameFlag.SETTING:
          curControlRef = mediaControlModeRef
          curMenuClickPosition = e.position
          viewState = IMediaViewState.STATE_MENU_MODE_VIEW_SHOW
          resetShowViewState()
          break;
        case PlayMenuNameFlag.RATE_ITEM:
          viewState = IMediaViewState.STATE_MENU_RATE_VIEW_DISMISS
          if (!isSameLocation){
            mediaControlViewRef.value.update(curMenuClickPosition,`倍速${e.text}`)
            player?.setPlayRate(e.rate)
            toast.showToast("切换成功")
          }
          if (!isPlayerPlaying.value) {
            player.start(0)
            isPlayerPlaying.value = true
          }
          resetShowViewState(IMediaViewState.STATE_MANAGER_VIEW_DISMISS)
          break;
        case PlayMenuNameFlag.DEFINITION_ITEM:
          viewState = IMediaViewState.STATE_MENU_DEFINITION_VIEW_DISMISS
          if (!isSameLocation){
            mediaControlViewRef.value.update(curMenuClickPosition,e.text)
            player?.setDefinition(e.definition)
            toast.showToast("切换成功")
          }
          if (!isPlayerPlaying.value) {
            player.start(0)
            isPlayerPlaying.value = true
          }
          resetShowViewState(IMediaViewState.STATE_MANAGER_VIEW_DISMISS)
          break;
        case PlayMenuNameFlag.SETTING_ITEM:
          viewState = IMediaViewState.STATE_MENU_MODE_VIEW_DISMISS
          if (!isSameLocation){
            player?.setPlayMediaListMode(e.mode)
            toast.showToast("切换成功")
          }
          if (!isPlayerPlaying.value) {
            player.start(0)
            isPlayerPlaying.value = true
          }
          resetShowViewState(IMediaViewState.STATE_MANAGER_VIEW_DISMISS)
          break;
      }
    }
    /**
     * 重置当前 View 展示状态
     * @param ref
     * @param position
     */
    function resetShowViewState(waitStatus?:IMediaViewState){
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
      return IMediaViewState.STATE_MANAGER_VIEW_SHOW === viewState
    }
    /**
     * 设置当前 manager view 显示
     */
    function setPlayerViewStateShow(){
      viewState = IMediaViewState.STATE_MANAGER_VIEW_SHOW
      resetShowViewState()
      requestFocus()
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
    function setPlayerViewStateDismissDelay(delay:number=5000){
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
      if (player && player.getWindowType() != ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL) {
        return false
      }
      if (isPlayerPlaying.value){
        setPlayerViewStateDismissDelay(5000)
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
              player.pause()
              isPlayerPlaying.value = false
              clearDismissTimer()
            } else {
              player.start(0)
              isPlayerPlaying.value = true
            }
            return true
          }
          break;
        case ESKeyCode.ES_KEYCODE_DPAD_LEFT:
        case ESKeyCode.ES_KEYCODE_DPAD_RIGHT:
          if (isPlayerViewStateDismiss()) {
            setPlayerViewStateShow()
            return true
          }
          if (isPlayerViewStateShow()){
            if (mediaManagerSeekBarRef.value?.isFocused()){
              isSeeking = true
              mediaManagerSeekBarRef.value?.startSeek(keyEvent.keyCode === ESKeyCode.ES_KEYCODE_DPAD_RIGHT)
            }
            return true
          }
          break;
      }
      return true
    }

    function onKeyUp(keyEvent: ESKeyEvent):boolean{
      if (player.getWindowType() != ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL) {
        return false
      }
      if (isPlayerPlaying.value || isMenuViewStateShow()){
        setPlayerViewStateDismissDelay(5000)
      }
      switch(keyEvent.keyCode){
        case ESKeyCode.ES_KEYCODE_DPAD_LEFT:
        case ESKeyCode.ES_KEYCODE_DPAD_RIGHT:
          if (isPlayerViewStateShow() && mediaManagerSeekBarRef.value?.isFocused()){
            mediaManagerSeekBarRef.value?.stopSeek()
          }
          isSeeking = false
          return true
      }
      return true
    }

    function onBackPressed():boolean{
      if (player.getWindowType() != ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL) {
        return false
      }
      if (isMenuViewStateShow()){
        setPlayerViewStateDismiss()
        return true
      }
      if (!isPlayerPlaying.value) {
        isPlayerPlaying.value = true
        player.start(0)
        return true
      }
      if (isPlayerViewStateShow()){
        setPlayerViewStateDismiss()
        return true
      }
      return false
    }

    return {
      mediaManagerSeekBarRef,
      mediaControlSpeedRateRef,
      mediaControlDefinitionRef,
      mediaControlModeRef,
      mediaControlViewRef,
      RATE_ITEM,
      DEFINITION_ITEM,
      SETTING_ITEM,
      playerWidth,
      playerHeight,
      isFullWindow,
      mediaMainTitle,
      mediaSubTitle,
      isPlayerPlaying,
      progress,
      duration,
      playIcon,
      pauseIcon,
      isShowManagerView,
      isShowBottomView,

      onItemFocused,
      onItemClicked,
      getId,
      setPlayerManager,
      getPlayerManager,
      setShowView,
      onPlayerWindowSizeChanged,
      onPlayerWindowTypeChanged,
      onPlayerProgressChanged,
      onPlayerDurationChanged,
      onSeekBarSeekStop,
      onSeekbarFocusChanged,
      onPlayerPlayRateListChanged,
      onPlayerPlayRateChanged,
      onPlayerDefinitionListChanged,
      onPlayerDefinitionChanged,
      onPlayerPlayMediaListModeListChanged,
      onPlayerPlayMediaListModeChanged,
      onKeyDown,
      onKeyUp,
      onBackPressed,
      onPlayerPlayMedia,
      onPlayerPlaying,
      onPlayerPaused,
    }
  }
})
</script>

<style>
.media-manager-root-css {
  background-color: transparent;
}

.media-manager-bg-css {
  position: absolute;
  bottom: 0;
  left: 0;
  justify-content: flex-end;
  background-color: transparent;
}

.media-manager-bg-css .media-manager-title-css {
  width: 900px;
  margin-left: 90px;
  background-color: transparent;
}
.media-manager-bg-css .main-title-css {
  max-height: 88px;
  font-weight: bold;
  line-height: 44px;
  font-size: 36px;
  max-lines: 2;
  color:white;
  margin-bottom: 24px;
}
.media-manager-bg-css .sub-title-css{
  max-height: 30px;
  line-height: 30px;
  font-size: 26px;
  max-lines: 1;
  color:white;
  margin-bottom: 117px;
}

.media-manager-bg-css .media-manager-progress-root-css {
  width: 1920px;
  height: 60px;
  margin-bottom: 39px;
  flex-direction: row;
  background-color: transparent;
}

.media-manager-bg-css .media-manager-img-state-div-css{
  width: 36px;
  height:36px;
  margin-left: 90px;
  margin-top: 12px;
  background-color: transparent;
}

.media-manager-bg-css .media-manager-img-play-state-css {
  width: 36px;
  height:36px;
  position: absolute;
  background-color: transparent;
}

.media-manager-bg-css .media-manager-setting-root-css {
  margin-bottom: 54px;
  width: 1920px;
  height: 72px;
  background-color: transparent;
}


.media-manager-bg-css .media-manager-seekbar-css {
  width: 1700px;
  height: 60px;
  margin-left: 10px;
  background-color: transparent;
}

.media-manager-bg-css .media-manager-progress-text-css {
  font-size: 30px;
  height: 72px;
  text-align: center;
}

.media-manager-bg-css  .media-manager-text-root-css {
  position: absolute;
  height: 72px;
  right: 100px;
  top: 0;
  flex-direction: row-reverse;
  background-color: transparent;
}
</style>
