<template>
  <div :focusable="true"
       @focus="onFocus"
       @click="onClick"
       ref="menuItemRef"
       class="menu-button-item-icon-css">

    <div showOnState="focused"
         class="menu-button-item-focused"
         :duplicateParentState="true"
         :gradientBackground="focusedGradientBg"/>

    <div class="menu-button-item-img-root-css"
         :duplicateParentState="true">
      <img class="menu-button-item-img-css"
           v-show="isMediaTypeFree && focused"
           :duplicateParentState="true"
           :focusable="false"
           :src="focusIcon"/>
      <img class="menu-button-item-img-css"
           v-show="!isMediaTypeFree && focused"
           :duplicateParentState="true"
           :focusable="false"
           :src="vipFocusIcon"/>
      <img class="menu-button-item-img-css"
           v-show="!focused"
           :duplicateParentState="true"
           :focusable="false"
           :src="icon"/>
    </div>
    <span class="menu-button-item-text-css"
          :style="{focusColor:textFocusColor}"
          :duplicateParentState="true">{{ text }}</span>
  </div>
</template>

<script lang="ts">

import {defineComponent} from "@vue/runtime-core";
import {inject, Ref, ref, watch} from "vue";
import {Native} from "@extscreen/es3-vue";
import {ESGradient} from "@extscreen/es3-component";
import {IMediaAuthorization} from "../../../api/media/IMediaAuthorization";
import {mediaAuthorizationKey} from "../injectionSymbols";
import {IMediaAuthType} from "../../../api/media/IMediaAuthType";

export default defineComponent({
  name: "media-menu-button",
  props: {
    icon: {
      type: String,
      default: ''
    },
    focusIcon: {
      type: String,
      default: ''
    },
    vipFocusIcon: {
      type: String,
      default: ''
    },
    text: {
      type: String,
      default: ''
    },
  },
  setup(props, context) {
    const focused = ref(false)
    const menuItemRef = ref()

    let goldenBg: ESGradient = {colors: ['#FFEEB364', '#FFFFE398'], orientation: 3, cornerRadius: 12}
    let whiteBg: ESGradient = {colors: ['#F5F5F5', '#F5F5F5'], orientation: 3, cornerRadius: 12}
    const focusedGradientBg = ref<ESGradient>(whiteBg)

    const textFocusColor = ref<string>('#000000')

    const isMediaTypeFree = ref<boolean>(true);

    const mediaAuthorization: Ref<IMediaAuthorization> =
      inject(mediaAuthorizationKey, {} as any)

    watch(
      () => [mediaAuthorization?.value] as const,
      ([auth], [oldAuth]) => {
        if (mediaAuthorization?.value.type == IMediaAuthType.MEDIA_AUTH_TYPE_FREE) {
          isMediaTypeFree.value = true
          focusedGradientBg.value = whiteBg
          textFocusColor.value = '#000000'
        } else {
          isMediaTypeFree.value = false
          focusedGradientBg.value = goldenBg
          textFocusColor.value = '#603314'
        }
      },
      {flush: 'post'}
    )

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
      focusedGradientBg,
      mediaAuthorization,
      isMediaTypeFree,
      textFocusColor
    }
  },
});
</script>

<style scoped>
.menu-button-item-icon-css {
  width: 140px;
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
.menu-button-item-focused {
  width: 140px;
  height: 140px;
  border-radius: 12px;
  background-color: transparent;
  position: absolute;
}

.menu-button-item-img-css {
  width: 46px;
  height: 46px;
  position: absolute;
}

.menu-button-item-text-css {
  width: 140px;
  height: 30px;
  color: rgba(255, 255, 255, 0.6);
  focus-color: black;
  align-self: center;
  font-size: 28px;
  text-align: center;
  font-weight: 400;
  margin-top: 15px;
}

.menu-button-item-img-root-css {
  width: 46px;
  height: 46px;
}

</style>
