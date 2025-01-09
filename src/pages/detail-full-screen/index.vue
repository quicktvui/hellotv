<template>
  <div class='detail-full-screen' ref='detailRef'>
    <!-- 播放器 -->
    <media-player ref="mediaPlayerRef" @emStartPlay="emStartPlayFn" @onOver="onOverFn" />      
  </div>
</template>
    
<script setup lang='ts' name='detail-full-screen'>
import { ref } from 'vue'
import {
ESKeyCode,
ESKeyEvent,
ESLogLevel,
toast,
useESEventBus,
useESLog,
useESRuntime,
} from '@extscreen/es3-core'
import { useESRouter } from '@extscreen/es3-router'
import MediaPlayer from "./components/media-player.vue";

  const TAG = 'DetailFullScreen'
  const log = useESLog()
  const runtime = useESRuntime()
  const router = useESRouter()
  const mediaPlayerRef = ref()
  let currenId = ref('')
  
  //  生命周期
  //  ***************************初始化入口 onESCreate***************************
  const onESCreate = (params) => {
    currenId.value = params && params.id ? params.id : '1584863712586579969'
  }
  const emStartPlayFn = () => {}
  const onOverFn = () => {}

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
    