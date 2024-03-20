<template>
  <qt-view class="history" ref="search_root">
    <qt-row>
      <HistoryMenu ref="HistoryMenuRef" />
      <HistoryContent ref="HistoryContentRef" />
    </qt-row>
  </qt-view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import HistoryMenu from './HistoryMenu.vue'
import HistoryContent from './HistoryContent.vue'

const HistoryMenuRef = ref()
const HistoryContentRef = ref()
function onESCreate(params) {
  HistoryMenuRef.value.initData()
  HistoryContentRef.value.initData()
}

defineExpose({
  HistoryMenuRef,
  HistoryContentRef,
  onESCreate
})
// export default defineComponent({
//   components: { HistoryMenu },
//   setup(props, context) {
//     const HistoryMenuRef = ref()
//     function onESCreate(params) {
//       HistoryMenuRef.value.initData()
//     }
//     return {
//       onESCreate, HistoryMenuRef
//     }
//   }
// })
</script>

<style scoped lang="css">
.history {
  width: 2000px;
  height: 1200px;
  /* background-color: #fff; */
}
</style>
