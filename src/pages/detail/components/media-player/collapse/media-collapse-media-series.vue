<template>
  <qt-view class="media-collapse-media-series" :focusable="false">
    <span class="media-collapse-media-series-title" :opacity="isCollapseExpand ? 1 : 0.5">播放列表</span>
    <qt-media-series
      ref="mediaSeriesRef"
      class="media-series"
      :clipChildren="false"
      markColor="#00D9D9"
      :focusable="false"
      :visible="visible"
      :textColors="{ color: ThemeConfig.textColor, focusColor: ThemeConfig.textFocusColor,
        selectColor: ThemeConfig.textSelectColor }"
      :gradientBackground="{ colors: ThemeConfig.btnGradientColor, cornerRadius: 8, orientation: 6 }"
      :gradientFocusFackground="{ colors: ThemeConfig.btnGradientFocusColor, cornerRadius: 8, orientation: 6 }"
      :commonParam="{itemGap: 32,contentWidth: 1760}"
      @loadData="onLoadData"
      @itemClick="onItemClick"
      @itemFocused="onItemFocused"
      @groupItemFocused="onGroupItemFocused">
      <template v-slot:default>
        <qt-view class="media-series-item" :focusable="true" :enableFocusBorder="true" :focusScale="1">
          <qt-image class="media-series-item-img" src="${cover}" :focusable="false"></qt-image>
          <qt-view class="media-series-item-info" duplicateParentState>
            <qt-text class="media-series-item-text" text="${text}" :lines="2" :ellipsizeMode="2"
              :focusable="false" duplicateParentState :fontSize="26"></qt-text>
            <qt-text class="media-series-item-duartion" text="${duartion}" :lines="2" :ellipsizeMode="2"
              :focusable="false" duplicateParentState :fontSize="22"></qt-text>
            <qt-view class="play_Mark" :focusable="false" :showOnState="['selected']" duplicateParentState>
              <play-mark :style="{width:'18px',height:'20px'}" markColor="#ffffff"
                :focusable="false" :showType="0" :roundCorner="1"/>
            </qt-view>
          </qt-view>
        </qt-view>
      </template>
    </qt-media-series>
  </qt-view>
</template>
      
<script setup lang='ts' name='media-collapse-media-series'>
import { ref, nextTick} from 'vue'
import { ESLogLevel, useESLog, toast, useESEventBus } from "@extscreen/es3-core"
import { QTIMediaSeries, QTMediaSeriesEvent} from '@quicktvui/quicktvui3'
import ThemeConfig from "../../../../../config/theme-config";
import {
  buildMediaSeriesType,
  buildMediaSeriesGroup,
  buildMediaSeriesStyleType,
  buildMediaSeriesData,
  buildMediaSeriesList
} from "../../../adapter/index";
import { IMedia, IMediaItem } from '../../../adapter/interface'
  const TAG = 'media-collapse-media-series'
  const log = useESLog()
  const eventbus = useESEventBus()
  const emits = defineEmits([
    'onMediaSeriesItemFocus',
    'onMediaSeriesItemClick',
    'onMediaSeriesGroupItemFocus',
  ])
  const isCollapseExpand = ref<boolean>(false)
  const mediaSeriesRef = ref<QTIMediaSeries>()
  const visible = ref<boolean>(false)
  const selectedIndex = ref<number>(0)
  let focusTimer
  let initialized = false
  //初始化media-series组件
  const init = (media: IMedia) => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, '-------initMedia-start----->>>>', media)
    }
    if(media.episodes > 1) visible.value = true
    mediaSeriesRef.value?.setInitData(
      buildMediaSeriesType(media.mediaSeriesType),
      buildMediaSeriesGroup(),
      buildMediaSeriesStyleType(),
      buildMediaSeriesData(media)
    );
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, '-------initMedia---end--->>>>', media)
    }
  }
  const setListData = (page: number, dataList: Array<IMediaItem>) => {
    console.log(dataList,'3wqeqeeeeeeeeeeeeeeeeeeee')
    const list = buildMediaSeriesList(dataList)
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, '-----1--setListData---eee--->>>>', page, list)
    }
    nextTick(() => {
      mediaSeriesRef.value?.setPageData(page, list)
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '---2----setListData---eee--->>>>', page, list)
      }
    })
  }
  // CollapseItem 展示回调
  const onCollapseItemExpand = (value: boolean) => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.e(TAG, "-------onCollapseItemExpand-----播放顺序--->>>>>", value)
    }
    isCollapseExpand.value = value
    if (value) {
      if (!initialized) {
        focusTimer = setTimeout(() => {
          setItemSelected(selectedIndex.value)
          setItemFocused(selectedIndex.value)
        }, 500)
      } else {
        focusTimer = setTimeout(() => {
          setItemSelected(selectedIndex.value)
          setItemFocused(selectedIndex.value)
        }, 200)
      }
      initialized = true
    } else {
      if (focusTimer) {
        clearTimeout(focusTimer)
      }
    }
  }
  const setItemFocused = (position: number): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, '---选集---setItemSelected------>>>>', position)
    }
    mediaSeriesRef.value?.requestFocus(position)
  }
  const setItemSelected = (position: number): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, '---选集---setItemSelected------>>>>', position)
    }
    selectedIndex.value = position
    mediaSeriesRef.value?.setSelected(position)
  }
  const onLoadData = (event: QTMediaSeriesEvent) => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, "---选集---onLoadData------>>>>")
    }
    const page = event.page ?? 10
    eventbus.emit('onMediaSeriesLoadData', page)
  }
  const onItemFocused = (event: QTMediaSeriesEvent) => {
    let index = event.position;
    emits("onMediaSeriesItemFocus", index)
  }
  const onItemClick = (event: QTMediaSeriesEvent) => {
    let index = event.position;
    let data = event.data
    emits("onMediaSeriesItemClick", index, data)
  }
  const onGroupItemFocused = (event: QTMediaSeriesEvent) => {
    let index = event.position;
    emits("onMediaSeriesGroupItemFocus", index)
  }
  const release = (): void => {
    selectedIndex.value = 0
    initialized = false
    isCollapseExpand.value = false
    mediaSeriesRef.value?.release()
  }
  defineExpose({
    init,
    setListData,
    setItemFocused,
    setItemSelected,
    onCollapseItemExpand,
    release
  })
</script>
      
<style lang='scss' scoped>
.media-collapse-media-series{
  width: 1920px;
  height: 300px;
  background-color: transparent;
  .media-collapse-media-series-title{
    width: 1740px;
    height: 32px;
    font-size: 27px;
    color: white;
    margin-left: 90px;
  }
  .media-series {
    width: 1920px;
    background-color: transparent;
    position: absolute;
    top: 50;
    .media-series-item{
      width: 434px;
      height: 137px;
      border-radius: 8px;
      background-color: rgba(255,255,255,0.1);
      flex-direction: row;
      padding-top: 12px;
      padding-left: 10px;
      padding-bottom: 12px;
      .media-series-item-img{
        width: 202px;
        height: 114px;
        border-radius: 8px;
      }
      .media-series-item-info{
        width: 200px;
        height: 113px;
        margin-left: 20px;
        background-color: transparent;
        flex-direction: row;
        flex-wrap: wrap;
        .media-series-item-text{
          width: 195px;
          height: 80px;
          color: rgba(255,255,255,0.5);
          focus-color: rgba(255,255,255,1);
          select-color: rgba(255,255,255,1);
        }
        .media-series-item-duartion{
          width: 60px;
          height: 30px;
          color: rgba(255,255,255,0.5);
          focus-color: rgba(255,255,255,1);
          select-color: rgba(255,255,255,1);
        }
        .play_Mark{
          width: 42px;
          height: 30px;
          background-color: transparent;
          margin-top: 5px;
          margin-left: 95px;
        }
      }
    }
  }
}
</style>
        