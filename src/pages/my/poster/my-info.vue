<template>
  <div
    :type="103"
    layout="${layout}"
    flexStyle="${style}"
    :focusScale="false"
    :focusable="true"
    eventClick
    :enableFocusBorder="true"
    eventFocus
    class="my-poster-into"
    :clipChildren="false"
    sid="${_id}"
  >
    <text-view
      class="poster-into-title"
      :focusable="false"
      autoWidth
      duplicateParentState
      textSize="${title.style.fontSize}"
      :ellipsizeMode="2"
      :lines="1"
      gravity="center"
      text="${title.text}"
      showIf="${title.enable}"
    />
  </div>
</template>
<script lang="ts" setup></script>
<style scoped>
.my-poster-into {
  position: relative;
  background-color: rgba(255, 255, 255, 0.06);
  border-width: 1px;
  border-radius: 20px;
  focus-border-radius: 20px;
  border-color: rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
}

.poster-into-title {
  background-color: transparent;
  height: 50px;
  color: rgba(255, 255, 255, 0.55);
  focus-color: #ffffff;
  font-weight: 500;
}
</style>
