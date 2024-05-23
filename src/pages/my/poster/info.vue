<template>
  <item-frame :type="3" layout="${layout}" flexStyle="${style}" focusScale="${focus.scale}" :focusable="true" eventClick
    eventFocus name="my_poster_into_name" class="my_poster_into" itemShowShimmer="${shimmer.enable}"
    hideShadow="${shadow.enable}" shimmerSize="${size}">
    <div :focusable="false" :duplicateParentState="true" class="poster_into_content_box" flexStyle="${image.style}" overflow="visible" :clipChildren="false">
      <div :focusable="false" :duplicateParentState="true" class="poster_into_content_box_info" flexStyle="${infoStyle}" autoHeight overflow="visible" :clipChildren="false">
        <div class="poster_into_icon_box" flexStyle="${icon.style}" :focusable="false" overflow="visible" :clipChildren="false">
          <img class="poster_into_icon" flexStyle="${icon.style}" :focusable="false" src="${image.src}"/>
          <div showIf="${_isCornerNum==true}" class="poster_into_corner" :focusable="false" autoWidth>
            <text-view showIf="${_isShowCornerNum==true}" class="poster_into_corner_txt" :focusable="false" gravity="center" text="${cornerNum}" autoWidth/>
            <text-view showIf="${_isShowCornerNum==false}" class="poster_into_corner_txt2" :focusable="false" text=""/>
          </div>
        </div>
        <!-- ${image.src} -->
        <text-view class="poster_into_title" :focusable="false" autoWidth
          textSize="${title.style.fontSize}" :ellipsizeMode="2" :lines="1" :postDelay="200" gravity="center|center"
          text="${title.text}" showIf="${title.enable}" />
      </div>
    </div>
  </item-frame>
</template>
<script lang='ts' setup>
</script>
<style scoped>
.poster_into_content_box{
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  focus-border-color: #ffffff;
  focus-border-style: solid;
  border-radius: 8px;
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
}

.poster_into_icon_box{
  position: relative;
  background-color: transparent;
}
.poster_into_icon{
  background-color: transparent;
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