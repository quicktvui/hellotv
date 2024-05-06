<template>
  <div layout="${layout}"
       flexStyle="${style}"
       :focusable="true"
       :clipChildren="false"
       eventClick
       eventFocus
       class="page-state-image-item-root">
    <img class="page-state-image-item-image"
         :duplicateParentState="true"
         postDelay="100"
         :focusable="false"
         showOnState="normal"
         :enableFocusBorder="false"
         flexStyle="${style}"
         src="${image}"/>
    <img class="page-state-image-item-image"
         :duplicateParentState="true"
         postDelay="100"
         :focusable="false"
         showOnState="selected"
         :enableFocusBorder="false"
         flexStyle="${style}"
         src="${selectedImage}"/>
    <img class="page-state-image-item-image"
         :duplicateParentState="true"
         postDelay="100"
         :focusable="false"
         :enableFocusBorder="false"
         showOnState="focused"
         flexStyle="${style}"
         src="${focusedImage}"/>
    <qt-view class="page-state-image-item-play-mark"
             :focusable="false" :showOnState="['selected','focused']" :duplicateParentState="true">
      <play-mark :style="{width:'30px',height:'30px'}" showIf="${isShowPlayMark==true}"
                 :markColor="'#FF4E46'" :gap="-1" style="margin-left: 16px;" :focusable="false"/>
    </qt-view>
  </div>
</template>

<script lang="ts">

import {defineComponent,} from '@vue/runtime-core';

export default defineComponent({
  name: 'page-state-image-item',
  setup() {
    return {};
  },
});
</script>

<style scoped>
.page-state-image-item-root {
  position: absolute;
  background-color: transparent;
  focus-scale: 1.1;
  overflow: hidden;
}

.page-state-image-item-image {
  background-color: transparent;
  z-index: 899;
  position: absolute;
  border-radius: 8px;
}

.page-state-image-item-play-mark{
  width: 55px;
  height: 40px;
  background-color: transparent;
  position: absolute;
  z-index: 1000;
  right: 10px;
  bottom: 12px;}
</style>
