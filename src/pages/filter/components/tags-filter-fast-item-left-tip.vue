<template>
  <qt-view style="background-color: transparent" flexStyle="${fastFilterTipStyle}" :focusable="false">
    <qt-text flexStyle="${fastFilterTipStyle}"
             style="color:rgba(255, 255, 255, .5);background-color: transparent"
             :fontSize="30"
             :lines="1"
             :focusable="false"
             gravity="center"
             text="${fastFilterTip}"
    />
  </qt-view>

</template>

<script lang="ts">
import {defineComponent} from "@vue/runtime-core";
import {ESLogLevel, useESLog} from "@extscreen/es3-core";

export default defineComponent({
  name: "tags-filter-fast-item-left-tip",
  setup(props, context) {
    const log = useESLog()

    return {}
  }
})
</script>

<style>

</style>
