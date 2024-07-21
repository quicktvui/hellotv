<template>
  <item-frame 
    :type="hPosterType" layout="${layout}" flexStyle="${style}" focusScale="${focus.scale}" 
    :focusable="true" eventClick eventFocus name="hc_poster_frame_name" 
    class="hc_poster_frame" itemShowShimmer="${shimmer.enable}"
    hideShadow="${shadow.enable}" shimmerSize="${shimmer.size}"
    keyName="_id"
  >
    <div class="hc_poster" flexStyle="${style}" :focusable="false" duplicateParentState>
      <div class="hc_poster_inner" flexStyle="${style}" :focusable="false" duplicateParentState>
        <img
        class="hc_poster_img" :postDelay="300" enableFade :focusable="false"
        flexStyle="${image.style}" src="${image.src}"
        :style="{borderRadius: `${borderRadius}px`}"/>
        <HposterTitle :focusable="false" duplicateParentState/>
      </div>
      <div 
        class="hc_poster_cover" flexStyle="${coverStyle}" 
        :focusable="false" duplicateParentState
        :style="{borderRadius: `${borderRadius}px`}"></div>
    </div>
  </item-frame>
</template>

<script lang="ts" setup>
import HposterTitle from './HposterTitle.vue'
import {hPosterType} from './configs'
withDefaults(defineProps<{
  borderRadius?:number
}>(),{
  borderRadius: 8
})
</script>

<style scoped>
.hc_poster {
  position: relative;
  background-color: transparent;
}
.hc_poster_inner {
  position: absolute;
  left: 0.01px;
  top: 0.01px;
  z-index: 2;
  background-color: transparent;
}
.hc_poster_cover {
  position: absolute;
  left: 0.01px;
  top: 0.01px;
  background-color: transparent;
  z-index: 10;
  focus-border-style: solid;
}
</style>