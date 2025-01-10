<template>
  <div class='world-4k-item-root-css'
       name="${name}"
       :clipChildren="false" :focusable="true"
       eventClick eventFocus>
    <!-- 背景图-->
    <img class='world-4k-item-bg' sid="${sid}"
         :postDelay="100" :focusable="false" flexStyle="${image.style}"
         src="${image.normal}"/>
    <!-- 焦点阴影-->
    <div class='world-4k-item-focused-bg'
         :showOnState="['selected','focused']" duplicateParentState
         :gradientBackground="{colors: ['#d91C2745', '#00000000'],  orientation: 4}"/>
    <!-- 主标题-->
    <qt-view class="world-4k-item-title  world-4k-item-main-title" >
      <img class="world-4k-item-txt-icon" :src="xuanJiIcon" />
      <qt-text class="world-4k-item-txt" :fontSize="36" text="${title}" gravity="start|center" :lines='1'/>
    </qt-view>
    <!-- 副标题-->
    <qt-view class="world-4k-item-title world-4k-item-sub-title" showIf="${subTitleShow==true}">
      <img class="world-4k-item-sub-txt-icon" :src="ic4KSub"/>
      <qt-text class="world-4k-item-sub-txt" :fontSize="24" text="${subTitle}" gravity="start|center"/>
    </qt-view>
    <!--底部按钮-->
    <qt-view class="world-4k-item-btn" duplicateParentState :focusable="false">
      <img class="world-4k-item-btn-icon" duplicateParentState :showOnState="['normal', 'selected']" :src="playIcon" :focusable="false"/>
      <img class="world-4k-item-btn-icon" duplicateParentState showOnState="focused" :src="playIconFocus" :focusable="false"/>
      <qt-text class="world-4k-item-btn-txt" :fontSize="30" :focusable="false"
               duplicateParentState gravity="start|center" text="进入详情"/>
    </qt-view>
  </div>

</template>

<script lang='ts' setup name='world-four-section-item'>
import xuanJiIcon from "../../../../../assets/component-media/ic_media_menu_xuanji_normal.png"
import playIcon from "../../../../../assets/component-media/ic_media_btn_play.png"
import playIconFocus from "../../../../../assets/home/ic_4k_play_focused.png"
import ic4KSub from "../../../../../assets/home/ic_4k_subtitle_normal.png"


defineExpose({})

</script>

<style lang='scss' src='../../../scss/world-four-section.scss'>

</style>
