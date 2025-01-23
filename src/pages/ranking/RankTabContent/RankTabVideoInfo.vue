<template>
<div class="rtv_info" :focusable="false">
  <qt-text class="rtv_ranking_name" text="${rankName.text}" flexStyle="${rankName.style}"></qt-text>
  <img :focusable="false" flexStyle="${vcTitleImg.style}" src="${vcTitleImg.url}" class="rtv_video_name_img" />
  <qt-text class="rtv_video_name" text="${vcTitle.text}" flexStyle="${vcTitle.style}"></qt-text>
  <qt-text class="rtv_video_sub_name" text="${vcSubTitle.text}" flexStyle="${vcSubTitle.style}"></qt-text>
  <qt-text
    class="rtv_video_tag"
    text="${tagStr.text}" flexStyle="${tagStr.style}"
  />
  
  <text-view 
    class="rtv_video_des"
    text="${des.text}" flexStyle="${des.style}"
    :ellipsizeMode="2"
    :lines="2"
    autoHeight
    gravity="left"
  />
  <tv-list
    class="rtv_video_bg_tag_list" list="${bgTags}" horizontal
    ref="rtvVideoBgTagListRef"
    :clipChildren="false" :focusable="false" :endHintEnabled="false"
  >
    <div type="101" class="rtv_video_bg_tag_box" autoWidth :focusable="false">
      <qt-text 
        class="rtv_video_bg_tag" :focusable="false" 
        text="${txt}" gravity="center" autoWidth
      />
    </div>
  </tv-list>
</div>
</template>
<script lang='ts' setup>
// import { onMounted, ref } from 'vue';

</script>
<style scoped>
.rtv_info {
  width: 630px;
  height: 560px;
  background-color: transparent;
}
.rtv_ranking_name {
  font-size: 36px;
  color: #BFBFBF;
}
.rtv_video_name {
  font-size: 48px;
  font-weight: bold;
  color: #FFFFFF;
}
.rtv_video_sub_name {
  font-size: 30px;
  color: #EC0000;
}

.rtv_video_tag {
  width: 600px;
  font-size: 30px;
  color: #BFBFBF;
}

.rtv_video_des {
  width: 540px;
  font-size: 30px;
  color: #BFBFBF;
}
.rtv_video_name_img {
  width: 540px;
}
.rtv_video_bg_tag_list {
  width: 540px;
  height: 30px;
  margin-top: 20px;
  background-color: transparent;
}
.rtv_video_bg_tag_box {
  height: 30px;
  border-radius: 2px;
  padding-left: 5px;
  padding-right: 5px;
  background-color: #FF6699;
}
.rtv_video_bg_tag {
  height: 30px;
  font-size: 20px;
  color: #FFFFFF;
}
</style>