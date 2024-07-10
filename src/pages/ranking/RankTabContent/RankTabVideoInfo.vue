<template>
<div class="rtv_info">
  <p class="rtv_ranking_name">热门榜</p>
  <!-- <img src="http://lexueimg.educdn.huan.tv/eduImg/upload/img5/20210709105200002.png" class="rtv_video_name_img" /> -->
  <p class="rtv_video_name">2022最美的夜bilibili晚会</p>
  <!-- <p class="rtv_video_sub_name">间谍过家家</p> -->
  <div class="rtv_video_tag_box">
    <p class="rtv_video_tag">日常｜搞笑｜战斗 跟新至第24话</p>
    <p class="rtv_video_score">9.7分</p>
  </div>
  <text-view 
    class="rtv_video_des"
    text="豆瓣飚分9.2，口碑逆天！年度霸权回归后半部开播！星光阿尼亚回归星光阿尼亚回归星光阿尼亚回归星光阿尼亚回归！"
    :ellipsizeMode="2"
    :lines="2"
    autoHeight
    gravity="left"
  />
  <tv-list
    class="rtv_video_bg_tag_list" :list="bgTags" horizontal
    ref="rtvVideoBgTagListRef"
    :clipChildren="false" :focusable="false" :endHintEnabled="false"
  >
    <qt-text 
      type="101" class="rtv_video_bg_tag" :focusable="false" 
      text="${txt}" gravity="center"
    />
  </tv-list>
</div>
</template>
<script lang='ts' setup>
import { onMounted, ref } from 'vue';


const rtvVideoBgTagListRef = ref()
const bgTags = [
  {id: 1, txt: '会员抢先看', type: 101},
  {id: 2, txt: '会员抢先看2', type: 101},
  {id: 3, txt: '会员抢先看3', type: 101}
]
onMounted(()=>{
  // rtvVideoBgTagListRef.value.setListData(bgTags)
})
</script>
<style scoped>
.rtv_info {
  width: 636px;
  height: 560px;
  background-color: transparent;
}
.rtv_ranking_name {
  font-size: 36px;
  color: #BFBFBF;
  margin-top: 50px;
}
.rtv_video_name {
  font-size: 48px;
  font-weight: bold;
  color: #FFFFFF;
  margin-top: 150px;
}
.rtv_video_sub_name {
  font-size: 30px;
  color: #EC0000;
}
.rtv_video_tag_box {
  height: 50px;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-top: 10px;
  background-color: transparent;
}
.rtv_video_tag {
  font-size: 30px;
  color: #BFBFBF;
  margin-right: 15px;
}
.rtv_video_score {
  height: 52px;
  font-size: 42px;
  color: #FF9F0A;
}
.rtv_video_des {
  width: 540px;
  height: 90px;
  font-size: 30px;
  color: #BFBFBF;
  margin-top: 10px;
}
.rtv_video_name_img {
  width: 540px;
  height: 150px;
  margin-top: 100px;
}
.rtv_video_bg_tag_list {
  width: 540px;
  height: 30px;
  background-color: #000000;
}
.rtv_video_bg_tag {
  width: 200px;
  height: 30px;
  font-size: 20px;
  color: #FFFFFF;
  background-color: #FF6699;
}
</style>