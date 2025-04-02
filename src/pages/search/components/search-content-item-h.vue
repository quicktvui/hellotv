<template>
  <qt-view class="search-content-item-h" name="gridItem" :focusable="true" layout="${layout}" eventFocus eventClick>
    <qt-image
      class="search-content-item-img-h"
      src="${cover}"
      :postDelay="100"
      :enableFocusBorder="true"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-image>
    <qt-text
      class="search-content-item-text"
      style="width: 410px"
      text="${title}"
      gravity="center|start"
      :lines="1"
      :ellipsizeMode="4"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-text>
  </qt-view>
</template>

<style scoped lang="scss" src="../scss/search-content.scss"></style>
