<template>
<div>
  <MyTemplate isHeader />
  <!-- <MyTemplate :height="880" /> -->
</div>
</template>
<script lang='ts' setup>
// import { ref } from 'vue';
import MyTemplate from './MyTemplate.vue'

defineExpose({
  onESStart(){},
  onESStop(){}
})
</script>
<style scoped>
</style>