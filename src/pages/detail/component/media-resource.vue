<template>
  <qt-view class="media-resource-css" :focusable="true" :focusScale="1.1" @click="$emit('onClick')">
    <qt-image class="media-resource-css-img" :src=$props.resourceUrl />
  </qt-view>
</template>

<script setup lang="ts" name="mediaResource">
defineProps({
  resourceUrl: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.media-resource-css {
  width: 846px;
  height: 100px;
  background-color: transparent;
  position: absolute;
  top: 302;
  left: 1016;
}

.media-resource-css-img {
  width: 846px;
  height: 100px;
}
</style>
