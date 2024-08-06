<template>
  <item-frame :type="103" layout="${layout}" flexStyle="${style}" focusScale="${focus.scale}" :focusable="true" eventClick
    eventFocus name="my_poster_into_name" class="my_poster_into" itemShowShimmer="${shimmer.enable}"
    hideShadow="${shadow.enable}" shimmerSize="${size}">
    <div :showOnState="['focused','selected']" :focusable="false" :duplicateParentState="true" class="poster_into_content_box_bg" flexStyle="${image.style}" gradientBackground="${focusedBgColor}"></div>
    <div :showOnState="['normal']" :focusable="false" :duplicateParentState="true" class="poster_into_content_box_bg_no" flexStyle="${image.style}"></div>

    <div :focusable="false" :duplicateParentState="true" class="poster_into_content_box" flexStyle="${image.style}">
      <div :focusable="false" :duplicateParentState="true" class="poster_into_content_box_info" flexStyle="${infoStyle}" autoHeight overflow="visible" :clipChildren="false">
        <div class="poster_into_icon_box" flexStyle="${icon.style}" :focusable="false" duplicateParentState overflow="visible" :clipChildren="false">
          <div class="poster_into_icon_boxf" flexStyle="${icon.style}" :focusable="false" :duplicateParentState="true">
            <img :showOnState="['focused','selected']" class="poster_into_icon poster_into_iconf" flexStyle="${icon.style}" :focusable="false" :duplicateParentState="true" src="${focusedImageSrc}"/>
            <img :showOnState="['normal']" class="poster_into_icon" flexStyle="${icon.style}" :focusable="false" :duplicateParentState="true" src="${image.src}"/>
          </div>
          <div showIf="${_isCornerNum==true}" class="poster_into_corner" :focusable="false" autoWidth>
            <text-view showIf="${_isShowCornerNum==true}" class="poster_into_corner_txt" :focusable="false" gravity="center" text="${cornerNum}" autoWidth/>
            <text-view showIf="${_isShowCornerNum==false}" class="poster_into_corner_txt2" :focusable="false" text=""/>
          </div>
        </div>
        <!-- ${image.src} -->
        <text-view class="poster_into_title" :focusable="false" autoWidth duplicateParentState
          textSize="${title.style.fontSize}" :ellipsizeMode="2" :lines="1" :postDelay="200" gravity="center|center"
          text="${title.text}" showIf="${title.enable}" typeface="bold"/>
      </div>
    </div>
  </item-frame>
</template>
<script lang='ts' setup>
</script>
<style scoped>
.my_poster_into{
  position:relative;
  background-color: transparent;
}
.poster_into_content_box_bg_no{
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  background-color: rgba(255,255,255,0.15);
  border-radius: 16px;
  border-style: solid;
  border-width: 1px;
  border-color: rgba(255,255,255,0.5);
}
.poster_into_content_box_bg{
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  background-color: transparent;
  border-radius: 16px;
}
.poster_into_content_box{
  position: absolute;
  left: 0;
  top: 0;
  z-index: 3;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  border-radius: 16px;
}
.poster_into_content_box_info{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  background-color: transparent;
}
.poster_into_title {
  background-color: transparent;
  height: 50px;
  color: #ffffff;
  focus-color: #023B2B;
}

.poster_into_icon_box{
  position: relative;
  background-color: transparent;
}
.poster_into_icon_boxf{
  position: relative;
  background-color: transparent;
}
.poster_into_icon{
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  background-color: transparent;
}
.poster_into_iconf{
  z-index: 2;
}
.poster_into_corner{
  position: absolute;
  left: 40px;
  top: 0px;
  width: 20px;
  height: 20px;
  background-color: #D41624;
  border-radius: 10px;
  z-index: 2;
  padding-left: 6px;
  padding-right: 6px;
}
.poster_into_corner_txt{
  width: 20px;
  height: 20px;
  font-size: 12px;
  color: #ffffff;
}
.poster_into_corner_txt2{
  /* width: 6px;
  height: 20px; */
}
</style>