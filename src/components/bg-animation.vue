<template>
  <div class='bg-animation-root-css' :style='$props.bgStyle'>
    <!--    图片-->
    <qt-animation ref='animationOldRef'
                  class='animation-css' style='z-index: 888'>
      <img
        :style='{width:$props.bgStyle.width,height:$props.bgStyle.height,borderRadius:borderRadius,backgroundColor:"transparent"}'
        :src='srcOld' />
    </qt-animation>
    <!--    图片-->
    <qt-animation ref='animationNewRef'
                  class='animation-css' style='z-index: 999'>
      <img
        :style='{width:$props.bgStyle.width,height:$props.bgStyle.height,borderRadius:borderRadius,backgroundColor:"transparent"}'
        :src='srcNew' />
    </qt-animation>
  </div>

</template>

<script lang='ts' setup name='bg-animation'>

import { QTAnimationPropertyName, QTAnimationValueType, QTIAnimation } from '@quicktvui/quicktvui3'
import { ref } from 'vue'

const props = defineProps({
  //整体样式
  bgStyle: {
    type: Object,
    default: () => {
      return { width: '1920px', height: '1080px', backgroundColor: 'transparent' }
    }
  },
  //圆角
  borderRadius: {
    type: Number,
    default: 0
  },
  //动画时间
  transitionTime: {
    type: Number,
    default: 600
  }
})

//图片
const srcOld = ref('')
const srcNew = ref('')
//动画
const animationOldRef = ref<QTIAnimation>()
const animationNewRef = ref<QTIAnimation>()
//动画ID
const animationOldHideId = 'old_1_0'
const animationNewHideId = 'new_1_0'
const animationNewShowId = 'new_0_1'


let loadImgTimer: any = -1
let loadImgNewTimer: any = -1
/**
 * 设置背景图片
 * @param src
 */
const setImg = (src: string) => {
  if (loadImgTimer) clearTimeout(loadImgTimer)
  if (loadImgNewTimer) clearTimeout(loadImgNewTimer)
  loadImgNewTimer = setTimeout(() => {
    //隐藏old
    animationOldRef.value?.objectAnimator2(
      animationOldHideId,
      QTAnimationValueType.QT_ANIMATION_VALUE_TYPE_FLOAT,
      QTAnimationPropertyName.QT_ANIMATION_PROPERTY_NAME_ALPHA,
      1, 0, <number>props.transitionTime, -1, 0, false, false, { type: 2 }
    )
    animationOldRef.value?.startAnimator(animationOldHideId)
    srcOld.value = srcNew.value
    srcNew.value = src
    //展示new
    animationNewRef.value?.objectAnimator2(
      animationNewShowId,
      QTAnimationValueType.QT_ANIMATION_VALUE_TYPE_FLOAT,
      QTAnimationPropertyName.QT_ANIMATION_PROPERTY_NAME_ALPHA,
      0, 1, <number>props.transitionTime, -1, 0, false, false, { type: 2 }
    )
    animationNewRef.value?.startAnimator(animationNewShowId)
    loadImgTimer = setTimeout(() => {
      srcOld.value = src
    }, <number>props.transitionTime + 10)
  }, 50)
}
/**
 * 清除当前图片
 */
const clearImg = () => {
  if (loadImgTimer) clearTimeout(loadImgTimer)
  //设置old图片隐藏动画
  animationOldRef.value?.objectAnimator2(
    animationOldHideId,
    QTAnimationValueType.QT_ANIMATION_VALUE_TYPE_FLOAT,
    QTAnimationPropertyName.QT_ANIMATION_PROPERTY_NAME_ALPHA,
    1, 0, 0, -1, 0, false, false
  )
  //设置new图片隐藏动画
  animationNewRef.value?.objectAnimator2(
    animationNewHideId,
    QTAnimationValueType.QT_ANIMATION_VALUE_TYPE_FLOAT,
    QTAnimationPropertyName.QT_ANIMATION_PROPERTY_NAME_ALPHA,
    1, 0, <number>props.transitionTime, -1, 0, false, false
  )
  //执行动画
  animationOldRef.value?.startAnimator(animationOldHideId)
  animationNewRef.value?.startAnimator(animationNewHideId)
  //清空图片资源
  loadImgTimer = setTimeout(() => {
    srcOld.value = ''
    srcNew.value = ''
  }, <number>props.transitionTime + 10)
}


defineExpose({ setImg, clearImg })

</script>

<style lang='scss' src='./bg-animation.scss'>
</style>
