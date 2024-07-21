<template>
  <qt-view class="media-control-item-root-css"
           eventClick
           eventFocus
           :sateBackgroundPadding="[30, 30]"
           autoWidth
           :focusable="true">
    <qt-text class="media-control-item-txt-css"
             :focusable="false"
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
  name: "media-control-item-view",
  setup(props, context) {
    const log = useESLog()

    return {}
  }
})
</script>

<style>
.media-control-item-root-css {
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

.media-control-item-root-css .media-control-item-txt-css {
  height: 72px;
  width: 210px;
  color:#BFBFBF;
  focus-color:#000000;
}
</style>
