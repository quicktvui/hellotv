<template>
  <qt-view class="filter-sidebar-list-item" :focusable="true" eventFocus eventClick>
    <qt-text
      class="filter-sidebar-list-item-text"
      text="${name}"
      :style="$props.textStyle"
      :gravity="$props.textGravity"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-text>
  </qt-view>
</template>

<script setup lang="ts">
defineProps({
  textStyle: {
    type: Object,
    default: {}
  },
  textGravity: {
    type: String,
    default: 'center'
  }
})
</script>

<style scoped lang="scss" src="../../scss/filter-sidebar.scss"></style>
