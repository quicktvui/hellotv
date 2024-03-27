<template>
  <qt-view class="filter-fast-line-root" flexStyle="${lineStyle}" :focusable="false">
  </qt-view>
</template>

<script lang="ts">
import {defineComponent} from "@vue/runtime-core";
import {ESLogLevel, useESLog} from "@extscreen/es3-core";

export default defineComponent({
  name: "tags-filter-fast-line",
  setup(props, context) {
    const log = useESLog()

    return {}
  }
})
</script>

<style src="../css/right-filter.css">

</style>
