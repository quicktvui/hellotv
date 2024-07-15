<template>
  <qt-view class="short_video" ref="short_video">
    <qt-waterfall class="short_video_waterfall"
      @onItemClick="onItemClick"
      @onItemFocused="onItemFocused"
      :enablePlaceholder="false"
      :skipRequestFocus="true"
      :endHintEnabled="false"
      ref="waterfallRef"
      :disableScrollOnFirstScreen="true"
      :blockFocusDirections="['up','down']"
      :useDiff="true">

    </qt-waterfall>  
  </qt-view>
</template>
  
  <script lang="ts">
  import { computed, defineComponent } from "@vue/runtime-core"
  import {ref} from "vue";
  import {useESRouter} from "@extscreen/es3-router";
  import { ESKeyEvent } from "@extscreen/es3-core"
  import {QTIWaterfall, QTWaterfallItem,} from "@quicktvui/quicktvui3";
  
  export default defineComponent({
    name: "search",
    components: {},
    props:{
      height:{
        type:String,
        default: "80px"
      }
    },
    setup(props, context) {
      const router = useESRouter()
      const short_video = ref()
      const waterfallRef = ref<QTIWaterfall>()
      // 生命周期
      const onESCreate = (params) => {
        
      }
      const onItemClick = () => {}
      const onItemFocused = () => {}

      const onESStart = () => {}
      const onESResume = () => {}
      const onESStop = () => {}
      function onKeyDown(keyEvent: ESKeyEvent): boolean {
        return false
      }
      const onESDestroy = () => {
      }
     
      return {
        short_video,waterfallRef,
        onItemClick,onItemFocused,
        onKeyDown, onESCreate, onESStart, onESResume, onESStop, onESDestroy,
      }
    }
  })
  </script>
  
  <style scoped src="./css/short_video.css"></style>
  
  