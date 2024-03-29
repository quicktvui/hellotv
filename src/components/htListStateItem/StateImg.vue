<template>
<qt-view class="list_item_img"
           eventFocus
           :focusable="true"
           :clipChildren="false" :focusScale="1.06">
    <img :duplicateParentState="true" :focusable="false" showOnState="normal" src="${normalImg}"/>
    <img :duplicateParentState="true" :focusable="false" showOnState="selected" src="${selectedImg}"/>
    <img :duplicateParentState="true" :focusable="false" showOnState="focused" src="${focusedImg}"/>
  </qt-view>
</template>
<script lang='ts' setup>
</script>
<style scoped>
.list_item_img{
    position: relative;
    width: 340px;
    height: 106px;
    background-color: transparent;
    justify-content: center;
    align-items: center;
}
.list_item_img img{
    position: absolute;
    width: 300px;
    height: 86px;
    align-self: center;
}
</style>