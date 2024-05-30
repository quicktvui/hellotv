<template>
  <item-frame :type="107" layout="${layout}" flexStyle="${style}" focusScale="${focus.scale}" :focusable="true" eventClick
    eventFocus name="my_poster_name" class="my_poster2" itemShowShimmer="${shimmer.enable}"
    hideShadow="${shadow.enable}" shimmerSize="${size}">
    <!-- :enableBlackBorder="false" -->
    <div :focusable="false" duplicateParentState class="my_poster2_content_box" flexStyle="${style}">
      <div :focusable="false" :duplicateParentState="true" class="my_poster2_content_box_info" flexStyle="${innerStyle}">
        <div flexStyle="${image.style}" class="my_poster2_img_css_box" :duplicateParentState="true" :focusable="false">
          <img class="my_poster2_img_css" :duplicateParentState="true" :postDelay="300" :focusable="false"
            flexStyle="${image.style}" src="${image.src}" />
        </div>
        
        <!-- overflow="visible" :clipChildren="false" -->
        <div class="my_poster2_title" flexStyle="${titleBoxStyle}" :duplicateParentState="true" :focusable="false">
          <text-view 
            :duplicateParentState="true" :focusable="false" textSize="${title.style.fontSize}"
            :ellipsizeMode="2" :lines="1" :postDelay="200" gravity="center|left" flexStyle="${title.style}"
            text="${title.text}" showIf="${title.enable}"
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

/* ------- */
.my_poster2_content_box {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  border-radius: 20px;
  background-color: transparent;
}

.my_poster2_content_box_info {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  border-radius: 20px;
  background-color: transparent;
}
.my_poster2_img_css_box{
  background-color: transparent;
  overflow: hidden;
  border-radius: 20px;
  focus-border-color: #0063FF;
  focus-border-style: solid;
  focus-border-radius: 20px;
}
.my_poster2_img_css {
  background-color: transparent;
  z-index: 1;
  border-radius: 20px;
}

.my_poster2_title {
  position: absolute;
  left: 0;
  top: 0;
  background-color: transparent;
  z-index: 10;
  background-color: transparent;
}
.my_poster2_title_text{
  background-color: transparent;
}
/* #666666 */
.my_poster2_subtitle {
  color: #92949A;
  background-color: transparent;
}
</style>