<template>
<div class="d2_introduction">
  <scroll-view :focusable="false" class="d2i_scroll_box" ref="d2iScrollBox" onScrollEnable>
    <qt-column class="d2i_content" autoHeight>
      <qt-text class="d2i_title" text="视频简介" gravity="center"></qt-text>
      <qt-text v-if="stateStr" class="d2i_state" :text="stateStr"></qt-text>
      <text-view v-if="actors" class="d2i_actors" :ellipsizeMode="2" autoHeight :maxLines="2" :text="actors"></text-view>
      <p class="d2i_des" v-if="des">{{ des }}</p>
    </qt-column>
  </scroll-view>
</div>
</template>
<script lang='ts' setup>
import { ref } from 'vue';
import { ESKeyEvent, ESKeyCode } from "@extscreen/es3-core"

const stateStr = ref()
const actors = ref()
const des = ref()

const d2iScrollBox = ref()
let scrollY = 0
defineExpose({
  onESCreate(params){
    scrollY = 0
    stateStr.value = params.status||''
    if(params.playNumber){
      stateStr.value += " | " + params.playNumber + '+播放'
    }
    if(params.actors){
      actors.value = '演职员：' + params.actors
    }
    des.value = '简介：' + (params.des||'')
  },
  onKeyDown (keyEvent:ESKeyEvent){
    if(keyEvent.keyCode===ESKeyCode.ES_KEYCODE_DPAD_DOWN){
      scrollY += 50
      d2iScrollBox.value?.scrollTo(0,scrollY,0)
    }
    if(keyEvent.keyCode===ESKeyCode.ES_KEYCODE_DPAD_UP){
      scrollY -= 50
      d2iScrollBox.value?.scrollTo(0,scrollY,0)
    }
  }
})
</script>
<style scoped>
.d2_introduction{
  width: 1920px;
  height: 1080px;
  background-color: transparent;
}
.d2i_scroll_box{
  width: 900px;
  height: 1080px;
  position: absolute;
  right: 0.01px;
  background-color: #0f0f0f;
}
.d2i_content{
  width: 900px;
  /* height: 1080px; */
  background-color: transparent;
  padding-left: 90px;
  padding-right: 90px;
  padding-top: 100px;
  padding-bottom: 100px;
}
.d2i_title {
  width: 720px;
  height: 58px;
  font-size: 48px;
  color: #ffffff;
  background-color: transparent;
  margin-bottom: 30px;
}
.d2i_state{
  width: 720px;
  height: 40px;
  font-size: 30px;
  color: rgba(255,255,255,0.7);
  background-color: transparent;
  margin-bottom: 30px;
}
.d2i_actors{
  width: 720px;
  height: 90px;
  font-size: 30px;
  color: rgba(255,255,255,0.6);
  background-color: transparent;
  margin-bottom: 50px;
  line-height: 45px;
}
.d2i_des{
  width: 720px;
  font-size: 30px;
  color: rgba(255,255,255,0.6);
  line-height: 45px;
  background-color: transparent;
}
</style>