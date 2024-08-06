<template>
  <div class="cornerRoot" flexStyle="${corner.style}" :focusable="false">
    <text-view
        :duplicateParentState="true"
        :focusable="false"
        :textSize="fontSize"
        :ellipsizeMode="2"
        :lines="1"
        typeface="bold"
        gravity="center"
        :postDelay="350"
        style="color: white;padding: 4px 8px;height: 36px;margin: 4px;"
        gradientBackground="${corner.background}"
        autoWidth
        text="${corner.text}"
        showIf="${corner.enable}"/>
    <img :focusable="false" flexStyle="${corner.style}" src="${corner.src}" showIf="${corner.enableImg}"/>
  </div>
</template>

<script>


import {defineComponent} from "@vue/runtime-core";

export default defineComponent({
  name: 'qt-poster-corner-title',
  props: {
    fontSize: {
      type: Number,
      default: 20
    }
  },
  setup(props, context) {
  },
});

</script>

<style scoped>
.cornerRoot {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 999;
  background-color: transparent;
  flex-direction: row-reverse;
}
</style>
