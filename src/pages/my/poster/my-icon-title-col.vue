<template>
  <div
    :type="105"
    layout="${layout}"
    flexStyle="${style}"
    :enableFocusBorder="true"
    :focusable="true"
    eventClick
    :clipChildren="false"
    eventFocus
    class="my-icon-title-col"
    sid="${_id}"
  >
    <div class="my-icon-title-col-icon" :duplicateParentState="true">
      <img
        class="my-icon-title-col-icon-inner"
        flexStyle="${icon.style}"
        :duplicateParentState="true"
        :showOnState="['normal', 'selected']"
        :focusable="false"
        src="${image.src}"
      />
      <img
        class="my-icon-title-col-icon-inner"
        flexStyle="${icon.style}"
        :duplicateParentState="true"
        :showOnState="'focused'"
        :focusable="false"
        src="${focusedImageSrc}"
      />
    </div>
    <text-view
      class="my-icon-title-col-text"
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
.my-icon-title-col {
  position: absolute;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.06);
  flex-direction: column;
  border-radius: 16px;
  focus-border-radius: 16px;
}
.my-icon-title-col-text {
  background-color: transparent;
  font-weight: 500;
}
.my-icon-title-col-icon {
  background-color: transparent;
  width: 80px;
  height: 80px;
  margin-bottom: 30px;
}
.my-icon-title-col-icon-inner {
  position: absolute;
  top: 0;
  left: 0;
}
</style>
