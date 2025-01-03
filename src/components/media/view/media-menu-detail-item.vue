<template>
  <qt-view class='media-menu-detail-item-root-css' eventClick eventFocus
           :focusable='true'>
    <qt-text class='item-text' :duplicateParentState='true'
             :paddingRect='[30,0,0,0]' :focusable='false'
             :fontSize='30' gravity='center|start' :lines='1' text='${text}' />
    <img class='item-icon' showIf="${iconState==true}" :focusable="false" duplicateParentState :src='selectedIcon'/>
    <img class='item-icon' showOnState="focused" :focusable="false" duplicateParentState :src='focusedIcon'/>
  </qt-view>

</template>

<script lang='ts' setup name='media-menu-detail-item'>
import selectedIcon from '../../../assets/component-media/ic_media_ok_selected.png'
import focusedIcon from '../../../assets/component-media/ic_media_ok_focused.png'

defineExpose({})

</script>

<style lang='scss' src='./scss/media-menu.scss'>

</style>
