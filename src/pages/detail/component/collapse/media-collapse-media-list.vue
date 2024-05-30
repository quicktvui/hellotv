<template>
  <qt-column class="qt-collapse-item-media-list"
             :focusable="false">
    <span class="qt-collapse-item-media-list-title"
          :style="{ opacity: isCollapseExpand ? 1 : 0.5 }">播放列表</span>
    <div class="qt-collapse-item-media-list-content"
         :clipChildren="false"
         :style="{ opacity: isCollapseExpand ? 1 : 0 }">
      <qt-media-series
        ref="mediaSeriesListRef"
        :display="isCollapseExpand"
        class="qt-collapse-media-series-root-css"
        :gradient-background="{colors:['#0057FF','#00C7FF'], cornerRadii4: [8, 8, 8, 8], orientation: 6}"
        :mark-color="`#FFFFFF`"
        :text-colors="{color:'rgba(255, 255, 255, .5)',focusColor:'#ffffff',selectColor:'#157AFC'}"
        :clipChildren="false"
        @load-data="onLoadData"
        @item-click="onItemClicked"
        @item-focused="onItemFocused"
        @group-item-focused="onGroupItemFocused"/>
    </div>
  </qt-column>
</template>

<script lang="ts">

import { defineComponent } from "@vue/runtime-core";
import { ESLogLevel, useESEventBus, useESLog, useESToast } from "@extscreen/es3-core";
import { ref, nextTick } from "vue";
import {
  QTIListView, QTIMediaSeries,
  QTListViewItem,
  QTMediaSeriesEvent,
} from "@quicktvui/quicktvui3";
import media_collapse_list_item from "./media-collapse-list-item.vue";
import { IMedia } from "../../../../api/media/IMedia";
import {
  buildMediaSeriesType,
  buildMediaSeriesGroup,
  buildMediaSeriesStyleType,
  buildMediaSeriesData
} from "../../adapter/MediaSeriesAdapter";
import { buildMediaSeriesList } from "../../adapter/DataAdapter";

const TAG = 'QTCollapseItem'

export default defineComponent({
  name: "media-collapse-media-list",
  emits: [
    'onMediaListItemClicked',
    'onMediaListItemFocused',
  ],
  components: {
    'media-collapse-list-item': media_collapse_list_item
  },
  setup(props, context) {
    const log = useESLog()
    let itemListId: string
    const isCollapseExpand = ref<boolean>(false)
    const mediaSeriesListRef = ref<QTIMediaSeries>()
    const visible = ref<boolean>(false)
    const eventbus = useESEventBus()

    const selectedIndex = ref<number>(0)

    let focusTimer
    let initialized = false

    //---------------------------------------------------------------------------
    function initMedia(media: IMedia) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-------initMedia-start----->>>>', media)
      }
      itemListId = media.itemList?.id ?? ''
      visible.value = media.itemList.enable
      mediaSeriesListRef.value?.setInitData(
        buildMediaSeriesType(media), //
        buildMediaSeriesGroup(media), //
        buildMediaSeriesStyleType(media), //
        buildMediaSeriesData(media)//
      );
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-------initMedia---end--->>>>', media)
      }
    }

    function setListData(page: number, dataList: Array<IMedia>) {
      const list = buildMediaSeriesList(dataList)
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-----1--setListData---eee--->>>>', page, list)
      }
      nextTick(() => {
        mediaSeriesListRef.value?.setPageData(page, list)
        if (log.isLoggable(ESLogLevel.DEBUG)) {
          log.d(TAG, '---2----setListData---eee--->>>>', page, list)
        }
      })
    }

    //---------------------------------------------------------------------------
    function onCollapseItemExpand(value: boolean) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-------onCollapseItemExpand---选集---->>>>', value, 'selectedIndex:' + selectedIndex)
      }
      isCollapseExpand.value = value

      // setTimeout(() => {
      //   setItemSelected(selectedIndex.value)
      // }, 300)

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

    function onFocus(e) {
      let focused = e.isFocused;
    }

    function setItemFocused(position: number): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '---选集---setItemSelected------>>>>', position)
      }
      mediaSeriesListRef.value?.requestFocus(position)
    }

    function setItemSelected(position: number): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '---选集---setItemSelected------>>>>', position)
      }
      selectedIndex.value = position
      mediaSeriesListRef.value?.setSelected(position)
    }

    function scrollTo(position: number): void {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '---选集---scrollTo------>>>>', position)
      }
      mediaSeriesListRef.value?.scrollTo(position)
    }

    //-----------------------------------------------------------
    function onLoadData(event: QTMediaSeriesEvent) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "---选集---onLoadData------>>>>")
      }
      const page = event.page ?? 10
      eventbus.emit('onMediaSeriesLoadData', page)
    }

    function onItemFocused(event: QTMediaSeriesEvent) {
      let index = event.position;
      context.emit("onMediaListItemFocused", index)
    }

    function onItemClicked(event: QTMediaSeriesEvent) {
      let index = event.position;
      let data = event.data
      context.emit("onMediaListItemClicked", index, data)
    }

    function onGroupItemFocused(event: QTMediaSeriesEvent) {
      let index = event.position;
      context.emit("onMediaListGroupItemFocused", index)
    }

    function release(): void {
      selectedIndex.value = 0
      initialized = false
      isCollapseExpand.value = false
      mediaSeriesListRef.value?.release()
    }

    return {
      mediaSeriesListRef,
      isCollapseExpand,
      onFocus,
      onCollapseItemExpand,
      setListData,
      setItemFocused,
      onItemClicked,
      onLoadData,
      onItemFocused,
      onGroupItemFocused,
      visible,
      initMedia,
      setItemSelected,
      selectedIndex,
      release
    }
  },
});

</script>

<style scoped>
.qt-collapse-item-media-list {
  width: 1920px;
  height: 300px;
}

.qt-collapse-item-media-list-title {
  width: 1740px;
  height: 30px;
  font-size: 27px;
  color: white;
  margin-left: 90px;
}

.qt-collapse-item-media-list-content {
  width: 1920px;
  height: 270px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qt-collapse-item-content-list {
  width: 1920px;
  height: 80px;
  background-color: transparent;
}

.qt-collapse-media-series-root-css {
  width: 1920px;
  height: 100px;
  background-color: transparent;
  position: absolute;
}
</style>
