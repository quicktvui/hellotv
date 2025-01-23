<template>
  <qt-view :focusable="true" :focusScale="1.1" @click="onClick" :nextFocusName="nextFocusNames" :class="searchBtnClass">
    <div class="search_keyboard_option_btn_focus"
         :gradientBackground="{ orientation: 6, colors: ['#FF0057FF', '#FF00C7FF'], cornerRadius: 99 }"
         showOnState="focused" :duplicateParentState="true"></div>      
    <qt-view :style="{ width: iconWidth + 'px', height: iconHeight + 'px' }" :duplicateParentState="true" :focusable="false">
      <qt-image :style="{ width: iconWidth + 'px', height: iconHeight + 'px', position: 'absolute' }" :src="iconNormal" :focusable="false"/>
      <!-- <qt-image :style="{width:iconWidth+'px',height:iconHeight+'px',position:'absolute'}" :src="iconNormal" :showOnState="['normal', 'selected']" :duplicateParentState="true" :focusable="false"/>
      <qt-image :style="{width:iconWidth+'px',height:iconHeight+'px',position:'absolute'}" :src="iconFocus" showOnState="focused" :duplicateParentState="true" :focusable="false"/> -->
    </qt-view>
    <qt-text :duplicateParentState="true" :class="searchTxtClass" :text="text" gravity="center" :fontSize="fontSize" :focusable="false"/>
  </qt-view>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core"
import { ESLogLevel, useESLog } from "@extscreen/es3-core"

export default defineComponent({
  name: "search-btn",
  props: {
    nextFocusNames: {},
    searchBtnClass: String,
    searchTxtClass: String,
    iconWidth: {
      type: Number,
      default: 0
    },
    iconHeight: {
      type: Number,
      default: 0
    },
    iconNormal: {
      type: String,
      default: ""
    },
    iconFocus: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: ""
    },
    fontSize: {
      type: Number,
      default: 0
    }
  },
  emits: ["click"],
  setup(props, context) {
    const log = useESLog()

    const onClick = (e) => {
      context.emit("click", e)
    }

    return {
      onClick,
    }
  }
})
</script>

<style></style>
