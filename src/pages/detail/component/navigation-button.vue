<template>
  <div :focusable="true"
       @focus="onFocus"
       @click="onClick"
       :autofocus='autofocus'
       class="navigation-button-item-icon-css">
    <div class="navigation-button-item-bg-focus" :duplicateParentState="true" showOnState="focused" :focusable="false"
         :gradientBackground="{colors:['#0057FF','#00C7FF'], cornerRadii4: [30, 30, 30, 30], orientation: 6}"/>
    <div class="navigation-button-item-img-root-css">
      <img class="navigation-button-item-img-css"
           :duplicateParentState="true"
           :focusable="false"
           showOnState="focused"
           :src="focusIcon"/>
      <img class="navigation-button-item-img-css"
           :duplicateParentState="true"
           :focusable="false"
           showOnState="normal"
           :src="icon"/>
    </div>
    <span class="navigation-button-item-text-css"
          :duplicateParentState="true">{{ text }}</span>
  </div>
</template>

<script lang="ts">

import {defineComponent} from "@vue/runtime-core";
import {ref} from "vue";

export default defineComponent({
  name: "navigation-button",
  props: {
    icon: {
      type: String,
      default: ''
    },
    focusIcon: {
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
    const autofocus = ref<boolean>(false)

    function onFocus(e) {
      focused.value = e.isFocused;
      context.emit("focus", e.isFocused);
    }

    function onClick(e) {
      context.emit("click");
    }

    function setAutofocus(value: boolean): void {
      autofocus.value = value
    }

    return {
      autofocus,
      menuItemRef,
      focused,
      onFocus,
      onClick,
      setAutofocus
    }
  },
});
</script>

<style scoped>
.navigation-button-item-icon-css {
  width: 145px;
  height: 60px;
  border-radius: 30px;
  background-color: rgba(255, 255, 255, 0.1);
  flex-direction: row;
  align-items: center;
  justify-content: center;
  display: flex;
}

.navigation-button-item-bg-focus{
  position: absolute;
  width: 145px;
  height: 60px;
  background-color: transparent;
}

.navigation-button-item-img-css {
  width: 32px;
  height: 32px;
  position: absolute;
}

.navigation-button-item-text-css {
  width: 56px;
  height: 60px;
  color: rgba(255, 255, 255, 0.6);
  focus-color: white;
  select-color: white;
  align-self: center;
  font-size: 28px;
  text-align: center;
  font-weight: 400;
  margin-left: 8px;
}

.navigation-button-item-img-root-css {
  width: 32px;
  height: 32px;
}

</style>
