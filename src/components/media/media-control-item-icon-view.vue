<template>
  <qt-view class="media-control-item-icon-root-css"
           eventClick eventFocus
           :sateBackgroundPadding="[30, 30]"
           :focusable="true">
    <div class="media-control-item-icon-div-css"
         :duplicateParentState="true" :focusable="false">
      <img class="media-control-item-icon-css"
           :duplicateParentState="true" :focusable="false" showOnState="normal" src="${iconNormal}"/>
      <img class="media-control-item-icon-css"
           :duplicateParentState="true" :focusable="false" showOnState="selected" src="${iconNormal}"/>
      <img class="media-control-item-icon-css"
           :duplicateParentState="true" :focusable="false" showOnState="focused" src="${iconFocus}"/>
    </div>
    <qt-text class="media-control-item-txt-css"
             :focusable="false"
             autoWidth
             gravity="center"
             :ellipsizeMode="3"
             :duplicateParentState="true"
             :fontSize="30"
             :lines="1"
             text="${name}"
    />

  </qt-view>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core"
import { ESLogLevel, useESLog } from "@extscreen/es3-core"

export default defineComponent({
  name: "media-control-item-icon-view",
  setup(props, context) {
    const log = useESLog()

    return {}
  }
})
</script>

<style>
.media-control-item-icon-root-css {
  height: 72px;
  width:165px;
  background-color: rgba(48,48,48,0.9);
  focus-background-color:#FFFFFF;
  border-radius: 45px;
  padding-left: 30px;
  padding-right: 30px;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

.media-control-item-icon-root-css .media-control-item-icon-div-css {
  width:36px;
  height:36px;
  background-color: transparent;
}

.media-control-item-icon-root-css .media-control-item-icon-css {
  width:36px;
  height:36px;
  position: absolute;
}

.media-control-item-icon-root-css .media-control-item-txt-css {
  height: 72px;
  margin-left: 9px;
  color:#BFBFBF;
  focus-color:#000000;
}
</style>
