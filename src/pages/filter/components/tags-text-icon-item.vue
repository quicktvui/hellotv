<template>
  <qt-view class="screen-left-item-tags-root-css" :style="{width:(leftRootWidth-20)+'px',height:leftItemHeight+'px'}"
       name="screen-left-item-tag"
       eventFocus
       :focusable="true"
       :clipChildren="false"
       :sateBackgroundPadding="[10, 10]"
       :focusScale="1.06">
    <qt-view class="screen-left-item-tags-bg" :style="{width:(leftRootWidth-20)+'px',height:leftItemHeight+'px'}"
             :duplicateParentState="true" showOnState="focused" :focusable="false"
         :gradientBackground="{colors:['#0057FF','#00C7FF'], cornerRadii4: [0, 20, 20, 0], orientation: 6}"/>

    <qt-view class="screen-left-item-tags-icon-div" :duplicateParentState="true" :focusable="false">
      <img class="screen-left-item-tags-icon" :duplicateParentState="true" showOnState="normal" :src="iconNormal" />
      <img class="screen-left-item-tags-icon" :duplicateParentState="true" showOnState="focused" :src="iconFocus" />
      <img class="screen-left-item-tags-icon" :duplicateParentState="true" showOnState="selected" :src="iconSelected" />
    </qt-view>
    <qt-text class="screen-left-item-tags-text" :style="{width:(leftRootWidth-20)+'px',height:leftItemHeight+'px'}"
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
import { computed, defineComponent } from "@vue/runtime-core"
import {ESLogLevel, useESLog} from "@extscreen/es3-core";
import {ref} from "vue";
import FilterConfig from "../build_data/FilterConfig"

export default defineComponent({
  name: "tags-text-icon-item",
  setup(props, context) {
    const log = useESLog()
    const leftRootWidth = computed(()=>{return FilterConfig.leftListWidth})
    const leftItemHeight = computed(()=>{return FilterConfig.leftItemHeight})
    const iconNormal = ref(require("../../../assets/ic_screen_normal.png").default)
    const iconFocus = ref(require("../../../assets/ic_screen_select.png").default)
    const iconSelected = ref(require("../../../assets/ic_screen_select.png").default)


    return {
      iconNormal,
      iconFocus,
      iconSelected,
      leftRootWidth,
      leftItemHeight
    }
  }
})
</script>

<style src="../css/tags-left-item.css">
</style>
