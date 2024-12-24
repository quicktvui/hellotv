<template>
  <qt-vue-section>
    <top-view :logoRight='true'></top-view>
  </qt-vue-section>
</template>

<script setup lang='ts' name='HeaderSection'>
  import { ref } from 'vue'
  import { ESKeyEvent } from '@extscreen/es3-core'
  import { QTIViewVisibility, QTIWaterfall, QTWaterfallItem } from '@quicktvui/quicktvui3'
  import TopView from '../../../../components/top-view.vue'
</script>
  
<style lang='scss' scoped>
  
</style>
