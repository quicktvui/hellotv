<template>
  <qt-view class="short_video" ref="short_video">
    
  </qt-view>
</template>
  
  <script lang="ts">
  import { computed, defineComponent } from "@vue/runtime-core"
  import {ref} from "vue";
  import {useESRouter} from "@extscreen/es3-router";
  import { ESKeyEvent } from "@extscreen/es3-core"
  
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
      // 生命周期
      const onESCreate = (params) => {
        
      }
      const onESStart = () => {}
      const onESResume = () => {}
      const onESStop = () => {}
      function onKeyDown(keyEvent: ESKeyEvent): boolean {
        return false
      }
      const onESDestroy = () => {
      }
     
      return {
        short_video,
        onKeyDown, onESCreate, onESStart, onESResume, onESStop, onESDestroy,
      }
    }
  })
  </script>
  
  <style scoped src="./css/search.css"></style>
  
  