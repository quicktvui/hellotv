<template>
  <item-frame class='focus-change-img-root-css'
       layout='${layout}'
       flexStyle='${style}'
       :focusable='true'
       :clipChildren='false'
       eventClick
       eventFocus
      itemShowShimmer="${shimmer.enable}"
      shimmerSize="${shimmer.size}"
  >
    <img class='focus-change-img-css'
         flexStyle='${image.style}'
         :showOnState='["normal","selected"]'
         :postDelay='100'
         :focusable='false'
         :duplicateParentState='true'
         :enablePlaceholder="true"
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
  </item-frame>

</template>

<script lang='ts' setup name='focus-change-img-item'>

defineExpose({})

</script>

<style lang='scss' src='../../scss/focus-change-img-item.scss'>

</style>
