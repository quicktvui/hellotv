<template>
  <div class='placeholder-root-css'
       layout="${layout}"
       flexStyle="${style}"
       :focusable="false"
       :disablePlaceholder="false"
       :enableFocusBorder="false">
    <img class="placeholder-img"
         flexStyle="${image.style}"
         :postDelay="100"
         :focusable="false"
         :enableFocusBorder="false"
         src="${image.normal}"/>
  </div>

</template>

<script lang='ts' setup name='placeholder-item'>

defineExpose({})

</script>

<style lang='scss' src='../../scss/placeholder-item.scss'>
</style>
