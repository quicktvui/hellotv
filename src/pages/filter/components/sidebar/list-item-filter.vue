<template>
  <qt-view
    class="filter-sidebar-list-item"
    style="flex-direction: row; align-items: center; justify-content: center"
    :focusable="true"
    eventFocus
    eventClick
  >
    <qt-view class="filter-sidebar-list-item-img" :focusable="false" :duplicateParentState="true">
      <qt-image
        class="filter-sidebar-list-item-img"
        style="position: absolute"
        src="${icon.normal}"
        showOnState="normal"
        :focusable="false"
        :duplicateParentState="true"
      ></qt-image>
      <qt-image
        class="filter-sidebar-list-item-img"
        style="position: absolute"
        src="${icon.focused}"
        showOnState="focused"
        :focusable="false"
        :duplicateParentState="true"
      ></qt-image>
      <qt-image
        class="filter-sidebar-list-item-img"
        style="position: absolute"
        src="${icon.selected}"
        showOnState="selected"
        :focusable="false"
        :duplicateParentState="true"
      ></qt-image>
    </qt-view>
    <qt-view style="height: 106px; background-color: transparent" autoWidth :focusable="false" :duplicateParentState="true">
      <qt-text
        class="filter-sidebar-list-item-text"
        text="${name}"
        autoWidth
        gravity="center"
        :showOnState="['normal', 'selected']"
        :focusable="false"
        :duplicateParentState="true"
      ></qt-text>
      <qt-text
        class="filter-sidebar-list-item-text"
        text="${name}"
        autoWidth
        gravity="center"
        typeface="bold"
        :showOnState="'focused'"
        :focusable="false"
        :duplicateParentState="true"
      ></qt-text>
    </qt-view>
  </qt-view>
</template>

<style scoped lang="scss" src="../../scss/filter-sidebar.scss"></style>
