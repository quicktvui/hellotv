<template>
  <div class="img-root-css" :style="{width:width+'px',height:height+'px'}" >
     <qt-animation ref="animationOldRef" class="animation-css" style="z-index: 888;">
       <img :src="srcOld" class="bgImg"
          :style="{'border-radius': borderRadius + 'px',width:width+'px',height:height+'px'}">
     </qt-animation>
     <qt-animation ref="animationNewRef" class="animation-css" style="z-index: 999;">
       <img :src="srcNew" class="bgImg"
          :style="{'border-radius': borderRadius + 'px',width:width+'px',height:height+'px'}">
     </qt-animation>
 </div>
</template>
  
  <script lang="ts">
  import {defineComponent, watch} from "@vue/runtime-core";
  import {ref} from "vue";
  import {QTAnimationPropertyName, QTAnimationValueType, QTIAnimation} from "@quicktvui/quicktvui3";
  import {useESToast} from "@extscreen/es3-core";
  
  export default defineComponent({
    name: "bg-player-img",
    props: {
      borderRadius: {
        type: Number,
        default: 0
      },
      transitionTime: {
        type: Number,
        default: 500
      },
      width:{
        type:Number,
        default:1920
      },
      height:{
        type:Number,
        default:1080
      }
    },
    setup(props, context) {
      const toast = useESToast()
      let srcOld = ref<string>()
      let srcNew = ref<string>()
      const animationOldRef = ref<QTIAnimation>()
      const animationNewRef = ref<QTIAnimation>()
      let timer:any = -1
      function setNextColor() {
        timer && clearTimeout(timer)
        animationOldRef.value?.objectAnimator2(
          "old_1_0",
          QTAnimationValueType.QT_ANIMATION_VALUE_TYPE_FLOAT,        //动画属性值类型
          QTAnimationPropertyName.QT_ANIMATION_PROPERTY_NAME_ALPHA,
          1,
          0,
          0,
          -1,
          0,
          false,
          false
        )
        animationNewRef.value?.objectAnimator2(
          "new_1_0",
          QTAnimationValueType.QT_ANIMATION_VALUE_TYPE_FLOAT,        //动画属性值类型
          QTAnimationPropertyName.QT_ANIMATION_PROPERTY_NAME_ALPHA,
          1,
          0,
          props.transitionTime,
          -1,
          0,
          false,
          false
        )
        animationOldRef.value?.startAnimator('old_1_0')
        animationNewRef.value?.startAnimator('new_1_0')
        timer = setTimeout(()=>{
          srcOld.value = ''
          srcNew.value = ''
        },props.transitionTime + 10)
      }
      let delaySetImgTimer: any = -1
      function setNextImage(src:string) {
        timer && clearTimeout(timer)
        // delaySetImgTimer && clearTimeout(delaySetImgTimer)
        delaySetImgTimer = setTimeout(() => {
          srcOld.value = srcNew.value
          animationOldRef.value?.objectAnimator2(
            "old_1_0",
            QTAnimationValueType.QT_ANIMATION_VALUE_TYPE_FLOAT,        //动画属性值类型
            QTAnimationPropertyName.QT_ANIMATION_PROPERTY_NAME_ALPHA,
            1,
            0,
            props.transitionTime,
            -1,
            0,
            false,
            false
          )
          animationOldRef.value?.startAnimator('old_1_0')
          srcNew.value = src
          animationNewRef.value?.objectAnimator2(
            "new_0_1",
            QTAnimationValueType.QT_ANIMATION_VALUE_TYPE_FLOAT,        //动画属性值类型
            QTAnimationPropertyName.QT_ANIMATION_PROPERTY_NAME_ALPHA,
            0,
            1,
            props.transitionTime,
            -1,
            0,
            false,
            false,
            {
              type: 6,
            }
          )
          animationNewRef.value?.startAnimator('new_0_1')
          timer = setTimeout(()=>{
            srcOld.value = src
          },props.transitionTime + 10)
        },50)
        // srcNew.value = src
        // if(!srcOld.value){
        //   srcOld.value = src
        // }
        // animationOldRef.value?.objectAnimator2(
        //   "old_1_0",
        //   QTAnimationValueType.QT_ANIMATION_VALUE_TYPE_FLOAT,        //动画属性值类型
        //   QTAnimationPropertyName.QT_ANIMATION_PROPERTY_NAME_ALPHA,
        //   1,
        //   0,
        //   props.transitionTime,
        //   -1,
        //   0,
        //   false,
        //   false
        // )
        // animationOldRef.value?.startAnimator('old_1_0')
        // animationNewRef.value?.objectAnimator2(
        //   "new_0_1",
        //   QTAnimationValueType.QT_ANIMATION_VALUE_TYPE_FLOAT,        //动画属性值类型
        //   QTAnimationPropertyName.QT_ANIMATION_PROPERTY_NAME_ALPHA,
        //   0,
        //   1,
        //   props.transitionTime,
        //   -1,
        //   0,
        //   false,
        //   false,
        //   {
        //     type: 6,
        //   }
        // )
        // animationNewRef.value?.startAnimator('new_0_1')
        // timer = setTimeout(()=>{
        //   srcOld.value = src
        // },props.transitionTime + 10)
      }
  
      return {
        srcOld,
        srcNew,
        animationOldRef,
        animationNewRef,
        setNextColor,
        setNextImage
      }
    }
  })
  </script>
  
  <style>
  .img-root-css {
    display: flex;
    background-color: transparent;
  }
  .img-root-css-placeholder {
    display: flex;
    background-color: black;
  }
  .animation-css{
    position: absolute;
    z-index: 9999;
    top: 0;
    left: 0;
    background-color: transparent;
  }
  .bgImg{
    background-color: transparent;
  }
  </style>
  