<template>
  <item-frame 
    :type="101" layout="${layout}" flexStyle="${style}" :focusable="true" eventClick
    focusScale="${focus.scale}" :placeholderScale="1.001" 
    eventFocus name="my_poster_name" class="qt-ui-poster-root-css" itemShowShimmer="${shimmer.enable}"
    hideShadow="${shadow.enable}" shimmerSize="${size}" :clipChildren="false"
  >
    <!-- :enableBlackBorder="false" -->
    <div :focusable="false" duplicateParentState class="content_box" flexStyle="${style}" :clipChildren="false">
      <div :focusable="false" :duplicateParentState="true" class="content_box_bg"
        flexStyle="${bgStyle}" :enableBlackBorder="false"></div>
      <div :focusable="false" :duplicateParentState="true" class="content_box_info" flexStyle="${style}">
        <img class="my_poster_img_css" :duplicateParentState="true" :postDelay="300" :focusable="false"
          enableFocusBorder="${focus.border}" flexStyle="${image.style}" src="${image.src}" />
        <div showIf="${floatTitle.enable}" flexStyle="${image.style}" class="float_title_box" :focusable="false"
          :duplicateParentState="true">
          <div flexStyle="${floatTitle.style}" class="qt-ui-poster-float-title-css"
            gradientBackground="${floatTitle.background}" :duplicateParentState="true" :focusable="false">
            <text-view :duplicateParentState="true" :focusable="false" textSize="${floatTitle.style.fontSize}"
              :ellipsizeMode="2" enablePostTask :postDelay="200" :lines="1" gravity="centerVertical|left" style=""
              flexStyle="${floatTitle.style}" text="${floatTitle.text}" />
          </div>
        </div>
        <!-- overflow="visible" :clipChildren="false" -->
        <div class="poster_title" flexStyle="${titleBoxStyle}" :showOnState="['normal']" :duplicateParentState="true" :focusable="false">
          <text-view 
            :duplicateParentState="true" :focusable="false" textSize="${title.style.fontSize}"
            :ellipsizeMode="2" :lines="1" :postDelay="200" gravity="center|left" flexStyle="${title.style}"
            text="${title.text}" showIf="${title.enable}"
            :paddingRect="[5,0,0,0]" class="poster_title_text"
          />
          <text-view 
            class="poster_subtitle" :focusable="false" fontSize="${subTitle.style.fontSize}"
            :ellipsizeMode="2" :lines="1" gravity="centerVertical|left" flexStyle="${subTitle.style}"
            :duplicateParentState="true" text="${subTitle.text}" visibility="${subTitle}"
            :paddingRect="[5,0,0,0]"
          />
        </div>
        <div class="poster_title_f" flexStyle="${titleFocuseBoxStyle}" :showOnState="['focused', 'selected']" :duplicateParentState="true"
          :focusable="false">
          <text-view 
            :duplicateParentState="true" :focusable="false" textSize="${title.style.fontSize}"
            ellipsizeMode="${titleEllipsizeMode}" lines="${titleLines}" gravity="center|left"
            flexStyle="${title.style}" text="${focusTitle.text}" showIf="${focusTitle.enable}"
            class="poster_title_f_text" :paddingRect="[10,0,10,0]"
          />
          <text-view class="poster_subtitle" :focusable="false" fontSize="${subTitle.style.fontSize}"
            :ellipsizeMode="2" :lines="1" gravity="centerVertical|left" flexStyle="${subTitle.style}"
            :duplicateParentState="true" text="${subTitle.text}" visibility="${subTitle}"
            :paddingRect="[10,0,10,0]"
          />
        </div>
      </div>
      <div :focusable="false" :duplicateParentState="true" class="content_box_cover"
        flexStyle="${coverStyle}" :enableBlackBorder="true"></div>
    </div>
  </item-frame>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
export default defineComponent({
  name: "my-poster",
  setup(props, context) {
    return {}
  },
});

</script>

<style scoped>
.qt-ui-poster-root-css {
  position: relative;
  background-color: transparent;
  overflow: hidden;
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

/* ------- */
.content_box {
  position: relative;
  border-radius: 16px;
  background-color: transparent;
}

.content_box_bg {
  position: absolute;
  left: 0.01px;
  top: 0.01px;
  z-index: 1;
  border-radius: 16px;
  background-color: transparent;
  focus-background-color: #FFFFFF;
}

.content_box_info {
  position: absolute;
  left: 0.01px;
  top: 0.01px;
  z-index: 2;
  border-radius: 16px;
  background-color: transparent;
}
.content_box_cover{
  position: absolute;
  left: 0.01px;
  top: 0.01px;
  z-index: 3;
  border-radius: 16px;
  background-color: transparent;
  focus-border-style: solid;
  /* focus-border-width: 8px; */
  focus-border-color: #FFFFFF;
}
.my_poster_img_css {
  /* rgba(255, 255, 255, 0.1) */
  background-color: transparent;
  z-index: 1;
  border-radius: 16px;
  /* focus-border-width: 8px;
  focus-border-color: #FEE100;
  focus-border-style: solid;
  focus-border-radius: 16px; */
}

.float_title_box {
  position: absolute;
  left: 0px;
  top: 0px;
  background-color: transparent;
  z-index: 2;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
}

.qt-ui-poster-float-title-css {
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: transparent;
}

.poster_title_hold {
  position: relative;
  background-color: transparent;
}

.poster_title {
  position: absolute;
  left: 0;
  top: 0;
  background-color: transparent;
  z-index: 1;
}
.poster_title_text{
  background-color: transparent;
}
.poster_title_f {
  position: absolute;
  left: 0;
  top: 0;
  background-color: #FFFFFF;
  z-index: 2;
  color: #023B2B;
  /* margin-top: -30px; */
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
}
.poster_title_f_text{
  color: #023B2B;
}

/* #666666 */
.poster_subtitle {
  color: #ffffff;
  background-color: transparent;
  focus-color: #023B2B;
}
</style>