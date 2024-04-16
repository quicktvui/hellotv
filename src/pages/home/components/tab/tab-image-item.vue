<template>
  <div class="tab-list-item-root-css"
       flexStyle="${imageStyle}"
       :focusable="true"
       :clipChildren="false"
       :focusScale="1.05"
       eventClick
       eventFocus>
    <img class="tab-list-item-image-css" flexStyle="${imageStyle}"
         :duplicateParentState="true" showOnState="normal" src="${image}"/>
    <img class="tab-list-item-image-css" flexStyle="${imageStyle}"
         :duplicateParentState="true" showOnState="focused" src="${focusedImage}"/>
    <img class="tab-list-item-image-css" flexStyle="${imageStyle}"
         :duplicateParentState="true" showOnState="selected" src="${selectedImage}"/>
  </div>

</template>

<script lang="ts">

import { defineComponent } from '@vue/runtime-core';

export default defineComponent({
    name: 'tab-image-item',
    setup() {
        return {}
    }
})
</script>

<style scoped>
.tab-list-item-root-css {
    display: flex;

    background-color: red;
}

.tab-list-item-image-css {
  resizeMode: contain;
  position: absolute;
  background-color: transparent;
}

</style>
