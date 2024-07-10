<template>
  <es-player-manager class="media-def-root-css"/>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core"
import { ESLogLevel, useESLog } from "@extscreen/es3-core"
import { ESPlayerManager } from "@extscreen/es3-player-manager"

export default defineComponent({
  name: "media-def-player",
  components: {
    "es-player-manager": ESPlayerManager
  },
  setup(props, context) {
    const log = useESLog()

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

<style scoped>
.media-def-root-css{
  width:1920px;
  height: 1080px;
  background-color: transparent;
  position: absolute;
}
</style>
