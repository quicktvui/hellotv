<template>
  <div :focusable="true"
       @focus="onFocus"
       @click="onClick"
       ref="menuItemRef"
       class="menu-vip-button-item-icon-css">

    <div showOnState="focused"
         class="menu-vip-button-item-focused"
         :duplicateParentState="true"
         :gradientBackground="{colors: ['#FFEEB364', '#FFFFE398'], orientation: 3, cornerRadius: 12}"/>

    <div class="menu-vip-button-item-img-root-css">
      <img class="menu-vip-button-item-img-css"
           :duplicateParentState="true"
           :focusable="false"
           showOnState="focused"
           :src="vipFocused"/>
      <img class="menu-vip-button-item-img-css"
           :duplicateParentState="true"
           :focusable="false"
           showOnState="normal"
           :src="vipNormal"/>
    </div>
    <span class="menu-vip-button-item-text-css"
          :duplicateParentState="true">{{ text }}</span>
  </div>
</template>

<script lang="ts">

import {defineComponent} from "@vue/runtime-core";
import {ref} from "vue";
import {Native} from "@extscreen/es3-vue";

import vipFocused from '../../../assets/ic_media_vip_button_focused.png'
import vipNormal from '../../../assets/ic_media_vip_button_normal.png'

export default defineComponent({
  name: "media-menu-vip-button",
  setup(props, context) {
    const focused = ref(false)
    const menuItemRef = ref()
    const text = ref<string>('付费观看')

    function onFocus(e) {
      focused.value = e.isFocused;
      context.emit("focus", e.isFocused);
    }

    function onClick(e) {
      context.emit("click");
    }

    function requestItemFocus() {
      Native.callUIFunction(menuItemRef.value, 'requestFocus', []);
    }

    return {
      menuItemRef,
      focused,
      onFocus,
      onClick,
      requestItemFocus,
      vipFocused,
      vipNormal,
      text
    }
  },
});
</script>

<style scoped>
.menu-vip-button-item-icon-css {
  width: 200px;
  height: 140px;
  border-radius: 12px;
  background-color: rgba(255, 255, 255, 0.1);
  focus-background-color: #FFF5F5F5;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  display: flex;
  margin-right: 16px;
}

.menu-vip-button-item-focused {
  width: 200px;
  height: 140px;
  border-radius: 12px;
  background-color: transparent;
  position: absolute;
}

.menu-vip-button-item-img-css {
  width: 46px;
  height: 46px;
  position: absolute;
}

.menu-vip-button-item-text-css {
  width: 200px;
  height: 30px;
  color: rgba(255, 255, 255, 0.6);
  focus-color: black;
  select-color: black;
  align-self: center;
  font-size: 28px;
  text-align: center;
  font-weight: 400;
  margin-top: 15px;
}

.menu-vip-button-item-img-root-css {
  width: 46px;
  height: 46px;
}

</style>
