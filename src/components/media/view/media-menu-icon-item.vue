<template>
  <div class='media-menu-icon-root-css' eventClick eventFocus
       flexStyle='${style}'
       :focusable='true'>
    <div class='icon-item-root' :duplicateParentState='true' :focusable='false'>
      <img class='icon-item' :duplicateParentState='true' :focusable='false' :showOnState='["normal","selected"]'
           src='${icon.normal}' />
      <img class='icon-item' :duplicateParentState='true' :focusable='false' showOnState='focused'
           src='${icon.focused}' />
    </div>
    <qt-text class='icon-item-text'
             :focusable="false"
             autoWidth
             gravity="center"
             :ellipsizeMode="3"
             :duplicateParentState="true"
             :fontSize="30"
             :lines="1"
             text="${name}" />

  </div>

</template>

<script lang='ts' setup name='MediaMenuIconItem'>

defineExpose({})

</script>

<style lang='scss'>

</style>
