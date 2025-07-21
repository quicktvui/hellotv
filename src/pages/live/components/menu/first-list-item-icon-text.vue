<template>
  <qt-view class="menu-body-list-item" :type="3" :focusable="true" eventFocus>
    <qt-view style="background-color: transparent; flex-direction: row; align-items: center" :focusable="false" duplicateParentState>
      <qt-image class="menu-body-list-item-icon" :src="icMine" :postDelay="100" :focusable="false"></qt-image>
      <qt-text
        class="menu-body-list-item-text"
        style="width: 144px"
        text="${name}"
        typeface="bold"
        gravity="center"
        :focusable="false"
        duplicateParentState
      ></qt-text>
    </qt-view>
  </qt-view>
</template>

<script setup lang="ts">
import icMine from '../../../../assets/live/ic-mine.png'
</script>

<style scoped src="../../css/menu.css"></style>
