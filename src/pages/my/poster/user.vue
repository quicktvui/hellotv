<template>
  <div :type="104" layout="${layout}" :focusable="true" eventClick eventFocus overflow="hidden" :clipChildren="true"
    class="poster_user_content_box" flexStyle="${image.style}">
    <img class="poster_user_icon" :focusable="false" src="${image.src}" :postDelay="300" />

    <div class="poster_user_content_box_info" :focusable="false" flexStyle="${infoStyle}" autoHeight duplicateParentState>
      <text-view class="poster_user_title" :focusable="false" textSize="${title.style.fontSize}" :ellipsizeMode="4"
        :lines="1" :postDelay="200" gravity="centerVertical|start" text="${title.text}" showIf="${title.enable}"
        typeface="bold" />
      <text-view class="poster_user_title_tip" :focusable="false" autoWidth :ellipsizeMode="2" :lines="1"
        :postDelay="200" gravity="centerVertical" text="${tip}" showIf="${title.enable}" />
      <div class="poster_user_subtitle" :focusable="false" duplicateParentState>
        <div class="poster_user_subtitle_bg_f p_ab" :showOnState="['focused', 'selected']" :focusable="false"
          duplicateParentState>
          <!-- <div class="poster_user_subtitle_bg_f_inner" :focusable="false"></div> -->
        </div>
        <div class="poster_user_subtitle_bg p_ab" :focusable="false" showOnState="normal" duplicateParentState>
          <!-- <div class="poster_user_subtitle_bg_inner" :focusable="false"></div> -->
        </div>
        <text-view class="poster_user_subtitle_txt p_ab" :focusable="false" duplicateParentState gravity="center"
          text="${subTitle.text}" typeface="bold" />
      </div>
    </div>
  </div>
</template>
<script lang='ts' setup>
</script>
<style scoped>
.poster_user_content_box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  background-color: transparent;
  border-radius: 16px;
}

.poster_user_icon_box {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 100px;
  background-color: transparent;
}

.poster_user_icon_bg {
  width: 198px;
  height: 198px;
  position: absolute;
  left: 1px;
  top: 1px;
  z-index: 1;
  background-color: rgba(216, 216, 216, 0.5);
  border-style: solid;
  border-width: 1px;
  border-color: rgba(216, 216, 216, 0.15);
  border-radius: 100px;
}

.poster_user_icon {
  width: 200px;
  height: 200px;
  border-radius: 100px;
  background-color: transparent;
}

.poster_user_content_box_info {
  margin-left: 59px;
  display: flex;
  flex-direction: column;
  background-color: transparent;
}

.poster_user_title {
  width: 260px;
  background-color: transparent;
  height: 50px;
  color: #ffffff;
}

.p_ab {
  position: absolute;
  left: 0.01px;
  top: 0.01px;
}

.poster_user_subtitle {
  position: relative;
  width: 210px;
  height: 60px;
  background-color: transparent;
  border-radius: 30px;
  margin-top: 25px;
}

.poster_user_subtitle_bg {
  z-index: 1;
  width: 210px;
  height: 60px;
  border-radius: 30px;
  background-color: rgba(255,255,255,0.15);
  border-style: solid;
  border-width: 1px;
  border-color: rgba(255,255,255,0.5);
}

.poster_user_subtitle_bg_inner {
  width: 210px;
  height: 56px;
  border-radius: 30px;
  background-color: #41C1FF;
}

.poster_user_subtitle_bg_f_inner {
  width: 210px;
  height: 56px;
  border-radius: 30px;
  background-color: #FFE60D;
}

.poster_user_subtitle_bg_f {
  z-index: 2;
  width: 210px;
  height: 60px;
  border-radius: 30px;
  background-color: #ffffff;
}

.poster_user_subtitle_bg_f_icon {
  position: absolute;
  right: 11px;
  top: 8px;
  width: 32px;
  height: 22px;
  z-index: 2;
}

.poster_user_subtitle_txt {
  z-index: 3;
  width: 210px;
  height: 56px;
  border-radius: 30px;
  background-color: transparent;
  font-size: 26px;
  color: #ffffff;
  focus-color: #023B2B;
}

.poster_user_title_tip {
  font-size: 24px;
  height: 36px;
  color: #FFFFFF;
  opacity: 0.7;
  background-color: transparent;
  margin-top: 30px;
}
</style>