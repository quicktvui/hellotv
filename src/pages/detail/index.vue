<template>
  <div class="detail-root-view-css" :skipRequestFocus='true'>
    <qt-waterfall
      :descendantFocusability="descendantFocusability"
      :enablePlaceholder="false"
      ref="waterfallRef"
      :blockFocusDirections="['left','right']"
      :disableScrollOnFirstScreen="true"
      @onScroll="onScroll"
      @onScrollStateChanged="onScrollStateChanged"
      @onItemClick="onItemClick"
      class="detail-waterfall-css">
      <template v-slot:section>
        <header-section
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
      class="detail-media-player-view-css"
      @onPlayerPlayMedia="onPlayerPlayMedia"
      @onPlayerPlaying="onPlayerPlaying"
      @onPlayerWindowTypeChanged="onPlayerWindowTypeChanged"/>

    <qt-view class="detail-loading-view-root-css" v-show="showLoading">
      <qt-loading-view class="detail-loading-view-css"/>
    </qt-view>
  </div>
</template>

<script lang="ts">

import {defineComponent,} from '@vue/runtime-core';
import { ESKeyCode, ESKeyEvent, ESLogLevel, useESEventBus, useESLog, useESToast } from "@extscreen/es3-core"
import {nextTick, ref, provide} from "vue";
import {IMedia} from "../../api/media/IMedia";
import {QTIWaterfall, QTWaterfallItem} from "@quicktvui/quicktvui3";
import header_section from './section/header-section.vue'
import album_detail_section from './section/album-detail-section.vue'
import media_player from './component/media-player.vue'
import {IMediaPlayer} from "./component/IMediaPlayer";
import {buildRecommendationItemList, buildSectionList, buildWaterfall} from './adapter/DataAdapter'
import {useESRouter} from "@extscreen/es3-router";
import {ESPlayerWindowType} from "@extscreen/es3-player";
import {IAlbumDetail} from "./section/IAlbumDetail";
import {QTMediaSeries} from "@quicktvui/quicktvui3/dist/src/series/QTMediaSeries";
import {ESMediaItem} from "@extscreen/es3-player-manager";
import {IMediaAuthorization} from "../../api/media/IMediaAuthorization";
import {mediaAuthorizationKey} from "./injectionSymbols";
import {useMediaDataSource} from "../../api/UseApi";


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
    const mediaPlayerViewRef = ref<IMediaPlayer>()
    const descendantFocusability = ref<number>(1)
    const eventbus = useESEventBus()
    const showLoading = ref<boolean>(true)
    const mediaAuthorizationRef = ref<IMediaAuthorization | undefined | null>()

    let isFullButtonClick = false

    let detailFocusTimer = null
    let detailScrollState

    //--------------------------------------------------------------------
    const mediaDataSource = useMediaDataSource()
    let mediaId: string
    let media: IMedia
    let isPaused = false
    let isStopped = false
    let isPlayerInit = false
    //--------------------------------------------------------------------
    const waterfallRef = ref<QTIWaterfall>()
    const albumDetailRef = ref<IAlbumDetail>()
    let waterfallScrollY = 0
    let lastWindowType: ESPlayerWindowType

    provide(mediaAuthorizationKey, mediaAuthorizationRef)

    let isKeyUpLongClick = false

    const onESCreate = (params) => {
      mediaId = params.mediaId
      if (!mediaId) {
        mediaId = '1703598812798386177'
      }
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onESCreate------详情页面---->>>>>", params)
      }
      isPaused = false
      initWaterfall()
      initEventBus()
      getMediaDetail()
    }

    function initWaterfall() {
      showLoading.value = true
      waterfallRef.value?.init(buildWaterfall())
      waterfallRef.value?.scrollToTop()
      albumDetailRef.value?.setAutofocus(true)
    }

    function initEventBus() {
      eventbus.on('onMenuFullButtonClick', onMenuFullButtonClick)
    }

    function releaseEventBus() {
      eventbus.off('onMenuFullButtonClick', onMenuFullButtonClick)
    }

    function getMediaDetail() {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "----1---getMediaDetail---------->>>>>", mediaId)
      }
      mediaDataSource.getMediaDetail(mediaId)
        .then((m: IMedia) => {
          media = m
          albumDetailRef.value?.initMedia(media)
          nextTick(() => {
            waterfallRef.value?.scrollToTop()
              let sections = buildSectionList(m)
              //根据是否有选集，调整焦点滚动的距离
              if(sections.length == 3){
                  if(media.itemList.enable){
                      sections[2].scrollOverride = {
                          down:1000,
                          up:-50
                      }
                  }else{
                      sections[2].scrollOverride = {
                          down:600,
                          up:-100
                      }
                  }
              }
            waterfallRef.value?.setSectionList(sections)
            mediaPlayerViewRef.value?.play(media)
            getMediaRecommendation()
          })
          //执行鉴权逻辑
          getMediaAuthorization()
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
      mediaDataSource.getMediaRecommendation(mediaId)
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

    function onScrollStateChanged(x: number, y: number, state: number) {
      detailScrollState = state
      log.d(TAG, '----滚动状态---onScrollStateChanged-------->>>>' +
          " y:" + y +
          " state:" + state
      )

      if(isKeyUpLongClick){
        log.d(TAG, '---滚动----onScrollStateChanged--屏蔽长按------>>>>' +
          " isKeyUpLongClick:" + isKeyUpLongClick
        )
        return
      }

      if (state == 0 && y < 5) {
        if (mediaPlayerViewRef.value?.getWindowType() ==
          ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FLOAT) {
          mediaPlayerViewRef.value?.setSmallWindow()
        }
      }
      if(state == 0 && y > 10){
          albumDetailRef.value?.setAutofocus(false)
      }
    }

    function onScroll(offsetX: number, scrollY: number) {
      log.d(TAG, '---滚动----onScroll-------->>>>' +
        " offsetX:" + offsetX +
        " scrollY:" + scrollY
      )
      waterfallScrollY = scrollY

      if(isKeyUpLongClick){
        log.d(TAG, '---滚动----onScroll--屏蔽长按------>>>>' +
          " isKeyUpLongClick:" + isKeyUpLongClick
        )
        return
      }

      if (scrollY > 0) {
        if (mediaPlayerViewRef.value?.getWindowType() ==
          ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_SMALL) {
          mediaPlayerViewRef.value?.setFloatWindow()
        }
      } else {
        if(detailScrollState == 0){
          if (mediaPlayerViewRef.value?.getWindowType() ==
            ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FLOAT) {
            mediaPlayerViewRef.value?.setSmallWindow()
          }
        }
      }
    }


    //------------------------------------------------------------------------------
    function onSearchButtonFocused(isFocused: boolean) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "-------onSearchButtonFocused----->>>>>", isFocused)
      }
      waterfallRef.value?.scrollToTop()
      detailScrollState = 0
      if (mediaPlayerViewRef.value?.getWindowType() ==
        ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FLOAT) {
        mediaPlayerViewRef.value?.setSmallWindow()
      }
      cancelDetailRequestFocusTimer()
    }

    function cancelDetailRequestFocusTimer(){
      if(detailFocusTimer != null){
        clearTimeout(detailFocusTimer)
        detailFocusTimer = null
      }
    }

    //-------------------------------------------------------------------------------
    function onMenuFullButtonClick() {
      albumDetailRef.value?.setAutofocus(false)
      mediaPlayerViewRef.value?.setFullWindow()
      isFullButtonClick = true
    }

    function onPlayerPlaceholderClick() {
      mediaPlayerViewRef.value?.setFullWindow()
    }

    function onPlayerPlaceholderFocus(focused: boolean) {
       if(focused){
           waterfallRef.value?.scrollToTop()
           waterfallScrollY = 0
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
      if (data.id != null) {
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

      //TODO 等待左图右文修改获取数据的bug
      if (page == 0 && !isPlayerInit) {
        mediaPlayerViewRef.value?.playMediaItemByIndex(0)
        isPlayerInit = true
      }
    }

    //-------------------------------------------------------------------------------
    function onPlayerPlayMedia(mediaItem: ESMediaItem) {
      const playingIndex = mediaPlayerViewRef.value?.getPlayingMediaIndex() ?? -1
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "----onMediaListItemClicked---onPlayerPlayMedia---->>>>>" + playingIndex)
      }
      if (playingIndex >= 0) {
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
            if (isFullButtonClick) {
              detailFocusTimer = setTimeout(() => {
                cancelDetailRequestFocusTimer()
                albumDetailRef.value?.requestFullButtonFocus()
              }, 300)
              isFullButtonClick = false
            } else {
              albumDetailRef.value?.setAutofocus(true)
            }
            return
          }

          if (media && !media.itemList.enable) {
            albumDetailRef.value?.setAutofocus(false)
            detailFocusTimer = setTimeout(() => {
              cancelDetailRequestFocusTimer()
              if (!isKeyUpLongClick) {
                albumDetailRef.value?.requestPlayerPlaceholderFocus()
              }
            }, 200)
          }else{
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
    }
    const onESDestroy = () => {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "-------onESDestroy---------->>>>>")
      }
      mediaPlayerViewRef.value?.release()
      mediaPlayerViewRef.value?.reset()
      albumDetailRef.value?.release()
      releaseEventBus()
    }

    function onKeyDown(keyEvent: ESKeyEvent): boolean {
      if (mediaPlayerViewRef.value?.onKeyDown(keyEvent)) {
        return true
      }
      if (keyEvent.keyCode == ESKeyCode.ES_KEYCODE_DPAD_UP && keyEvent.keyRepeat >= 1) {
        isKeyUpLongClick = true
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
            albumDetailRef.value?.requestPlayerPlaceholderFocus()
          }, 300)
          return true
      }

      router.back()
      return true
    }

    return {
      mediaId,
      descendantFocusability,
      mediaPlayerViewRef,
      waterfallRef,
      albumDetailRef,
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
      onSearchButtonFocused
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

