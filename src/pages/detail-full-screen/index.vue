<template>
  <qt-view class='detail-full-screen' ref='detailRef'>
    <!-- 播放器 -->
    <media-player ref="mediaPlayerRef" @emStartPlay="emStartPlayFn" @onOver="onOverFn" />      
    <!-- 页面内容 -->
    <qt-view class="content">
      <!-- 顶部按钮 -->
      <top-view :logoRight='true' @focus="onTopBtnFocus"></top-view>
      <!-- 详情页基本信息及按钮 -->
      <media-info ref="mediaInfoRef"></media-info>
      <!-- bottom waterfall 选集列表及推荐列表-->
      <qt-waterfall
        ref="waterfallRef" 
        class="detail-waterfall"
        enablePlaceholder
        :endHintEnabled="false" 
        :enableKeepFocus='false'
        :qtTabSectionEnable="qtTabSectionEnable"
        :blockFocusDirections="['left', 'right', 'down']"
        @onItemClick="onWaterfallItemClick"
        :verticalFadingEdgeEnabled="true" :fadingEdgeLength="100">
        <template v-slot:vue-section>
          <!-- 选集自定义vue-section -->
          <media-series-section ref="mediaSeriesSectionRef"></media-series-section>
        </template>
        <template v-slot:list-item>
          <!-- 推荐列表item -->
          <recommend-item :type="10011"></recommend-item>
        </template>
      </qt-waterfall>
    </qt-view>
    <!-- 骨架屏 -->
    <div class="skeleton" v-if="isShowSkeleton">
      <img src="../../assets/detail/skeleton.png" :focusable="false" />
    </div>
  </qt-view >
</template>
    
<script setup lang='ts' name='detail-full-screen'>
import { ref, nextTick } from 'vue'
import {
ESKeyEvent,
useESLog,
useESRuntime,
} from '@extscreen/es3-core'
import { useESRouter } from '@extscreen/es3-router'
import MediaPlayer from "./components/media-player.vue";
import TopView from '../../components/top-view.vue'
import MediaInfo from "./components/media-info.vue";
import MediaSeriesSection from './components/media-series-section.vue'
import RecommendItem from './components/recommend-item.vue'
// import BuildConfig from '../../config/build-config'
import detailManager from './api/index'
import { IMedia } from './adapter/interface'

  // const TAG = 'DetailFullScreen'
  const log = useESLog()
  const runtime = useESRuntime()
  const router = useESRouter()
  // let deviceId = runtime.getRuntimeDeviceId()??''
  const qtTabSectionEnable = {
    tabEnable:false,
    flexSectionEnable:false,
    flexSection:{
      qtPosterEnable:false,
      qtPluginItemEnable:false,
      cardItemEnable:false,
    },
    listSectionEnable:true,
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
  let media: IMedia
  const mediaPlayerRef = ref()
  const mediaInfoRef = ref()
  const mediaSeriesSectionRef = ref()
  //let currentPlayIndex = -1 // 当前播放视频的index
  let currenId = ref('')
  let isShowSkeleton = ref(true)
  
  //  生命周期
  //  ***************************初始化入口 onESCreate***************************
  const onESCreate = (params) => {
    currenId.value = params && params.id ? params.id : '1584863712586579969'
    getDetail()
  }
  //获取详情页数据
  const getDetail = () => {
    detailManager.getMediaDetail(currenId.value).then((res:IMedia) => {
      console.log(res,'getDetailgetDetailgetDetail') 
      media = res
      media.mediaSeriesType = 1 //设置选集类型
      mediaInfoRef.value?.init(media) //初始化基本介绍板块数据
      nextTick(async () => {
        //加载waterfall 板块数据
        //获取播放历史
        // detailManager.getRecordData(media.id, deviceId, 'history').then((result) => {
        //   if(result){
        //     media.history = result
        //     currentPlayIndex = Math.min(Math.max((Number(result.episode)||0)-1, 0), Math.max(media.episodes-1, 0))
        //     media._prevPlayIndex = currentPlayIndex
        //   }else{
        //     currentPlayIndex = 0
        //     media._prevPlayIndex = currentPlayIndex
        //   }
        // }).catch(() => {
        //   currentPlayIndex = 0
        //   media._prevPlayIndex = currentPlayIndex
        // })
        // mediaPlayerRef.value?.play(media)
        //延迟加载相关推荐列表数据更新相关推荐板块 不影响主页面展示速度
        // getRecommendList(media.id)
        isShowSkeleton.value = false
      })
    })
  }

  const onTopBtnFocus = () => {}
  const emStartPlayFn = () => {}
  const onOverFn = () => {}

  const onWaterfallItemClick = () => {}

  const onESResume = () => {}
  const onESRestart = () => {}
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
    router.back()
    return true
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
    