<template>
  <qt-view class="filter-sidebar-list-item" :focusable="true" eventFocus eventClick>
    <qt-text
      class="filter-sidebar-list-item-text"
      text="${name}"
      gravity="center"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-text>
  </qt-view>
</template>

<style scoped lang="scss" src="../../scss/filter-sidebar.scss"></style>
