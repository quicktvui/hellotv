<template>
  <div class='home-root-css' ref='homeRef'>
    <waterfall-tabs ref='homeWaterTabRef'>
      <template #topView>
        <top-view :logoRight='true' downSid='tabNavBarSid'>
        </top-view>
      </template>
    </waterfall-tabs>

  </div>

</template>

<script setup lang='ts' name='index'>

import { ESKeyEvent } from '@extscreen/es3-core'
import { ref } from 'vue'
import TopView from '../../components/top-view.vue'
import WaterfallTabs from './components/waterfall-tabs.vue'

const homeWaterTabRef = ref()

const onESCreate = (params) => {
  homeWaterTabRef.value?.onESCreate(params)
}
const onESRestart = () => {
  homeWaterTabRef.value?.onESRestart()
}
const onESPause = () => {
  homeWaterTabRef.value?.onESPause()
}
const onESStop = () => {
  homeWaterTabRef.value?.onESStop()
}
const onESResume = () => {
  homeWaterTabRef.value?.onESResume()
}
const onESDestroy = () => {
  homeWaterTabRef.value?.onESDestroy()
}
const onKeyDown = (keyEvent: ESKeyEvent) => {
  homeWaterTabRef.value?.onKeyDown(keyEvent)
}
const onKeyUp = (keyEvent: ESKeyEvent) => {
  homeWaterTabRef.value?.onKeyUp(keyEvent)
}
const onBackPressed = () => {
  homeWaterTabRef.value?.onBackPressed()
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

<style lang='scss' src='./scss/home.scss'>

</style>
