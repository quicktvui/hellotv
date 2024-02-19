<template>
  <div :class="['tab-icon-nav-item-root-css',
  {
    'tab-icon-nav-item-root-text-icon-left-css':textIconLeft,
    'tab-icon-nav-item-root-text-icon-right-css':textIconRight
  }]"
       :type="3"
       slot="navItem"
       eventFocus
       :focusable="true"
       autoWidth
       :sateBackgroundPadding="[10, 10]"
       :clipChildren="false">
    <div autoWidth
         :focusable="false"
         showIf="${isTabBgShow==true}"
         class="tab-icon-nav-item-group-bg-css"
         gradientBackground="${tabBg}"/>
    <div class="tab-icon-nav-item-focus-css" :duplicateParentState="true" showOnState="focused" autoWidth :focusable="false"/>
    <div :duplicateParentState="true"
         :class="['tab-icon-nav-item-icon-default-css',
         {'tab-icon-nav-item-icon-left-css':cornerIconLeft,
         'tab-icon-nav-item-icon-right-css':cornerIconRight}]" :focusable="false">
      <img style="width: 73px;height:22px;position: absolute;"
           :duplicateParentState="true" showOnState="normal" src="${tabCorner}">
      <img style="width: 73px;height:22px;position: absolute;"
           :duplicateParentState="true" showOnState="focused" src="${tabCornerFocus}">
      <img style="width: 73px;height:22px;position: absolute;"
           :duplicateParentState="true" showOnState="selected" src="${tabCornerFocus}">
    </div>
    <img :class="[ 'tab-icon-nav-item-text-icon-default-css',
      { 'tab-icon-nav-item-text-icon-left-css':textIconLeft,
      'tab-icon-nav-item-text-icon-right-css':textIconRight }]"
      src="${textIcon}"/>
    <qt-text
      autoWidth
      gravity="center"
      :lines="1"
      :fontSize="44"
      class="tab-icon-nav-item-text-css"
      :duplicateParentState="true"
      text="${text}"/>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "@vue/runtime-core";

export default defineComponent({
  name: "tab-text-icon-item",
  props:{
    cornerIconLeft:Boolean,
    cornerIconRight:Boolean,
    textIconLeft:Boolean,
    textIconRight:Boolean,
  },
  setup(props, context) {
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
    }
  }
})
</script>

<style scoped>
.tab-icon-nav-item-root-css {
  padding-left: 40px;
  padding-right: 40px;
  height: 70px;
  display: flex;
  border-radius: 35px;
  background-color: transparent;
  justify-content: center;
  align-items: center;
}
.tab-icon-nav-item-root-text-icon-left-css {
  flex-direction: row;
}
.tab-icon-nav-item-root-text-icon-right-css {
  flex-direction: row-reverse;
}
.tab-icon-nav-item-group-bg-css{
  background-color: transparent;
  height: 70px;
  position: absolute;
  left: -0.1px;
  top:1px;
  bottom: 1px;
  right: -0.1px;
  z-index: -1000;
}
.tab-icon-nav-item-focus-css {
  position: absolute;
  height: 70px;
  left:0.1px;
  top: 0.1px;
  right: 0.1px;
  bottom: 0.1px;
  display: flex;
  border-radius: 35px;
  background-color: #f5f5f5;
  justify-content: center;
}
.tab-icon-nav-item-icon-default-css{
  width: 73px;
  height:22px;
  position: absolute;
  top: -10px;
  background-color: transparent;
}
.tab-icon-nav-item-icon-left-css{
  left: 10px;
}
.tab-icon-nav-item-icon-right-css{
  right:10px;
}
.tab-icon-nav-item-text-icon-default-css {
  width: 32px;
  height: 32px;
}
.tab-icon-nav-item-text-icon-left-css{
  margin-right: 10px;
}
.tab-icon-nav-item-text-icon-right-css{
  margin-left: 10px;
}
.tab-icon-nav-item-text-css {
  height: 60px;
  color: rgba(255, 255, 255, 0.5);
  focus-color: black;
  background-color: transparent;
  select-color: white;
  align-self: center;
}
</style>
