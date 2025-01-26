<template>
  <div class='home-root-css' ref='homeRef'>
    <waterfall-tabs ref='homeWaterTabRef'>
      <template #topView>
        <top-view downSid='tabNavBarSid'>
          <template #topOtherBtn>
            <div class='home-resource-root'
                 :focusScale='ThemeConfig.placeHolderFocusScale'
                 :focusable='true'
                 @click='resourceClick'>
              <img class='home-resource-img' :src='resourceImg' />
            </div>

          </template>
        </top-view>
      </template>
    </waterfall-tabs>

  </div>

</template>

<script setup lang='ts' name='index'>

import { ESKeyEvent } from '@extscreen/es3-core'
import { ref } from 'vue'
import TopView from '../../components/top-view.vue'
import launch from '../../tools/launch'
import { TopResource } from './adapter/exit/home-exit-imp'
import homeManager from './api'
import WaterfallTabs from './components/waterfall-tabs.vue'
import ThemeConfig from '../../config/theme-config'

const homeWaterTabRef = ref()
let resourceImg = ref("")
let topResource:TopResource

const onESCreate = (params) => {
  homeWaterTabRef.value?.onESCreate(params)
  homeManager.getHomeResource().then((res:TopResource)=>{
    if (res && res.url){
      topResource = res
      resourceImg.value = res.url
    }
  })
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
  if (homeWaterTabRef.value?.onBackPressed()){
    return true
  }
  launch.launchExitDialog()
}
const resourceClick = ()=>{
  if (topResource.jumpParams){
    launch.launch(topResource.jumpParams)
  }
}
defineExpose({
  onESCreate,
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
