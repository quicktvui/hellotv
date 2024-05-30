<template>
  <div 
    :type="106" layout="${layout}" flexStyle="${style}" 
    focusScale="${focus.scale}"  :focusable="true" eventClick
    eventFocus name="my_poster_card_name2" class="my_poster_card2">
    <div :showOnState="['focused','selected']" class="my_poster_card_name2_bg" flexStyle="${style}" :focusable="false" :duplicateParentState="true" gradientBackground="${focusedBgColor}">
      <text-view 
      class="my_poster_card2_text my_poster_card2_text_f" :focusable="false" autoWidth autoHeight 
      textSize="${title.style.fontSize}" :ellipsizeMode="2" :lines="1" :postDelay="200"
      gravity="center" text="${focusTitle.text}" />
      <img class="my_poster_card2_icon" :focusable="false" src="${focusedImageSrc}" />
    </div>
    <div :showOnState="['normal']" class="my_poster_card_name2_inner" flexStyle="${style}" :focusable="false" :duplicateParentState="true">
      <text-view 
      class="my_poster_card2_text" :focusable="false" autoWidth autoHeight 
      textSize="${title.style.fontSize}" :ellipsizeMode="2" :lines="1" :postDelay="200"
      gravity="center" text="${title.text}" />
      <img class="my_poster_card2_icon" :focusable="false" src="${image.src}" />
    </div>
  </div>
</template>
<script lang='ts' setup>
</script>
<style scoped>
.my_poster_card2{
  position: relative;
  background-color: transparent;
}
.my_poster_card_name2_bg{
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border-radius: 20px;
  border-style: solid;
  border-width: 1px;
  border-color: transparent;
}
.my_poster_card_name2_inner{
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #2A2F39;
  border-radius: 20px;
  border-style: solid;
  border-width: 1px;
  border-color: #696A80;
}
.my_poster_card2_text{
  margin-bottom: 20px;
  background-color: transparent;
}
.my_poster_card2_icon{
  width: 120px;
  height: 128px;
  background-color: transparent;
}
.my_poster_card2_text_f{
  color: #ffffff;
}
</style>