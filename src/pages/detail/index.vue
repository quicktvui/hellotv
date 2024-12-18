<template>
  <div class='detail-root-css' ref='detailRef'>
    <qt-waterfall
      ref="waterfallRef"
      class="detail-waterfall-css"
      :scrollYLesserReferenceValue="30"
      :scrollYGreaterReferenceValue="30"
      :blockFocusDirections="['left', 'right']"
      :enablePlaceholder="false"
      :enableKeepFocus='false'
      :descendantFocusability="descendantFocusability"
      :qtTabSectionEnable="qtTabSectionEnable"
      :triggerTask="triggerTask"
      @onScroll="onScroll"
      @onScrollStateChanged="onScrollStateChanged"
      @onItemClick="onItemClick"
      @onScrollYGreaterReference="onScrollYGreaterReference"
      @onScrollYLesserReference="onScrollYLesserReference">
      <template v-slot:section>
        <header-section 
          ref="headerSectionRef" 
          :type="1"     
          :blockFocusDirections="['left','right','up']" 
          :focusable='false'>
        </header-section>
      </template>
      <template v-slot:vue-section>
        <basic-section
          ref="albumDetailRef"
          @onIntroductionFocus="onIntroductionFocus"
          @onMediaListItemLoad="onMediaListItemLoad"
          @onMediaListItemFocused="onMediaListItemFocused"
          @onMediaListItemClicked="onMediaListItemClicked"
          @onMediaListGroupItemClicked="onMediaListGroupItemClicked"
          @onPlayerPlaceholderFocus="onPlayerPlaceholderFocus"
          @onPlayerPlaceholderClick="onPlayerPlaceholderClick">
        </basic-section>
      </template>
    </qt-waterfall>  
  </div>
</template>
  
<script setup lang='ts' name='detail'>
import { ref,nextTick } from 'vue'
import {
  ESKeyCode,
  ESKeyEvent,
  ESLogLevel,
  useESEventBus,
  useESLog,
  useESToast,
  useESAppList
} from '@extscreen/es3-core'
import { QTIViewVisibility, QTIWaterfall, QTWaterfallItem } from '@quicktvui/quicktvui3'
import BuildConfig from '../../config/build-config'
import detailManager from '../../api/detail/detail-manager'
import { IDetailInfo } from './build-data/interface/index'
import {
  buildRecommendationItemList,
  buildSectionList,
  buildWaterfall
} from './build-data/adapter/data-adapter'
import HeaderSection from './components/section/header-section.vue'
import BasicSection from './components/section/basic-section.vue'

  const log = useESLog()
  const detailRef = ref()
  let currenId = ref('')
  const waterfallRef = ref<QTIWaterfall>()
  let descendantFocusability = ref<number>(1)
  const qtTabSectionEnable = {
    tabEnable:false,
    flexSectionEnable:true,
    flexSection:{
      qtPosterEnable:false,
      qtPluginItemEnable:false,
      cardItemEnable:false,
    },
    listSectionEnable:false,
    listSectionItem:{
      qtPosterEnable:false
    },
    loadingSectionEnable:true,
    endSectionEnable:true,
    blankSectionEnable:false,
    cardSectionEnable:false,
    pluginSectionEnable:false,
    vueSectionEnable:true,
    itemStoreEnable:false,
  }
  let triggerTask = BuildConfig.isLowEndDev ? [
    {
      event: 'onScrollYGreater',
      target: 'playerLowMaskImg',
      function: 'changeVisibility',
      params: ['invisible'],
    },
    {
      event: 'onScrollYLesser',
      target: 'playerLowMaskImg',
      function: 'changeVisibility',
      params: ['visible'],
    },
    {
      event: 'onScrollYGreater',
      target: 'media-player',
      function: 'changeVisibility',
      params: ['invisible'],
    },
    {
      event: 'onScrollYLesser',
      target: 'media-player',
      function: 'changeVisibility',
      params: ['visible'],
    }] : [
    {
      event: 'onScrollYGreater',
      target: 'es-player-manager',
      function: 'updateLayout',
      params: [502,283,1393,25],
    },
    {
      event: 'onScrollYGreater',
      target: 'es-video-player-component',
      function: 'setPlayerLayout',
      params: [0, 0, 502, 283],
    },
    {
      event: 'onScrollYGreater',
      target: 'smallRoot',
      function: 'updateLayout',
      params: [502,283,0,0,true],
    },
    {
      event: 'onScrollYGreater',
      target: 'media-player',
      function: 'changeAlpha',
      params: ['0'],
    }
  ]
  // waterfall 回调
  const onScroll = () => {}
  const onScrollStateChanged = () => {}
  const onItemClick = () => {}
  const onScrollYGreaterReference = () => {}
  const onScrollYLesserReference = () => {}

  // header-setion 回调
  const onSearchButtonFocused = () => {}

  // basic-setion 回调
  const onIntroductionFocus = () => {}
  const onMediaListItemLoad = () => {}
  const onMediaListItemFocused = () => {}
  const onMediaListItemClicked = () => {}
  const onMediaListGroupItemClicked = () => {}
  const onPlayerPlaceholderFocus = () => {}
  const onPlayerPlaceholderClick = () => {}


  const initWaterfall = () =>  {
    // showLoading.value = true
    waterfallRef.value!.init(buildWaterfall())
    // albumDetailRef.value?.setAutofocus(true)
  }
  const getDetail = () => {
    detailManager.getMediaDetail(currenId.value).then((res:IDetailInfo) => {
      console.log(res,'getDetailgetDetailgetDetail') 
      // media = m
      // sourceId = media.rawData.dataItems[0].sourceId
      // albumDetailRef.value?.initMedia(media)
      nextTick(async () => {
        waterfallRef.value?.scrollToTop()
        let sections = buildSectionList(res)
        //根据是否有选集，调整焦点滚动的距离
        // if (sections.length == 3) {
        //   if (media.itemList.enable) {
        //     sections[2].scrollOverride = {
        //       down: 1000,
        //       up: -50
        //     }
        //   } else {
        //     // sections[2].scrollOverride = {
        //     //     down:600,
        //     //     up:-100
        //     // }
        //   }
        // }
        waterfallRef.value?.setSectionList(sections)

        // 补充播放历史
        // request.post(urlGetMediaHistory, {
        //   data: {
        //     platformId: media.platformId,
        //     metaId: media.id,
        //     assetLongId: media.itemListId
        //   }
        // }).then(result => {
        //   media.history = result
        //   prevPlayIndex = Math.min(Math.max((Number(result.episode)||0)-1, 0), Math.max(media.itemListCount-1, 0))
        //   media._prevPlayIndex = prevPlayIndex
        //   albumDetailRef.value?.scrollMediaListViewTo(prevPlayIndex)
        //   albumDetailRef.value?.setMediaListViewSelected(prevPlayIndex)
        // }).catch(err=>{
        //   prevPlayIndex = 0
        //   media._prevPlayIndex = prevPlayIndex
        // })
        // mediaPlayerViewRef.value?.play(media)
        // getMediaRecommendation(media.id,sourceId)
      })
    })
  }

  //  生命周期
  const onESCreate = (params) => {
    currenId.value = params && params.id ? params.id : '1584863712586579969'
    initWaterfall()
    getDetail()
  }
  const onESResume = () => {
  }
  const onESRestart = () => {
  }
  const onESPause = () => {
  }
  const onESStop = () => {
  }
  const onESDestroy = () => {
  }
  //  按键
  const onKeyDown = (keyEvent: ESKeyEvent) => {
  }
  const onKeyUp = (keyEvent: ESKeyEvent) => {
  }
  //  返回
  const onBackPressed = () => {
  }

  defineExpose({
    onESCreate,
    onESRestart,
    onESPause,
    onESStop,
    onESResume,
    onESDestroy,
    onKeyDown,
    onKeyUp,
    onBackPressed
  })
</script>
  
<style lang='scss' src='./scss/index.scss'>
  
</style>
  