<template>
  <div class='waterfall-tabs-root-css' :clipChildren='false' :clipPadding='false'>
    <!--    背景图-->
    <bg-animation ref='waterfallBg' style='position: absolute' :focusable='false' />
    <bg-animation ref='waterfallLogo4kRef' class='waterfall-tabs-4k-logo'
                  :bgStyle='{width:"240px",height:"84px"}' :focusable='false'
                  :transitionTime='200' />

    <div ref='waterfallTopRef' name='waterfallTopView' sid='waterfallTopSid'
         class='waterfall-top-view' :clipChildren='false'
         :blockFocusDirections='["left", "right", "up"]'>
      <slot name='topView'/>
    </div>

  </div>

</template>

<script lang='ts' setup name='WaterfallTabs'>

import BgAnimation from '../../../components/bg-animation.vue'

defineExpose({})

</script>

<style lang='scss'>
@import "../scss/waterfall-tabs";

</style>
