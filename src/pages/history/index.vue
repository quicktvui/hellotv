<template>
  <qt-view class="history" ref="search_root">
    <Htemplate />
  </qt-view>
</template>

<script lang="ts" setup>
// import { ref } from 'vue';
import Htemplate from './history_template.vue'
</script>

<style scoped lang="css">
.history {
  width: 1920px;
  height: 1080px;
  background-color: #252930;
}
</style>
