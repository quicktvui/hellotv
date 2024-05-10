<template>
  <div class="screen-left-item-tags-root-css" :style="{width:(leftRootWidth-20)+'px',height:leftItemHeight+'px'}"
       eventFocus
       name="screen-left-item-tag"
       :focusable="true"
       :clipChildren="false"
       :sateBackgroundPadding="[10, 10]" :focusScale="1.06">
    <div class="screen-left-item-tags-bg" :style="{width:(leftRootWidth-20)+'px',height:leftItemHeight+'px'}"
         :duplicateParentState="true" showOnState="focused" :focusable="false"
         :gradientBackground="{colors:['#F5F5F5','#F5F5F5'], cornerRadii4: [0, 8, 8, 0], orientation: 6}"/>
    <qt-text class="screen-left-item-tags-text"  :style="{width:(leftRootWidth-20)+'px',height:leftItemHeight+'px'}"
             gravity="center" :duplicateParentState="true"
             :lines="1" :fontSize="36" text="${showName}" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/runtime-core"
import {ESLogLevel, useESLog} from "@extscreen/es3-core";
import {ref} from "vue";
import FilterConfig from "../build_data/FilterConfig"

export default defineComponent({
  name: "tags-text-item",
  setup(props, context) {
    const leftRootWidth = computed(()=>{return FilterConfig.leftListWidth})
    const leftItemHeight = computed(()=>{return FilterConfig.leftItemHeight})
    const log = useESLog()


    return {
      leftRootWidth,
      leftItemHeight
    }
  }
})
</script>

<style src="../css/tags-left-item.css">

</style>
