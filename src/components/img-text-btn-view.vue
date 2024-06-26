<template>
  <div :class="['img-text-btn-root-css',
  imgTxtBtnStyle ? imgTxtBtnStyle : 'img-text-btn-root-default',
  {
    'is-icon-left':iconLeft,
    'is-icon-right':iconRight,
    'is-icon-top':iconTop,
    'is-icon-bottom':iconBottom
  }]"
       :style="imgTxtBtnStyle"
       @click="onClick"
       @focus="onFocus"
       :listenHasFocusChange="true">
    <div showOnState="normal" :duplicateParentState="true" :gradientBackground="defaultGradientBg"
         class="bg-css"/>
    <div showOnState="focused" :duplicateParentState="true" :gradientBackground="focusedGradientBg"
         class="bg-css"/>
    <div :style="iconRootStyle ? iconRootStyle :{width: `${imgWidth}px`, height: `${imgHeight}px`, backgroundColor: 'transparent'}"
         duplicateParentState v-if="icon">
      <img duplicateParentState :src="src" showOnState="normal" v-if="icon"
           :style="{ width:`${imgWidth}px`, height:`${imgHeight}px`,borderRadius:`${imgBorderRadius}px`}" />
      <img duplicateParentState :src="focusSrc" showOnState="focused" v-if="focusIcon"
           :style="{ width:`${imgWidth}px`, height:`${imgHeight}px`,borderRadius:`${imgBorderRadius}px`}" />
    </div>

    <qt-text duplicateParentState gravity="center" :fontSize="fontSize" v-if="text"
             :text="text" :focusable="false" :select="true" :ellipsizeMode="3" :lines="1"
             :class="[{
               'icon-is-txt-left':iconLeft,
               'icon-is-txt-right':iconRight,
               'icon-is-txt-top':iconTop,
               'icon-is-txt-bottom':iconBottom
             }]"
             :style="textStyle ? textStyle :{color:color, focusColor:focusColor, position:'static', width:'60px',height:'60px'}"/>
  </div>

</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, watch} from "@vue/runtime-core";
import ThemeConfig from "../build/ThemeConfig"

export default defineComponent({
  name: "img-text-btn-view",
  props:{
    imgTxtBtnStyle:Object,
    /**
     * 背景渐进色 默认
     */
    defaultGradientBg: {
      type: Object,
      default: () => {
        return {colors: ThemeConfig.btnGradientColor, orientation: 6, cornerRadii4: [30,30,30,30]} //cornerRadii4[左上, 右上, 右下, 左下]
      }
    },
    /**
     * 背景渐进色 焦点
     */
    focusedGradientBg: {
      type: Object,
      default: () => {
        return {colors: ThemeConfig.btnGradientFocusColor, orientation: 6, cornerRadius: 30}
      }
    },
    iconRootStyle:Object,
    iconLeft:{
      type:Boolean,
      default:false
    },
    iconTop:{
      type:Boolean,
      default:false
    },
    iconRight:{
      type:Boolean,
      default:false
    },
    iconBottom:{
      type:Boolean,
      default:false
    },
    /**
     * 默认图片
     */
    icon: {
      type: String,
      default: ''
    },
    /**
     * 焦点图片
     */
    focusIcon: {
      type: String,
      default: ''
    },
    /**
     * 图片宽度
     */
    imgWidth: {
      type: Number,
      default: 30
    },
    /**
     * 图片高
     */
    imgHeight: {
      type: Number,
      default: 30
    },
    /**
     * 图片圆角
     */
    imgBorderRadius: {
      type: Number,
      default: 0
    },
    /**
     * 内容
     */
    text:{
      type:String,
      default:""
    },
    /**
     * 内容字体大小
     */
    fontSize:{
      type:Number,
      default:28
    },
    textStyle:Object,
  },
  emits: ['focus', 'click'],
  setup(props, context) {
    const color = ThemeConfig.textColor
    const focusColor = ThemeConfig.textFocusColor
    let data = reactive({
      src:"",
      focusSrc:"",
    })
    watch([() => props.icon,() => props.focusIcon],(newValue,oldValue)=>{
      const isIconNetUrl = newValue[0]?.startsWith('http')
      const isFocusIconNetUrl = newValue[1]?.startsWith('http')
      data.src = newValue[0] ? (isIconNetUrl ? newValue[0] : require(`../assets/${newValue[0]}`).default) : ""
      data.focusSrc = newValue[1] ? (isFocusIconNetUrl ? newValue[1] :require(`../assets/${newValue[1]}`).default) : ""
    },{deep:true,
      immediate:true})

    function onESCreate(params) {

    }

    function onESStart() {

    }

    function onESStop() {

    }
    function onClick(e) :void{
      context.emit("click",e);
    }
    function onFocus(e) :void{
      context.emit("focus", e)
    }

    return {
      onESCreate,
      onESStart,
      onESStop,
      onClick,
      onFocus,
      color,
      focusColor,
      ...toRefs(data),
    }
  }
})
</script>

<style>
.img-text-btn-root-css {
  display: flex;
  background-color: transparent;
  justify-content: center;
  align-items: center;
}
.img-text-btn-root-default{
  border-radius: 30px;
}
.img-text-btn-root-css .bg-css{
  background-color: transparent;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}
.img-text-btn-root-css img{
  position: absolute;
}
.is-icon-left{
  flex-direction: row;
}
.is-icon-right{
  flex-direction: row-reverse;
}
.is-icon-top{
  flex-direction: column;
}
.is-icon-bottom{
  flex-direction: column-reverse;
}
.img-text-btn-root-css .icon-is-txt-left{
  margin-left: 8px;
}
.img-text-btn-root-css .icon-is-txt-right{
  margin-right: 8px;
}
.img-text-btn-root-css .icon-is-txt-top{
  margin-top: 4px;
}
.img-text-btn-root-css .icon-is-txt-bottom{
  margin-bottom: 4px;
}

</style>
