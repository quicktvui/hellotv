<template>
  <item-frame :type="107" layout="${layout}" flexStyle="${style}" focusScale="${focus.scale}" :focusable="true" eventClick
    eventFocus name="my_poster_name" class="my_poster2" itemShowShimmer="${shimmer.enable}"
    hideShadow="${shadow.enable}" shimmerSize="${size}" :clipChildren="false">
    <!-- :enableBlackBorder="false" -->
    <div :focusable="false" duplicateParentState class="my_poster2_content_box" flexStyle="${style}" :clipChildren="false">
      <div :focusable="false" duplicateParentState class="my_poster2_content_box_info" flexStyle="${style}" :clipChildren="false">
        <div class="my_poster2_img_css_box" :focusable="false" duplicateParentState :clipChildren="false">
          <div flexStyle="${imageBgStyle}" showOnState="focused" class="my_poster2_img_bg p_ab" :duplicateParentState="true" :focusable="false"></div>
          <img class="my_poster2_img_css p_ab" :duplicateParentState="true" :postDelay="300" :focusable="false"
              flexStyle="${image.style}" src="${image.src}" />
        </div>
        
        <!-- overflow="visible" :clipChildren="false" -->
        <div class="my_poster2_title" flexStyle="${titleBoxStyle}" :duplicateParentState="true" :focusable="false">
          <text-view 
            :duplicateParentState="true" :focusable="false" textSize="${title.style.fontSize}"
            :ellipsizeMode="4" :lines="1" :postDelay="200" gravity="center|left" flexStyle="${title.style}"
            text="${title.text}" showIf="${title.enable}" typeface="bold"
            :paddingRect="[5,0,0,0]" class="my_poster2_title_text"
          />
          <text-view 
            class="my_poster2_subtitle" :focusable="false" fontSize="${subTitle.style.fontSize}"
            :ellipsizeMode="2" :lines="1" gravity="centerVertical|left" flexStyle="${subTitle.style}"
            :duplicateParentState="true" text="${subTitle.text}" visibility="${subTitle}"
            :paddingRect="[5,0,0,0]"
          />
        </div>
      </div>
    </div>
  </item-frame>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
export default defineComponent({
  name: "my-poster2",
  setup(props, context) {
    return {}
  },
});

</script>

<style scoped>
.my_poster2 {
  position: relative;
  background-color: transparent;
  overflow: hidden;
}
.p_ab{
  position: absolute;
  left: 0.01px;
  top: 0.01px;
}
/* ------- */
.my_poster2_content_box {
  position: absolute;
  left: 0.01px;
  top: 0.01px;
  z-index: 2;
  border-radius: 16px;
  background-color: transparent;
  /* focus-background-color: #FEE100; */
}

.my_poster2_content_box_info {
  position: absolute;
  left: 0.01px;
  top: 0.01px;
  z-index: 1;
  border-radius: 16px;
  background-color: transparent;
}
.my_poster2_img_css_box{
  position: relative;
  background-color: transparent;
  border-radius: 16px;
}
.my_poster2_img_bg{
  left: 0.01px;
  top: 0.01px;
  z-index: 1;
  background-color: #FEE100;
  border-radius: 16px;
}
.my_poster2_img_css {
  z-index: 2;
  background-color: transparent;
  border-radius: 16px;
  /* focus-border-width: 16px;
  focus-border-color: #FEE100;
  focus-border-style: solid;
  focus-border-radius: 16px; */
}

.my_poster2_title {
  background-color: transparent;
  z-index: 10;
  background-color: transparent;
}
.my_poster2_title_text{
  color: #ffffff;
  background-color: transparent;
}
/* #666666 */
.my_poster2_subtitle {
  color: #ffffff;
  background-color: transparent;
}
</style>