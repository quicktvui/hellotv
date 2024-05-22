<template>
  <item-frame :type="3" layout="${layout}" flexStyle="${style}" focusScale="${focus.scale}" :focusable="true" eventClick
    eventFocus name="my_poster_into_name" class="my_poster_into" itemShowShimmer="${shimmer.enable}"
    hideShadow="${shadow.enable}" shimmerSize="${size}">
    <div :focusable="false" :duplicateParentState="true" class="poster_into_content_box" flexStyle="${innerStyle}">
      <div :focusable="false" :duplicateParentState="true" class="poster_into_content_box_info" flexStyle="${infoStyle}" autoHeight>
        <img class="poster_into_icon" :focusable="false" src="${image.src}"/>
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
  border-radius: 15px;
  focus-border-color: #ffffff;
  focus-border-style: solid;
  border-radius: 15px;
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
.poster_into_icon{
  width: 80px;
  height: 80px;
  background-color: transparent;
}
</style>