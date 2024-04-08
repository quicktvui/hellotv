<template>

  <div class="media-list-view-root-css" v-show="visible" :clipChildren="false" :clipPadding="false">

    <div class="media-list-title-root-css">
      <qt-text class="media-list-title-text-css" :focusable="false" :fontSize="40" text="选集" />
    </div>

    <qt-media-series ref="mediaSeriesRef" class="media-series-root-css" :clipChildren="false" @load-data="onLoadData"
      @item-click="onItemClick" @item-focused="onItemFocused" @group-item-focused="onGroupItemFocused" />

  </div>
</template>

<script lang="ts">

import { defineComponent, onUnmounted } from "@vue/runtime-core";
import { onMounted, ref } from "vue";
import {
  QTMediaSeriesEvent,
  QTMediaSeriesType,
  QTIMediaSeries,
  QTMediaSeriesStyleType,
  QTMediaSeriesGroup,
  QTMediaSeriesData
} from "@quicktvui/quicktvui3";
import { IMedia } from "../../../api/media/IMedia";
import { useMediaDataSource } from "../../../api/UseApi";
import { ESLogLevel, useESEventBus, useESLog } from "@extscreen/es3-core";
import { buildMediaSeriesList } from "../adapter/DataAdapter";
import { IMediaItemListType } from "../../../api/media/IMediaItemListType";
import {
  buildMediaSeriesData,
  buildMediaSeriesGroup,
  buildMediaSeriesStyleType,
  buildMediaSeriesType
} from "../adapter/MediaSeriesAdapter";

const TAG = 'MediaListView'

export default defineComponent({
  name: "media-list",
  emits: [
    'onMediaListItemFocused',
    'onMediaListItemClicked',
    'onMediaListGroupItemClicked',
    'onMediaListItemLoad'
  ],
  setup(props, context) {

    const eventbus = useESEventBus()
    const initParams = ref()
    const listViewWidth = ref<number>(0)
    const listViewHeight = ref<number>(0)
    const mediaSeriesRef = ref<QTIMediaSeries>()
    const mediaDataSource = useMediaDataSource()
    const log = useESLog()
    const visible = ref<boolean>(false)
    const iMedia = ref<IMedia>()

    onMounted(() => {
      eventbus.on('onMediaSeriesLoadData', onMediaSeriesLoadData)
    });
    onUnmounted(() => {
      eventbus.off('onMediaSeriesLoadData', onMediaSeriesLoadData)
    });

    function onMediaSeriesLoadData(page: number) {
      getMediaList(iMedia.value?.itemList.id || '', page)
    }

    function initMedia(media: IMedia) {
      iMedia.value = media
      visible.value = media.itemList.enable
      mediaSeriesRef.value?.setInitData(
        buildMediaSeriesType(media), //
        buildMediaSeriesGroup(media), //
        buildMediaSeriesStyleType(media), //
        buildMediaSeriesData(media));//
    }

    function scrollTo(position: number): void {
      mediaSeriesRef.value?.scrollTo(position)
    }

    function setSelected(position: number): void {
      mediaSeriesRef.value?.setSelected(position)
    }

    function release(): void {
      mediaSeriesRef.value?.release()
    }

    function getMediaList(mediaItemListId: string, pageNo: number) {
      mediaDataSource.getMediaItemList(mediaItemListId, pageNo, 10, iMedia.value)
        .then((mediaList: Array<IMedia>) => {
          if (log.isLoggable(ESLogLevel.DEBUG)) {
            log.d(TAG, "-------getMediaList----success------>>>>>", pageNo, mediaList)
          }
          mediaSeriesRef.value?.setPageData(pageNo, buildMediaSeriesList(mediaList))
          context.emit("onMediaListItemLoad", pageNo, mediaList)
        }, error => {
          if (log.isLoggable(ESLogLevel.DEBUG)) {
            log.d(TAG, "-------getMediaList----error------>>>>>", error)
          }
        })
    }

    function onLoadData(event: QTMediaSeriesEvent) {
      const page = event.page ?? 10
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "-------onLoadData---------->>>>>", page)
      }
      getMediaList(iMedia.value?.itemList.id || '', page)
    }

    function onItemFocused(event: QTMediaSeriesEvent) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "-------onItemFocused----->>>>>", event)
      }
      let index = event.position;
      context.emit("onMediaListItemFocused", index)
    }

    function onItemClick(event: QTMediaSeriesEvent) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "--------onItemClick----->>>>>", event)
      }
      let index = event.position;
      let data = event.data
      context.emit("onMediaListItemClicked", index, data)
    }

    function onGroupItemFocused(event: QTMediaSeriesEvent) {
      let index = event.position;
      context.emit("onMediaListGroupItemFocused", index)
    }

    return {
      visible,
      mediaSeriesRef,
      initMedia,
      listViewWidth,
      listViewHeight,
      initParams,
      onItemFocused,
      onLoadData,
      onItemClick,
      onGroupItemFocused,
      scrollTo,
      setSelected,
      release
    }
  },
});

</script>

<style scoped>
.media-list-view-root-css {
  width: 1920px;
  height: 220px;
  position: absolute;
  margin-top: 550px;
}

.media-list-title-root-css {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-left: 90px;
}

.media-list-title-text-css {
  width: 180px;
  height: 60px;
  font-size: 40px;
  font-weight: 400;
  color: white;
}

.media-series-root-css {
  width: 1920px;
  height: 150px;
  margin-top: 25px;
}
</style>
