<template>
  <qt-view class="detail-root-view-css" ref='detailRootViewRef'>
    <qt-waterfall
      :descendantFocusability="descendantFocusability"
      :enablePlaceholder="false"
      ref="waterfallRef"
      :blockFocusDirections="['left', 'right']"
      @onScroll="onScroll"
      :enableKeepFocus='false'
      @onScrollStateChanged="onScrollStateChanged"
      @onItemClick="onItemClick"
      :triggerTask="triggerTask"
      :scrollYLesserReferenceValue="30"
      :scrollYGreaterReferenceValue="30"
      @onScrollYGreaterReference="onScrollYGreaterReference"
      @onScrollYLesserReference="onScrollYLesserReference"
      class="detail-waterfall-css">
      <template v-slot:section>
        <header-section
          ref="headerSectionRef"
          :type="1"
          @onSearchButtonFocused="onSearchButtonFocused" />
      </template>
      <template v-slot:vue-section>
        <album-detail-section
          ref="albumDetailRef"
          @onIntroductionFocus="onIntroductionFocus"
          @onMediaListItemLoad="onMediaListItemLoad"
          @onMediaListItemFocused="onMediaListItemFocused"
          @onMediaListItemClicked="onMediaListItemClicked"
          @onMediaListGroupItemClicked="onMediaListGroupItemClicked"
          @onPlayerPlaceholderFocus="onPlayerPlaceholderFocus"
          @onPlayerPlaceholderClick="onPlayerPlaceholderClick"/>
      </template>
    </qt-waterfall>

    <media-player
      ref="mediaPlayerViewRef"
      name='media-player'
      class="detail-media-player-view-css"
      @onPlayerPlayMedia="onPlayerPlayMedia"
      @onPlayerPlaying="onPlayerPlaying"
      @onPlayerWindowTypeChanged="onPlayerWindowTypeChanged"/>

    <qt-view class="detail-loading-view-root-css" v-show="showLoading">
      <qt-loading-view class="detail-loading-view-css"/>
    </qt-view>
  </qt-view>
</template>

<script lang="ts">

import { defineComponent } from '@vue/runtime-core'
import {
  ESKeyCode,
  ESKeyEvent,
  ESLogLevel,
  useESEventBus, useESLocalStorage,
  useESLog,
  useESToast
} from '@extscreen/es3-core'
import { nextTick, provide, ref } from 'vue'
import { IMedia } from '../../api/media/IMedia'
import { QTIViewVisibility, QTIWaterfall, QTWaterfallItem } from '@quicktvui/quicktvui3'
import header_section from './section/header-section.vue'
import album_detail_section from './section/album-detail-section.vue'
import media_player from './component/media-player.vue'
import { IMediaPlayer } from './component/IMediaPlayer'
import {
  buildRecommendationItemList,
  buildSectionList,
  buildWaterfall
} from './adapter/DataAdapter'
import { useESRouter } from '@extscreen/es3-router'
import { ESPlayerWindowType } from '@extscreen/es3-player'
import { IAlbumDetail } from './section/IAlbumDetail'
import { IHeader } from './section/IHeader'
import { QTMediaSeries } from '@quicktvui/quicktvui3/dist/src/series/QTMediaSeries'
import { ESMediaItem } from '@extscreen/es3-player-manager'
import { IMediaAuthorization } from '../../api/media/IMediaAuthorization'
import { mediaAuthorizationKey } from './injectionSymbols'
import { useMediaDataSource } from '../../api/UseApi'
import { localHistory, historyKey, removeHistory, historyToCategory } from '../../api/history/store';

const TAG = 'DetailPage'

export default defineComponent({
  name: 'detail',
  components: {
    'media-player': media_player,
    'header-section': header_section,
    'album-detail-section': album_detail_section
  },
  setup() {
    const log = useESLog()
    const toast = useESToast()
    const router = useESRouter()
    const localStore = useESLocalStorage()
    const mediaPlayerViewRef = ref<IMediaPlayer>()
    const descendantFocusability = ref<number>(1)
    const eventbus = useESEventBus()
    const showLoading = ref<boolean>(true)
    const mediaAuthorizationRef = ref<IMediaAuthorization | undefined | null>()

    let isFullButtonClick = false

    let detailFocusTimer: any = null
    let detailScrollState

    //--------------------------------------------------------------------
    const mediaDataSource = useMediaDataSource()
    let mediaId: string
    let playId: string
    let playPosition: number
    let media: IMedia
    let isPaused = false
    let isStopped = false
    let isPlayerInit = false
    //--------------------------------------------------------------------
    const waterfallRef = ref<QTIWaterfall>()
    const albumDetailRef = ref<IAlbumDetail>()
    const headerSectionRef = ref<IHeader>()
    let waterfallScrollY = 0
    let lastWindowType: ESPlayerWindowType
    let playerVisible = ref(true)
    let enterByFullButton = 0; // 0 ,placeholder,1 : fullBtn,2 : mediaItem
    let showPlayerTimer = null
    let currentID: any = null
    let detailRootViewRef = ref()

    let changePlayerStateTimer: any = null
    let changePlayerVisibleTimer: any = null

    let triggerTask = [
      {
        event: 'onScrollYGreater',
        target: 'media-player',
        function: 'changeAlpha',
        params: [0],
      },
      //--------------------------------------------
      {
        event: 'onScrollYLesser',
        target: 'media-player',
        function: 'changeAlpha',
        params: [0],
      },
      //--------------------------------------------
      // {
      //   event: 'onScrollStateIdle',
      //   target: 'media-player',
      //   function: 'changeVisibility',
      //   params: ['visible'],
      // },
    ]

    // @ts-ignore
    provide(mediaAuthorizationKey, mediaAuthorizationRef)

    let isKeyUpLongClick = false

    const onESCreate = (params) => {
      mediaId = params.mediaId
      playId = params.playId
      playPosition = params.playPosition ?? 0

      if (!mediaId) {
        mediaId = '7160'
      }
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onESCreate------详情页面---->>>>>", params)
      }
      isPaused = false
      isStopped = false;
      isPlayerInit = false

      initWaterfall()
      initEventBus()
      getMediaDetail()
    }

    function initWaterfall() {
      showLoading.value = true
      waterfallRef.value?.init(buildWaterfall())
      albumDetailRef.value?.setAutofocus(true)
    }

    function initEventBus() {
      eventbus.on('onMenuFullButtonClick', onMenuFullButtonClick)
      eventbus.on('onMenuFavouriteButtonClick', onMenuFavouriteButtonClick)
    }

    function releaseEventBus() {
      eventbus.off('onMenuFullButtonClick', onMenuFullButtonClick)
      eventbus.off('onMenuFavouriteButtonClick', onMenuFavouriteButtonClick)
    }

    function getMediaDetail() {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "----1---getMediaDetail---------->>>>>", mediaId)
      }
      mediaDataSource.getMediaDetail(mediaId)
        // @ts-ignore
        .then((m: IMedia) => {
          media = m
          media.playId = playId
          media.playPosition = playPosition
          albumDetailRef.value?.initMedia(media)
          nextTick(() => {
            waterfallRef.value?.scrollToTop()
            let sections = buildSectionList(m)
            //根据是否有选集，调整焦点滚动的距离
            if (sections.length == 3) {
              if (media.itemList.enable) {
                sections[2].scrollOverride = {
                  down: 1000,
                  up: -50
                }
              } else {
                // sections[2].scrollOverride = {
                //     down:600,
                //     up:-100
                // }
              }
            }
            waterfallRef.value?.setSectionList(sections)
            mediaPlayerViewRef.value?.play(media)
            getMediaRecommendation()
          })
          //执行鉴权逻辑
          // getMediaAuthorization()
          //
          if (log.isLoggable(ESLogLevel.DEBUG)) {
            log.d(TAG, "-------getMediaDetail----success------>>>>>", media)
          }
          showLoading.value = false
        }, error => {
          showLoading.value = false
          if (log.isLoggable(ESLogLevel.DEBUG)) {
            log.d(TAG, "-------getMediaDetail----error------>>>>>", error)
          }
        })
    }

    function getMediaAuthorization() {
      mediaDataSource.getMediaAuthorization(mediaId)
        // @ts-ignore
        .then((mediaAuthorization: IMediaAuthorization) => {
          if (log.isLoggable(ESLogLevel.DEBUG)) {
            log.d(TAG, "-------getMediaAuthorization----success------>>>>>", mediaAuthorization)
          }
          mediaAuthorizationRef.value = mediaAuthorization
        }, error => {
          if (log.isLoggable(ESLogLevel.DEBUG)) {
            log.d(TAG, "-------getMediaAuthorization----error------>>>>>", error)
          }
        })
    }

    function getMediaRecommendation() {
      mediaDataSource.getMediaRecommendation(media.typeId)
        .then((mediaList: Array<IMedia>) => {
          const section = waterfallRef.value?.getSection(2)
          if (section) {
            section.itemList = buildRecommendationItemList(mediaList)
            waterfallRef.value?.updateSection(2, section)
          }
          if (log.isLoggable(ESLogLevel.DEBUG)) {
            log.d(TAG, mediaId + "-------getMediaRecommendation----success------>>>>>", section)
          }
        }, error => {
          if (log.isLoggable(ESLogLevel.DEBUG)) {
            log.d(TAG, mediaId + "-------getMediaRecommendation----error------>>>>>", error)
          }
        })
    }

    //---------------------------------------------------------------------------------
    function onItemClick(sectionIndex: number, position: number, item: QTWaterfallItem) {
      if (!item) {
        return
      }
      log.d(TAG, '-------onItemClick-------->>>>' +
        " sectionIndex:" + sectionIndex +
        " position:" + position +
        " item:", item
      )
      switch (sectionIndex) {
        case 1:
          router.push("introduction")
          break
        case 2:
          router.push({
            name: 'series_view',
            params: {
              mediaId: item.item.id
            },
            replace: true,
          });
          break
      }
    }

    function onScrollYGreaterReference() {
      log.d(TAG, "----onScrollY---onScrollYGreaterReference----->>>>")
      clearTimeout(changePlayerStateTimer)
      if (mediaPlayerViewRef.value?.getWindowType() ==
        ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_SMALL) {
        nextTick(() => {
          changePlayerStateTimer = setTimeout(() => {
            mediaPlayerViewRef.value?.setFloatWindow()
          }, 100)

        })
      }
      albumDetailRef.value?.setAutofocus(false)
    }

    function onScrollYLesserReference() {
      log.d(TAG, "----onScrollY---onScrollYLesserReference----->>>>")
      clearTimeout(changePlayerStateTimer)
      if (mediaPlayerViewRef.value?.getWindowType() ==
        ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FLOAT) {
        nextTick(() => {
          changePlayerStateTimer = setTimeout(() => {
            mediaPlayerViewRef.value?.setSmallWindow()
          }, 200)
        })
      }
    }

    function onScrollStateChanged(x: number, y: number, state: number) {
      // log.e("ScrollLog","onScrollStateChanged x:"+x+" y:"+y+" state:"+state)
      detailScrollState = state
      clearTimeout(changePlayerVisibleTimer)
      if (state == 0) {
        changePlayerVisibleTimer = setTimeout(() => {
          mediaPlayerViewRef.value?.changeVisible(true)
        }, 200)
      }
    }

    function onScroll(offsetX: number, scrollY: number) {
      log.d(TAG, '---滚动----onScroll-------->>>>' +
        " offsetX:" + offsetX +
        " scrollY:" + scrollY
      )
      waterfallScrollY = scrollY
    }


    //------------------------------------------------------------------------------
    function onSearchButtonFocused(isFocused: boolean) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "-------onSearchButtonFocused----->>>>>", isFocused)
      }
      waterfallRef.value?.scrollToTop()
      detailScrollState = 0
      setTimeout(() => {
        if (mediaPlayerViewRef.value?.getWindowType() ==
          ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FLOAT) {
          mediaPlayerViewRef.value?.setSmallWindow()
        }
      }, 100)
      cancelDetailRequestFocusTimer()
    }

    function cancelDetailRequestFocusTimer() {
      if (detailFocusTimer != null) {
        clearTimeout(detailFocusTimer)
        if (log.isLoggable(ESLogLevel.DEBUG)) {
          log.d(TAG, "-------requestFullButtonFocus--cancelDetailRequestFocusTimer-->>>>>")
        }
        detailFocusTimer = null
      }
    }

    //-------------------------------------------------------------------------------
    function onMenuFullButtonClick() {
      enterByFullButton = 1
      albumDetailRef.value?.setAutofocus(false)
      mediaPlayerViewRef.value?.setFullWindow()
      isFullButtonClick = true
    }

    function onMenuFavouriteButtonClick(val: boolean) {
      media.sortTime = new Date().getTime()
      val ? localHistory.fav[media.id] = media : removeHistory('fav', Number(media.id)), historyToCategory('fav')
    }

    function onPlayerPlaceholderClick() {
      mediaPlayerViewRef.value?.setFullWindow()
      enterByFullButton = 0;
    }

    function onPlayerPlaceholderFocus(focused: boolean) {
      if (focused) {
        waterfallRef.value?.scrollToTop()
        waterfallScrollY = 0
        cancelDetailRequestFocusTimer()
      }
      eventbus.emit("onPlayerPlaceholderFocus", focused)
    }

    function onIntroductionFocus(focused: boolean) {
      if (focused) {
        waterfallRef.value?.scrollToTop()
      }
    }

    function onMediaListItemClicked(index: number, data: QTMediaSeries) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "-------onMediaListItemClicked----->>>>>" + index, data)
      }
      if (albumDetailRef.value?.getMediaSelectedPosition() == index) {
        enterByFullButton = 2
        mediaPlayerViewRef.value?.setFullWindow()
        return;
      }
      if (data.id != null) {
        currentID = data.id
        mediaPlayerViewRef.value?.stop()
        mediaPlayerViewRef.value?.playMediaItemById(data.id)
      }
    }

    function onMediaListItemFocused(index) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "-------onMediaListItemFocused------->>>>>" + index)
      }
    }

    function onMediaListGroupItemClicked(index: number) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "-------onMediaListGroupItemClicked---->>>>>" + index)
      }
    }

    function onMediaListItemLoad(page: number, data: Array<IMedia>) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "-------onMediaListItemLoad---->>>>>" + page, data)
      }
      //全屏菜单数据
      eventbus.emit('onMediaListItemLoad', page, data)
      //
      mediaPlayerViewRef.value?.addMediaItemList(page, data)

      if (page == 0) {
        mediaPlayerViewRef.value?.playMediaItemById(playId || data[0].id)
      }
    }

    //-------------------------------------------------------------------------------
    function onPlayerPlayMedia(mediaItem: ESMediaItem) {
      const playingIndex = mediaPlayerViewRef.value?.getPlayingMediaIndex() ?? -1
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "----onMediaListItemClicked---onPlayerPlayMedia---->>>>>" + playingIndex)
      }
      if (playingIndex >= 0) {
        albumDetailRef.value?.scrollMediaListViewTo(playingIndex)
        albumDetailRef.value?.setMediaListViewSelected(playingIndex)
      }
    }

    function onPlayerPlaying() {
      albumDetailRef.value?.showPlaceholderMediaInfo(false)
    }

    function onPlayerWindowTypeChanged(windowType: ESPlayerWindowType): void {
      log.d(TAG, '-------onPlayerWindowTypeChanged-------->>>>' + windowType)
      albumDetailRef.value?.show(windowType == ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_SMALL)
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
                  albumDetailRef.value?.requestPlayerPlaceholderFocus()
                  break
                case 1:
                  albumDetailRef.value?.requestFullButtonFocus()
                  break
                case 2:
                  albumDetailRef.value?.requestCurrentMediaFocus()
                  break
              }
            }, 300)

            return
          }

          if (log.isLoggable(ESLogLevel.DEBUG)) {
            log.d(TAG, '-----全屏---------ES_PLAYER_WINDOW_TYPE_SMALL------>>>>')
          }
          if (media && !media.itemList.enable) {
            albumDetailRef.value?.setAutofocus(false)
            detailFocusTimer = setTimeout(() => {
              cancelDetailRequestFocusTimer()
              albumDetailRef.value?.requestPlayerPlaceholderFocus()
            }, 0)
          } else {
            albumDetailRef.value?.setAutofocus(false)
          }
          isFullButtonClick = false
          break
      }
      lastWindowType = windowType
    }

    //---------------------------------------------------------------------------------

    const onESResume = () => {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "-------onESResume---------->>>>>")
      }
      if (isStopped) {
        mediaPlayerViewRef.value?.resume()
      }
      isPaused = false;
      isStopped = false;
    }
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
      mediaPlayerViewRef.value?.stop()
      isStopped = true;
      // 存储历史数据
      localStore.putString(historyKey, JSON.stringify(localHistory))
    }
    const onESDestroy = () => {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "-------onESDestroy---------->>>>>")
      }
      mediaPlayerViewRef.value?.reset()
      mediaPlayerViewRef.value?.release()
      albumDetailRef.value?.release()
      releaseEventBus()
    }

    function onKeyDown(keyEvent: ESKeyEvent): boolean {
      if (mediaPlayerViewRef.value?.onKeyDown(keyEvent)) {
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

    function onKeyUp(keyEvent: ESKeyEvent): boolean {
      if (mediaPlayerViewRef.value?.onKeyUp(keyEvent)) {
        return true
      }
      isKeyUpLongClick = false
      headerSectionRef.value?.setAutofocus(false)
      return true
    }

    function onBackPressed(): boolean {
      if (mediaPlayerViewRef.value?.onBackPressed()) {
        return true
      }

      if (waterfallScrollY > 0) {
        detailScrollState = 0
        waterfallRef.value?.scrollToTop()
        waterfallScrollY = 0
        detailFocusTimer = setTimeout(() => {
          cancelDetailRequestFocusTimer()
          mediaPlayerViewRef.value?.changeVisible(true)
          albumDetailRef.value?.requestPlayerPlaceholderFocus()
        }, 300)
        return true
      }

      router.back()
      return true
    }

    return {
      // @ts-ignore
      mediaId,
      descendantFocusability,
      mediaPlayerViewRef,
      waterfallRef,
      albumDetailRef,
      headerSectionRef,
      mediaAuthorizationRef,

      onESCreate,
      onESResume,
      onESPause,
      onESStop,
      onESDestroy,
      //
      onKeyDown,
      onKeyUp,
      onBackPressed,
      //
      onItemClick,
      onScroll,
      onScrollStateChanged,
      //
      onPlayerPlaceholderClick,
      onPlayerPlaceholderFocus,
      onPlayerWindowTypeChanged,
      onPlayerPlaying,
      onPlayerPlayMedia,
      //
      onMediaListItemClicked,
      onMediaListItemFocused,
      onMediaListGroupItemClicked,
      onMediaListItemLoad,
      //
      onIntroductionFocus,
      //
      showLoading,
      onSearchButtonFocused,
      onScrollYGreaterReference,
      onScrollYLesserReference,
      triggerTask,
      playerVisible,
      detailRootViewRef,
    };
  },
});
</script>

<style>
.detail-root-view-css {
  width: 1920px;
  height: 1080px;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.detail-waterfall-css {
  width: 1920px;
  height: 1080px;
  position: absolute;
  background-color: #2F3541;
}

.detail-media-player-view-css {
  background-color: transparent;
}

.detail-loading-view-root-css {
  width: 1920px;
  height: 1080px;
  background-color: #252930;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-loading-view-css {
  width: 100px;
  height: 100px;
}
</style>
