<template>
  <qt-view class="screen-left-item-img-root-css"
           :style="{width:(leftRootWidth-20)+'px',height:leftItemHeight+'px'}"
           name="screen-left-item-tag"
           eventFocus
           :focusable="true"
           :clipChildren="false" :focusScale="1.06">
    <img class="screen-left-item-img" :style="{width:(leftRootWidth-20)+'px',height:leftItemHeight+'px'}"
         :duplicateParentState="true" :focusable="false" showOnState="normal" src="${normalImg}"/>
    <img class="screen-left-item-img" :style="{width:(leftRootWidth-20)+'px',height:leftItemHeight+'px'}"
         :duplicateParentState="true" :focusable="false" showOnState="selected" src="${selectedImg}"/>
    <img class="screen-left-item-img" :style="{width:(leftRootWidth-20)+'px',height:leftItemHeight+'px'}"
         :duplicateParentState="true" :focusable="false" showOnState="focused" src="${focusedImg}"/>
  </qt-view>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/runtime-core"
import {ESLogLevel, useESLog} from "@extscreen/es3-core";
import FilterConfig from "../build_data/FilterConfig"

export default defineComponent({
  name: "tags-img-item",
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
