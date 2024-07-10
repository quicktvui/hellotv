<template>
<div :type="1" class="ran_tab_list_item" autoWidth :clipChildren="false" :focusable="true" :focusScale="1.08">
  <qt-text text="${text}" class="ran_tab_list_item_txt" :focusable="false" duplicateParentState autoWidth gravity="center"></qt-text>
</div>
</template>
<script lang='ts' setup>
</script>
<style scoped>
.ran_tab_list_item {
  height: 60px;
  padding-left: 25px;
  padding-right: 25px;
  border-radius: 30px;
  background-color: transparent;
  focus-background-color: #ffffff;
}
.ran_tab_list_item_txt{
  height: 60px;
  font-size: 30px;
  color: hsl(0, 0%, 75%);
  focus-color: #0E0E0E;
}
</style>