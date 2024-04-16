<template>
  <qt-column class="album-detail-section-root" :style="{ height: sectionHeight }"
    :scrollOverride="{ down: 0, up: -1080 }" :clipChildren="false" :clipPadding="false">
    <!-- 简介-->
    <media-introduction ref="introductionRef" @onIntroductionFocus="onIntroductionFocus" />

    <!-- 菜单 -->
    <media-menu ref="menuRef" :isCollected="isCollected" />

    <!-- 播放器占位-->
    <media-player-placeholder ref="placeholderRef" @onPlaceholderFocus="onPlayerPlaceholderFocus"
      @onPlaceholderClick="onPlayerPlaceholderClick" />

    <!-- 选集-->
    <media-list ref="mediaListRef" @onMediaListItemLoad="onMediaListItemLoad"
      @onMediaListItemFocused="onMediaListItemFocused" @onMediaListItemClicked="onMediaListItemClicked"
      @onMediaListGroupItemClicked="onMediaListGroupItemClicked">
    </media-list>

  </qt-column>
</template>

<script lang="ts">

import { defineComponent } from "@vue/runtime-core";
import media_introduction from '../component/media-introduction.vue'
import media_menu from '../component/media-menu.vue'
import media_list from '../component/media-list.vue'
import media_player_placeholder from '../component/media-player-placeholder.vue'
import { IMedia } from "../../../api/media/IMedia";
import { ref } from "vue";
import { IMediaIntroduction } from "../component/IMediaIntroduction";
import { IMediaPlaceholder } from "../component/IMediaPlaceholder";
import { IMediaListView } from "../component/IMediaListView";
import { QTMediaSeries } from "@quicktvui/quicktvui3";
import { IMediaItemListType } from "../../../api/media/IMediaItemListType";
import { localHistory } from "../../../api/history/store";
import { IMediaMenuView } from "../component/IMediaMenuView"

const TAG = 'AlbumDetail'

export default defineComponent({
  name: "album-detail-section",
  emits: [
    'onPlayerPlaceholderClick',
    'onPlayerPlaceholderFocus',
    'onMediaListItemFocused',
    'onMediaListItemClicked',
    'onMediaListGroupItemClicked',
    'onIntroductionFocus',
    'onMediaListItemLoad'
  ],
  components: {
    'media-introduction': media_introduction,
    'media-player-placeholder': media_player_placeholder,
    'media-menu': media_menu,
    'media-list': media_list
  },
  setup(props, context) {
    const isCollected = ref(false)
    const introductionRef = ref<IMediaIntroduction>()
    const placeholderRef = ref<IMediaPlaceholder>()
    const mediaListRef = ref<IMediaListView>()
    const menuRef = ref<IMediaMenuView>()

    const sectionHeight = ref<number>(550)

    function initMedia(media: IMedia) {
      // console.log('----------initMedia---------->>>>', media)
      isCollected.value = localHistory.fav[media.id] ? true : false
      if (media.itemList.enable) {
        switch (media.itemList.type) {
          case IMediaItemListType.MEDIA_ITEM_LIST_TYPE_NUMBER://数字
            sectionHeight.value = 815
            break
          case IMediaItemListType.MEDIA_ITEM_LIST_TYPE_LEFT_RIGHT://左图右文
            sectionHeight.value = 896
            break
          case IMediaItemListType.MEDIA_ITEM_LIST_TYPE_TEXT://文本
            sectionHeight.value = 835
            break
          case IMediaItemListType.MEDIA_ITEM_LIST_TYPE_TOP_DOWN://上图下文
            sectionHeight.value = 945
            break
        }
      } else {
        sectionHeight.value = 550
      }

      introductionRef.value?.initMedia(media)
      placeholderRef.value?.initMedia(media)
      mediaListRef.value?.initMedia(media)
    }

    function onPlayerPlaceholderClick() {
      context.emit('onPlayerPlaceholderClick')
    }

    function onPlayerPlaceholderFocus(focused: boolean) {
      context.emit('onPlayerPlaceholderFocus', focused)
    }

    function onMediaListItemFocused(index) {
      context.emit("onMediaListItemFocused", index)
    }

    function onMediaListItemClicked(position: number, data: QTMediaSeries) {
      context.emit("onMediaListItemClicked", position, data)
    }

    function onMediaListGroupItemClicked(position: number) {
      context.emit("onMediaListGroupItemClicked", position)
    }

    function onMediaListItemLoad(page: number, data: Array<IMedia>) {
      context.emit("onMediaListItemLoad", page, data)
    }

    function onIntroductionFocus(focused: boolean) {
      context.emit("onIntroductionFocus", focused)
    }

    function show(value: boolean) {
      placeholderRef.value?.show(value)
    }

    function showPlaceholderMediaInfo(value: boolean) {
      placeholderRef.value?.showMediaInfo(value)
    }

    function scrollMediaListViewTo(position: number): void {
      mediaListRef.value?.scrollTo(position)
    }

    function setMediaListViewSelected(position: number): void {
      mediaListRef.value?.setSelected(position)
    }

    function requestPlayerPlaceholderFocus(): void {
      placeholderRef.value?.requestFocus()
    }

    function requestFullButtonFocus(): void {
      console.log("=======1====requestFullButtonFocus========>>>>")
      menuRef.value?.requestFullButtonFocus()
    }

    function release(): void {
      mediaListRef.value?.release()
    }

    function setAutofocus(enable: boolean) {
      placeholderRef.value?.setAutofocus(enable)
    }


    return {
      isCollected,
      menuRef,
      sectionHeight,
      introductionRef,
      placeholderRef,
      mediaListRef,
      show,
      showPlaceholderMediaInfo,
      initMedia,
      onPlayerPlaceholderClick,
      onPlayerPlaceholderFocus,
      //
      onMediaListItemFocused,
      onMediaListItemClicked,
      onMediaListGroupItemClicked,
      onMediaListItemLoad,
      //
      onIntroductionFocus,
      scrollMediaListViewTo,
      setMediaListViewSelected,
      requestPlayerPlaceholderFocus,
      release,
      setAutofocus,
      requestFullButtonFocus
    }
  },
});

</script>
<style scoped>
.album-detail-section-root {
  width: 1920px;
}

.album-detail-media-player-css {
  background-color: transparent;
  position: absolute;
}
</style>
