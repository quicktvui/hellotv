<template>
  <div layout="${layout}"
       flexStyle="${style}"
       :focusable="true"
       :clipChildren="false"
       eventClick
       eventFocus
       class="page-no-frame-item-root">
    <img class="page-no-frame-item_img"
         :duplicateParentState="true"
         postDelay="100"
         :focusable="false"
         :enableFocusBorder="false"
         flexStyle="${style}"
         src="${image}"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "@vue/runtime-core";

export default defineComponent({
  name: "page-no-frame-item",
  setup(props, context) {
    return {
    }
  }
})
</script>

<style scoped>
.page-no-frame-item-root {
  position: absolute;
  background-color: transparent;
  focus-scale: 1.1;
  overflow: hidden;
}
.page-no-frame-item_img {
  background-color: transparent;
  z-index: 899;
  position: absolute;
  border-radius: 8px;
}
</style>
