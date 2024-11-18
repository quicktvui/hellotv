<template>
  <span
    id='aa'
    class='button-gradient-background-css'>dddddd</span>


</template>

<script lang='ts' setup>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'index',
  setup() {

    function onESCreate() {
      timer = setTimeout(()=>{},200)
    }


    return {
      onESCreate,
    }
  }
})
</script>

<style>

</style>
