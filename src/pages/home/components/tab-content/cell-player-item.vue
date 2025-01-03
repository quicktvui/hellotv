<template>
  <tv-item class='cell-player-item-root-css'
           layout='${layout}'
           flexStyle='${style}'
           :focusable='true'
           :clipChildren='false'
           eventClick
           eventFocus>
    <img class='cell-player-item-bg'
         flexStyle='${image.style}'
         src='${image.normal}'
         :duplicateParentState='true'
         :enableFocusBorder='true'
         :focusable='false' />
    <qt-replace-child
      class='cell-player-item-replace'
      flexStyle='${play.style}'
      sid='${play.sid}'
      eventReceiverSID='homeTabsSid'
      :focusable='false'
      :clipChildren='false'
      :replaceOnVisibilityChanged='false'
      :markChildSID='TabContentConfig.homeBgPlaySid'
    >
    </qt-replace-child>

  </tv-item>

</template>

<script lang='ts' setup name='CellPlayerItem'>
import TabContentConfig from '../../build-data/tab-content/tab-content-config.ts'
defineExpose({})

</script>

<style lang='scss' src='../../scss/cell-player-item.scss'>

</style>
