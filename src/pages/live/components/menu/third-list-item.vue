<template>
  <qt-view class="menu-body-list-item" style="width: 380px" :type="1" :focusable="true">
    <qt-view style="background-color: transparent" :focusable="false" duplicateParentState>
      <qt-text
        class="menu-body-list-item-text"
        style="width: 296px; font-size: 32px; height: 52px"
        text="${program}"
        gravity="center|start"
        :focusable="false"
        duplicateParentState
      ></qt-text>
      <qt-view style="background-color: transparent; flex-direction: row; align-items: center" :focusable="false" duplicateParentState>
        <qt-text
          class="menu-body-list-item-text"
          style="width: 154px; height: 40px; font-size: 24px"
          text="${time}"
          gravity="center|start"
          :focusable="false"
          duplicateParentState
        ></qt-text>
        <qt-text
          class="menu-body-list-item-text"
          style="width: 96px; height: 40px; font-size: 24px"
          text="${tips}"
          gravity="center|start"
          :focusable="false"
          duplicateParentState
        ></qt-text>
      </qt-view>
    </qt-view>
    <play-mark
      showIf="${isPlaying}"
      style="width: 20px; height: 20px; position: absolute; right: 14px; bottom: 20px"
      :markColor="'#FFFFFF'"
      :gap="-1"
      :focusable="false"
    />
  </qt-view>
</template>

<style scoped src="../../css/menu.css"></style>
