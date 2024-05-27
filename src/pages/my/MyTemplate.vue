<template>
  <div class="my_template">
    <MyPoster />
    <MyPosterInfo />
    <MyPosterCard />
    <MyPosterUser />
  </div>
</template>
<script lang='ts' setup>
// import { ref } from 'vue';
import MyPoster from './poster/index.vue'
import MyPosterInfo from './poster/info.vue'
import MyPosterCard from './poster/card.vue'
import MyPosterUser from './poster/user.vue'
defineExpose({})
</script>
<style scoped>
/* .my_template {} */
</style>