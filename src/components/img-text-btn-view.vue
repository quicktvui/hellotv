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
    <div showOnState="selected" :duplicateParentState="true" :gradientBackground="defaultGradientBg"
         class="bg-css"/>
    <div showOnState="normal" :duplicateParentState="true" :gradientBackground="selectedGradientBg"
         class="bg-css"/>
    <div showOnState="focused" :duplicateParentState="true" :gradientBackground="focusedGradientBg"
         class="bg-css"/>
    <div :style="iconRootStyle ? iconRootStyle :{width: imgWidth, height: imgHeight, backgroundColor: 'transparent'}"
         duplicateParentState v-if="icon">
      <img duplicateParentState :src="src" showOnState="normal" v-if="icon"
           :style="{ width:imgWidth, height:imgHeight,borderRadius:imgBorderRadius}" />
      <img duplicateParentState :src="src" showOnState="selected" v-if="icon"
           :style="{ width:imgWidth, height:imgHeight,borderRadius:imgBorderRadius}" />
      <img duplicateParentState :src="focusSrc" showOnState="focused" v-if="focusIcon"
           :style="{ width:imgWidth, height:imgHeight,borderRadius:imgBorderRadius}" />
    </div>

    <qt-text duplicateParentState gravity="center" :fontSize="fontSize" v-if="text"
             :text="text" :focusable="false" :select="true" :ellipsizeMode="3"
             :class="[{
               'icon-is-txt-left':iconLeft,
               'icon-is-txt-right':iconRight,
               'icon-is-txt-top':iconTop,
               'icon-is-txt-bottom':iconBottom
             }]"
             :style="textStyle ? textStyle :{color, focusColor, position:'static', width:'60px',height:'60px'}"/>
  </div>

</template>

<script lang="ts">
import {defineComponent, reactive, toRefs, watch} from "@vue/runtime-core";

export default defineComponent({
  name: "img-text-btn-view",
  props:{
    imgTxtBtnStyle:String,
    /**
     * 背景渐进色 默认
     */
    defaultGradientBg: {
      type: Object,
      default: () => {
        return {colors: ['#0FFFFFFF', '#0FFFFFFF'], orientation: 6, cornerRadii4: [30,30,30,30]} //cornerRadii4[左上, 右上, 右下, 左下]
      }
    },
    /**
     * 背景渐进色 选中状态
     */
    selectedGradientBg: {
      type: Object,
      default: () => {
        return {colors: ['#0FFFFFFF', '#0FFFFFFF'], orientation: 6, cornerRadius: 30}
      }
    },
    /**
     * 背景渐进色 焦点
     */
    focusedGradientBg: {
      type: Object,
      default: () => {
        return {colors: ['#0057FF','#00C7FF'], orientation: 6, cornerRadius: 30}
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
      type: String,
      default: '30px'
    },
    /**
     * 图片高
     */
    imgHeight: {
      type: String,
      default: '30'
    },
    /**
     * 图片圆角
     */
    imgBorderRadius: {
      type: String,
      default: '0px'
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
    textStyle:String,


    fontMarginLeft: {
      type: String,
      default: '5px'
    },
    fontMarginTop:{
      type: String,
      default: '0px'
    }

  },
  emits: ['focus', 'click'],
  setup(props, context) {
    let data = reactive({
      src:"",
      focusSrc:"",
      color: __THEME__.textColor,
      focusColor:__THEME__.textFocusColor,
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
