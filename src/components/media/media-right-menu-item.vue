<template>
  <qt-view class="media-right-menu-item-root-css"
           eventClick eventFocus
           :focusable="true">
    <qt-text class="media-right-menu-item-text-css" :duplicateParentState="true"
             :paddingRect="[30,0,0,0]" :focusable="false"
    :fontSize="30" gravity="center|start" :lines="1" text="${text}"/>
      <img class="media-right-menu-item-icon-css"  showIf="${iconState==true}" :focusable="false"
           duplicateParentState :src="normalIcon"/>
      <img class="media-right-menu-item-icon-css"  showOnState="focused" :focusable="false"
           duplicateParentState :src="focusIcon"/>
  </qt-view>

</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core"
import { ESLogLevel, useESLog } from "@extscreen/es3-core"
import normalIcon from '../../assets/def_media/ic_def_media_menu_item_normal.png'
import focusIcon from '../../assets/def_media/ic_def_media_menu_item_focus.png'

export default defineComponent({
  name: "media-right-menu-item",
  setup(props, context) {
    const log = useESLog()

    return {
      normalIcon,
      focusIcon
    }
  }
})
</script>

<style>
.media-right-menu-item-root-css {
  width: 564px;
  height: 102px;
  border-radius: 9px;
  background-color: #303030;
  focus-background-color:#FFFFFF;
}

.media-right-menu-item-text-css {
  position: absolute;
  left: 0.1px;
  top: 0.1px;
  width: 564px;
  height: 102px;
  color:#FFFFFF;
  focus-color:#000000;
  select-color:#FF5E90;
  background-color: transparent;
}
.media-right-menu-item-icon-css {
  right: 30px;
  top: 40px;
  position: absolute;
  width: 24px;
  height:15px;
  background-color: transparent;
}
</style>
