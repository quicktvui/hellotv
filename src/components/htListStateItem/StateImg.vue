<template>
<qt-view class="list_item_img"
           eventFocus
           :focusable="true"
           :clipChildren="false" :focusScale="1.06" flexStyle="${iStyle}">
    <img :duplicateParentState="true" :focusable="false" showOnState="normal" src="${normalImg}" flexStyle="${imgStyle}"/>
    <img :duplicateParentState="true" :focusable="false" showOnState="selected" src="${selectedImg}" flexStyle="${imgStyle}"/>
    <img :duplicateParentState="true" :focusable="false" showOnState="focused" src="${focusedImg}" flexStyle="${imgStyle}"/>
  </qt-view>
</template>
<script lang='ts' setup>
</script>
<style scoped>
.list_item_img{
    position: relative;
    background-color: transparent;
    justify-content: center;
    align-items: center;
}
.list_item_img img{
    position: absolute;
    align-self: center;
    background-color: transparent;
}
</style>