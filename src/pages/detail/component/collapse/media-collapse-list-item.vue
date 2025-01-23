<template>
  <qt-column class="qt-collapse-list-item"
             :clipChildren="false"
             :enableFocusBorder="false"
             :focusScale="1.1"
             eventClick
             eventFocus
             :focusable=true>
    <div class="qt-collapse-list-item-focus"
         :gradientBackground="{ orientation: 6, colors: ['#FF0057FF', '#FF00C7FF'], cornerRadius: 8 }"
         showOnState="focused"
         duplicateParentState></div>
    <div class="qt-collapse-list-item-text-root" :duplicateParentState="true">
      <div class="qt-collapse-list-item-icon-root" :duplicateParentState="true"
           flexStyle="${iconStyle}">
        <img class="qt-collapse-list-item-icon"
             duplicateParentState
             :src="mediaListItemSelected"
             showOnState="normal"/>
        <img class="qt-collapse-list-item-icon"
             duplicateParentState
             :src="mediaListItemSelected"
             showOnState="focused"/>
        <img class="qt-collapse-list-item-icon"
             duplicateParentState
             :src="mediaListItemSelected"
             showOnState="selected"/>
      </div>
      <qt-text class="qt-collapse-list-item-text"
               :focusable="false"
               gravity="center"
               autoWidth
               :ellipsizeMode="3"
               :duplicateParentState="true"
               :fontSize="30"
               text="${text}"/>
    </div>
  </qt-column>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

import mediaListItemSelected from "../../../../assets/ic_media_list_item_selected.png"
import mediaListItemNormal from "../../../../assets/ic_media_list_item_normal.png"

const TAG = 'QTCollapseListItem'

export default defineComponent({
  name: "media-collapse-list-item",
  setup(props, context) {
    return {
      mediaListItemSelected,
      mediaListItemNormal,
    }
  },
});

</script>

<style scoped>
.qt-collapse-list-item {
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 280px;
  height: 80px;
  background-color: rgba(255, 255, 255, 0.1);
  focus-background-color: rgba(245, 245, 245, 1);
}

.qt-collapse-list-item-focus {
  width: 280px;
  height: 80px;
  background-color: transparent;
  border-radius: 8px;
  position: absolute;
}

.qt-collapse-list-item-text-root {
  background-color: transparent;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.qt-collapse-list-item-text {
  height: 80px;
  color: white;
  font-size: 30px;
  select-color: white;
  font-weight: 400;
  background-color: transparent;
}

.qt-collapse-list-item-icon-root {
  width: 32px;
  height: 32px;
  margin-right: 16px;
  background-color: transparent;
}

.qt-collapse-list-item-icon {
  width: 32px;
  height: 32px;
  background-color: transparent;
  position: absolute;
}
</style>
