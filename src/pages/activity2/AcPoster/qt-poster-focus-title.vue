<template>
  <div class="absoluteFocusTitleRoot"
       flexStyle="${titleFocusStyle}"
       autoHeight
       :focusable="false">
    <!-- 浮动标题-->
    <text-view
      :duplicateParentState="true"
      :focusable="false"
      :fontSize="26"
      :ellipsizeMode="2"
      :lines="1"
      :paddingRect="[16,18,0,0]"
      gradientBackground="${floatTitle.background}"
      style="height: 64px;color: #ffffff"
      flexStyle="${floatTitle.style}"
      text="${floatTitle}"
      showIf="${floatTitle.enable}"
      gravity="left"
      :postDelay="250"/>
    <div class="absoluteFocusMainBgRoot"
         :duplicateParentState="true"
         :focusable="false"
         showIf="${focusTitle.enable}">
      <!-- 主标题 -->
      <text-view
        :duplicateParentState="true"
        :focusable="false"
        :fontSize="30"
        :ellipsizeMode="2"
        autoHeight
        :maxLines="2"
        gravity="left"
        :paddingRect="[16,8,12,8]"
        style="background-color: transparent;color: #000000"
        flexStyle="${focusTitle.style}"
        text="${focusTitle.text}"/>
      <!-- 副标题 -->
      <text-view
        :duplicateParentState="true"
        :focusable="false"
        :fontSize="24"
        :ellipsizeMode="2"
        :lines="1"
        autoHeight
        gravity="left|top"
        :paddingRect="[16,0,0,16]"
        style="color: rgba(0,0,0,.4);background-color: transparent"
        flexStyle="${subTitle.style}"
        text="${subTitle.text}"
        visibility="${subTitle}"/>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "@vue/runtime-core";

export default defineComponent({
  name: 'qt-poster-focus-title',
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
.absoluteFocusTitleRoot {
  position: absolute;
  z-index: 999;
  background-color: transparent;
}

.absoluteFocusMainBgRoot {
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  background-color: white;
  margin-left: -1px;
  margin-right: -1px;
}
</style>
