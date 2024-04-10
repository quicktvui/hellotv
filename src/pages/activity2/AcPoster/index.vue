<template>
  <item-frame
    :type="type"
    layout="${layout}"
    flexStyle="${style}"
    focusScale="${focus.scale}"
    :focusable="true"
    eventClick
    eventFocus
    name="poster"
    class="qt-ui-poster-root-css"
    itemShowShimmer="${shimmer.enable}"
    hideShadow="${shadow.enable}"
    shimmerSize="${size}">
    <!--封面-->
    <img
      class="qt-ui-poster-img-css"
      :duplicateParentState="true"
      :postDelay="300"
      :focusable="false"
      enableFocusBorder="${focus.border}"
      flexStyle="${image.style}"
      src="${image.src}"/>

    <text-view
      class="qt-ui-poster-score-css"
      :duplicateParentState="true"
      :focusable="false"
      flexStyle="${score.style}"
      textSize="${score.style.fontSize}"
      :ellipsizeMode="2"
      :lines="1"
      gravity="center"
      :postDelay="350"
      autoWidth
      text="${score.text}"/>

    <!--   焦点选中时的标题 -->
    <qt-poster-focus-title
      :focusable="false"
      showOnState="focused"/>

    <div 
      style="flex-direction: column;background-color: transparent;z-index: 999;"
      :duplicateParentState="true"
      :focusable="false"
      flexStyle="${titleStyle}"
      :showOnState="mainTextShowOnState"
    >
      <!--  浮动标题 -->
      <div flexStyle="${floatTitle.style}"
           class="qt-ui-poster-title-css"
           :gradientBackground="{colors:['#e5000000','#00000000'], cornerRadii4: [0, 0, 8, 8],orientation:4}"
           :duplicateParentState="true"
           :focusable="false"
           showIf="${floatTitle.enable}">
        <text-view
          :duplicateParentState="true"
          :focusable="false"
          :textSize="26"
          :ellipsizeMode="2"
          enablePostTask
          :postDelay="200"
          :lines="1"
          gravity="left"
          style="z-index: 999;height: 50px;"
          flexStyle="${floatTitle.style}"
          text="${floatTitle.text}"/>
      </div>

      <!--  主标题-->
      <text-view
        :duplicateParentState="true"
        :focusable="false"
        :textSize="30"
        :ellipsizeMode="2"
        :lines="1"
        :postDelay="200"
        gravity="left"
        :paddingRect="[16,0,0,0]"
        gradientBackground="${title.background}"
        style="z-index: 999;"
        flexStyle="${title.style}"
        text="${title.text}"
        showIf="${title.enable}"/>
      <text-view
        :duplicateParentState="true"
        :focusable="false"
        :fontSize="24"
        :ellipsizeMode="2"
        :lines="1"
        gravity="left|top"
        :paddingRect="[16,0,0,0]"
        style="background-color: transparent"
        flexStyle="${subTitle.style}"
        text="${subTitle.text}"
        visibility="${subTitle}"
        showIf="${subTitle.enable}"
      />
    </div>
    <div
      flexStyle="${ripple.style}"
      class="qt-ui-poster-ripple-view-root-css"
      showOnState="focused"
      :focusable="false"
      :clipChildren="false">

      <ripple-view
        class="qt-ui-ripple-view-css"
        :delayLoad="800"
        :focusable="false"
        :duplicateParentState="true"
        :color="'#FF4E46'"
        isShowRipple="${ripple.enable}"
        rippleVisible="invisible"/>

      <img src="${ripple.src}"
           class="qt-ui-ripple-img-css"
           :focusable="false"
           :duplicateParentState="true"
           showIf="${true}"
           :delayLoad="800"/>
    </div>

    <qt-poster-corner-title
      :focusable="false"
      flexStyle="${corner.style}"
      style="z-index:1000;position: absolute;"/>
    <slot/>
  </item-frame>
</template>

<script lang="ts">

import QTPosterFocusTitle from "./qt-poster-focus-title.vue";
import QTPosterCornerTitle from "./qt-poster-corner-title.vue";

import {defineComponent} from "@vue/runtime-core";

export default defineComponent({
  name: "qt-poster",
  components: {
    'qt-poster-corner-title': QTPosterCornerTitle,
    'qt-poster-focus-title': QTPosterFocusTitle,
  },
  props: {
    requestFirstFocus: {
      type: Boolean,
      default: false
    },
    loadDelay: {
      type: Number,
      default: 500
    },
    type: {
      type: Number,
      default: 10001
    },
    templateKeyMap: {
      type: Object,
      default: () => null
    },
  },
  setup(props, context) {
    let mainTextShowOnState = ['normal', 'selected']
    return {
      mainTextShowOnState,
    }
  },
});

</script>

<style scoped>
.qt-ui-poster-root-css {
  position: absolute;
  background-color: transparent;
  overflow: hidden;
}

.qt-ui-poster-img-css {
  background-color: rgba(255, 255, 255, 0.1);
  z-index: 1;
  position: absolute;
  focus-border-color: white;
  focus-border-style: solid;
  border-radius: 8px;
}

.qt-ui-poster-score-css {
  z-index: 2;
  position: absolute;
  color: #FC5E1B;
  background-color: transparent;
}

.qt-ui-poster-title-css {
  padding-left: 16px;
  padding-top: 15px;
  background-color: transparent;
}

.qt-ui-ripple-img-css {
  width: 60px;
  height: 60px;
  background-color: transparent;
  position: absolute;
  z-index: 1001;
  right: 20px;
  bottom: 20px;
}

.qt-ui-ripple-view-css {
  width: 100px;
  height: 100px;
  z-index: 1000;
  background-color: transparent;
  position: absolute;
}

.qt-ui-poster-ripple-view-root-css {
  width: 100px;
  height: 100px;
  right: 0;
  bottom: 0;
  margin-right: -12px;
  z-index: 1000;
  background-color: transparent;
  position: absolute;
}

</style>
