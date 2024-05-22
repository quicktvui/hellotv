<template>
  <qt-view class="hellowtv_loading" :style="isFullScreen ? 
    {width: `${1920}px`, height: `${1080}px`, backgroundColor: `rgba(0,0,0,0.1)`} : 
    {width: `${width}px`, height: `${height}px`, backgroundColor: `transparent`}">

    <qt-loading-view :color="color"	:style="{width: `${width}px`, height: `${height}px`}"/> 

  </qt-view>
</template>
  
<script lang="ts">

import {defineComponent, watch} from "@vue/runtime-core";
import {ref} from "vue";
import {} from "@quicktvui/quicktvui3";
  
export default defineComponent({
  name: "loading",
  props: {
    isFullScreen: {
      type: Boolean,
      default: false
    },
    width:{
      type: Number,
      default: 150
    },
    height:{
      type: Number,
      default: 150
    },
    color:{
      type: String,
      default: '#F1590B'
    },
  },
  setup(props, context) {
    // watch([() => props.src], (newValue, oldValue) => {
    //   img.value?.setNextImage(newValue[0])
    // })
    return {
      
    }
  }
})

</script>
  
<style>
.hellowtv_loading {
  align-items: center;
  justify-content: center;
}
</style>
  