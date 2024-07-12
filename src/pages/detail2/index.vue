<template>
<div class="d_page2">
  <D2Video />
  <div class="d_page2_cover">
    <qt-button text="d_page2_cover"></qt-button>
  </div>
</div>
</template>
<script lang='ts' setup>
import D2Video from './D2Video.vue'
</script>
<style scoped>
.d_page2{
  position: relative;
  width: 1920px;
  height: 1920px;
  background-color: #000000;
}
.d_page2_cover{
  position: absolute;
  left: 0.01px;
  top: 0.01px;
  width: 1920px;
  height: 1920px;
  background-color: rgba(0,0,0,0.5);
  z-index: 2;
}
</style>