<template>
  <div class="ac_top" :class="['ac_top_'+dConfig.top.mode]">
    <div class="top_title_box">
      <qt-text v-if="dConfig.top.title" class="top_title" :style="dConfig.top.titleStyle" :text="dConfig.top.title" :gravity="titleGravity"></qt-text>
    </div>
    <qt-list-view 
      ref="topListRef" :clipChildren="false" :clipPadding="false" class="top_list"
      :style="{width: dConfig.top.btnListWidth + 'px'}"
      @item-focused="onTabChange" :horizontal="true" :focusable="false" padding="0,0,10,0"
    >
      <div :type="1" class="top_list_item" :collapsable="false" :focusable="true" :focusScale="1.08">
        <!-- <qt-button :enable-flex-style="true" text="text" gradientFocusBackground="gradientBackground" size="mini" round></qt-button> -->
        <!-- :style="{ width: '${' + bWidth + '}', height: '${' + bHeight + '}' }" -->
        <div 
            class="top_btn" :duplicateParentState="true" showOnState="normal"
            gradientBackground="${background}" :focusable="false"
          >
            <qt-image class="top_btn_img" src="${icon}" />
            <text-view class="top_btn_txt" text="${text}" textColor="${textColor}" autoWidth autoHeight :focusable="false"></text-view>
          </div>
          <div 
            class="top_btn_focused" :duplicateParentState="true" :enableBlackBorder="false"
            gradientBackground="${focusedBackground}" :focusable="false" :showOnState="['selected','focused']"
          >
            <qt-image class="top_btn_img" src="${focusIcon}" />
            <text-view class="top_btn_txt" text="${text}" textColor="${textFocusColor}" autoWidth autoHeight :focusable="false"></text-view>
          </div>
      </div>
      <div :type="2" class="top_list_item" :collapsable="false" :focusable="true" :focusScale="1.08">
        <div 
          class="top_btn" :duplicateParentState="true" showOnState="normal"
          gradientBackground="${background}" :focusable="false"
        >
          <text-view class="top_btn_txt" text="${text}" textColor="${textColor}" autoWidth autoHeight :focusable="false"></text-view>
        </div>
        <div 
          class="top_btn_focused" :duplicateParentState="true" :enableBlackBorder="false"
          gradientBackground="${focusedBackground}" :focusable="false" :showOnState="['selected','focused']"
        >
          <text-view class="top_btn_txt" text="${text}" textColor="${textFocusColor}" autoWidth autoHeight :focusable="false"></text-view>
        </div>
      </div>
    </qt-list-view>
  </div>
</template>
<script lang='ts' setup>
import { ref } from 'vue';
import { QTListViewItem } from '@quicktvui/quicktvui3';
// @ts-ignore
import { dConfig } from './index.ts'
import { topModes } from '../../api/activity2/types'

const topListRef = ref()

const titleGravity = dConfig.top.mode === topModes.lr ? 'centerVertical' : 'centerVertical|end'
const onTabChange = () => {

}

import homeIcon from '../../assets/ic_header_home.png'
import homeFocusIcon from '../../assets/ic_header_home_focus.png'
import vipIcon from '../../assets/ic_media_vip_button_focused.png'
const arr:QTListViewItem[] = [
  { 
    type: 1, //1 带图标，2不带图标
    decoration:{ left: 20 }, text: '购买',
    background: {colors:['#F9DFA7','#F9DFA7'],cornerRadius:25}, 
    focusedBackground: {colors:['#F9DFA7','#F9DFA7'],cornerRadius:25},
    icon: vipIcon, focusIcon:vipIcon, textColor: '#ffffff', textFocusColor: '#ffffff'
  },
  { 
    type: 1, //1 带图标，2不带图标
    decoration:{ left: 20 }, text: '首页',
    background: {colors:['#30000000','#30000000'],cornerRadius:25}, 
    focusedBackground: {colors:['#ffffff','#ffffff'],cornerRadius:25},
    icon: homeIcon, focusIcon:homeFocusIcon,
    textColor: '#ffffff', textFocusColor: '#333333'
  }
]
defineExpose({
  init() {
    topListRef.value?.init(arr)
  }
})
</script>
<style scoped lang="less">
.ac_top {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 20;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  width: 1920px;
  padding-left: 90px;
  padding-right: 80px;
  padding-top: 20px;
}
.top_title_box{
  flex: 1;
  height: 80px;
  background-color: transparent;
}
.top_title {
  height: 80px;
  background-color: transparent;
}

.top_list {
  /* max-width: 800px; */
  height: 80px;
  background-color: transparent;
}
.top_list_item{
  position: relative;
  height: 80px;
  flex-direction: row;
  align-items: center;
  background-color: transparent;
}
.top_btn, .top_btn_focused {
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: absolute;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 25px;
  background-color: transparent;
  z-index: 1;
}
.top_btn_icon{
  // padding-left: 58px;
}
.top_btn_focused{
  z-index: 10;
  background-color: transparent;
  focus-border-style: solid;
  focus-border-color: #fff;
  focus-border-width: 2px;
  focus-border-radius: 25px;
}
.top_btn_txt{
  /* color: pink; */
  font-size: 30px;
  background-color: transparent;
}
.top_btn_img {
  width: 30px;
  height: 30px;
  margin-right: 8px;
  margin-top: 2px;
  background-color: transparent;
}
.ac_top_right-left{
  flex-direction: row-reverse;
}
</style>