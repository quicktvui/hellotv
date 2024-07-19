<template>
<qt-view :type="selectionPosterTypes.text" class="d2sti_tabs_item" autoWidth :clipChildren="false" :focusable="true" :focusScale="1.08">
  <qt-text text="${tName}" class="d2sti_tabs_item_txt" :focusable="false" duplicateParentState autoWidth gravity="center"></qt-text>
</qt-view>
<qt-view :type="selectionPosterTypes.btn" class="d2sti_tabs_btn_item" :clipChildren="false" :focusable="true" :focusScale="1.08">
  <qt-text text="${tName}" class="d2sti_tabs_item_btn_txt" :focusable="false" duplicateParentState gravity="center" :ellipsizeMode="2" :lines="1"></qt-text>
</qt-view>
</template>
<script lang='ts' setup>
import { selectionPosterTypes } from '../../../api/details2/types'
</script>
<style scoped>
.d2sti_tabs_item {
  height: 60px;
  padding-left: 25px;
  padding-right: 25px;
  border-radius: 30px;
  background-color: transparent;
  focus-background-color: #ffffff;
}
.d2sti_tabs_item_txt{
  height: 60px;
  font-size: 42px;
  color: #BFBFBF;
  select-color: #FFFFFF;
  focus-color: #0E0E0E;
}

.d2sti_tabs_btn_item {
  width: 180px;
  height: 66px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 9px;
  margin-right: 20px;
  background-color: rgba(102, 102, 102, 0.2);
  focus-background-color: #ffffff;
}
.d2sti_tabs_item_btn_txt {
  width: 140px;
  height: 66px;
  color: #BFBFBF;
  font-size: 30px;
  focus-color: #0E0E0E;
  select-color: #FF5E90;
}
</style>