<template>
  <div class="poster_title_box" flexStyle="${titleStyle}" overflow="visible" :clipChildren="false" :duplicateParentState="true" :focusable="false">
    <div class="poster_title_focus_box" showOnState="focused" flexStyle="${titleFocusStyle}" :duplicateParentState="true" :focusable="false">
      <text-view
        :duplicateParentState="true" :focusable="false"
        :fontSize="30"
        :ellipsizeMode="2"
        autoHeight
        :maxLines="2"
        gravity="left"
        :paddingRect="[16,8,12,8]"
        style="background-color: transparent;color: #000000;"
        flexStyle="${focusTitle.style}"
        text="${focusTitle.text}"/>
      <text-view
        :duplicateParentState="true"
        :focusable="false"
        :fontSize="24"
        :ellipsizeMode="2"
        :lines="1"
        autoHeight
        gravity="left|top"
        :paddingRect="[16,0,0,16]"
        style="color: rgba(0,0,0,.4);background-color: transparent"
        flexStyle="${subTitle.style}"
        text="${subTitle.text}"
        visibility="${subTitle}"/>
    </div>
    <div class="poster_title_default_box" :showOnState="['normal', 'selected']"  flexStyle="${titleStyle}" :duplicateParentState="true" :focusable="false">
      <text-view
        :duplicateParentState="true"
        :focusable="false"
        :textSize="30"
        :ellipsizeMode="2"
        autoHeight
        :lines="1"
        :postDelay="200"
        gravity="left"
        :paddingRect="[16,8,0,0]"
        gradientBackground="${title.background}"
        style="background-color: transparent;"
        flexStyle="${title.style}"
        text="${title.text}"
        showIf="${title.enable}"/>
      <text-view
        :duplicateParentState="true"
        :focusable="false"
        :fontSize="24"
        :ellipsizeMode="2"
        :lines="1"
        autoHeight
        gravity="left|top"
        :paddingRect="[16,0,0,16]"
        flexStyle="${subTitle.style}"
        style="background-color: transparent"
        text="${subTitle.text}"
        visibility="${subTitle}"/>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.poster_title_box {
  position: relative;
  background-color: transparent;
  z-index: 30;
}
.poster_title_focus_box,.poster_title_default_box{
  position: absolute;
  left: 0;
  top: 0;
  z-index: 50;
  flex-direction: column;
  background-color: transparent;
}
.poster_title_focus_box{
  top: 10px;
  left: -0.5px;
  background-color: #ffffff;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
</style>
