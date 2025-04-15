<template>
  <qt-x5web-view ref="loadWebView" :requestFocus="true" class="loadWebViewRootStyle" />
</template>

<script>
import { defineComponent, ref } from 'vue'

import { useESRouter } from '@extscreen/es3-router'

export default defineComponent({
  name: 'load-web-view',
  setup() {
    const loadWebView = ref()
    const router = useESRouter()
    const html = ref('')
    const onESCreate = (params) => {
      if (params) {
        html.value = params.html
        loadWebView.value.loadUrl(html.value)
      }
    }
    const onBackPressed = () => {
      router.back()
    }
    return {
      loadWebView,
      onBackPressed,
      onESCreate
    }
  }
})
</script>

<style scoped>
.loadWebViewRootStyle {
  width: 1920px;
  height: 1080px;
  background-color: #252930;
}
</style>
