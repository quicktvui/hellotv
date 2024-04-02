<template>
  <qt-view class="screen-left-item-img-root-css"
           name="screen-left-item-tag"
           eventFocus
           :focusable="true"
           :clipChildren="false" :focusScale="1.06">
    <img class="screen-left-item-img" :duplicateParentState="true" :focusable="false" showOnState="normal" src="${normalImg}"/>
    <img class="screen-left-item-img" :duplicateParentState="true" :focusable="false" showOnState="selected" src="${selectedImg}"/>
    <img class="screen-left-item-img" :duplicateParentState="true" :focusable="false" showOnState="focused" src="${focusedImg}"/>
  </qt-view>
</template>

<script lang="ts">
import {defineComponent} from "@vue/runtime-core";
import {ESLogLevel, useESLog} from "@extscreen/es3-core";

export default defineComponent({
  name: "tags-img-item",
  setup(props, context) {
    const log = useESLog()

    return {}
  }
})
</script>

<style src="../css/tags-left-item.css">

</style>
