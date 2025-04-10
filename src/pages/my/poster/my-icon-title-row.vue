<template>
  <div
    :type="102"
    layout="${layout}"
    flexStyle="${style}"
    :enableFocusBorder="true"
    :focusable="true"
    eventClick
    :clipChildren="false"
    eventFocus
    class="my-icon-title-row"
    sid="${_id}"
  >
    <div class="my-icon-title-row-icon" :duplicateParentState="true">
      <img
        class="my-icon-title-row-icon-inner"
        flexStyle="${icon.style}"
        :duplicateParentState="true"
        :showOnState="['normal', 'selected']"
        :focusable="false"
        src="${image.src}"
      />
      <img
        class="my-icon-title-row-icon-inner"
        flexStyle="${icon.style}"
        :duplicateParentState="true"
        :showOnState="'focused'"
        :focusable="false"
        src="${focusedImageSrc}"
      />
    </div>
    <text-view
      class="my-icon-title-row-text"
      :focusable="false"
      autoWidth
      autoHeight
      textSize="${title.style.fontSize}"
      textColor="${title.style.color}"
      :ellipsizeMode="2"
      :lines="1"
      gravity="center"
      text="${title.text}"
    />
  </div>
</template>
<script lang="ts" setup></script>
<style scoped>
.my-icon-title-row {
  position: absolute;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.06);
  flex-direction: row;
  border-radius: 16px;
  focus-border-radius: 16px;
}
.my-icon-title-row-text {
  margin-left: 30px;
  background-color: transparent;
  font-weight: 500;
}
.my-icon-title-row-icon {
  background-color: transparent;
  width: 80px;
  height: 80px;
}
.my-icon-title-row-icon-inner {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
