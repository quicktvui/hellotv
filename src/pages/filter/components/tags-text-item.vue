<template>
  <div class="screen-left-item-tags-root-css"
       eventFocus
       name="screen-left-item-tag"
       :focusable="true"
       :clipChildren="false"
       :sateBackgroundPadding="[10, 10]" :focusScale="1.06">
    <div class="screen-left-item-tags-bg" :duplicateParentState="true" showOnState="focused" :focusable="false"
         :gradientBackground="{colors:['#F5F5F5','#F5F5F5'], cornerRadii4: [0, 8, 8, 0], orientation: 6}"/>
    <qt-text class="screen-left-item-tags-text"  gravity="center" :duplicateParentState="true"
             :lines="1" :fontSize="36" text="${showName}" />
  </div>
</template>

<script lang="ts">
import {defineComponent} from "@vue/runtime-core";
import {ESLogLevel, useESLog} from "@extscreen/es3-core";
import {ref} from "vue";

export default defineComponent({
  name: "tags-text-item",
  setup(props, context) {
    const log = useESLog()


    return {
    }
  }
})
</script>

<style src="../css/tags-left-item.css">

</style>
