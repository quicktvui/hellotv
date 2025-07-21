<template>
  <qt-view class="bg-player-list-item" :type="1" :focusable="true" eventClick eventFocus>
    <qt-view
      style="width: 403px; height: 116px; background-color: transparent; position: absolute"
      gradientBackground="${gradientBackground}"
      :showOnState="['focused', 'selected']"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-view>
    <qt-text
      class="bg-player-list-item-text"
      text="${text}"
      gravity="center|start"
      :paddingRect="[20, 0, 20, 0]"
      :showOnState="'normal'"
      :lines="2"
      :ellipsizeMode="2"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-text>
    <qt-text
      class="bg-player-list-item-text"
      style="width: 376px"
      text="${text}"
      typeface="bold"
      gravity="center|start"
      :paddingRect="[20, 0, 20, 0]"
      :showOnState="['focused', 'selected']"
      :lines="2"
      :ellipsizeMode="2"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-text>
    <qt-view
      style="background-color: transparent; position: absolute; top: 60px; right: 20px"
      :showOnState="['focused', 'selected']"
      :focusable="false"
      :duplicateParentState="true"
    >
      <play-mark style="width: 27px; height: 27px" :markColor="'#13161B'" :gap="-1" :focusable="false" />
    </qt-view>
  </qt-view>
</template>

<style lang="scss" src="../../scss/bg-player.scss"></style>
