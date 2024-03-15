<template>
  <qt-view class="filter-line-item-root"
           name="filter_line_item"
           autoWidth
           eventClick
           eventFocus
           :focusable="true">
    <qt-text class="filter-line-item-text"
             :duplicateParentState="true"
             :fontSize="30" gravity="center"
             autoWidth text="${filterShowName}"/>
  </qt-view>
</template>

<script lang="ts">
import {defineComponent} from "@vue/runtime-core";
import {ESLogLevel, useESLog} from "@extscreen/es3-core";

export default defineComponent({
  name: "tags-filter-item",
  setup(props, context) {
    const log = useESLog()



    return {

    }
  }
})
</script>

<style src="../css/right-filter.css">

</style>
