<template>
  <qt-view class="media-player-loading-view-root-css"
           :focusable="false">
    <qt-view class="media-player-loading-view-root-css"
             v-show="show"
             :focusable="false">
      <qt-loading-view
        :style="{width:loadingViewWidth, height:loadingViewHeight}"
        class="media-player-loading-view-css"/>
    </qt-view>
  </qt-view>
</template>

<script lang="ts">

import {defineComponent} from "@vue/runtime-core";
import {ref} from "vue";
import {ESLogLevel, useESLog} from "@extscreen/es3-core";

const TAG = 'MediaPlayerLoadingView'

export default defineComponent({
  name: "media-player-loading-view",
  props: {
    //---------------------------------------
    loadingViewWidth: {
      type: Number,
      default: 100
    },
    loadingViewHeight: {
      type: Number,
      default: 100
    },
  },
  setup(props, context) {

    const log = useESLog()
    const show = ref<boolean>(false)


    function showLoading() {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "--------showLoading----->>>>>")
      }
      show.value = true
    }

    function dismissLoading() {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, "--------dismissLoading----->>>>>")
      }
      show.value = false
    }

    return {
      show,
      showLoading,
      dismissLoading
    }
  },
});

</script>

<style scoped>
.media-player-loading-view-root-css {
  background-color: transparent;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

.media-player-loading-view-css {
}

</style>
