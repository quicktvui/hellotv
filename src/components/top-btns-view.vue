<template>
  <div :style="parentStyle" :class="['top_btns_root_css',{'is-logo-right':logoRight,'is-logo-left':logoLeft}]">
    <img-text-btn-view
      v-if="!$slots.btnItem"
      :icon-left="true"
      text="筛选"
      :focusable="true"
      style="width: 145px;height: 60px;margin-left: 10px;margin-right: 10px"
      name="top_screen_btn"
      ref="top_screen_btn"
      icon="ic_top_search.png"
      focus-icon="ic_top_search_focus.png"
      @click="onClick"
      @focus="onFocus"/>
    <img-text-btn-view
      v-if="!$slots.btnItem"
      :icon-left="true"
      text="搜索"
      :focusable="true"
      style="width: 145px;height: 60px;margin-left: 10px;margin-right: 10px"
      name="top_search_btn"
      ref="top_search_btn"
      icon="ic_top_search.png"
      focus-icon="ic_top_search_focus.png"
      @click="onClick"
      @focus="onFocus"/>
  <img-text-btn-view
      v-if="!$slots.btnItem"
      :icon-left="true"
      text="多级列表"
      :focusable="true"
      :textStyle="{ width: '120px', height:'60px',color:'#ffffff',focusColor:'#000000'}"
      style="width: 205px;height: 60px;margin-left: 10px;margin-right: 10px"
      name="top_tv_box_btn"
      ref="top_tv_box_btn"
      icon="ic_top_search.png"
      focus-icon="ic_top_search_focus.png"
      @click="onClick"
      @focus="onFocus"/>
    <slot name="btnItem"></slot>
    <img v-if="!$slots.logoItem"
      :class="['logo_default_css',{'logo_left':logoLeft,'logo_right':logoRight}]" :style="logoStyle" :src="logo">
    <slot name="logoItem"></slot>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "@vue/runtime-core";
import ImgTextBtnView from "./img-text-btn-view.vue";
import {useESRouter} from "@extscreen/es3-router";

export default defineComponent({
  name: "top-btns-view",
  components: {'img-text-btn-view':ImgTextBtnView},
  props:{
    parentStyle:Object,
    logoStyle:Object,
    logoLeft:Boolean,
    logoRight:Boolean
  },
  emits: ['focus', 'click'],
  setup(props, context) {
    const logo = require("../assets/ic_right_logo.png").default
    const router = useESRouter()
    function onESCreate(params) {

    }

    function onESStart() {

    }

    function onESResume() {

    }

    function onESStop() {

    }

    function onClick(e):void{
      const name = e.target.attributes.name
      context.emit("click")
      switch (name){
        case "top_screen_btn":
          router.push({
            name: 'screen_main_view',
            params: {}
          });
          break;
        case "top_search_btn":
          router.push({
            name: 'search',
            params: {}
          });
          break;
        case "top_tv_box_btn":
            router.push({
                name: 'live',
                params: {}
            });
          break;
      }
    }
    function onFocus(e):void{
      const name = e.target.attributes.name
      switch (name){
        case "top_screen_btn":
          context.emit("focus", e)
          break;
        case "top_search_btn":
          context.emit("focus", e)
          break;
      }

    }
    return {
      logo,
      onESCreate,
      onESStart,
      onESResume,
      onESStop,
      onClick,
      onFocus,
    }
  }
})
</script>

<style>
  .top_btns_root_css{
    position: absolute;
    width: 1920px;
    height:120px;
    background-color: transparent;
    display: flex;
    justify-content: start;
    align-items: center;
  }
  .is-logo-right{
    flex-direction: row;
    padding-left: 80px;
  }
  .is-logo-left{
    flex-direction: row-reverse;
    padding-right: 80px;
  }
  .top_btns_root_css .logo_default_css{
    position: absolute;
    width: 274px;
    height: 60px;
  }
  .top_btns_root_css .logo_left{
    left:90px;
  }
  .top_btns_root_css .logo_right{
    right:90px;
  }

</style>
