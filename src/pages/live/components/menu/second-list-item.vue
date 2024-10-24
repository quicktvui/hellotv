<template>
  <qt-view class="menu-body-list-item" style="width: 400px" :type="1" :focusable="true" eventFocus eventClick>
    <!-- 角标 -->
    <qt-image showIf="${isVip}" class="menu-body-list-item-corner" :src="icCornerVip" :focusable="false"></qt-image>
    <!-- 主体 -->
    <qt-view style="background-color: transparent; flex-direction: row; align-items: center" :focusable="false" duplicateParentState>
      <qt-text
        class="menu-body-list-item-text"
        style="width: 110px; height: 52px"
        text="${id}"
        gravity="center"
        :focusable="false"
        duplicateParentState
      ></qt-text>
      <qt-view style="width: 270px; background-color: transparent" :focusable="false" duplicateParentState>
        <qt-text
          class="menu-body-list-item-text"
          style="width: 270px; height: 40px; font-size: 32px; line-height: 40px"
          text="${name}"
          gravity="center|start"
          :focusable="false"
          :lines="1"
          :ellipsizeMode="2"
          duplicateParentState
        ></qt-text>
        <qt-text
          class="menu-body-list-item-text"
          style="width: 230px; height: 40px; font-size: 24px"
          text="${program}"
          gravity="center|start"
          :focusable="false"
          :lines="1"
          :ellipsizeMode="4"
          :horizontalFadingEdgeEnabled="true"
          :fadingEdgeLength="10"
          duplicateParentState
        ></qt-text>
      </qt-view>
    </qt-view>
    <!-- 播放图标 -->
    <play-mark showIf="${isPlaying}" class="menu-body-list-item-playmark" :markColor="'#FFFFFF'" :gap="-1" :focusable="false" />
  </qt-view>
</template>

<script setup lang="ts">
import icCornerVip from '../../../../assets/live/ic-corner-vip.png'
</script>

<style scoped src="../../css/menu.css"></style>
