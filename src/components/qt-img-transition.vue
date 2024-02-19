<template>
  <div class="img-root-css" :style="{width:width+'px',height:height+'px'}" >
<!--    <qt-animation ref="animationOldRef" class="animation-css" :visible="visible">-->
<!--      <img :src="srcOld" :onLoadEnd="true"-->
<!--           @loadStart="onOldLoadStart"-->
<!--           @loadEnd="onOldLoadEnd"-->
<!--           :style="{'border-radius': borderRadius + 'px',backgroundColor:needEmptyBg?'rgba(255,255,255,0.1)':'transparent',width:width+'px',height:height+'px'}">-->
<!--    </qt-animation>-->
<!--    <qt-animation ref="animationNewRef" class="animation-css" :visible="!visible">-->
<!--      <img :src="srcNew" :onLoadEnd="true"-->
<!--           @loadStart="onNewLoadStart"-->
<!--           @loadEnd="onNewLoadEnd"-->
<!--           :style="{'border-radius': borderRadius + 'px',width:width+'px',height:height+'px'}">-->
<!--    </qt-animation>-->
<!--    <qt-view class="img-root-css-placeholder" v-show="maskShow" :style="{width:width+'px',height:height+'px'}">-->
<!--    </qt-view>-->
    <img-transition ref="img" :transitionTime="400" :style="{'border-radius': borderRadius + 'px',backgroundColor:needEmptyBg?'rgba(255,255,255,0.1)':'transparent',width:width+'px',height:height+'px'}">

    </img-transition>

  </div>
</template>

<script lang="ts">
import {defineComponent, watch} from "@vue/runtime-core";
import {onMounted, ref} from "vue";
import {QTAnimationPropertyName, QTAnimationValueType, QTIAnimation} from "@quicktvui/quicktvui3";

export default defineComponent({
  name: "qt-img-transition",
  props: {
    borderRadius: {
      type: Number,
      default: 0
    },
    showDelay: {
      type: Number,
      default: 400
    },
    needEmptyBg: {
      type: Boolean,
      default: false
    },
    src: {
      type: String,
      default: ""
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
    let srcOld = ref<string>()
    let srcNew = ref<string>()
    let visible = ref<boolean>(false)
    let allIsShow = ref<boolean>(false)
    const animationOldRef = ref<QTIAnimation>()
    const animationNewRef = ref<QTIAnimation>()
    const hideDelay:number = props.showDelay + 0
    let timer:any = -1
    let maskShow = ref(true)
    let img = ref()
    onMounted(() => {
     // init()
    })
    function init(){
      animationOldRef.value?.objectAnimator2(
        "old_0_1",
        QTAnimationValueType.QT_ANIMATION_VALUE_TYPE_FLOAT,        //动画属性值类型
        QTAnimationPropertyName.QT_ANIMATION_PROPERTY_NAME_ALPHA,
        0,
        1,
        <number>props.showDelay,
        -1,
        0,
        false,
        false
      )
      animationNewRef.value?.objectAnimator2(
        "new_0_1",
        QTAnimationValueType.QT_ANIMATION_VALUE_TYPE_FLOAT,        //动画属性值类型
        QTAnimationPropertyName.QT_ANIMATION_PROPERTY_NAME_ALPHA,
        0,
        1,
        <number>props.showDelay,
        -1,
        0,
        false,
        false
      )

      animationOldRef.value?.objectAnimator2(
        "old_1_0",
        QTAnimationValueType.QT_ANIMATION_VALUE_TYPE_FLOAT,        //动画属性值类型
        QTAnimationPropertyName.QT_ANIMATION_PROPERTY_NAME_ALPHA,
        1,
        0,
        hideDelay,
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
        hideDelay,
        -1,
        0,
        false,
        false
      )

    }

    function onOldLoadStart(e) {
    }

    function onOldLoadEnd(e) {
      if(allIsShow.value){
        animationOldRef.value?.startAnimator('new_1_0')
        animationOldRef.value?.startAnimator('old_0_1')
        timer && clearTimeout(timer)
        timer = setTimeout(()=>{visible.value = !visible.value},hideDelay)
      }
    }


    function onNewLoadStart(e) {
    }

    function reset(){
      srcOld.value = ''
      srcNew.value = ''
      maskShow.value = true
    }

    function onNewLoadEnd(e) {
      if (allIsShow.value){
        animationNewRef.value?.startAnimator('old_1_0')
        animationNewRef.value?.startAnimator('new_0_1')
        timer && clearTimeout(timer)
        timer = setTimeout(()=>{
          visible.value = !visible.value
        },hideDelay)
      }
    }

    watch([() => props.src], (newValue, oldValue) => {
            img.value?.setNextImage(newValue[0])
        }
    //   if (!newValue[0]){
    //     timer && clearTimeout(timer)
    //     allIsShow.value = false
    //     visible.value = false
    //     srcOld.value = ""
    //     srcNew.value = ""
    //     return
    //   }
    //   maskShow.value = false;
    //   allIsShow.value = true
    //   if (!srcOld.value){
    //     srcOld.value = newValue[0]
    //   }else if (oldValue[0] === newValue[0]){
    //     return
    //   }else{
    //     if (visible.value){
    //       if (srcNew.value === newValue[0]){
    //         animationNewRef.value?.startAnimator('old_1_0')
    //         animationNewRef.value?.startAnimator('new_0_1')
    //         visible.value = !visible.value
    //       }else{
    //         srcNew.value = newValue[0]
    //       }
    //     }else{
    //       if (srcOld.value === newValue[0]){
    //         animationNewRef.value?.startAnimator('new_1_0')
    //         animationNewRef.value?.startAnimator('old_0_1')
    //         visible.value = !visible.value
    //       }else{
    //         srcOld.value = newValue[0]
    //       }
    //     }
    //   }
    // }
    )

    return {
      srcOld,
      srcNew,
      animationOldRef,
      animationNewRef,
      visible,
      allIsShow,
      onOldLoadStart,
      onOldLoadEnd,
      onNewLoadStart,
      onNewLoadEnd,
      reset,
      maskShow,
      img
    }
  }
})
</script>

<style>
.img-root-css {
  display: flex;
  background-color: green;
}
.img-root-css-placeholder {
  display: flex;
  background-color: black;
}
.animation-css{
  position: absolute;
  background-color: transparent;
}
</style>
