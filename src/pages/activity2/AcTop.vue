<template>
  <div class="ac_top" :class="['ac_top_'+dConfig.top.mode]">
    <qt-text class="top_title" :text="dConfig.top?.title" :gravity="titleGravity"></qt-text>
    <qt-list-view 
      ref="topListRef" :clipChildren="false" :clipPadding="false" class="top_list"
      :style="{width: dConfig.top.btnListWidth + 'px'}"
      @item-focused="onTabChange" :horizontal="true" :focusable="false" padding="0,0,10,0"
    >
      <div :type="10001" class="top_list_item" :collapsable="false" :focusable="true" :focusScale="1.08">
        <!-- <qt-button :enable-flex-style="true" text="text" gradientFocusBackground="gradientBackground" size="mini" round></qt-button> -->
        <div 
          class="top_btn" autoWidth autoHeight :duplicateParentState="true" showOnState="normal"
          gradientBackground="${background}" :focusable="false"
        >
          <text-view class="top_btn_txt" text="${text}" :style="dConfig.top?.btnStyle" autoWidth autoHeight :focusable="false"></text-view>
        </div>
        <div 
          class="top_btn_focused" autoWidth autoHeight :duplicateParentState="true"
          gradientBackground="${focusedBackground}" :focusable="false" :showOnState="['selected','focused']"
        >
          <text-view class="top_btn_txt" text="${text}" :style="dConfig.top?.btnFocusedStyle" autoWidth autoHeight :focusable="false"></text-view>
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
const arr:QTListViewItem[] = [1,2].map(item=>{
  return { 
    type: 10001,decoration:{ left: 20 }, text: '首页'+item,
    background: {colors:['#30000000','#30000000'],cornerRadius:25}, 
    focusedBackground: {colors:['#F9DFA7','#F9DFA7'],cornerRadius:25}, 
  }
})
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
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  width: 1920px;
  padding-left: 50px;
  padding-right: 50px;
  padding-top: 20px;
}
.top_title {
  flex: 1;
  height: 80px;
  font-size: 30px;
  color: #fff;
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
  position: absolute;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  border-radius: 25px;
  background-color: transparent;
  z-index: 1;
}
.top_btn_focused{
  z-index: 10;
  /* focus-background-color: transparent;
  focus-border-style: solid;
  focus-border-color: #fff;
  focus-border-width: 2px;
  focus-border-radius: 25px; */
}
.top_btn_txt{
  /* color: pink; */
  background-color: transparent;
}

.ac_top_right-left{
  flex-direction: row-reverse;
}
</style>