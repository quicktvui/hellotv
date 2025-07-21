<template>
  <qt-view class="menu-body-list-item" :type="2" :focusable="true" eventFocus>
    <qt-text
      class="menu-body-list-item-text"
      text="${name}"
      typeface="bold"
      gravity="center"
      :focusable="false"
      :lines="1"
      :ellipsizeMode="2"
      duplicateParentState
    ></qt-text>
  </qt-view>
</template>

<style scoped src="../../css/menu.css"></style>
