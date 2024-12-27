<template>
  <qt-view class='media-loading-component-root-css' :focusable='false'>
    <qt-view class='media-loading-component-root-css' :focusable='false' :visible='show'>
      <p class='loading-tips'>{{ `视频正在加载中...${netTips}` }}</p>
    </qt-view>
  </qt-view>

</template>

<script lang='ts' setup name='MediaLoadingComponent'>
import { EventBus } from '@extscreen/es3-vue'
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { showNetSpeed, stopNetSpeed } from '../build-data/media-control-adapter'

const show = ref<boolean>(false)
const netTips = ref<string>('')
onMounted(() => {
  EventBus.$on('NetSpeed', onNetWorkTipChanged)
})
onBeforeUnmount(() => {
  EventBus.$off('NetSpeed')
})
const onNetWorkTipChanged = (e) => {
  const mb = Number(e.speedMbps)
  const kb = Number(e.speedKbps)
  netTips.value = mb >= 1 ? mb + 'MB/s' : kb + 'KB/s'
}
const showLoading = () => {
  show.value = true
  showNetSpeed()
}
const dismissLoading = () => {
  show.value = false
  stopNetSpeed()
}
defineExpose({ showLoading,dismissLoading })

</script>

<style lang='scss' src='./scss/media-loading.scss'>

</style>
