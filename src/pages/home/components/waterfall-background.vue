<template>
  <img-transition ref="waterfallBg" class="waterfall-bg-css" :transitionTime="200"/>
</template>

<script lang="ts">
import {defineComponent} from "@vue/runtime-core";
import {ref} from "vue";
import {ESITransitionImage} from "@extscreen/es3-component/dist/src/ESTransitionImageView/ESITransitionImage";

export default defineComponent({
  name: "waterfall-background",
  setup(props, context) {
    //背景
    const waterfallBg = ref<ESITransitionImage>()
    const currentImg = ref("")
    const defaultImg = ref("")

    function setImg(curImg,defImg="",isShowCurImg=false,isShowDefImg=false) {
      if (isShowCurImg){
        if (currentImg.value === curImg)return
        currentImg.value = curImg
        showCurrentImg()
      }else if(isShowDefImg){
        if (defaultImg.value === defImg)return
        defaultImg.value = defImg
        showDefaultImg()
      }
    }

    function showDefaultImg(){
      if (defaultImg.value){
        waterfallBg.value?.setNextImage(defaultImg.value)
      }else{
        waterfallBg.value?.setNextColor(0)
      }
    }

    function showCurrentImg(){
      if (currentImg.value){
        waterfallBg.value?.setNextImage(currentImg.value)
      }else{
        waterfallBg.value?.setNextColor(0)
      }
    }

    return {
      waterfallBg,
      setImg,
      showDefaultImg,
      showCurrentImg
    }
  }
})
</script>

<style src="./../css/home.css"></style>
