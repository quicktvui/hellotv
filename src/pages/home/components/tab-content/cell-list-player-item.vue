<template>
  <tv-item class="cell-player-item-root-css" layout="${layout}" flexStyle="${style}" :focusable="false" :clipChildren="false">
    <qt-replace-child
      style="background-color: transparent"
      flexStyle="${play.style}"
      sid="${play.sid}"
      eventReceiverSID="homeTabsSid"
      :postDelay="300"
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
