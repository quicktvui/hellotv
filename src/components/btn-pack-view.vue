<template>
  <div :class='["btn-pack-root-css",
  { "is-icon-left":iconLeft, "is-icon-top":iconTop,"show-default-bg":!isShowGradientBg }]'
       @click='onClick'
       @focus='onFocus'
       :listenHasFocusChange='true'>
    <!--    渐进背景-->
    <div v-if='isShowGradientBg' showOnState='normal' :duplicateParentState='true'
         :gradientBackground='defaultGradientBg'
         class='bg-css' />
    <div v-if='isShowGradientBg' showOnState='focused' :duplicateParentState='true'
         :gradientBackground='focusedGradientBg'
         class='bg-css' />
    <!--    图标-->
    <div :style='iconRootStyle' duplicateParentState>
      <img v-if='normalIcon' :style='iconStyle' duplicateParentState showOnState='normal'
           :src='normalIcon' />
      <img v-if='focusIcon' :style='iconStyle' duplicateParentState showOnState='focused'
           :src='focusIcon' />
    </div>
    <!--    文字内容-->
    <qt-text v-if='text' duplicateParentState typeface='bold' :font-size='fontSize' :text='text'
             :focusable='false' :select='true' :ellipsizeMode='3' :lines='1'
             gravity='centerVertical'
             :class='["text-css",{
               "icon-left":iconLeft,
               "icon-top":iconTop
             }]'
             :style='textStyle'
    />
  </div>

</template>

<script lang='ts' setup name='btn-pack-view'>
import ThemeConfig from '../config/theme-config.ts'

const emits = defineEmits([
  'focus', 'click'
])
defineProps({
  //展示左侧图标
  iconLeft: {
    type: Boolean,
    default: false
  },
  //展示顶部图标
  iconTop: {
    type: Boolean,
    default: false
  },
  //是否使用渐进背景
  isShowGradientBg: {
    type: Boolean,
    default: false
  },
  //背景渐进色 默认
  defaultGradientBg: {
    type: Object,
    default: () => {
      return {
        colors: ThemeConfig.btnGradientNormalColor,
        orientation: 6,
        cornerRadii4: [30, 30, 30, 30]
      } //cornerRadii4[左上, 右上, 右下, 左下]
    }
  },
  //背景渐进色 焦点
  focusedGradientBg: {
    type: Object,
    default: () => {
      return {
        colors: ThemeConfig.btnGradientFocusColor,
        orientation: 6,
        cornerRadius: 30
      }
    }
  },
  //默认图片
  normalIcon: {
    type: String,
    default: ''
  },
  //焦点图片
  focusIcon: {
    type: String,
    default: ''
  },
  //图标整体样式
  iconRootStyle: {
    type: Object,
    default: () => {
      return { width: '30px', height: '30px', backgroundColor: 'transparent' }
    }
  },
  //图标样式
  iconStyle: {
    type: Object,
    default: () => {
      return { position: 'absolute', width: '30px', height: '30px', borderRadius: 0 }
    }
  },
  //按钮信息
  text: {
    type: String,
    default: ''
  },
  //字体大小
  fontSize: {
    type: Number,
    default: 28
  },
  //字体样式
  textStyle: {
    type: Object,
    default: () => {
      return { position: 'static', width: '70px', height: '60px' }
    }
  }
})

function onClick(e): void {
  emits('click', e)
}

function onFocus(e): void {
  emits('focus', e)
}

defineExpose({})

</script>

<style lang='scss' src='./btn-pack.scss'>

</style>
