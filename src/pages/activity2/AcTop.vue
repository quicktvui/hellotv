<template>
  <div class="ac_top" :class="['ac_top_'+topConfig.mode]" :style="cStyle">
    <div class="top_title_box">
      <qt-text v-if="topConfig.title" class="top_title" :style="topConfig.titleStyle" :text="topConfig.title" :gravity="titleGravity"></qt-text>
    </div>
    <qt-list-view 
      ref="topListRef" :clipChildren="false" :clipPadding="false" class="top_list"
      :style="{width: topConfig.btnListWidth + 'px'}"
      @item-focused="onTabChange" :horizontal="true" :focusable="false" padding="0,0,10,0"
      @item-click="onItemClick" :enableSelectOnFocus="false"
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
import { computed, ref, onMounted } from 'vue';
import { QTListViewItem } from '@quicktvui/quicktvui3';
import { topModes } from '../../api/activity2/types'
import { useESToast } from '@extscreen/es3-core';
// @ts-ignore
import activity2Api from '../../api/activity2/index.ts';
import { useESRouter } from '@extscreen/es3-router';

const props = defineProps<{ isTop:boolean }>();

const topConfig = ref({
  mode: 'left-right', title: '',
  titleStyle: {
    color: '#ffffff', fontSize: '50px'
  },
  btnListWidth: 0,
  maskBg: 'transparent'
})
const router = useESRouter()
// const toast = useESToast()
const topListRef = ref()
const emits = defineEmits(['emTabChange'])
const cStyle = computed(()=>{
  return { backgroundColor: props.isTop ? topConfig.value.maskBg : 'transparent' }
})

const titleGravity = computed(()=>{
  return topConfig.value.mode === topModes.lr ? 'centerVertical' : 'centerVertical|end'
})

const onTabChange = (e) => {
  emits('emTabChange', e)
}

const onItemClick = (e)=>{
  if(e.item._router){
    router.push({
        name: e.item._router.name, //'series_view',
        params: e.item._router.params?{...e.item._router.params}:undefined
    });
  }
}
onMounted(async ()=>{
  const tconfig = await activity2Api.getConfigs()
  topConfig.value = Object.assign(topConfig.value, tconfig.top)
  const arr = await activity2Api.getTopBtns()
  topListRef.value?.init(arr)
})
// defineExpose({})
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
.ac_top_bg{
  background-color: rgba(0,0,0,0.8);
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