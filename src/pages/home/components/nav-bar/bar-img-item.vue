<template>
  <div class='bar-img-item-root-css'
       flexStyle="${image.style}"
       :focusable="true"
       :clipChildren="false"
       :focusScale="1.05"
       eventClick
       eventFocus>
    <img class="bar-img-item-image-css" flexStyle="${image.style}"
         :duplicateParentState="true" showOnState="normal" src="${image.normal}" />
    <img class="bar-img-item-image-css" flexStyle="${image.style}"
         :duplicateParentState="true" showOnState="focused" src="${image.focused}" />
    <img class="bar-img-item-image-css" flexStyle="${image.style}"
         :duplicateParentState="true" showOnState="selected" src="${image.selected}" />
  </div>

</template>

<script lang='ts' setup name='bar-img-item'>

defineExpose({})

</script>

<style lang='scss' src='../../scss/bar-img-item.scss'>
</style>
