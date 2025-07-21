<template>
  <qt-view style="flex-direction: row; align-items: center">
    <qt-image style="width: 28px; height: 28px; margin-right: 9px" :src="props.icon"></qt-image>
    <qt-text class="player-tips-text" :style="props.textStyle" :text="props.text" gravity="center|start"></qt-text>
  </qt-view>
</template>

<script setup lang="ts">
const props = defineProps({
  icon: String,
  text: {
    type: String,
    default: ''
  },
  textStyle: Object
})
</script>

<style scoped src="../../css/player.css"></style>
