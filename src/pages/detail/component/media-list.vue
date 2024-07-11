<template>
  <div v-show="visible" class="media-list-view-root-css" :clipChildren="false" :clipPadding="false">
    <!-- 选集标题 -->
    <div class="media-list-title-root-css">
      <qt-text class="media-list-title-text-css" :focusable="false" :fontSize="40" text="选集"/>
    </div>
    <!-- 选集内容 -->
    <qt-media-series ref="mediaSeriesRef" class="media-series-root-css"
      :clipChildren="false" :mark-color="`#FFFFFF`"
      :text-colors="{ color: textColor, focusColor: textFocusColor, selectColor: textSelectColor }"
      :gradient-background="{ colors: btnGradientColor, cornerRadius: 8, orientation: 6 }"
      :gradient-focus-background="{ colors: btnGradientFocusColor, cornerRadius: 8, orientation: 6 }"
      @load-data="onLoadData"
      @item-click="onItemClick"
      @item-focused="onItemFocused"
      @group-item-focused="onGroupItemFocused"/>
  </div>
</template>

<script lang="ts">
import { ref, onMounted } from "vue";
import { defineComponent, onUnmounted } from "@vue/runtime-core";
import { ESLogLevel, useESEventBus, useESLog } from "@extscreen/es3-core";
import { QTMediaSeriesEvent, QTIMediaSeries } from "@quicktvui/quicktvui3";
import { IMedia } from "../../../api/media/IMedia";
import { useMediaDataSource } from "../../../api/UseApi";
import { buildMediaSeriesList } from "../adapter/DataAdapter";
import {
  buildMediaSeriesData,
  buildMediaSeriesGroup,
  buildMediaSeriesStyleType,
  buildMediaSeriesType
} from "../adapter/MediaSeriesAdapter";
import ThemeConfig from "../../../build/ThemeConfig";

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
    // 主题配置
    const textColor = ThemeConfig.textColor
    const textFocusColor = ThemeConfig.textFocusColor
    const textSelectColor = ThemeConfig.textSelectColor
    const btnGradientColor = ThemeConfig.btnGradientColor
    const btnGradientFocusColor = ThemeConfig.btnGradientFocusColor
    
    const eventbus = useESEventBus()
    const initParams = ref()
    const listViewWidth = ref<number>(0)
    const listViewHeight = ref<number>(0)
    const mediaSeriesRef = ref<QTIMediaSeries>()
    const mediaDataSource = useMediaDataSource()
    const log = useESLog()
    const visible = ref<boolean>(false)
    let selectedIndex : number = 0

    let itemListId: string

    const dataMap = new Map<number, Array<IMedia>>()

    onMounted(() => {
      eventbus.on('onMediaSeriesLoadData', onMediaSeriesLoadData)
    });
    
    onUnmounted(() => {
      eventbus.off('onMediaSeriesLoadData', onMediaSeriesLoadData)
    });

    function onMediaSeriesLoadData(page: number) {
      getMediaList(itemListId, page)
    }

    function initMedia(media: IMedia) {
      itemListId = media.itemList?.id ?? ''
      visible.value = media.itemList.enable

      mediaSeriesRef.value?.setInitData(
        buildMediaSeriesType(media), //
        buildMediaSeriesGroup(media), //
        buildMediaSeriesStyleType(media), //
        buildMediaSeriesData(media));//
    }

    function scrollTo(position: number): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "-------选集组件----scrollTo------>>>>>" + position)
      }
      mediaSeriesRef.value?.scrollTo(position)
    }

    function setSelected(position: number): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "-------选集组件----setSelected------>>>>>" + position)
      }
      selectedIndex = position
      mediaSeriesRef.value?.setSelected(position)
    }

    function getSelectedPosition() : number{
      return selectedIndex
    }

    function requestFocus(position:number): void {
      mediaSeriesRef.value?.requestFocus(position)
    }

    function release(): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "-------选集组件----release------>>>>>")
      }
      dataMap.clear()
      mediaSeriesRef.value?.release()
    }

    function getMediaList(mediaItemListId: string, pageNo: number) {
      if (dataMap.has(pageNo)) {
        //TODO 等待左图右文修改获取数据的bug
        return
      }
      mediaDataSource.getMediaItemList(mediaItemListId, pageNo, 10)
        .then((mediaList: Array<IMedia>) => {
          dataMap.set(pageNo, mediaList)
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
      getMediaList(itemListId, page)
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
      textColor,
      textFocusColor,
      textSelectColor,
      btnGradientColor,
      btnGradientFocusColor,
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
      release,
      getSelectedPosition,
      requestFocus
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
  height: 50px;
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
