<template>
  <qt-view class="filter-record-item-root"
           :style="{height:filterRecordHeight+'px'}"
           :focusable="false" autoWidth>
    <qt-text class="filter-record-item-text"
             :style="{height:filterRecordHeight+'px'}"
             :focusable="false"
             :fontSize="30"
             gravity="center" autoWidth text="${recordFilterName}"/>

  </qt-view>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/runtime-core"
import {ESLogLevel, useESLog} from "@extscreen/es3-core";
import FilterConfig from "../build_data/FilterConfig"

export default defineComponent({
  name: "tags-filter-record",
  setup(props, context) {
    const filterRecordHeight = computed(()=>{return FilterConfig.filterRecordHeight})
    const log = useESLog()

    return {filterRecordHeight}
  }
})
</script>

<style src="../css/right-filter.css">

</style>
