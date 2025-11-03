<template>
  <div class='detail-root-css' ref='detailRef'>
    <qt-waterfall
      ref="waterfallRef"
      class="detail-waterfall-css"
      :scrollYLesserReferenceValue="30"
      :scrollYGreaterReferenceValue="30"
      :blockFocusDirections="['left', 'right']"
      :enablePlaceholder="false"
      :enableKeepFocus='false'
      :descendantFocusability="descendantFocusability"
      :qtTabSectionEnable="qtTabSectionEnable"
      @onScroll="onScroll"
      @onScrollStateChanged="onScrollStateChanged"
      @onItemClick="onItemClick"
      @onScrollYGreaterReference="onScrollYGreaterReference"
      @onScrollYLesserReference="onScrollYLesserReference">
      <template v-slot:section>
        <header-section
          ref="headerSectionRef"
          :type="1"
          :blockFocusDirections="['left','right','up']"
          :focusable='false'
          @onTopButtonFocus="onTopButtonFocus">
        </header-section>
      </template>
      <template v-slot:vue-section>
        <basic-section
          ref="basicSectionRef"
          @onIntroductionFocus="onIntroductionFocus"
          @onMediaSeriesItemLoad="onMediaSeriesItemLoad"
          @onMediaSeriesItemFocus="onMediaSeriesItemFocus"
          @onMediaSeriesItemClick="onMediaSeriesItemClick"
          @onMediaSeriesGroupItemFocus="onMediaSeriesGroupItemFocus"
          @onPlayerPlaceholderFocus="onPlayerPlaceholderFocus"
          @onPlayerPlaceholderClick="onPlayerPlaceholderClick">
        </basic-section>
      </template>
      <template v-slot:item>
        <recommend-item :type="10011"></recommend-item>
      </template>
    </qt-waterfall>
    <!-- 播放器 -->
    <media-player
      ref="mediaPlayerRef"
      name="media-player"
      class="detail-media-player"
      @onPlayerPlayMedia="onPlayerPlayMedia"
      @onPlayerPlaying="onPlayerPlaying"
      @onPlayerWindowTypeChanged="onPlayerWindowTypeChanged">
    </media-player>
  </div>
</template>

<script setup lang='ts' name='detail'>
import { ref,nextTick } from 'vue'
import {
  ESKeyCode,
  ESKeyEvent,
  ESLogLevel,
  toast,
  useESEventBus,
  useESLog,
  useESRuntime,
} from '@extscreen/es3-core'
import { useESRouter } from '@extscreen/es3-router'
import { ESPlayerWindowType } from '@extscreen/es3-player'
import { QTIWaterfall, QTWaterfallItem } from '@quicktvui/quicktvui3'
import { QTMediaSeries } from '@quicktvui/quicktvui3/dist/src/series/QTMediaSeries'
import BuildConfig from '../../config/build-config'
import detailManager from './api/index'
import { IMedia, IRecommendItem, IMediaPlayer, IMediaItem } from './adapter/interface'
import {buildRecommendList,buildSectionList,buildWaterfall} from './adapter/index'
import HeaderSection from './components/section/header-section.vue'
import BasicSection from './components/section/basic-section.vue'
import RecommendItem from './components/recommend-item.vue'
import MediaPlayer from './components/media-player/index.vue'
  const TAG = 'DetailPage'
  const log = useESLog()
  const runtime = useESRuntime()
  const router = useESRouter()
  const eventbus = useESEventBus()
  let deviceId = runtime.getRuntimeDeviceId()??''
  const detailRef = ref()
  const headerSectionRef = ref()
  const basicSectionRef = ref()
  let currenId = ref('')
  const waterfallRef = ref<QTIWaterfall>()
  let descendantFocusability = ref<number>(1)
  let media: IMedia
  let isStopped = false
  const qtTabSectionEnable = {
    tabEnable:false,
    flexSectionEnable:true,
    flexSection:{
      qtPosterEnable:false,
      qtPluginItemEnable:false,
      cardItemEnable:false,
    },
    listSectionEnable:false,
    listSectionItem:{
      qtPosterEnable:false
    },
    loadingSectionEnable:true,
    endSectionEnable:true,
    blankSectionEnable:false,
    cardSectionEnable:false,
    pluginSectionEnable:false,
    vueSectionEnable:true,
    itemStoreEnable:false,
  }
  let currentPlayIndex = -1 // 当前播放视频的index
  const mediaPlayerRef = ref<IMediaPlayer>()
  let lastWindowType: ESPlayerWindowType
  let enterByFullButton = 0; // 0 ,placeholder,1 : fullBtn,2 : mediaItem
  let detailFocusTimer: any = null
  let waterfallScrollY = 0
  let changePlayerVisibleTimer: any = -1
  let mediaSeriesData: Array<any> = []
  //  生命周期
  //  ***************************初始化入口 onESCreate***************************
  const onESCreate = (params) => {
    // currenId.value = params && params.mediaId ? params.mediaId : '1584863712586579969'
    currenId.value = '1584863712586579969'
    isStopped = false;
    initWaterfall()
    getDetail()
  }
  const onESResume = () => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, "-------onESResume---------->>>>>")
    }
    initEventBus()
    if (isStopped) {
      let curIndex = currentPlayIndex > -1 ? currentPlayIndex : 0
      if (mediaSeriesData[curIndex].vipType == 0) {
        mediaPlayerRef.value?.resume()
      }
    }
    isStopped = false;
  }
  const onESRestart = () => {}
  const onESPause = () => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, "-------onESPause---------->>>>>")
    }
  }
  const onESStop = () => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, "-------onESStop---------->>>>>")
    }
    mediaPlayerRef.value?.stop()
    setTimeout(()=>{
      mediaPlayerRef.value?.stop()
    },300)
    releaseEventBus()
    isStopped = true;
  }
  const onESDestroy = () => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, "-------onESDestroy---------->>>>>")
    }
    mediaPlayerRef.value?.stop()
    mediaPlayerRef.value?.reset()
    mediaPlayerRef.value?.release()
    basicSectionRef.value?.release()
  }
  //初始化waterfall
  const initWaterfall = () =>  {
    waterfallRef.value!.init(buildWaterfall())
    basicSectionRef.value?.setAutofocus(true)
  }
  //获取详情页数据
  const getDetail = () => {
    detailManager.getMediaDetail(currenId.value).then((res:IMedia) => {
      media = res
      media.mediaSeriesType = 1 //设置选集类型
      basicSectionRef.value?.init(media) //初始化基本介绍板块数据
      nextTick(async () => {
        waterfallRef.value?.scrollToTop()
        //加载waterfall 板块数据
        let sections = buildSectionList(res)
        waterfallRef.value?.setSectionList(sections)
        //获取播放历史
        detailManager.getRecordData(media.id, deviceId, 'history').then((result) => {
          if(result){
            media.history = result
            currentPlayIndex = Math.min(Math.max((Number(result.episode)||0)-1, 0), Math.max(media.episodes-1, 0))
            media._prevPlayIndex = currentPlayIndex
            basicSectionRef.value?.scrollMediaSeriesTo(currentPlayIndex)
            basicSectionRef.value?.setMediaSeriesSelected(currentPlayIndex)
          }else{
            currentPlayIndex = 0
            media._prevPlayIndex = currentPlayIndex
          }
        }).catch(() => {
          currentPlayIndex = 0
          media._prevPlayIndex = currentPlayIndex
        })
        mediaPlayerRef.value?.play(media)
        //延迟加载相关推荐列表数据更新相关推荐板块 不影响主页面展示速度
        getRecommendList(media.id)
      })
    }).catch((err) => {console.log(err,'999999999')})
  }
  //获取相关推荐列表数据
  const getRecommendList = (id: string) => {
    detailManager.getRecommendList(id)
      .then((recommendList: Array<IRecommendItem>) => {
        if (log.isLoggable(ESLogLevel.DEBUG)) {
          log.d(TAG, "-------getRecommendList----success------>>>>>", recommendList)
        }
        const section = waterfallRef.value?.getSection(2)
        if (section) {
          section.itemList = buildRecommendList(recommendList)
          waterfallRef.value?.updateSection(2, section)
        }
      }, error => {
        if (log.isLoggable(ESLogLevel.DEBUG)) {
          log.d(TAG, id + "-------getRecommendList----error------>>>>>", error)
        }
      })
  }
  const initEventBus = () => {
    eventbus.on('onMenuFullButtonClick', onMenuFullButtonClick)
    eventbus.on('onMenuFavouriteButtonClick', onMenuFavouriteButtonClick)
    eventbus.on('onMenuVIPButtonClick', onMenuVIPButtonClick)
  }
  const releaseEventBus = () => {
    eventbus.off('onMenuFullButtonClick', onMenuFullButtonClick)
    eventbus.off('onMenuFavouriteButtonClick', onMenuFavouriteButtonClick)
    eventbus.off('onMenuVIPButtonClick', onMenuVIPButtonClick)
  }
  // waterfall 回调
  const onScroll = (offsetX: number, scrollY: number) => {
    log.d(TAG, '---滚动----onScroll-------->>>>' +
      " offsetX:" + offsetX +
      " scrollY:" + scrollY
    )
    waterfallScrollY = scrollY
  }
  const onScrollStateChanged = (x: number, y: number, state: number) => {
    clearTimeout(changePlayerVisibleTimer)
    if (state == 0) {
      changePlayerVisibleTimer = setTimeout(() => {
        mediaPlayerRef.value?.changeVisible(true)
      }, 200)
    }
  }
  const onItemClick = (sectionIndex: number, position: number, item: QTWaterfallItem) => {
    if(!item) return
    log.d(TAG, '-------onItemClick-------->>>>' +
      " sectionIndex:" + sectionIndex +
      " position:" + position +
      " item:", item
    )
    switch (sectionIndex) {
      case 1:
        break
      case 2:
        router.push({
          name: 'detail',
          params: {
            id: item.item.id
          },
          replace: true,
        });
        break
    }
  }
  const onScrollYGreaterReference = () => {
    if (mediaPlayerRef.value?.getWindowType() == ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_SMALL) {
      mediaPlayerRef.value?.setFloatWindow()
    }
    basicSectionRef.value?.setAutofocus(false)
  }
  const onScrollYLesserReference = () => {
    if (mediaPlayerRef.value?.getWindowType() ==
      ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FLOAT || mediaPlayerRef.value?.getLoadLow()) {
      mediaPlayerRef.value?.setSmallWindow()
    }
  }
  // header-setion 回调
  const onTopButtonFocus = (e: any) => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, "-------onTopButtonFocus----->>>>>", e)
    }
    waterfallRef.value?.scrollToTop()
    if(mediaPlayerRef.value?.getWindowType() == ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FLOAT) {
      mediaPlayerRef.value?.setSmallWindow()
    }
    cancelDetailRequestFocusTimer()
  }
  const cancelDetailRequestFocusTimer = () => {
    if (detailFocusTimer != null) {
      clearTimeout(detailFocusTimer)
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "-------requestFullButtonFocus--cancelDetailRequestFocusTimer-->>>>>")
      }
      detailFocusTimer = null
    }
  }
  const onMenuFullButtonClick = () => {
    enterByFullButton = 1
    basicSectionRef.value?.setAutofocus(false)
    mediaPlayerRef.value?.setFullWindow()
  }
  const onMenuFavouriteButtonClick = (val: boolean) => {
    const body = {
      id: media.id,
      deviceId: deviceId,
      recordType: "favorite",
      title: media.title
    }
    if(val){ //收藏
      detailManager.reportRecordData(body).then(()=> {}).catch(()=>{})
    }else{ //取消收藏
      detailManager.deleteRecordData(body.id,body.deviceId,body.recordType)
        .then(()=> {}).catch(()=>{})
    }
  }
  const onMenuVIPButtonClick = () => {
    toast.showToast('去付费')
  }
  // basic-setion 回调
  const onIntroductionFocus = (focused: boolean) => {
    if(focused) {
      waterfallRef.value?.scrollToTop()
    }
  }
  const onMediaSeriesItemLoad = (page: number, data: Array<IMediaItem>) => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, "-------onMediaListItemLoad---->>>>>" + page, data)
    }
    //全屏菜单数据
    eventbus.emit('onMediaListItemLoad', page, data)
    mediaSeriesData = mediaSeriesData.concat(data)
    mediaPlayerRef.value?.addMediaItemList(page, data)
    if (currentPlayIndex >= 0) {
      mediaPlayerRef.value?.playMediaItemByIndex(currentPlayIndex)
      currentPlayIndex = -1
      media._prevPlayIndex = -1
    }
  }
  const onMediaSeriesItemFocus = () => {}
  const onMediaSeriesItemClick = (index: number, data: QTMediaSeries) => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, "-------onMediaListItemClicked----->>>>>" + index, data)
    }
    if (basicSectionRef.value?.getMediaSelectedPosition() == index) {
      if (data && data.vipType == 0) {
        enterByFullButton = 2
        mediaPlayerRef.value?.setFullWindow()
      } else {
        toast.showToast('去支付')
      }
      return;
    }
    if (data.id != null) {
      mediaPlayerRef.value?.stop()
      mediaPlayerRef.value?.playMediaItemById(data.id)
      if (BuildConfig.isLowEndDev) {
        mediaPlayerRef.value?.setFullWindow()
      }
    }
  }
  const onMediaSeriesGroupItemFocus = () => {}
  const onPlayerPlaceholderFocus = (focused: boolean) => {
    if (focused) {
      waterfallRef.value?.scrollToTop()
      waterfallScrollY = 0
      cancelDetailRequestFocusTimer()
    }
    eventbus.emit("onPlayerPlaceholderFocus", focused)
  }
  //小窗播放器placeholeder的点击事件
  const onPlayerPlaceholderClick = () => {
    let curIndex = currentPlayIndex > -1 ? currentPlayIndex : 0
    //判断当前分集是否免费
    if(mediaSeriesData[curIndex].vipType == 0){
      mediaPlayerRef.value?.setFullWindow()
      enterByFullButton = 0;
    }else{
      toast.showToast('去支付')
    }
  }
  // 播放器
  const onPlayerPlayMedia = () => { // 播放器媒体列表开始播放回调
    const playingIndex = mediaPlayerRef.value?.getPlayingMediaIndex() ?? -1
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, "----onMediaListItemClicked---onPlayerPlayMedia---->>>>>" + playingIndex)
    }
    if (playingIndex >= 0) {
      basicSectionRef.value?.scrollMediaSeriesTo(playingIndex)
      basicSectionRef.value?.setMediaSeriesSelected(playingIndex)
    }
  }
  const onPlayerPlaying = () => {// 播放器开始播放回调  隐藏占位图
    basicSectionRef.value?.showPlayerPlaceholderImg(false)
  }
  const onPlayerWindowTypeChanged = (windowType: ESPlayerWindowType) => { //播放器窗口改变回调
    log.d(TAG, '-------onPlayerWindowTypeChanged-------->>>>' + windowType)
    switch (windowType) {
      case ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL:
        descendantFocusability.value = 2
        break
      case ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FLOAT:
        break
      case ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_SMALL:
        descendantFocusability.value = 1
        if (lastWindowType === ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL) {
          detailFocusTimer = setTimeout(() => {
            cancelDetailRequestFocusTimer()
            switch (enterByFullButton) {
              case 0:
                basicSectionRef.value?.requestPlayerPlaceholderFocus()
                break
              case 1:
                basicSectionRef.value?.requestFullButtonFocus()
                break
              case 2:
                basicSectionRef.value?.requestCurrentMediaFocus()
                break
            }
          }, 300)
          return
        }
        if (log.isLoggable(ESLogLevel.DEBUG)) {
          log.d(TAG, '-----全屏---------ES_PLAYER_WINDOW_TYPE_SMALL------>>>>')
        }
        if (media && media.episodes < 2) {
          basicSectionRef.value?.setAutofocus(false)
          detailFocusTimer = setTimeout(() => {
            cancelDetailRequestFocusTimer()
            basicSectionRef.value?.requestPlayerPlaceholderFocus()
          }, 0)
        } else {
          basicSectionRef.value?.setAutofocus(false)
        }
        break
    }
    lastWindowType = windowType
  }
  //  按键
  const onKeyDown = (keyEvent: ESKeyEvent) => {
    if ((keyEvent.keyCode === ESKeyCode.ES_KEYCODE_DPAD_CENTER || keyEvent.keyCode === ESKeyCode.ES_KEYCODE_ENTER)
      && mediaPlayerRef.value?.getWindowType() === ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL) {
      let curIndex = currentPlayIndex > -1 ? currentPlayIndex : 0
      if (mediaSeriesData[curIndex].vipType != 0) {
        toast.showToast('去支付')
        return true
      }
    }
    if (mediaPlayerRef.value?.onKeyDown(keyEvent)) {
      return true
    }
    return
  }
  const onKeyUp = (keyEvent: ESKeyEvent) => {
    if (mediaPlayerRef.value?.onKeyUp(keyEvent)) {
      return true
    }
    return
  }
  //  返回
  const onBackPressed = () => {
    if (mediaPlayerRef.value?.onBackPressed()) {
      return true
    }
    if (waterfallScrollY > 0) {
      waterfallRef.value?.scrollToTop()
      waterfallScrollY = 0
      detailFocusTimer = setTimeout(() => {
        cancelDetailRequestFocusTimer()
        mediaPlayerRef.value?.changeVisible(true)
        basicSectionRef.value?.requestPlayerPlaceholderFocus()
      }, 300)
      return true
    }
    router.back()
    return true
  }

  defineExpose({
    onScrollYGreaterReference,
    onScrollYLesserReference,
    onESCreate,
    onESRestart,
    onESPause,
    onESStop,
    onESResume,
    onESDestroy,
    onKeyDown,
    onKeyUp,
    onBackPressed
  })
</script>

<style lang='scss' src='./scss/index.scss'>

</style>
