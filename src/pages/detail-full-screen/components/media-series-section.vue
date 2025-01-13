<template>
  <qt-view class="media-series-section" :clipChildren="false">
    
  </qt-view>
</template>

<script setup lang='ts' name='media-series-section'>
// import { ref } from 'vue'
// import { useESRuntime } from '@extscreen/es3-core'
// import { QTMediaSeries} from '@quicktvui/quicktvui3'
import { IMedia} from '../adapter/interface'
// import detailManager from '../api/inidex'
// import ThemeConfig from "../../../config/theme-config";
  
  //**************************初始化入口**************************
  const init = async (media: IMedia) => {
    
  }

  defineExpose({
    init,
  })
</script>

<style lang='scss' scoped>
.media-series-section {
  width: 1920px;
  background-color: transparent;
}
</style>
  