<template>
  <qt-view class="screen-right-content-item-root-css"
           name="screen_content_item"
           :focusable="true"
           :focusScale="1.06"
           :enableFocusBorder="true"
           eventClick
           eventFocus >
    <!--    图片-->
    <img class="screen-right-content-item-img"
         src="${poster}" :focusable="false"/>
    <!--    角标-->
    <img class="screen-right-content-item-corner" :postDelay="300" flexStyle="${corner.style}" src="${corner.src}" :focusable="false"/>
    <!--    评分-->
    <qt-view class="screen-right-content-item-score-root" :focusable="false"
             :gradientBackground="{colors:['#00000000', '#E5000000'], cornerRadii4: [0, 0, 6, 6]}">
      <qt-text class="screen-right-item-score" :fontSize="24" :paddingRect="[15,0,0,6]" text="${score}" :focusable="false"/>
    </qt-view>
    <!--    标题-->
   <qt-view class="screen-right-content-item-text-root" :duplicateParentState="true" :focusable="false">
     <qt-text class="screen-right-content-item-text" :fontSize="30"
              :ellipsizeMode="3" :lines="1" :duplicateParentState="true"
              :paddingRect="[12,6,12,0]" text="${title}"
              :focusable="false" :select="true"/>
   </qt-view>

  </qt-view>
</template>

<script lang="ts">
import {defineComponent} from "@vue/runtime-core";
import {ESLogLevel, useESLog} from "@extscreen/es3-core";

export default defineComponent({
  name: "tags-content-item",
  setup(props, context) {
    const log = useESLog()

    function onESCreate(params) {

    }

    function onESStart() {

    }

    function onESRestart() {

    }

    function onESResume() {

    }

    function onESPause() {

    }

    function onESStop() {

    }

    function onESDestroy() {

    }

    return {
      onESCreate,
      onESStart,
      onESResume,
      onESPause,
      onESStop,
      onESRestart,
      onESDestroy,
    }
  }
})
</script>

<style src="../css/tag-right-content-item.css">

</style>
