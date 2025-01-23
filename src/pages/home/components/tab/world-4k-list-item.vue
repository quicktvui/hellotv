<template>
  <qt-view class="world-4k-list-item-root-css" :focusable="true"  eventClick eventFocus name="world_4k_list_item"
           flexStyle="${style}">
    <img class="world-4k-list-item-img-css"
         postDelay="100" :focusable="false" flexStyle="${style}"
         src="${imgBg}"/>

    <qt-view class="world-4k-list-item-title-root-css world-4k-list-item-maintitle-root-css">
      <img class="world-4k-list-item-txt-icon-css" :src="xuanJiIcon"/>
      <qt-text class="world-4k-list-item-txt-css" :fontSize="36" text="${title}" gravity="start|center"/>
    </qt-view>

    <qt-view class="world-4k-list-item-title-root-css world-4k-list-item-subtitle-root-css" showIf="${subTitleShow==true}">
      <img class="world-4k-list-item-subtitle-icon" :src="ic4KSub"/>
      <qt-text class="world-4k-list-item-subtitle" :fontSize="24" text="${subTitle}" gravity="start|center"/>
    </qt-view>
<!--底部按钮-->
    <qt-view class="world-4k-list-item-btn-css" duplicateParentState :focusable="false">
      <img class="world-4k-list-item-btn-icon-css" duplicateParentState showOnState="normal" :src="playIcon" :focusable="false"/>
      <img class="world-4k-list-item-btn-icon-css" duplicateParentState showOnState="focused" :src="playIcon" :focusable="false"/>
      <qt-text class="world-4k-list-item-btn-txt-css" :fontSize="30" :focusable="false"
               duplicateParentState gravity="start|center" text="进入播放"/>
    </qt-view>
  </qt-view>

</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core"
import { ESLogLevel, useESLog } from "@extscreen/es3-core"
import xuanJiIcon from '../../../../assets/def_media/ic_def_media_menu_xuanji.png'
import playIcon from '../../../../assets/def_media/ic_def_media_player_play.png'
import ic4KSub from '../../../../assets/world_4k/ic_4k_world_subtitle.png'

export default defineComponent({
  name: "world-4k-list-item",
  setup(props, context) {
    const log = useESLog()

    return {
      xuanJiIcon,
      playIcon,
      ic4KSub
    }
  }
})
</script>

<style>
.world-4k-list-item-root-css {
  background-color: transparent;
  justify-content: flex-end;
}

.world-4k-list-item-img-css {
  position: absolute;
  width:1413px;height:795px;
  border-radius: 8px;
  background-color: rgba(255,255,255,0.3);
}

.world-4k-list-item-txt-icon-css {
  width: 35px;
  height: 34px;
}

.world-4k-list-item-btn-css {
  flex-direction: row;
  width: 219px;
  height:72px;
  margin-left: 60px;
  margin-bottom: 60px;
  border-radius: 45px;
  background-color: rgba(255,255,255,0.2);
  focus-background-color: #FFFFFF
}

.world-4k-list-item-btn-icon-css {
  position: absolute;
  width: 25px;
  height:29px;
  margin-left: 30px;
  margin-top: 21px;
}

.world-4k-list-item-btn-txt-css {
  position: absolute;
  margin-left: 70px;
  width: 120px;
  height: 72px;
  color: #EDEDED;
  focus-color:black;
}

.world-4k-list-item-title-root-css {
  flex-direction: row;
  align-items: center;
  margin-left: 60px;
  width: 1300px;
  background-color: transparent;
}
.world-4k-list-item-maintitle-root-css{
  margin-bottom: 30px;
  height:60px;
  background-color: transparent;
}
.world-4k-list-item-subtitle-root-css{
  margin-bottom: 26px;
  height: 40px;
}

.world-4k-list-item-subtitle-icon {
  width: 91px;
  height: 33px;
}
.world-4k-list-item-subtitle{
  color: #EDEDED;
  height: 40px;
  width: 1200px;
  margin-left: 18px;
}

.world-4k-list-item-txt-css {
  color: #EDEDED;
  height:60px;
  width: 1200px;
  margin-left: 12px;
  background-color: transparent;
}
</style>
