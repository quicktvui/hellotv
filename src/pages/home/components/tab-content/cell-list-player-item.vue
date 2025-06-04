<template>
  <tv-item
    class="cell-player-item-root-css"
    layout="${layout}"
    flexStyle="${style}"
    :focusable="true"
    :clipChildren="false"
    eventClick
    eventFocus
  >
    <qt-replace-child
      class="cell-player-item-replace"
      flexStyle="${play.style}"
      sid="${play.sid}"
      :postDelay="300"
      eventReceiverSID="homeTabsSid"
      :focusable="false"
      :clipChildren="false"
      :replaceOnVisibilityChanged="false"
      :markChildSID="TabContentConfig.homeBgPlaySid"
    >
    </qt-replace-child>
  </tv-item>
</template>

<script lang="ts" setup name="cell-list-player-item">
import TabContentConfig from '../../adapter/tab-content/tab-content-config'
defineExpose({})
</script>

<style lang="scss" src="../../scss/cell-player-item.scss"></style>
