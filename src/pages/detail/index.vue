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
      :triggerTask="triggerTask"
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
          :focusable='false'>
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
import { ref,nextTick, reactive } from 'vue'
import {
  ESKeyCode,
  ESKeyEvent,
  ESLogLevel,
  useESEventBus,
  useESLog,
  useESToast,
  useESAppList,
  toast
} from '@extscreen/es3-core'
import { useESRouter } from '@extscreen/es3-router'
import { ESPlayerWindowType } from '@extscreen/es3-player'
import { QTIViewVisibility, QTIWaterfall, QTWaterfallItem } from '@quicktvui/quicktvui3'
import BuildConfig from '../../config/build-config'
import detailManager from '../../api/detail/detail-manager'
import { IMedia, IRecommendItem, IMediaPlayer, IMediaItem } from './adapter/interface'
import {buildRecommendList,buildSectionList,buildWaterfall} from './adapter/index'
import HeaderSection from './components/section/header-section.vue'
import BasicSection from './components/section/basic-section.vue'
import RecommendItem from './components/recommend-item.vue'
import MediaPlayer from './components/media-player/index.vue'
  const TAG = 'DetailPage'
  const log = useESLog()
  const router = useESRouter()
  const eventbus = useESEventBus()
  const detailRef = ref()
  const headerSectionRef = ref()
  const basicSectionRef = ref()
  let currenId = ref('')
  const waterfallRef = ref<QTIWaterfall>()
  let descendantFocusability = ref<number>(1)
  let media: IMedia
  let isPaused = false
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
  let triggerTask = BuildConfig.isLowEndDev ? [
    {
      event: 'onScrollYGreater',
      target: 'playerLowMaskImg',
      function: 'changeVisibility',
      params: ['invisible'],
    },
    {
      event: 'onScrollYLesser',
      target: 'playerLowMaskImg',
      function: 'changeVisibility',
      params: ['visible'],
    },
    {
      event: 'onScrollYGreater',
      target: 'media-player',
      function: 'changeVisibility',
      params: ['invisible'],
    },
    {
      event: 'onScrollYLesser',
      target: 'media-player',
      function: 'changeVisibility',
      params: ['visible'],
    }] : [
    {
      event: 'onScrollYGreater',
      target: 'es-player-manager',
      function: 'updateLayout',
      params: [502,283,1393,25],
    },
    {
      event: 'onScrollYGreater',
      target: 'es-video-player-component',
      function: 'setPlayerLayout',
      params: [0, 0, 502, 283],
    },
    {
      event: 'onScrollYGreater',
      target: 'smallRoot',
      function: 'updateLayout',
      params: [502,283,0,0,true],
    },
    {
      event: 'onScrollYLesser',
      target: 'es-player-manager',
      function: 'updateLayout',
      params: [890,500,80,135],
    },
    {
      event: 'onScrollYLesser',
      target: 'smallRoot',
      function: 'updateLayout',
      params: [890,500,0,0],
    },
    {
      event: 'onScrollYLesser',
      target: 'es-video-player-component',
      function: 'setPlayerLayout',
      params: [0, 0, 890,500],
    },
    {
      event: 'onScrollYGreater',
      target: 'media-player',
      function: 'changeAlpha',
      params: ['0'],
    }
  ]
  let currentPlayIndex = -1 // 当前播放视频的index
  const mediaPlayerRef = ref<IMediaPlayer>()
  let changePlayerStateTimer: any = -1
  let lastWindowType: ESPlayerWindowType
  let isFullButtonClick = false
  let enterByFullButton = 0; // 0 ,placeholder,1 : fullBtn,2 : mediaItem
  let detailFocusTimer: any = null
  let detailScrollState
  let isKeyUpLongClick = false
  let waterfallScrollY = 0
  let changePlayerVisibleTimer: any = -1
  //  生命周期
  //  ***************************初始化入口 onESCreate***************************
  const onESCreate = (params) => {
    currenId.value = params && params.id ? params.id : '1584863712586579969'
    isPaused = false
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
      mediaPlayerRef.value?.resume()
    }
    isPaused = false;
    isStopped = false;
  }
  const onESRestart = () => {}
  const onESPause = () => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, "-------onESPause---------->>>>>")
    }
    isPaused = true;
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
      console.log(res,'getDetailgetDetailgetDetail') 
      media = res
      basicSectionRef.value?.init(media)
      nextTick(async () => {
        waterfallRef.value?.scrollToTop()
        //加载waterfall 板块数据
        let sections = buildSectionList(res)
        //根据是否有选集，调整焦点滚动的距离
        // if (sections.length == 3) {
        //   if (media.itemList.enable) {
        //     sections[2].scrollOverride = {
        //       down: 1000,
        //       up: -50
        //     }
        //   } else {
        //     // sections[2].scrollOverride = {
        //     //     down:600,
        //     //     up:-100
        //     // }
        //   }
        // }
        waterfallRef.value?.setSectionList(sections)
        // 补充播放历史
        // request.post(urlGetMediaHistory, {
        //   data: {
        //     platformId: media.platformId,
        //     metaId: media.id,
        //     assetLongId: media.itemListId
        //   }
        // }).then(result => {
        //   media.history = result
        //   prevPlayIndex = Math.min(Math.max((Number(result.episode)||0)-1, 0), Math.max(media.itemListCount-1, 0))
        //   media._prevPlayIndex = prevPlayIndex
        //   basicSectionRef.value?.scrollMediaListViewTo(prevPlayIndex)
        //   basicSectionRef.value?.setMediaListViewSelected(prevPlayIndex)
        // }).catch(err=>{
        //   prevPlayIndex = 0
        //   media._prevPlayIndex = prevPlayIndex
        // })
        currentPlayIndex = 0
        media._prevPlayIndex = currentPlayIndex
        mediaPlayerRef.value?.play(media)
        //延迟加载相关推荐列表数据更新相关推荐板块 不影响主页面展示速度
        getRecommendList(media.id)
      })
    })
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
  }
  const releaseEventBus = () => {
    eventbus.off('onMenuFullButtonClick', onMenuFullButtonClick)
    eventbus.off('onMenuFavouriteButtonClick', onMenuFavouriteButtonClick)
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
    detailScrollState = state
    clearTimeout(changePlayerVisibleTimer)
    if (state == 0) {
      changePlayerVisibleTimer = setTimeout(() => {
        mediaPlayerRef.value?.changeVisible(true)
      }, 200)
    }
  }
  const onItemClick = () => {}
  const onScrollYGreaterReference = () => {
    log.d(TAG, "----onScrollY---onScrollYGreaterReference----->>>>")
    clearTimeout(changePlayerStateTimer)
    if (mediaPlayerRef.value?.getWindowType() ==
      ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_SMALL) {
      nextTick(() => {
        changePlayerStateTimer = setTimeout(() => {
          mediaPlayerRef.value?.setFloatWindow()
        }, 100)
      })
    }
    basicSectionRef.value?.setAutofocus(false)
  }
  const onScrollYLesserReference = () => {
    log.d(TAG, "----onScrollY---onScrollYLesserReference----->>>>")
    clearTimeout(changePlayerStateTimer)
    if (mediaPlayerRef.value?.getWindowType() ==
      ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FLOAT || mediaPlayerRef.value?.getLoadLow()) {
      nextTick(() => {
        changePlayerStateTimer = setTimeout(() => {
          mediaPlayerRef.value?.setSmallWindow()
        }, 200)
      })
    }
  }
  // header-setion 回调
  const onSearchButtonFocused = () => {}
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
    isFullButtonClick = true
  }
  const onMenuFavouriteButtonClick = (val: boolean) => {
    // const body = {
    //   platformId: media.platformId,
    //   metaId: media.id,
    //   assetLongId: media.itemListId,
    //   assetLongTitle: media.title,
    //   assetLongCoverH: media.coverH,
    //   assetLongCoverV: media.coverV
    // }
    // val ? request.post(urlAddEnshrine, { data: body }) : request.post(urlDelOneEnshrine, { data: body })
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
    mediaPlayerRef.value?.addMediaItemList(page, data)
    if (currentPlayIndex >= 0) {
      mediaPlayerRef.value?.playMediaItemByIndex(currentPlayIndex)
      currentPlayIndex = -1
      media._prevPlayIndex = -1
    }
  }
  const onMediaSeriesItemFocus = () => {}
  const onMediaSeriesItemClick = () => {}
  const onMediaSeriesGroupItemFocus = () => {}
  const onPlayerPlaceholderFocus = () => {}
  const onPlayerPlaceholderClick = () => {}
  // 播放器
  const onPlayerPlayMedia = () => {
    const playingIndex = mediaPlayerRef.value?.getPlayingMediaIndex() ?? -1
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, "----onMediaListItemClicked---onPlayerPlayMedia---->>>>>" + playingIndex)
    }
    if (playingIndex >= 0) {
      basicSectionRef.value?.scrollMediaSeriesTo(playingIndex)
      basicSectionRef.value?.setMediaSeriesSelected(playingIndex)
    }
  }
  const onPlayerPlaying = () => {
    basicSectionRef.value?.showPlayerPlaceholderImg(false)
  }
  const onPlayerWindowTypeChanged = (windowType: ESPlayerWindowType) => {
    log.d(TAG, '-------onPlayerWindowTypeChanged-------->>>>' + windowType)
    //basicSectionRef.value?.show(windowType == ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_SMALL)
    switch (windowType) {
      case ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL:
        descendantFocusability.value = 2
        break
      case ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FLOAT:
        isFullButtonClick = false
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
        if (media && !media.itemList.enable) {
          basicSectionRef.value?.setAutofocus(false)
          detailFocusTimer = setTimeout(() => {
            cancelDetailRequestFocusTimer()
            basicSectionRef.value?.requestPlayerPlaceholderFocus()
          }, 0)
        } else {
          basicSectionRef.value?.setAutofocus(false)
        }
        isFullButtonClick = false
        break
    }
    lastWindowType = windowType
  }
  //  按键
  const onKeyDown = (keyEvent: ESKeyEvent) => {
    if (mediaPlayerRef.value?.onKeyDown(keyEvent)) {
      return true
    }
    if (keyEvent.keyCode == ESKeyCode.ES_KEYCODE_DPAD_UP && keyEvent.keyRepeat >= 1) {
      isKeyUpLongClick = true
      // headerSectionRef.value?.setAutofocus(true)
    } else {
      isKeyUpLongClick = false
    }
    return true
  }
  const onKeyUp = (keyEvent: ESKeyEvent) => {
    if (mediaPlayerRef.value?.onKeyUp(keyEvent)) {
      return true
    }
    isKeyUpLongClick = false
    headerSectionRef.value?.setAutofocus(false)
    return true
  }
  //  返回
  const onBackPressed = () => {
    if (mediaPlayerRef.value?.onBackPressed()) {
      return true
    }
    if (waterfallScrollY > 0) {
      detailScrollState = 0
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
  