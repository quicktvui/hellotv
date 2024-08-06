<template>
  <div class="tab-placeholder-item-root-css"
       layout="${layout}"
       flexStyle="${style}"
       :focusable="false"
       :disablePlaceholder="false"
       :enableFocusBorder="false">
    <img class="tab-placeholder-item-img"
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
  name: "page-place-holder-item",
  setup(props, context) {
    return {
    }
  }
})
</script>

<style scoped>
.tab-placeholder-item-root-css {
  position: absolute;
  background-color: transparent;
  z-index: 1;
  display: flex;
}
.tab-placeholder-item-img {
  background-color: transparent;
  z-index: 899;
  position: absolute;
  border-radius: 20px;
}
</style>
