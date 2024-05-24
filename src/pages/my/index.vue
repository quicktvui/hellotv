<template>
<div>
  <MyTemplate ref="MyTemplateRef" isHeader />
  <!-- <MyTemplate :height="880" /> -->
</div>
</template>
<script lang='ts' setup>
import { ref } from 'vue';
import MyTemplate from './MyTemplate.vue'

const MyTemplateRef = ref()
defineExpose({
  onESStart(){
    MyTemplateRef.value.start()
  },
  onESRestart(){
    MyTemplateRef.value.reStart()
  }
})
</script>
<style scoped>
</style>