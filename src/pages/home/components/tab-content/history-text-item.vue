<template>
  <div class='history-item-root-css'
       flexStyle='${style}' layout='${layout}'
       gradientBackground='${gradientBackground}'
       :enableFocusBorder='true'
       eventClick
       eventFocus
       :focusable="true" :clipChildren="false">
<!--    :disablePlaceholder="true"-->
    <qt-text flexStyle='${style}' fontSize='32' style='color: white' text='历史记录' gravity='center'/>

  </div>

</template>

<script lang='ts' setup name='history-text-item'>

defineExpose({})

</script>

<style lang='scss' src='../../scss/history-item.scss'>

</style>
