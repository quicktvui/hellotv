<template>
  <qt-view class="screen-left-item-tags-root-css"
       name="screen-left-item-tag"
       eventFocus
       :focusable="true"
       :clipChildren="false"
       :sateBackgroundPadding="[10, 10]"
       :focusScale="1.06">
    <qt-view class="screen-left-item-tags-bg" :duplicateParentState="true" showOnState="focused" :focusable="false"
         :gradientBackground="{colors:['#F5F5F5','#F5F5F5'], cornerRadii4: [0, 8, 8, 0], orientation: 6}"/>

    <qt-view class="screen-left-item-tags-icon-div" :duplicateParentState="true" :focusable="false">
      <img class="screen-left-item-tags-icon" :duplicateParentState="true" showOnState="normal" :src="iconNormal" />
      <img class="screen-left-item-tags-icon" :duplicateParentState="true" showOnState="focused" :src="iconFocus" />
      <img class="screen-left-item-tags-icon" :duplicateParentState="true" showOnState="selected" :src="iconSelected" />
    </qt-view>
    <qt-text class="screen-left-item-tags-text"
             :focusable="false"
             gravity="center"
             autoWidth
             :ellipsizeMode="3"
             :duplicateParentState="true"
             :fontSize="36"
             :lines="1"
             text="${showName}" />
  </qt-view>
</template>

<script lang="ts">
import {defineComponent} from "@vue/runtime-core";
import {ESLogLevel, useESLog} from "@extscreen/es3-core";
import {ref} from "vue";

export default defineComponent({
  name: "tags-text-icon-item",
  setup(props, context) {
    const log = useESLog()
    const iconNormal = ref(require("../../../assets/ic_screen_normal.png").default)
    const iconFocus = ref(require("../../../assets/ic_screen_focus.png").default)
    const iconSelected = ref(require("../../../assets/ic_screen_select.png").default)
    function onESCreate(params) {

    }

    function onESStart() {

    }

    function onESRestart() {

    }

    function onESResume() {

    }

    function onESPause() {

    }

    function onESStop() {

    }

    function onESDestroy() {

    }

    return {
      onESCreate,
      onESStart,
      onESResume,
      onESPause,
      onESStop,
      onESRestart,
      onESDestroy,
      iconNormal,
      iconFocus,
      iconSelected
    }
  }
})
</script>

<style src="../css/tags-left-item.css">
</style>
