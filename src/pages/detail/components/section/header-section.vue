<template>
  <qt-vue-section>
    <top-view :logoRight='true' @focus="onFocus"></top-view>
  </qt-vue-section>
</template>

<script setup lang='ts' name='HeaderSection'>
import TopView from '../../../../components/top-view.vue'
const emits = defineEmits(['onTopButtonFocus'])
const onFocus = (e) => {
  emits('onTopButtonFocus', e)
}
</script>
  
<style lang='scss' scoped>
  
</style>
