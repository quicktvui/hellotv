<template>
  <div style='width:1920px;height:1080px;background-color: yellowgreen'>
    <p>sssssss</p>
  </div>

</template>

<script lang='ts'>
import { defineComponent } from 'vue'
// import { useESLog } from '@extscreen/es3-core'

export default defineComponent({
  name: 'test-vue',
  setup(props, context) {
    // const log = useESLog()

    function onESCreate(params) {

    }

    function onESStart() {

    }

    function onESRestart() {

    }

    function onESResume() {

    }

    function onESPause() {

    }

    function onESStop() {

    }

    function onESDestroy() {

    }

    return {
      onESCreate,
      onESStart,
      onESResume,
      onESPause,
      onESStop,
      onESRestart,
      onESDestroy
    }
  }
})
</script>

<style>

</style>
