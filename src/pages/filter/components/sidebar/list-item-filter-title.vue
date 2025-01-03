<template>
  <qt-view class="filter-sidebar-list-item" style="flex-direction: row; align-items: center" :focusable="true" eventFocus eventClick>
    <qt-image
      style="width: 36px; height: 36px; background-color: transparent; position: absolute; left: 50px"
      src="${icon.normal}"
      showOnState="normal"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-image>
    <qt-image
      style="width: 36px; height: 36px; background-color: transparent; position: absolute; left: 50px"
      src="${icon.focused}"
      showOnState="focused"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-image>
    <qt-image
      style="width: 36px; height: 36px; background-color: transparent; position: absolute; left: 50px"
      src="${icon.selected}"
      showOnState="selected"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-image>
    <qt-text
      class="filter-sidebar-list-item-text"
      style="margin-left: 98px"
      text="${name}"
      autoWidth
      gravity="center"
      :showOnState="['normal', 'selected']"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-text>
    <qt-text
      class="filter-sidebar-list-item-text"
      style="margin-left: 98px"
      text="${name}"
      autoWidth
      gravity="center"
      typeface="bold"
      :showOnState="'focused'"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-text>
    <!-- <qt-view
      style="width: 4px; height: 30px; background-color: white; margin-left: 25px; margin-top: 6px"
      showOnState="selected"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-view> -->
  </qt-view>
</template>

<style scoped lang="scss" src="../../scss/filter-sidebar.scss"></style>
