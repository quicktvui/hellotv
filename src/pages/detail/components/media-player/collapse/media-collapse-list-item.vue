<template>
  <qt-view
    class="media-collapse-list-item"
    :clipChildren="false"
    :enableFocusBorder="false"
    :focusScale="1.1"
    eventClick
    eventFocus
    :focusable=true>
    <div class="media-collapse-list-item-focus-bg"
      showOnState="focused" duplicateParentState
      :gradientBackground="{ orientation: 6, colors: ['#ffffff', '#ffffff'], cornerRadius: 8 }">
    </div>
    <div class="media-collapse-list-item-content" :duplicateParentState="true">
      <div class="media-collapse-list-item-img" :duplicateParentState="true" flexStyle="${iconStyle}">
        <img duplicateParentState :src="mediaListItemSelected" showOnState="normal"/>
        <img duplicateParentState :src="mediaListItemNormal" showOnState="focused"/>
        <img duplicateParentState :src="mediaListItemNormal" showOnState="selected"/>
      </div>
      <qt-text class="media-collapse-list-item-text" :focusable="false"
        gravity="center" text="${text}" autoWidth :ellipsizeMode="3"
        :duplicateParentState="true" :fontSize="30"/>
    </div>
  </qt-view>
</template>

<script setup lang='ts' name='media-collapse-list-item'>
import mediaListItemSelected from "../../../../../assets/detail/ic_media_list_item_selected.png"
import mediaListItemNormal from "../../../../../assets/detail/ic_media_list_item_normal.png"
</script>

<style lang='scss' scoped>
.media-collapse-list-item{
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 280px;
  height: 80px;
  background-color: rgba(255, 255, 255, 0.1);
  focus-background-color: rgba(245, 245, 245, 1);
  .media-collapse-list-item-focus-bg{
    width: 280px;
    height: 80px;
    background-color: transparent;
    border-radius: 8px;
    position: absolute;
  }
  .media-collapse-list-item-content {
    background-color: transparent;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    .media-collapse-list-item-img{
      width: 32px;
      height: 32px;
      margin-right: 16px;
      background-color: transparent;
      img{
        width: 32px;
        height: 32px;
        background-color: transparent;
        position: absolute;
      }
    }
    .media-collapse-list-item-text{
      height: 80px;
      color: white;
      font-size: 30px;
      select-color: white;
      focus-color: #000;
      background-color: transparent;
    }
  }
}
</style>
