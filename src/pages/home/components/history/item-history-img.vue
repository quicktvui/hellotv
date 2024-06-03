<template>
  <!-- layout pLayout :enableBlackBorder="false" focusScale-->
  <div 
    :focusable="true" layout="${layout}" class="my_item_his_img" flexStyle="${style}"
    gradientBackground="${myHisGradientBackground}"
    :type="122"
  >
    <img 
      showIf="${isShowBarImg}" class="my_item_his_img_img" :duplicateParentState="true" 
      :postDelay="300" :focusable="false" enableFocusBorder="${focus.border}"
      flexStyle="${barImgStyle}" src="${barImg}"
    />
    <div 
      flexStyle="${floatTitleBoxStyle}" class="my_item_his_img_title"
      gradientBackground="${floatTitleBackground}" :duplicateParentState="true"
      :focusable="false" showIf="${isShowBarImg}"
    >
        <text-view 
          class="my_item_his_img_float_title" :duplicateParentState="true" :focusable="false" 
          flexStyle="${floatTitleStyle}"
          :ellipsizeMode="4" enablePostTask :postDelay="200" 
          :lines="1" gravity="centerVertical|left" text="${floatTitleText}" 
        />
        <text-view 
          class="my_item_his_img_float_subtitle" :focusable="false"
          :ellipsizeMode="2" :lines="1" autoHeight gravity="centerVertical|left"
          :duplicateParentState="true" flexStyle="${floatSubTitleStyle}"
          text="${floatSubTitleText}" />
    </div>
    <div class="my_item_his_img_empty" showIf="${isShowBarImg==false}" :focusable="false" :duplicateParentState="true" flexStyle="${barImgEmptyTitleStyle}">
      <div class="my_item_his_img_empty_title_box">
        <img class="my_item_his_img_empty_icon" src="../../../../assets/my/record.png" :focusable="false"/>
        <text-view 
          class="my_item_his_img_empty_title" :duplicateParentState="true" :focusable="false" 
          autoWidth autoHeight gravity="centerVertical|left" text="历史记录" 
        />
      </div>
      <text-view 
        showIf="${isLogin==false}" class="my_item_his_img_empty_subtitle"
        :duplicateParentState="true" :focusable="false" 
        autoWidth autoHeight gravity="centerVertical|left" text="登录同步云端历史" 
      />
      <!-- ${barImgEmptyText} -->
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
  /* 424650 */
  border-radius: 20px;
  overflow: hidden;
  focus-border-color: #0063FF;
  focus-border-style: solid;
  focus-border-radius: 20px;
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
.my_item_his_img_empty{
  position: absolute;
  left: 0;
  top: 0;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: center;
}
.my_item_his_img_empty_title_box{
  display: flex;
  flex-direction: row;
  align-items: center;
}
.my_item_his_img_empty_icon{
  width: 50px;
  height: 50px;
  margin-right: 10px;
  margin-top: 2px;
}
.my_item_his_img_empty_subtitle{
  color: #909398;
  font-size: 22px;
  margin-top: 10px;
}
</style>