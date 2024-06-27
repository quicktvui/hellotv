<template>
  <div v-if="pConfig" class="d2_top" :class="'d2_top_' + pConfig.topMode" :clipChildren="false" :focusable="false">
    <div class="d2_top_list_box">
      <ul class="d2_top_list" ref="d2TopListRef" :focusable="false" horizontal :clipChildren="false">
        <li class="d2_top_list_item" :focusable="false" :clipChildren="false">
          <div
            v-for="(item,index) in topData?.btns" :key="item.id+''+index" 
            :style="getBtnStyle(item)" class="d2_top_btn" :focusable="true"
            :focusScale="1.05"
          >
            <div v-if="item.lIcon" class="d2_top_btn_icon_box" :focusable="false" duplicateParentState>
              <!-- lIconf selected -->
              <img :showOnState="['normal','selected']" class="d2_top_btn_icon" :src="item.lIcon" :focusable="false" duplicateParentState/>
              <img showOnState="focused" class="d2_top_btn_icon" :src="item.lIconf" :focusable="false" duplicateParentState/>
            </div>
            <span class="d2_top_btn_txt" :focusable="false" duplicateParentState>{{item.text}}</span>
            <img v-if="item.rIcon" class="d2_top_btn_icon_right" :src="item.rIcon" :focusable="false"/>
          </div>
        </li>
      </ul>
    </div>
    <div class="d2_logo" v-if="topData.logo" :focusable="false">
      <div v-if="topData.logo.title" class="d2_logo_title" :focusable="false">
        <img v-if="topData.logo.titleIcon" :src="topData.logo.titleIcon" class="d2_logo_icon" :focusable="false"/>
        <span class="d2_logo_txt">{{ topData.logo.title }}</span>
      </div>
      <img v-if="topData.logo" :src="topData.logo.logo" class="d2_logo_img" :focusable="false"/>
    </div>
  </div>
</template>
<script lang='ts' setup>
import { StyleValue, onMounted, ref } from 'vue';
// @ts-ignore
import api from '../../api/details2/index.ts'
import { Id2TopData, Id2TopBtns,IDetail2Config } from '../../api/details2/types';

const topData = ref<Id2TopData>({ btns:[] })
const pConfig = ref<Partial<IDetail2Config>>();

const fontSize = 24
const btnPadding = 18
const iconMarginRight = 9
const btnIconSize = 24+iconMarginRight
const getBtnStyle = (item:Id2TopBtns):StyleValue => {
  return {
    width: item.text.length*fontSize + (item.lIcon?btnIconSize:0) + (item.rIcon?btnIconSize:0) + (btnPadding*2) + 'px'
  }
}

api.getConfig().then(res=>{
  pConfig.value = res
})
api.getTopList().then(res=>{
  topData.value = res
})
</script>
<style scoped lang="less">
.d2_top{
  width: 1920px;
  height: 100px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 96px;
  padding-right: 96px;
  background-color: transparent;
}
.d2_top_list_box{
  width: 1000px;
  height: 50px;
  margin-top: 30px;
}
.d2_top_list{
  width: 1000px;
  height: 50px;
  background-color: transparent;
}
.d2_top_list_item{
  width: 1000px;
  height: 50px;
  display: flex;
  flex-direction: row;
  background-color: transparent;
}
.d2_top_btn{
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 48px;
  border-radius: 24px;
  margin-right: 24px;
  background-color: #343637;
  focus-background-color: #ffffff;
}
.d2_top_btn_icon_box{
  position: relative;
  width: 24px;
  height: 24px;
  margin-top: 2px;
  margin-right: 9px;
  background-color: transparent;
}
.d2_top_btn_icon{
  position:absolute;
  left: 0.01px;
  top: 0.01px;
  width: 24px;
  height: 24px;
  background-color: transparent;
  z-index: 1;
}
.d2_top_btn_icon_right{
  width: 24px;
  height: 24px;
  margin-top: 2px;
  margin-left: 9px;
}
.d2_top_btn_txt{
  font-size: 24px;
  color: #BFBFBF;
  focus-color: #0E0E0E;
}
.d2_logo{
  width: 160px;
  height: 48px;
  margin-top: 30px;
}
.d2_logo_title{
  width: 160px;
  height: 48px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #343637;
  border-radius: 24px;
}
.d2_logo_icon{
  width: 30px;
  height: 24px;
  margin-top: 2px;
  margin-right: 5px;
}
.d2_logo_txt{
  font-size: 30px;
  color: #BFBFBF;
}
.d2_logo_img{
  width: 160px;
  height: 48px;
}

.d2_top_leftLogo{
  flex-direction: row-reverse;
  .d2_top_list_item{
    justify-content: flex-end;
  }
  .d2_top_btn{
    margin-right: 0px;
    margin-left: 24px;
  }
}
</style>