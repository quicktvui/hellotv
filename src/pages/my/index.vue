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
    MyTemplateRef.value.init()
  },
  onESRestart(){
    MyTemplateRef.value.update()
  }
})
</script>
<style scoped>
</style>