<template>
  <div class='bar-img-item-root-css'
       flexStyle="${imageStyle}"
       :focusable="true"
       :clipChildren="false"
       :focusScale="1.05"
       eventClick
       eventFocus>
    <img class="bar-img-item-image-css" flexStyle="${imageStyle}"
         :duplicateParentState="true" showOnState="normal" src="${image}" />
    <img class="bar-img-item-image-css" flexStyle="${imageStyle}"
         :duplicateParentState="true" showOnState="focused" src="${focusedImage}" />
    <img class="bar-img-item-image-css" flexStyle="${imageStyle}"
         :duplicateParentState="true" showOnState="selected" src="${selectedImage}" />
  </div>

</template>

<script lang='ts' setup name='BarImgItem'>

defineExpose({})

</script>

<style lang='scss' src='../../scss/bar-img-item.scss'>
</style>
