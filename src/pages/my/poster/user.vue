<template>
  <item-frame :type="4" layout="${layout}" flexStyle="${image.style}" focusScale="${focus.scale}" :focusable="true" eventClick
    eventFocus name="my_poster_user_name" class="my_poster_user" itemShowShimmer="${shimmer.enable}"
    hideShadow="${shadow.enable}" shimmerSize="${size}">
    <div :focusable="false" overflow="hidden" :clipChildren="true" :duplicateParentState="true" class="poster_user_content_box" flexStyle="${image.style}">
      <img class="poster_user_icon" :focusable="false" src="${image.src}"/>

      <div class="poster_user_content_box_info" :focusable="false" flexStyle="${infoStyle}" autoHeight :duplicateParentState="true">
        <text-view class="poster_user_title" :focusable="false" autoWidth
          textSize="${title.style.fontSize}" :ellipsizeMode="2" :lines="1" :postDelay="200" gravity="centerVertical|center"
          text="${title.text}" showIf="${title.enable}" />
        <div class="poster_user_subtitle" :focusable="false" :duplicateParentState="true" :enableBlackBorder="false">
          <text-view 
            class="poster_user_subtitle_txt" :focusable="false" :ellipsizeMode="2" :lines="1"
            gravity="center" text="${subTitle.text}" autoWidth
          />
        </div>
      </div>
    </div>
  </item-frame>
</template>
<script lang='ts' setup>
</script>
<style scoped>
.my_poster_user{
  background-color: transparent;
}
.poster_user_content_box{
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  focus-border-color: #ffffff;
  focus-border-style: solid;
}
.poster_user_icon{
  width: 140px;
  height: 140px;
  border-radius: 70px;
  margin-left: 50px;
  background-color: transparent;
}
.poster_user_content_box_info{
  margin-left: 25px;
  display: flex;
  flex-direction: column;
  background-color: transparent;
}
.poster_user_title {
  background-color: transparent;
  height: 50px;
  color: #ffffff;
  margin-bottom: 20px;
}
.poster_user_subtitle{
  width: 210px;
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 34px;
  /* focus-background-color: #ffffff; */
}
.poster_user_subtitle_txt{
  height: 60px;
  background-color: transparent;
  font-size: 26px;
  color: rgba(255, 255, 255, 0.5);
}
</style>