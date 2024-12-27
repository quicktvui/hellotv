<template>
  <div class='media-loading-view-root-css'
       :style='{width:`${playerWidth}px`,height:`${playerHeight}px`}'
       :blockFocusDirections='["left", "right", "down", "up"]'
       :focusable='false'>
    <media-loading-component ref='mediaLoadingRef' />
    <div class='try-see-tip-root-css' :visible='isShowTrySee'>
      <span class='try-see-tip-header-end'>正在试看，按</span>
      <span class='try-see-tip-middle'>OK</span>
      <span class='try-see-tip-header-end'>键开通会员观看正片</span>
    </div>
  </div>

</template>

<script lang='ts' setup name='MediaLoadingView'>

import { useESEventBus } from '@extscreen/es3-core'
import { ESPlayerInfo, ESPlayerWindowType } from '@extscreen/es3-player'
import { ESMediaItem } from '@extscreen/es3-player-manager'
import { RouteRecordName, useESRoute } from '@extscreen/es3-router'
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import MediaConfig from '../build-data/media-config'
import MediaLoadingComponent from './media-loading-component.vue'

const route = useESRoute()
const esEventBus = useESEventBus()
let curRouteName: RouteRecordName | null | undefined = ''

const mediaLoadingRef = ref()

const playerWidth = ref<number>(0)
const playerHeight = ref<number>(0)
const isFullWindow = ref<boolean>(false)
const isShowTrySee = ref<boolean>(false)
const controlTrySeeShow = ref(true)
const trySee = ref(false)

//付费类型 0：免费，其他收费
let payStatus: string | number

let isBuffStart = -1

onMounted(() => {
  curRouteName = route.name
  esEventBus.on(MediaConfig.trySeeShowStateEventName, setTrySeeShowState)
})
onBeforeMount(() => {
  esEventBus.off(MediaConfig.trySeeShowStateEventName)
})
watch([()=>isFullWindow.value,()=>controlTrySeeShow.value,()=>trySee.value],(newValue)=>{
  isShowTrySee.value = newValue[0] && newValue[1] && newValue[2]
},{immediate:true})
const setTrySeeShowState = (isShow: boolean) => {
  controlTrySeeShow.value = isShow
}
const isTrySee= () =>{
  //todo 后期加入用户是否有权益的判断，有即为不用试看，无即为试看
  if (!payStatus || payStatus === 0 || payStatus === "0" || payStatus === "null"){
    trySee.value = false
  }else {
    trySee.value = true
  }
}

/**
 * 窗口类型改变 回调
 * @param windowType
 */
const onPlayerWindowTypeChanged = (windowType: ESPlayerWindowType) => {
  isFullWindow.value = (windowType == ESPlayerWindowType.ES_PLAYER_WINDOW_TYPE_FULL)
}
/**
 * 窗口尺寸改变回调
 * @param width
 * @param height
 */
const onPlayerWindowSizeChanged = (width: number, height: number) => {
  playerWidth.value = width
  playerHeight.value = height
  isFullWindow.value = (width === 1920 && height === 1080) || (width === 1280 && height === 720)

}
const onPlayerPlayMedia = (mediaItem: ESMediaItem) => {
  payStatus = mediaItem.payStatus
  if (curRouteName !== MediaConfig.HOME_ROUTE_NAME){//首页首次加载视频不展示 loading
    mediaLoadingRef.value?.showLoading()
  }
  payStatus = mediaItem.payStatus
  isTrySee()
}
const onPlayerPlaying = () => {
  mediaLoadingRef.value?.dismissLoading()
}
const onPlayerBufferStart = () => {
  if (isBuffStart === -1) {
    mediaLoadingRef.value?.showLoading()
    isBuffStart = 1
  } else {
    isBuffStart = -1
  }

}
const onPlayerBufferEnd = () => {
  if (isBuffStart === 1) {
    isBuffStart = -1
    mediaLoadingRef.value?.dismissLoading()
  } else {
    isBuffStart = 2
  }
}
const onPlayerInfo = (info:ESPlayerInfo)=>{
  if (info.infoCode === 10008 || info.infoCode === 3){
    mediaLoadingRef.value?.dismissLoading()
  }
}

defineExpose({
  onPlayerWindowTypeChanged,
  onPlayerWindowSizeChanged,
  onPlayerPlayMedia,
  onPlayerInfo,
  onPlayerPlaying,
  onPlayerBufferStart,
  onPlayerBufferEnd
})

</script>

<style lang='scss' src='scss/media-loading.scss'>

</style>
