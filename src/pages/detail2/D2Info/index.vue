<template>
  <div class="d2_info" :style="getStyle()" :clipChildren="false">
    <!-- autoWidth autoHeight -->
    <text-view 
      class="d2_info_title" :ellipsizeMode="2" :lines="1" gravity="centerVertical"
      :text="dideoDesData.title" :focusable="false" typeface="bold"
    />
    
    <div class="d2_info_tag_list" :focusable="false">
      <div 
        v-for="(tagItem,tagIndex) in dideoDesData.tags" :key="tagItem.id+''+tagIndex"
        class="d2_info_tag_list_item" :class="'d2_info_tag_list_item_'+tagItem.mode"
        :focusable="false" :style="getTagStyle(tagItem)"
      >
        <span :style="getTagTxtStyle(tagItem)">{{tagItem.txt}}</span><p v-if="tagItem.showSplit" :style="getTagSplitStyle(tagItem)">/</p>
      </div>
    </div>

    <div class="d2_info_des" v-if="dideoDesData.des" :focusable="true" :focusScale="1.05">
      <text-view 
        class="d2_info_des_txt" :ellipsizeMode="2" :lines="1" gravity="centerVertical"
        :text="dideoDesData.des" :focusable="false" typeface="bold"
      />
      <div class="d2_info_des_more_box" :focusable="false" duplicateParentState>
        <span class="d2_info_des_more" :focusable="false" duplicateParentState>更多</span>
      </div>
    </div>
  
    <ul 
      class="d2_info_actions" sid="d2InfoActionsSid" :focusable="false" 
      :clipChildren="false" horizontal :initPosition="{
        focusPosition: 0, scrollToPosition: 0
      }"
    >
      <li v-for="(actionItem,actionIndex) in dideoDesData.actions" :key="actionItem.id+''+actionIndex" :type="actionItem.type">
        <D2InfoAction1 v-if="actionItem.type==IvideoDesActionTypes.btn" :pData="actionItem" @click="clickActionFn(actionItem)"/>
        <D2InfoAction2 v-if="actionItem.type==IvideoDesActionTypes.btn2" :pData="actionItem" @click="clickActionFn(actionItem)"/>
        <D2InfoAction3 v-if="actionItem.type==IvideoDesActionTypes.img" :pData="actionItem" @click="clickActionFn(actionItem)"/>
      </li>
    </ul>
  </div>
</template>
<script lang='ts' setup>
import { StyleValue, nextTick, ref } from 'vue';
// @ts-ignore
import api from '../../../api/details2/index.ts'
import { IvideoDes, Itag, IvideoDesActionTypes } from '../../../api/details2/types';
import D2InfoAction1 from './D2InfoAction1.vue'
import D2InfoAction2 from './D2InfoAction2.vue'
import D2InfoAction3 from './D2InfoAction3.vue'

const dideoDesData = ref<IvideoDes>({
  topDistance: 0, title: '', tags: [], actions: []
})

const getStyle = ():StyleValue=>{
  return {
    marginTop: (dideoDesData.value.topDistance||0)+'px',
    // opacity: dideoDesData.value.title?1:0
  }
}
const getTagStyle = (tagItem:Itag):StyleValue => {
  return {
    backgroundColor: tagItem.bgColor, borderColor: tagItem.borderColor,
    marginRight: tagItem.showSplit?'0px':(tagItem.gap||0)+'px'
  }
}
const getTagTxtStyle = (tagItem:Itag):StyleValue => {
  return {
    color: tagItem.color
  }
}
const getTagSplitStyle = (tagItem:Itag):StyleValue => {
  return {
    paddingLeft: (tagItem.gap||0)+'px', paddingRight: (tagItem.gap||0)+'px',
    color: tagItem.color
  }
}
const clickActionFn = (actionItem)=>{
  console.log(actionItem, '--lsj=args')
}
api.getVideoDes().then(res=>{
  dideoDesData.value = res
})
</script>
<style scoped lang="less">
.d2_info{
  width: 1920px;
  /* height: 610px; */
  padding-left: 96px;
  padding-right: 96px;
  background-color: transparent;
}
.d2_info_title{
  width: 1500px;
  height: 70px;
  font-size: 48px;
  color: #ffffff;
  margin-bottom: 30px;
  background-color: transparent;
}
.d2_info_tag_list{
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 30px;
  height: 36px;
  background-color: transparent;
}
.d2_info_tag_list_item {
  display: flex;
  flex-direction: row;
  align-items: center;
  vertical-align: middle;
  span{
    font-size: 30px;
    line-height: 36px;
    color: #FFFFFF;
    vertical-align: middle;
  }
  p{
    line-height: 36px;
    font-size: 32px;
    padding-left: 2px;
    padding-right: 2px;
    color: #FFFFFF;
    vertical-align: middle;
  }
}
.d2_info_tag_list_item_tag{
  height: 30px;
  border-radius: 4px;
  padding-left: 5px;
  padding-right: 5px;
  border-width: 1px;
  border-style: solid;
  border-color: #cccccc;
  span{
    font-size: 22px;
    line-height: 30px;
  }
}
.d2_info_tag_list_item_btn{
  height: 30px;
  border-radius: 4px;
  padding-left: 5px;
  padding-right: 5px;
  background-color: rgb(213, 58, 84);
  span{
    line-height: 30px;
    font-size: 22px;
  }
}

.d2_info_des{
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 30px;
}
.d2_info_des_txt{
  width: 1000px;
  height: 50px;
  font-size: 24px;
  color: #999999;
  margin-right: 20px;
}
.d2_info_des_more_box{
  background-color: transparent;
  padding-left: 5px;
  padding-right: 5px;
  border-radius: 4px;
  focus-background-color: #ffffff;
}
.d2_info_des_more{
  font-size: 24px;
  color: #ffffff;
  text-decoration: underline;
  background-color: transparent;
  focus-color: #000000;
}

.d2_info_actions{
  height: 109px;
  display: flex;
  flex-direction: row;
  background-color: transparent;
}
</style>