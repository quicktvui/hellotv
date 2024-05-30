<template>
    <qt-view class="filter-fast-item-root"
             :style="{height:filterRecordHeight+'px'}"
             name="filter_fast_item"
             autoWidth
             eventClick
             eventFocus
             :focusable="true">
      <div class="filter-fast-item-focus" :style="{height:filterRecordHeight+'px'}" autoWidth
           :duplicateParentState="true" showOnState="focused" :focusable="false"
           :gradientBackground="{colors:['#0057FF','#00C7FF'], cornerRadii4: [30, 30, 30, 30], orientation: 6}"/>
        <qt-text class="filter-fast-item-text"
                 :style="{height:filterRecordHeight+'px'}"
                 :duplicateParentState="true" :focusable="false"
                 :fontSize="30" gravity="center"
                 autoWidth text="${filterShowName}"/>
    </qt-view>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/runtime-core"
import {ESLogLevel, useESLog} from "@extscreen/es3-core";
import FilterConfig from "../build_data/FilterConfig"

export default defineComponent({
  name: "tags-filter-fast-item",
  setup(props, context) {
    const log = useESLog()
    const filterRecordHeight = computed(()=>{return FilterConfig.filterRecordHeight})

    return {
      filterRecordHeight
    }
  }
})
</script>

<style src="../css/right-filter.css">

</style>
