<template>
  <div flexStyle="${floatTitle.style}"
        class="qt-ui-poster-title-css"
        :gradientBackground="{colors:['#e5000000','#00000000'], cornerRadii4: [0, 0, 8, 8],orientation:4}"
        :duplicateParentState="true"
        :focusable="false">
    <text-view
      :duplicateParentState="true"
      :focusable="false"
      :textSize="26"
      :ellipsizeMode="2"
      enablePostTask
      :postDelay="200"
      :lines="1"
      gravity="left"
      style="z-index: 999;height: 50px;"
      flexStyle="${floatTitle.style}"
      text="${floatTitle.text}"
    />
  </div>
</template>
<script lang='ts' setup>
</script>
<style scoped>
.qt-ui-poster-title-css {
  padding-left: 16px;
  padding-top: 15px;
  background-color: transparent;
}
</style>