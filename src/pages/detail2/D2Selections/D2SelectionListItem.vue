<template>
  <qt-view :type="posterTypes.bigBtn" class="d2sli_list_btn_item" autoWidth :clipChildren="false" :focusable="true"
    :focusScale="1.08">
    <qt-text 
      text="${title.text}" class="d2sli_list_btn_item_txt" :focusable="false" 
      duplicateParentState gravity="center" :ellipsizeMode="2" :lines="1"
    ></qt-text>
  </qt-view>
</template>
<script lang='ts' setup>
import { posterTypes } from '../../../api/details2/types'

</script>
<style scoped>
.d2sli_list_btn_item {
  width: 307px;
  height: 120px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 9px;
  margin-right: 40px;
  background-color: rgba(102, 102, 102, 0.2);
  focus-background-color: #ffffff;
}

.d2sli_list_btn_item_txt {
  width: 267px;
  height: 120px;
  color: #BFBFBF;
  font-size: 30px;
  focus-color: #0E0E0E;
  select-color: #FF5E90;
}
</style>