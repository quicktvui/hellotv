<template>
  <div class='history-item-root-css'
       flexStyle='${style}' layout='${layout}'
       :disablePlaceholderFocus="true"
       :enableFocusBorder='true'
        :clipChildren="false">

     <!-- 无历史-->
    <qt-view class='history-item-null-root' flexStyle='${style}'
             eventClick
             eventFocus
             :focusable="true">
      <qt-text  class='history-item-null-text' text='历史记录' :fontSize='36' />
      <qt-text  class='history-item-null-text-tip' text='登录同步云端历史' :fontSIze='28'/>
    </qt-view>
  </div>

</template>

<script lang='ts' setup name='history-text-item'>

defineExpose({})

</script>

<style lang='scss' src='../../scss/history-item.scss'>

</style>
