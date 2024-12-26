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
        <introduction
          :blockFocusDirections="['up']"
          ref="introductionRef"
          @onIntroductionFocus="onIntroductionFocus">
        </introduction>
        <!-- 资源位 -->
        <qt-view 
          class="resource-placeholder" 
          :focusable="true"
          v-if="isShowResourcePlaceholder"
          :focusScale="1.05" 
          @click="onMediaResourceClicked">
          <qt-image class="resource-placeholder-img" :src=resourcePlaceholderUrl />
        </qt-view>
        <!-- 按钮菜单 -->
        <button-menu ref="menuRef"></button-menu>
      </qt-column>
    </qt-row>
    <!-- 选集 -->
    <media-series 
      ref="mediaSeiresRef"
      nextFocusDownSID="releatedFirstId"
      :blockFocusDirections="['left','right']"
      @onMediaListItemLoad="onMediaSeriesItemLoad"
      @onMediaListItemFocused="onMediaSeriesListItemLoad"
      @onMediaListItemClicked="onMediaSeriesItemClicked"
      @onMediaListGroupItemClicked="onMediaSeriesGroupItemClicked">
    </media-series>
  </qt-column>
</template>

<script setup lang='ts' name='BasicSection'>
import { ref } from 'vue'
import { ESKeyEvent } from '@extscreen/es3-core'
import { QTIViewVisibility} from '@quicktvui/quicktvui3'
import { IMedia, IMediaSeriesType ,IEpisodeAuthType } from '../../adapter/interface'
import Introduction from './item/introduction.vue'
import PlayerPlaceholder from './item/player-placeholder.vue'
import ButtonMenu from './item/button-menu.vue'
import MediaSeries from './item/media-series.vue'
import config from './config';
  const emits = defineEmits(['onIntroductionFocus'])
  // 简介
  let sectionHeight = ref<number>(896)
  const onIntroductionFocus = (focused: boolean) => emits("onIntroductionFocus", focused)
  // 资源位
  const introductionRef = ref()
  const isShowResourcePlaceholder = config.showResourcePlaceholder
  const resourcePlaceholderUrl = 'http://qcloudimg.moss.huan.tv/project/lexue_education/lexue/2023/08/29/ed22d94f6a674b9c99cbda74f0db5fd1.png'
  const onMediaResourceClicked = () => {}
  //按钮菜单
  const menuRef = ref()
  //播放器占位
  const playerPlaceholderRef = ref() 
  const onPlayerPlaceholderFocus = () => {}
  const onPlayerPlaceholderClick = () => {}
  //选集
  const mediaSeiresRef = ref() 
  const onMediaSeriesItemLoad = () => {}
  const onMediaSeriesListItemLoad = () => {}
  const onMediaSeriesItemClicked = () => {}
  const onMediaSeriesGroupItemClicked = () => {}
  async function init(media: IMedia) {
    // console.log('----------initMedia---------->>>>', media)
    // if (media.itemList.enable) {
      // switch (media.itemList.type) {
      //   case IMediaSeriesType.MEDIA_ITEM_LIST_TYPE_NUMBER://数字
      //     sectionHeight.value = 815
      //     break
      //   case IMediaSeriesType.MEDIA_ITEM_LIST_TYPE_LEFT_RIGHT://左图右文
      //     sectionHeight.value = 896
      //     break
      //   case IMediaSeriesType.MEDIA_ITEM_LIST_TYPE_TEXT://文本
      //     sectionHeight.value = 835
      //     break
      //   case IMediaSeriesType.MEDIA_ITEM_LIST_TYPE_TOP_DOWN://上图下文
      //     sectionHeight.value = 945
      //     break
      // }
    // } else {
    //   sectionHeight.value = 550
    // }
    introductionRef.value?.init(media)
    playerPlaceholderRef.value?.init(media)
    menuRef.value?.init(media)
    mediaSeiresRef.value?.init(media)
  }
  

  defineExpose({
    init
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
  