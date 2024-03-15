<template>
    <qt-view class="filter-fast-item-root"
             name="filter_fast_item"
             autoWidth
             eventClick
             eventFocus
             :focusable="true">
        <qt-text class="filter-fast-item-text"
                 :duplicateParentState="true"
                 :fontSize="30" gravity="center"
                 autoWidth text="${filterShowName}"/>
    </qt-view>
</template>

<script lang="ts">
import {defineComponent} from "@vue/runtime-core";
import {ESLogLevel, useESLog} from "@extscreen/es3-core";

export default defineComponent({
  name: "tags-filter-fast-item",
  setup(props, context) {
    const log = useESLog()

    return {

    }
  }
})
</script>

<style src="../css/right-filter.css">

</style>
