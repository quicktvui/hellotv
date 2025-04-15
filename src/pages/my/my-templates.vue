<template>
  <div class="my_template">
    <my-poster-user />
    <my-poster-card2 />
    <my-icon-title-col />
    <my-poster />
    <my-poster-info />
    <my-icon-title-row />
  </div>
</template>
<script lang="ts" setup>
import MyPoster from './poster/index.vue'
import MyPosterInfo from './poster/my-info.vue'
import MyPosterUser from './poster/my-user.vue'
import MyPosterCard2 from './poster/my-card2.vue'
import MyIconTitleRow from './poster/my-icon-title-row.vue'
import MyIconTitleCol from './poster/my-icon-title-col.vue'

defineExpose({})
</script>
<style scoped>
.my_template {
}
</style>
