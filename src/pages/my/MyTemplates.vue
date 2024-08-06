<template>
  <div class="my_template">
    <MyPoster />
    <MyPosterInfo />
    <MyPosterCard />
    <MyPosterUser />
    <MyPosterBtn />
    <MyPosterCard2 />
    <MyPosterPoster2 />
  </div>
</template>
<script lang='ts' setup>
// import { onMounted, onBeforeUnmount } from 'vue';
import MyPoster from './poster/index.vue'
import MyPosterInfo from './poster/info.vue'
import MyPosterCard from './poster/card.vue'
import MyPosterUser from './poster/user.vue'
import MyPosterBtn from './poster/btn.vue'
import MyPosterCard2 from './poster/card2.vue'
import MyPosterPoster2 from './poster/poster2.vue'
defineExpose({})
</script>
<style scoped>
/* .my_template {} */
</style>