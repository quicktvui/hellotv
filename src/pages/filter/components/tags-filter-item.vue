<template>
  <qt-view class="filter-line-item-root"
           :style="{height:filterHeight+'px'}"
           name="filter_line_item"
           autoWidth
           eventClick
           eventFocus
           :focusable="true">
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
