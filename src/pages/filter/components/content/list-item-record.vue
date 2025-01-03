<template>
  <qt-view class="filter-main-conditions-list-record-item" :focusable="false">
    <qt-text class="filter-main-conditions-list-record-item-text" autoWidth text="${text}" gravity="center"></qt-text>
  </qt-view>
</template>

<style scoped lang="scss">
.filter-main-conditions-list-record-item {
  height: 46px;
  background-color: transparent;
  align-items: center;
  justify-content: center;
  border-width: 1px;
  border-style: solid;
  border-color: #ffffff;
  border-radius: 8px;
}

.filter-main-conditions-list-record-item-text {
  height: 38px;
  color: $text-normal-color;
  font-size: 28px;
  padding-left: 12px;
  padding-right: 12px;
}
</style>
