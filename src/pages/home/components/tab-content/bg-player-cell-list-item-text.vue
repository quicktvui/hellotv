<template>
  <qt-view class="bg-player-cell-list-item"
           flexStyle="${itemStyle}"
           name='${name}'
           :focusable="true"
           eventClick
           eventFocus>
    <qt-view
      style="background-color: transparent; position: absolute"
      flexStyle='${itemStyle}'
      gradientBackground="${gradientBackground}"
      showOnState="focused"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-view>
    <qt-text
      class="bg-player-cell-list-item-text"
      flexStyle='${itemStyle}'
      :focusable="false"
      :showOnState="['normal']"
      text="${text}"
      gravity="center|start"
      :paddingRect="[20, 0, 20, 0]"
      :fontSize='28'
      :lines="2"
      :ellipsizeMode="2"
      :duplicateParentState="true"
    ></qt-text>
    <qt-text
      class="bg-player-cell-list-item-text"
      flexStyle='${itemStyle}'
      :showOnState="['focused', 'selected']"
      :focusable="false"
      text="${textFocus}"
      typeface="bold"
      gravity="center|start"
      :paddingRect="[20, 0, 20, 0]"
      :fontSize='28'
      :lines="2"
      :ellipsizeMode="2"
      :duplicateParentState="true"
    ></qt-text>
    <qt-view
      style="background-color: transparent; position: absolute; width: 42px;height:30px;top:30px"
      :showOnState="['focused', 'selected']"
      :focusable="false"
      :duplicateParentState="true"
    >
      <play-mark style="width: 25px; height: 20px;margin-left: 16px" :markColor="'#FF0000'" :gap="3" :focusable="false" />
    </qt-view>
  </qt-view>
</template>

<style lang="scss" src='../../scss/bg-player-cell-list-item.scss'></style>
