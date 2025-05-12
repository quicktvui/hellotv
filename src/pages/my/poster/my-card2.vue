<template>
  <div
    :type="106"
    layout="${layout}"
    flexStyle="${style}"
    :enableFocusBorder="true"
    :focusable="true"
    eventClick
    :clipChildren="false"
    eventFocus
    class="my-poster-card2"
    sid="${_id}"
  >
    <text-view
      class="my-poster-card2-text"
      :focusable="false"
      autoWidth
      autoHeight
      textSize="${title.style.fontSize}"
      textColor="${titleFontColor}"
      :ellipsizeMode="2"
      :lines="1"
      gravity="center"
      text="${title.text}"
    />
    <div class="my-poster-card2-icon" :duplicateParentState="true">
      <img
        class="my-poster-card2-icon-inner"
        flexStyle="${icon.style}"
        :duplicateParentState="true"
        :showOnState="['normal', 'selected']"
        :focusable="false"
        src="${image.src}"
      />
      <img
        class="my-poster-card2-icon-inner"
        flexStyle="${icon.style}"
        :duplicateParentState="true"
        :showOnState="'focused'"
        :focusable="false"
        src="${focusedImageSrc}"
      />
    </div>

    <text-view
      class="my-poster-card2-tip"
      :focusable="false"
      autoWidth
      autoHeight
      :ellipsizeMode="2"
      :lines="1"
      gravity="center"
      text="${tip}"
    />
  </div>
</template>
<script lang="ts" setup></script>
<style scoped>
.my-poster-card2 {
  position: absolute;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.06);
  flex-direction: column;
  border-radius: 16px;
  focus-border-radius: 16px;
}
.my-poster-card2-text {
  margin-top: 30px;
  background-color: transparent;
  font-weight: 500;
}
.my-poster-card2-icon {
  margin-top: 40px;
  background-color: transparent;
  width: 100px;
  height: 80px;
}
.my-poster-card2-icon-inner {
  position: absolute;
  top: 0;
  left: 0;
}
.my-poster-card2-tip {
  margin-top: 31px;
  color: rgba(255, 255, 255, 0.55);
  font-size: 24px;
  height: 24px;
}
</style>
