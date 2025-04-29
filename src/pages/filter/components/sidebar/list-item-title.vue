<template>
  <qt-view class="filter-sidebar-list-item" :focusable="false">
    <qt-text
      class="filter-sidebar-list-item-text"
      style="color: #ffffff; font-size: 40px"
      text="${name}"
      gravity="center|end"
      typeface="bold"
      :focusable="false"
    ></qt-text>
  </qt-view>
</template>

<style scoped lang="scss" src="../../scss/filter-sidebar.scss"></style>
