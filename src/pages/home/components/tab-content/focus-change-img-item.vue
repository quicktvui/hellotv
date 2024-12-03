<template>
  <div class='focus-change-img-root-css'
       layout='${layout}'
       flexStyle='${style}'
       :focusable='true'
       :clipChildren='false'
       eventClick
       eventFocus
  >
    <img class='focus-change-img-css'
         flexStyle='${image.style}'
         :showOnState='["normal","selected"]'
         :postDelay='100'
         :focusable='false'
         :duplicateParentState='true'
         :enableFocusBorder='false'
         src='${image.normal}' />
    <img class="focus-change-img-css"
         flexStyle="${style}"
         showOnState="focused"
         :postDelay="100"
         :focusable="false"
         :duplicateParentState="true"
         :enableFocusBorder="false"
         src="${image.focused}"/>
  </div>

</template>

<script lang='ts' setup name='FocusChangeImgItem'>

defineExpose({})

</script>

<style lang='scss' src='../../scss/focus-change-img-item.scss'>

</style>
