<template>
  <img 
    :postDelay="300" src="${previewImg}" class="rtvp_img" :focusable="false" 
    :enableFade="true" :fadeDuration="1000"
  />
</template>
<script lang='ts' setup>
</script>
<style scoped>
.rtvp_img {
  position: absolute;
  width: 1140px;
  height: 640px;
  border-radius: 8px;
}
</style>