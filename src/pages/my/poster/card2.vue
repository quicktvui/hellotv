<template>
  <div 
    :type="106" layout="${layout}" flexStyle="${style}" 
    focusScale="${focus.scale}"  :focusable="true" eventClick
    eventFocus name="my_poster_card_name2" class="my_poster_card2">
    <div :showOnState="['focused','selected']" class="my_poster_card_name2_bg" flexStyle="${style}" :focusable="false" :duplicateParentState="true" gradientBackground="${focusedBgColor}">
      <text-view 
      class="my_poster_card2_text my_poster_card2_text_f" :focusable="false" autoWidth autoHeight 
      textSize="${title.style.fontSize}" :ellipsizeMode="2" :lines="1" :postDelay="200"
      gravity="center" text="${focusTitle.text}" typeface="bold"/>
      <div class="my_poster_card2_icon_box">
        <img class="my_poster_card2_icon" flexStyle="${icon.style}" :focusable="false" src="${focusedImageSrc}" />
      </div>
    </div>
    <div :showOnState="['normal']" class="my_poster_card_name2_inner" flexStyle="${style}" :focusable="false" :duplicateParentState="true">
      <text-view 
      class="my_poster_card2_text" :focusable="false" autoWidth autoHeight 
      textSize="${title.style.fontSize}" :ellipsizeMode="2" :lines="1" :postDelay="200"
      gravity="center" text="${title.text}" typeface="bold"/>
      <div class="my_poster_card2_icon_box">
        <img class="my_poster_card2_icon" flexStyle="${icon.style}" :focusable="false" src="${image.src}" />
      </div>
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
  border-radius: 16px;
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
  background-color: rgba(255,255,255,0.15);
  border-radius: 16px;
  border-style: solid;
  border-width: 1px;
  border-color: rgba(255,255,255,0.5);
}
.my_poster_card2_text{
  margin-bottom: 20px;
  color: #ffffff;
  background-color: transparent;
}
.my_poster_card2_icon_box{
  width: 147px;
  height: 147px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.my_poster_card2_icon{
  /* width: 120px;
  height: 128px; */
  background-color: transparent;
}
.my_poster_card2_text_f{
  color: #023B2B;
}
</style>