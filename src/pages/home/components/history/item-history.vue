<template>
<div
  layout="${layout}" flexStyle="${style}" :focusable="true"
  :clipChildren="false" eventClick style="background-color: rgba(255,255,255,1);"
>
  <text-view 
    class="his_text" :focusable="false" autoWidth
    :ellipsizeMode="2" :lines="1" gravity="centerVertical|left"
    text="${_his_txt}"
  />
</div>
</template>
<script lang='ts' setup>
// import { ref, onMounted } from 'vue';
</script>
<style scoped>
.his_text{
  height: 100px;
  font-size: 30px;
  color: red;
}
</style>