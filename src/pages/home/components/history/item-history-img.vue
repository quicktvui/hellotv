<template>
  <!-- layout pLayout :enableBlackBorder="false" focusScale-->
  <div :focusable="true" layout="${layout}" class="my_item_his_img" flexStyle="${style}">
    <img 
      showIf="${showApiData01}" class="my_item_his_img_img" :duplicateParentState="true" 
      :postDelay="300" :focusable="false" enableFocusBorder="${focus.border}"
      flexStyle="${image.style}" src="${barImg}"
    />
    <div 
      flexStyle="${floatTitleBoxStyle}" class="my_item_his_img_title"
      gradientBackground="${floatTitleBackground}" :duplicateParentState="true"
      :focusable="false"
    >
        <text-view 
          class="my_item_his_img_float_title" :duplicateParentState="true" :focusable="false" 
          flexStyle="${floatTitleStyle}"
          :ellipsizeMode="4" enablePostTask :postDelay="200" 
          :lines="1" gravity="centerVertical|left" text="${apiData02Title}" 
        />

        <text-view 
          class="my_item_his_img_float_subtitle" :focusable="false"
          :ellipsizeMode="2" :lines="1" autoHeight gravity="centerVertical|left"
          :duplicateParentState="true" flexStyle="${floatSubTitleStyle}"
          text="${apiData02SubTitle}" />
      </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
export default defineComponent({
  name: "my-item-history-img",
  setup(props, context) {
    return {}
  },
});

</script>

<style scoped>
.my_item_his_img {
  position: relative;
  background-color: transparent;
  border-radius: 8px;
  overflow: hidden;
  focus-border-color: #ffffff;
  focus-border-style: solid;
  focus-border-radius: 8px;
}
/* .my_item_his_img_img{} */
.my_item_his_img_title{
  position: absolute;
  left: 0;
  top: 0;
  background-color: transparent;
}
.my_item_his_img_float_title{
}
.my_item_his_img_float_subtitle{
  color: #909398;
  font-size: 22px;
}
</style>