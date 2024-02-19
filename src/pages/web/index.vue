<template>
  <qt-x5web-view
    ref="loadWebView"
    :requestFocus="true"
    class="load-x5-web-view-css"
  />
</template>

<script lang="ts">
import {defineComponent} from "@vue/runtime-core";
import {ESLogLevel, useESLog} from "@extscreen/es3-core";
import {ref} from "vue";

export default defineComponent({
  name: "index",
  setup(props, context) {
    const log = useESLog()
    const loadWebView = ref()

    function onESCreate(params) {
      if (params){
        const html = params.html
        loadWebView.value?.loadUrl(html)
      }
    }

    return {
      onESCreate,
      loadWebView
    }
  }
})
</script>

<style>
.load-x5-web-view-css {
  width: 1920px;
  height: 1080px;
  background-color: #252930;
}

</style>
