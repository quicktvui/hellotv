<template>
  <item-frame :type="2" layout="${layout}" flexStyle="${image.style}" focusScale="${focus.scale}" :focusable="true" eventClick
    eventFocus name="my_poster_card_name" class="my_poster_card" itemShowShimmer="${shimmer.enable}"
    hideShadow="${shadow.enable}" shimmerSize="${size}">
    <div :focusable="false" overflow="hidden" :clipChildren="true" :duplicateParentState="true" class="poster_card_content_box" flexStyle="${image.style}">
      <img class="poster_card_icon" :focusable="false" src="${image.src}"/>

      <div :focusable="false" class="poster_card_content_box_info" flexStyle="${infoStyle}" autoHeight>
        <text-view class="poster_card_title" :focusable="false" autoWidth
          textSize="${title.style.fontSize}" :ellipsizeMode="2" :lines="1" :postDelay="200" gravity="centerVertical|center"
          text="${title.text}" showIf="${title.enable}" />
        <text-view 
          class="poster_card_subtitle" :focusable="false" autoWidth
          fontSize="${subTitle.style.fontSize}" :ellipsizeMode="2" :lines="1"
          gravity="centerVertical|left" text="${subTitle.text}"
        />
      </div>
    </div>
  </item-frame>
</template>
<script lang='ts' setup>
</script>
<style scoped>
.my_poster_card{
  background-color: transparent;
}
.poster_card_content_box{
  position: relative;
  background-color: rgba(255, 255, 255, 0.06);
  
  border-radius: 8px;
  focus-border-color: #ffffff;
  focus-border-style: solid;
}
.poster_card_icon{
  position: absolute;
  left: 238px;
  top: 108px;
  width: 140px;
  height: 132px;
  background-color: transparent;
}
.poster_card_content_box_info{
  position: absolute;
  left: 0;
  top: 0;
  padding-left: 36px;
  padding-top: 36px;
  display: flex;
  flex-direction: column;
  background-color: transparent;
}
.poster_card_title {
  background-color: transparent;
  height: 50px;
  color: #F4D297;
}
.poster_card_subtitle{
  background-color: transparent;
  height: 30px;
}
</style>