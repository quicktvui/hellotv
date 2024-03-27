<template>
  <qt-view class="filter-record-item-root" :focusable="false" autoWidth>
    <qt-text class="filter-record-item-text"  :focusable="false"
             :fontSize="30"
             gravity="center" autoWidth text="${recordFilterName}"/>

  </qt-view>
</template>

<script lang="ts">
import {defineComponent} from "@vue/runtime-core";
import {ESLogLevel, useESLog} from "@extscreen/es3-core";

export default defineComponent({
  name: "tags-filter-record",
  setup(props, context) {
    const log = useESLog()

    return {}
  }
})
</script>

<style src="../css/right-filter.css">

</style>
