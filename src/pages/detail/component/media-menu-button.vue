<template>
  <div :focusable="true"
       @focus="onFocus"
       @click="onClick"
       ref="menuItemRef"
       :class="`menu-button-item-icon-css${suffix}`" :style="style" >

    <div showOnState="focused"
         :class="`menu-button-item-focused${suffix}`"
         :style="style"
         :duplicateParentState="true"
         :gradientBackground="focusedGradientBg"/>

    <div :class="`menu-button-item-img-root-css${suffix}`" :duplicateParentState="true">
      <img :class="`menu-button-item-img-css${suffix}`"
           v-show="isMediaTypeFree && focused"
           :duplicateParentState="true"
           :focusable="false"
           :src="icon"/>
      <img :class="`menu-button-item-img-css${suffix}`"
           v-show="!isMediaTypeFree && focused"
           :duplicateParentState="true"
           :focusable="false"
           :src="vipFocusIcon"/>
      <img :class="`menu-button-item-img-css${suffix}`"
           v-show="!focused"
           :duplicateParentState="true"
           :focusable="false"
           :src="icon"/>
    </div>
    <span :class="`menu-button-item-text-css${suffix}`"
          :style="{ focusColor: textFocusColor }"
          :duplicateParentState="true">{{ text }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { inject, Ref, ref, watch } from "vue";
import { Native } from "@extscreen/es3-vue";
import { ESGradient } from "@extscreen/es3-component";
import { IMediaAuthorization } from "../../../api/media/IMediaAuthorization";
import { mediaAuthorizationKey } from "../injectionSymbols";
import { IMediaAuthType } from "../../../api/media/IMediaAuthType";

export default defineComponent({
  name: "media-menu-button",
  props: {
    suffix: {
      type: String,
      default: ''
    },
    style: {
      type: Object,
      default: {}
    },
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

    let cornerRadius = props.suffix === '-small' ? 36 : 12
    let goldenBg: ESGradient = { colors: ['#FFFFE398', '#FFEEB364'], orientation: 6, cornerRadius: cornerRadius }
    let whiteBg: ESGradient = { colors: ['#FF0057FF', '#FF00C7FF'], orientation: 6, cornerRadius: cornerRadius }
    const focusedGradientBg = ref<ESGradient>(whiteBg)

    const textFocusColor = ref<string>('#FFFFFF')

    const isMediaTypeFree = ref<boolean>(true);

    const mediaAuthorization: Ref<IMediaAuthorization> =
      inject(mediaAuthorizationKey, {} as any)

    watch(
      () => [mediaAuthorization?.value] as const,
      ([auth], [oldAuth]) => {
        if (mediaAuthorization?.value.type == IMediaAuthType.MEDIA_AUTH_TYPE_FREE) {
          isMediaTypeFree.value = true
          focusedGradientBg.value = whiteBg
          textFocusColor.value = '#FFFFFF'
        } else {
          isMediaTypeFree.value = false
          focusedGradientBg.value = goldenBg
          textFocusColor.value = '#603314'
        }
      },
      { flush: 'post' }
    )

    function onFocus(e) {
      focused.value = e.isFocused;
      context.emit("focus", e.isFocused);
    }

    function onClick(e) {
      context.emit("click");
    }

    function requestItemFocus() {
      Native.callUIFunction(menuItemRef.value, 'requestFocusDirectly');
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

.menu-button-item-icon-css-small {
  width: 160px;
  height: 70px;
  border-radius: 36px;
  background-color: rgba(255, 255, 255, 0.1);
  focus-background-color: #FFF5F5F5;
  flex-direction: row;
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

.menu-button-item-focused-small {
  width: 160px;
  height: 70px;
  border-radius: 36px;
  background-color: transparent;
  position: absolute;
}

.menu-button-item-img-css {
  width: 46px;
  height: 46px;
  position: absolute;
}

.menu-button-item-img-css-small {
  width: 30px;
  height: 30px;
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

.menu-button-item-text-css-small {
  color: rgba(255, 255, 255, 0.6);
  focus-color: black;
  align-self: center;
  font-size: 28px;
  text-align: center;
  font-weight: 400;
  margin-left: 10px;
}

.menu-button-item-img-root-css {
  width: 46px;
  height: 46px;
}

.menu-button-item-img-root-css-small {
  width: 30px;
  height: 30px;
  align-items: center;
}
</style>
