<template>
  <item-frame :type="104" layout="${layout}" flexStyle="${image.style}" focusScale="${focus.scale}" :focusable="true" eventClick
    eventFocus name="my_poster_user_name" class="my_poster_user" itemShowShimmer="${shimmer.enable}"
    hideShadow="${shadow.enable}" shimmerSize="${size}">
    <div :focusable="false" overflow="hidden" :clipChildren="true" :duplicateParentState="true" class="poster_user_content_box" flexStyle="${image.style}">
      <div class="poster_user_icon_box">
        <img class="poster_user_icon" flexStyle="${avatarStyle}" :focusable="false" src="${image.src}"/>
      </div>

      <div class="poster_user_content_box_info" :focusable="false" flexStyle="${infoStyle}" autoHeight :duplicateParentState="true">
        <text-view class="poster_user_title" :focusable="false" autoWidth
          textSize="${title.style.fontSize}" :ellipsizeMode="2" :lines="1" :postDelay="200" gravity="centerVertical|center"
          text="${title.text}" showIf="${title.enable}" />
        <text-view 
          class="poster_user_title_tip" :focusable="false" autoWidth
          :ellipsizeMode="2" :lines="1" :postDelay="200" gravity="centerVertical"
          text="${tip}" showIf="${title.enable}" />
        <div class="poster_user_subtitle" :focusable="false" :duplicateParentState="true" :enableBlackBorder="false">
          <div class="poster_user_subtitle_bg" :showOnState="['focused','selected']" :gradientBackground="{colors:['#FF0057FF','#FF00C7FF'], cornerRadii4: [34, 34, 34, 34],orientation:6}"></div>
          <div class="poster_user_subtitle_inner">
            <text-view 
              class="poster_user_subtitle_txt" :focusable="false" :ellipsizeMode="2" :lines="1"
              gravity="center" text="${subTitle.text}" autoWidth :duplicateParentState="true"
            />
          </div>
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
  /* background-color: rgba(255, 255, 255, 0.06); */
  background-color: transparent;
  border-radius: 8px;
  /* focus-border-color: #ffffff;
  focus-border-style: solid; */
}
.poster_user_icon_box{
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 100px;
  margin-left: 35px;
  background-color: rgba(216,216,216,0.15);
  border-style: solid;
  border-width: 1px;
  border-color: #ffffff;
}
.poster_user_icon{
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
}
.poster_user_subtitle{
  position: relative;
  width: 210px;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.6);
  border-radius: 34px;
  /* focus-background-color: #ffffff; */
  margin-top: 20px;
}
.poster_user_subtitle_bg{
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  width: 210px;
  height: 60px;
  border-radius: 34px;
}
.poster_user_subtitle_inner{
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 210px;
  height: 60px;
  border-radius: 34px;
}
.poster_user_subtitle_txt{
  height: 60px;
  background-color: transparent;
  font-size: 26px;
  color: #ffffff;
  /* focus-color: #000000; */
}
.poster_user_title_tip{
  font-size: 24px;
  height: 36px;
  color: #9C9C9C;
  margin-top: 30px;
}
</style>