<template>
  <qt-column 
    class="basic-section-root"
    :style="{ height: sectionHeight }"
    :scrollOverride="{ down: 0, up: -1080 }"
    :clipChildren="false"
    :clipPadding="false">
    <qt-row class="basic-section-top">
      <!-- 播放器占位 -->
      <player-placeholder
        ref="playerPlaceholderRef"
        @onPlaceholderFocus="onPlayerPlaceholderFocus"
        @onPlaceholderClick="onPlayerPlaceholderClick">
      </player-placeholder>
      <qt-column  class="basic-section-top-info">
        <!-- 简介-->
        <media-introduction
          :blockFocusDirections="['up']"
          ref="mediaIntroductionRef"
          @onIntroductionFocus="onIntroductionFocus">
        </media-introduction>
        <!-- 资源位 -->
        <qt-view 
          class="resource-placeholder" 
          :focusable="true"
          v-if="isShowResourcePlaceholder"
          :focusScale="ThemeConfig.placeHolderFocusScale"
          @click="onMediaResourceClicked">
          <qt-image class="resource-placeholder-img" :src=resourcePlaceholderUrl />
        </qt-view>
        <!-- 按钮菜单 -->
        <button-menu ref="menuRef" :isCollected="isCollected"></button-menu>
      </qt-column>
    </qt-row>
    <!-- 选集 -->
    <media-series 
      ref="mediaSeiresRef"
      nextFocusDownSID="releatedFirstId"
      :blockFocusDirections="['left','right']"
      @onMediaSeriesItemLoad="onMediaSeriesItemLoad"
      @onMediaSeriesItemFocus="onMediaSeriesItemFocus"
      @onMediaSeriesItemClick="onMediaSeriesItemClick"
      @onMediaSeriesGroupItemFocus="onMediaSeriesGroupItemFocus">
    </media-series>
  </qt-column>
</template>

<script setup lang='ts' name='BasicSection'>
import { ref } from 'vue'
import { useESRuntime } from '@extscreen/es3-core'
import { QTMediaSeries} from '@quicktvui/quicktvui3'
import { IMedia, IMediaSeriesType ,IMediaItem } from '../../adapter/interface'
import MediaIntroduction from './item/media-introduction.vue'
import PlayerPlaceholder from './item/player-placeholder.vue'
import ButtonMenu from './item/button-menu.vue'
import MediaSeries from './item/media-series.vue'
import detailManager from '../../../../api/detail/detail-manager'
import ThemeConfig from "../../../../config/theme-config";
import config from './config';
  const emits = defineEmits([
    'onIntroductionFocus',
    'onMediaSeriesItemLoad',
    'onMediaSeriesItemFocus',
    'onMediaSeriesItemClick',
    'onMediaSeriesGroupItemFocus',
    'onPlayerPlaceholderFocus',
    'onPlayerPlaceholderClick',
  ])
  const runtime = useESRuntime()
  // 简介
  let sectionHeight = ref<number>(896)
  const onIntroductionFocus = (focused: boolean) => emits("onIntroductionFocus", focused)
  // 资源位
  const mediaIntroductionRef = ref()
  const isShowResourcePlaceholder = config.showResourcePlaceholder
  const resourcePlaceholderUrl = 'http://qcloudimg.moss.huan.tv/project/lexue_education/lexue/2023/08/29/ed22d94f6a674b9c99cbda74f0db5fd1.png'
  const onMediaResourceClicked = () => {}
  //按钮菜单
  const menuRef = ref()
  const isCollected = ref(false)
  //播放器占位
  const playerPlaceholderRef = ref() 
  const onPlayerPlaceholderFocus = (focused: boolean) => {
    emits("onPlayerPlaceholderFocus", focused)
  }
  const onPlayerPlaceholderClick = () => {emits("onPlayerPlaceholderClick")}
  //选集
  const mediaSeiresRef = ref() 
  const onMediaSeriesItemLoad = (page: number, data: Array<IMediaItem>) => {
    emits("onMediaSeriesItemLoad", page, data)
  }
  const onMediaSeriesItemFocus = (position: number) => {
    emits("onMediaSeriesItemFocus", position)
  }
  const onMediaSeriesItemClick = (position: number, data: QTMediaSeries) => {
    emits("onMediaSeriesItemClick", position, data)
  }
  const onMediaSeriesGroupItemFocus = (position: number) => {
    emits("onMediaSeriesGroupItemFocus", position)
  }
  //**************************初始化入口**************************
  const init = async (media: IMedia) => {
    if (media.mediaSeriesType && media.mediaSeriesType > -1) {
      switch (media.mediaSeriesType) {
        case IMediaSeriesType.MEDIA_ITEM_LIST_TYPE_NUMBER: //数字
          sectionHeight.value = 815
          break
        case IMediaSeriesType.MEDIA_ITEM_LIST_TYPE_LEFT_RIGHT: //左图右文
          sectionHeight.value = 896
          break
        case IMediaSeriesType.MEDIA_ITEM_LIST_TYPE_TEXT: //文本
          sectionHeight.value = 835
          break
        case IMediaSeriesType.MEDIA_ITEM_LIST_TYPE_TOP_DOWN: //上图下文
          sectionHeight.value = 945
          break
      }
    } else {
      sectionHeight.value = 550
    }
    let devicedId = runtime.getRuntimeDeviceId()??''
    await detailManager.getRecordData(media.id,devicedId,'favorite').then((res) => {
      isCollected.value = res && res.id ? true : false
    })
    mediaIntroductionRef.value?.init(media)
    playerPlaceholderRef.value?.init(media)
    menuRef.value?.init(media)
    mediaSeiresRef.value?.init(media)
  }
  const showPlayerPlaceholderImg = (value: boolean) => {
    playerPlaceholderRef.value?.showPlayerPlaceholderImg(value)
  } 
  const scrollMediaSeriesTo = (position: number): void => {
    mediaSeiresRef.value?.scrollTo(position)
  }
  const setMediaSeriesSelected = (position: number): void => {
    mediaSeiresRef.value?.setSelected(position)
  }
  const requestPlayerPlaceholderFocus = (): void => {
    playerPlaceholderRef.value?.requestFocus()
  }
  const requestFullButtonFocus = (): void => {
    menuRef.value?.requestFullButtonFocus()
  }
  const release = (): void => {
    mediaSeiresRef.value?.release()
  }
  const setAutofocus = (enable: boolean) => {
    playerPlaceholderRef.value?.setAutofocus(enable)
  }
  const requestCurrentMediaFocus = () => {
    mediaSeiresRef.value?.requestFocus(mediaSeiresRef.value?.getSelectedPosition() ?? -1)
  }
  const getMediaSelectedPosition = (): number => {
    return mediaSeiresRef.value?.getSelectedPosition() ?? -1
  }

  defineExpose({
    init,
    showPlayerPlaceholderImg,
    scrollMediaSeriesTo,
    setMediaSeriesSelected,
    requestPlayerPlaceholderFocus,
    requestFullButtonFocus,
    release,
    setAutofocus,
    requestCurrentMediaFocus,
    getMediaSelectedPosition

  })
</script>

<style lang='scss' scoped>
.basic-section-root {
  width: 1920px;
  background-color: transparent;
  .basic-section-top{
    width: 1920px;
    height: 504px;
    margin-top: 15px;
    background-color: transparent;
    .basic-section-top-info{
      width: 810px;
      height: 500px;
      background-color: transparent;
      margin-left: 60px;
      .resource-placeholder{
        width: 790px;
        height: 95px;
        background-color: transparent;
        border-radius: 10px;
        margin-left: 20px;
        margin-top: 12px;
        .resource-placeholder-img{
          width: 790px;
          height: 95px;
          border-radius: 10px;
        }
      }
    }
    
  }
  
}
</style>
  