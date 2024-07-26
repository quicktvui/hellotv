<template>
  <tv-item class="world-4k-section-root-css" flexStyle="${style}" @item-click="onItemClicked"
           :clipChildren="false"
           :clipPadding="false" >
    <qt-list-view class="world-4k-section-list-css" horizontal :infiniteParams='{
        scrollOffset:253,
    }'
                  flexStyle="${style}"
                  list="${itemList}"
                  padding="0,30,0,30"
                  :blockFocusDirections="['left','right']"
                  :clipChildren="false"
                  :clipPadding="false"
                  makeChildVisibleType="center"
                  :enableSelectOnFocus="true"
                  >
      <world-4k-list-item :type="1"/>
    </qt-list-view>
  </tv-item>

</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core"
import { ESLogLevel, useESLog, useESToast } from "@extscreen/es3-core"
import World4kListItem from "./world-4k-list-item.vue"

export default defineComponent({
  name: "world-4k-section",
  components: { World4kListItem },
  setup(props, context) {
    const log = useESLog()
    const toast = useESToast()
    const onItemClicked = (e)=>{
      log.e("XRG",e)
      toast.showToast("XRG==="+e)
    }
    return {onItemClicked}
  }
})
</script>

<style>
.world-4k-section-root-css {
  position: absolute;
  background-color: transparent;
}

.world-4k-section-list-css {
  background-color: transparent;
}
</style>
