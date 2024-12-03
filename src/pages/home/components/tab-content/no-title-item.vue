<template>
  <div class='no-title-item-root-css'
       layout='${layout}'
       flexStyle='${style}'
       :focusable='true'
       :clipChildren='false'
       :enableFocusBorder='true'
       eventClick eventFocus>
    <!-- 海报图-->
    <img class='no-title-item-img'
         flexStyle='${image.style}'
         :postDelay='100' :focusable='false' src='${image.normal}'
    />
    <!-- 文字角标-->
    <qt-text showIf='${corner.enable==true}' class='item-corner'
             gradientBackground='${corner.background}'
             autoWidth
             typeface='bold'
             gravity='center'
             :focusable='false'
             :postDelay='100'
             :textSize='20'
             :ellipsizeMode='2'
             :lines='1'
             text='${corner.text}' />
  </div>

</template>

<script lang='ts' setup name='NoFrameItem'>

defineExpose({})

</script>

<style lang='scss' src='../../scss/no-title-item.scss'>

</style>
