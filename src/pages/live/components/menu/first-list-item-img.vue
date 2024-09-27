<template>
  <qt-view class="menu-body-list-item" :type="1" :focusable="true" eventFocus>
    <qt-image class="menu-body-list-item-img" :src="icService" :focusable="false"></qt-image>
  </qt-view>
</template>

<script setup lang="ts">
import icService from '../../../../assets/live/ic-service.png'
</script>

<style scoped src="../../css/menu.css"></style>
