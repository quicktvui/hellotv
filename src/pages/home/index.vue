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

import TopView from '../../components/top-view.vue'
import WaterfallTabs from './components/waterfall-tabs.vue'

defineExpose({

})
</script>

<style lang='scss' src='./scss/home.scss'>

</style>
