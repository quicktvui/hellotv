<template>
  <qt-view class='media-menu-text-root-css' eventClick
           eventFocus
           :sateBackgroundPadding="[30, 30]"
           autoWidth
           :focusable="true">
    <qt-text class='text-item' :focusable="false"
             gravity="center"
             :ellipsizeMode="3"
             :duplicateParentState="true"
             :fontSize="30"
             :lines="1"
             text="${name}"/>

  </qt-view>

</template>

<script lang='ts' setup name='media-menu-text-item'>

defineExpose({})

</script>

<style lang='scss'>

</style>
