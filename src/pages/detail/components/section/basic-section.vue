<template>
  <qt-column 
    class="basic-section-root"
    :style="{ height: sectionHeight }"
    :scrollOverride="{ down: 0, up: -1080 }"
    :clipChildren="false"
    :clipPadding="false">
    <!-- 简介-->
    <introduction
      :blockFocusDirections="['up']"
      ref="introductionRef"
      @onIntroductionFocus="onIntroductionFocus">
    </introduction>
  </qt-column>
</template>

<script setup lang='ts' name='BasicSection'>
import { ref } from 'vue'
import { ESKeyEvent } from '@extscreen/es3-core'
import { QTIViewVisibility, QTIWaterfall, QTWaterfallItem } from '@quicktvui/quicktvui3'
import TopView from '../../../../components/top-view.vue'

  const sectionHeight = ref<number>(550)
  const onIntroductionFocus = () => {}

</script>

<style lang='scss' scoped>
.basic-section-root {
  width: 1920px;
}
</style>
  