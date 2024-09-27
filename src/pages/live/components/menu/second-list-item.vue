<template>
  <qt-view class="menu-body-list-item" style="width: 400px" :type="1" :focusable="true" eventFocus>
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
          duplicateParentState
        ></qt-text>
      </qt-view>
    </qt-view>
    <!-- 播放图标 -->
    <play-mark
      showIf="${isPlaying}"
      style="width: 20px; height: 20px; position: absolute; right: 19px; bottom: 26px"
      :markColor="'#FFFFFF'"
      :gap="-1"
      :focusable="false"
    />
  </qt-view>
</template>

<style scoped src="../../css/menu.css"></style>
