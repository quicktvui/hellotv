<template>
  <qt-view class="filter-line-item-root"
           :style="{height:filterHeight+'px'}"
           name="filter_line_item"
           autoWidth
           eventClick
           eventFocus
           :focusable="true">
    <div class="filter-line-item-focus" :style="{height:filterHeight+'px'}" autoWidth
         :duplicateParentState="true" showOnState="focused" :focusable="false"
         :gradientBackground="{colors:['#0057FF','#00C7FF'], cornerRadii4: [30, 30, 30, 30], orientation: 6}"/>
    <qt-text class="filter-line-item-text"
             :style="{height:filterHeight+'px'}"
             :duplicateParentState="true"
             :fontSize="30" gravity="center"
             autoWidth text="${filterShowName}"/>
  </qt-view>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/runtime-core"
import {ESLogLevel, useESLog} from "@extscreen/es3-core";
import FilterConfig from "../build_data/FilterConfig"

export default defineComponent({
  name: "tags-filter-item",
  setup(props, context) {
    const filterHeight = computed(()=>{return FilterConfig.filterTextHeight})
    const log = useESLog()



    return {
      filterHeight
    }
  }
})
</script>

<style src="../css/right-filter.css">

</style>
