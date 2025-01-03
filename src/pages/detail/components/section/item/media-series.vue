<template>
  <qt-view
    class="media-series-root"
    :clipChildren="false"
    :clipPadding="false"
    :focusable="false"
    v-show="visible">
    <!-- 选集标题 -->
    <div class="media-series-title" :focusable="false">
      <qt-text class="media-series-title-text" :focusable="false" :fontSize="40" text="选集"/>
    </div>
    <!-- 选集内容 -->
    <qt-media-series
      ref="mediaSeriesRef"
      class="media-series"
      :clipChildren="false"
      markColor="#00D9D9"
      :focusable="false"
      :visible="visible"
      :text-colors="{ color: ThemeConfig.textColor, focusColor: ThemeConfig.textFocusColor,
        selectColor: ThemeConfig.textSelectColor }"
      :gradient-background="{ colors: ThemeConfig.btnGradientColor, cornerRadius: 8, orientation: 6 }"
      :gradient-focus-background="{ colors: ThemeConfig.btnGradientFocusColor, cornerRadius: 8, orientation: 6 }"
      :commonParam="{itemGap: 32,contentWidth: 1760}"
      @load-data="onLoadData"
      @item-click="onItemClick"
      @item-focused="onItemFocused"
      @group-item-focused="onGroupItemFocused">
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

<script setup lang='ts' name='MediaSeries'>
import { ref } from 'vue'
import { ESLogLevel, useESEventBus, useESLog } from "@extscreen/es3-core";
import { useESRouter } from '@extscreen/es3-router'
import { qtRef, QTIMediaSeries, QTMediaSeriesEvent} from '@quicktvui/quicktvui3'
import { IMedia, IMediaSeriesItem } from '../../../adapter/interface'
import ThemeConfig from "../../../../../config/theme-config";
import {
  buildMediaSeriesType,
  buildMediaSeriesGroup,
  buildMediaSeriesStyleType,
  buildMediaSeriesData,
  buildMediaSeriesList
} from "../../../adapter/index";
import detailManager from '../../../../../api/detail/detail-manager'
import ic_full_normal from '../../../../../assets/detail/ic_full_normal.png'
import config from '../config';
  const TAG = 'MediaSeriesView'
  const emits = defineEmits(['onMediaSeriesListItemLoad'])
  const log = useESLog()
  const router = useESRouter()
  const mediaSeriesRef = ref<QTIMediaSeries>()
  let m: IMedia
  let visible = ref(false)
  let selectedIndex = ref(0)
  const dataMap = new Map<number, Array<IMediaSeriesItem>>()
  const init = (media: IMedia) => {
    m = media
    if(media.episodes > 1) visible.value = true
    mediaSeriesRef.value?.setInitData(
      buildMediaSeriesType(1),
      buildMediaSeriesGroup(),
      buildMediaSeriesStyleType(),
      buildMediaSeriesData(media)
    )
  }
  const getMediaList = (episodesId: string, pageNo: number) => {
    if (dataMap.has(pageNo)) {
      //TODO 等待左图右文修改获取数据的bug
      return
    }
    detailManager.getMediaSeriesList(episodesId, pageNo, 10)
      .then((mediaList: Array<IMediaSeriesItem>) => {
        dataMap.set(pageNo, mediaList)
        if (log.isLoggable(ESLogLevel.DEBUG)) {
          log.d(TAG, "-------getMediaList----success------>>>>>", pageNo, mediaList)
        }
        mediaSeriesRef.value?.setPageData(pageNo, buildMediaSeriesList(mediaList))
        setSelected(0)
        emits("onMediaSeriesListItemLoad", pageNo, mediaList)
      }, error => {
        if (log.isLoggable(ESLogLevel.DEBUG)) {
          log.d(TAG, "-------getMediaList----error------>>>>>", error)
        }
      })
  }
  const onLoadData = (event: QTMediaSeriesEvent) => {
    const page = event.page ?? 1
    getMediaList(m.episodesId, page)
  }
  const onItemClick = () => {}
  const onItemFocused = () => {}
  const onGroupItemFocused = () => {}
  const setSelected = (position: number): void => {
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, "-------选集组件----setSelected------>>>>>" + position)
    }
    selectedIndex.value = position
    mediaSeriesRef.value?.setSelected(selectedIndex.value)
  }
defineExpose({
    init,
    setSelected
  })
</script>

<style lang='scss' scoped>
.media-series-root{
  width: 1920px;
  height: 299px;
  margin-top: 30px;
  background-color: transparent;
  .media-series-title{
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin-left: 80px;
    width: 180px;
    height: 50px;
    .media-series-title-text{
      width: 180px;
      height: 50px;
      color: #fff;
    }
  }
  .media-series{
    width: 1920px;
    margin-top: 40px;
    background-color: transparent;
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
