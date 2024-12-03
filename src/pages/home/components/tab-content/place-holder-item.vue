<template>
  <div class='place-holder-root-css'
       layout="${layout}"
       flexStyle="${style}"
       :focusable="false"
       :disablePlaceholder="false"
       :enableFocusBorder="false">
    <img class="place-holder-img"
         flexStyle="${image.style}"
         :postDelay="100"
         :focusable="false"
         :enableFocusBorder="false"
         src="${image.normal}"/>

  </div>

</template>

<script lang='ts' setup name='PlaceHolderItem'>

defineExpose({})

</script>

<style lang='scss' src='../../scss/place-holder-item.scss'>

</style>
