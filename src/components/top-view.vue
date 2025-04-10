<template>
  <div :class="['top-view-root-css', { 'logo-right': logoRight, 'logo-left': !logoRight }]">
    <!-- 搜索-->
    <btn-pack-view
      v-if="!$slots.topBtnItem"
      ref="topSearchBtnRef"
      name="topSearchBtn"
      style="width: 145px; height: 60px; margin-right: 10px"
      :nextFocusDownSID="downSid"
      :focusScale="ThemeConfig.placeHolderFocusScale"
      :focusable="true"
      :iconLeft="true"
      :normalIcon="ic_top_search_normal"
      :focusIcon="ic_top_search_focused"
      text="搜索"
      @click="onClick"
      @focus="onFocus"
    />
    <!-- 个人中心-->
    <btn-pack-view
      v-if="!$slots.topBtnItem"
      ref="topMyBtnRef"
      name="topMyBtn"
      sid="topMyBtnSid"
      :blockFocusDirections="['right', 'top']"
      style="width: 200px; height: 60px; margin-left: 10px; margin-right: 10px"
      :nextFocusDownSID="downSid"
      :textStyle="{ width: '120px', height: '60px' }"
      :focusScale="ThemeConfig.placeHolderFocusScale"
      :focusable="true"
      :iconLeft="true"
      :normalIcon="ic_top_user_normal"
      :focusIcon="ic_top_user_focused"
      text="个人中心"
      @click="onClick"
      @focus="onFocus"
    />
    <slot name="topBtnItem"></slot>
    <slot name="topOtherBtn"></slot>
    <!-- logo-->
    <img v-if="!$slots.topLogoItem" :src="ic_logo" :class="['logo-default', { 'img-left': !logoRight, 'img-right': logoRight }]" />
    <slot name="topLogoItem"></slot>
  </div>
</template>

<script lang="ts" setup name="top-view">
import launch from '../tools/launch'
import BtnPackView from './btn-pack-view.vue'
import ic_top_search_normal from '../assets/top-view/ic_top_search_normal.png'
import ic_top_search_focused from '../assets/top-view/ic_top_search_focused.png'
import ic_top_user_normal from '../assets/top-view/ic_top_user_normal.png'
import ic_top_user_focused from '../assets/top-view/ic_top_user_focused.png'
import ic_logo from '../assets/top-view/ic_logo.png'
import ThemeConfig from '../config/theme-config'

const emits = defineEmits(['focus', 'click'])
defineProps({
  //logo右侧展示
  logoRight: {
    type: Boolean,
    default: true
  },
  //向下组件ID
  downSid: {
    type: String,
    default: ''
  }
})

const onClick = (e) => {
  const name = e.target.attributes.name
  emits('click', e)
  switch (name) {
    //搜索
    case 'topSearchBtn':
      launch.launchSearch()
      break
    //个人中心
    case 'topMyBtn':
      launch.launchMy()
      break
  }
}

const onFocus = (e) => {
  const name = e.target.attributes.name
  switch (name) {
    //搜索
    case 'topSearchBtn':
      emits('focus', e)
      break
    //个人中心
    case 'topMyBtnRef':
      emits('focus', e)
      break
  }
}

defineExpose({})
</script>

<style lang="scss" src="./top-view.scss"></style>
