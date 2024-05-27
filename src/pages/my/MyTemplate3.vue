<template>
  <div class="my_template">
    <div :type="1">
      <text-view :focusable="false" text="${subTitle.text}" />
    </div>
  </div>
</template>
<script lang='ts'>
import { ref } from 'vue';
import { defineComponent } from "@vue/runtime-core";
export default defineComponent({

})
</script>
<style scoped>
/* .my_template {} */
</style>