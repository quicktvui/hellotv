<template>
  <div class='media-loading-view-root-css'
       :style='{width:`${playerWidth}px`,height:`${playerHeight}px`}'
       :blockFocusDirections='["left", "right", "down", "up"]'
       :focusable='false'
  >
    <media-loading-component ref='mediaLoadingRef'/>
  </div>

</template>

<script lang='ts'>
import { ESPlayerInfo } from '@extscreen/es3-player'
import { ESMediaItem } from '@extscreen/es3-player-manager'
// import { RouteRecordName, useESRoute } from '@extscreen/es3-router'
import { defineComponent, ref } from 'vue'
// import { ESLogLevel, useESEventBus, useESLog } from '@extscreen/es3-core'
// import MediaConfig from '../../../../components/media/build-data/media-config'
import MediaLoadingComponent from '../../../../components/media/view/media-loading-component.vue'

export default defineComponent({
  name: 'full-player-loading',
  components: { MediaLoadingComponent },
  setup(props, context) {
    // const log = useESLog()
    // const route = useESRoute()
    // const esEventBus = useESEventBus()

    const mediaLoadingRef = ref()

    const playerWidth = ref<number>(0)
    const playerHeight = ref<number>(0)
    let isBuffStart = -1
    const onPlayerPlayMedia = (mediaItem: ESMediaItem) => {
      mediaLoadingRef.value?.showLoading()
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
    return {
      mediaLoadingRef,
      playerWidth,
      playerHeight,
      onPlayerPlayMedia,
      onPlayerInfo,
      onPlayerPlaying,
      onPlayerBufferStart,
      onPlayerBufferEnd
    }
  }
})
</script>

<style lang='scss' src='../../../../components/media/view/scss/media-loading.scss'>

</style>
