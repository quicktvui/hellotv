<template>
  <div class="top_menu" :class="'top_menu_' + topMode" :clipChildren="false" :focusable="false">
    <div class="top_menu_list_box">
      <ul class="top_menu_list" :focusable="false" horizontal :clipChildren="false">
        <li class="top_menu_list_item" :focusable="false" :clipChildren="false">
          <div
            v-for="(item,index) in btns" :key="item.id+''+index" 
            :style="getBtnStyle(item)" class="top_menu_btn" :focusable="true"
            :focusScale="1.05"
          >
            <div v-if="item.lIcon" class="top_menu_btn_icon_box" :focusable="false" duplicateParentState>
              <!-- lIconf selected -->
              <img :showOnState="['normal','selected']" class="top_menu_btn_icon" :src="item.lIcon" :focusable="false" duplicateParentState/>
              <img showOnState="focused" class="top_menu_btn_icon" :src="item.lIconf" :focusable="false" duplicateParentState/>
            </div>
            <span class="top_menu_btn_txt" :focusable="false" duplicateParentState>{{item.text}}</span>
            <img v-if="item.rIcon" class="top_menu_btn_icon_right" :src="item.rIcon" :focusable="false"/>
          </div>
        </li>
      </ul>
    </div>
    <div class="top_menu_logo" v-if="logo" :focusable="false">
      <div v-if="logo.title" class="top_menu_logo_title" :focusable="false">
        <img v-if="logo.titleIcon" :src="logo.titleIcon" class="top_menu_logo_icon" :focusable="false"/>
        <span class="top_menu_logo_txt">{{ logo.title }}</span>
      </div>
      <img v-if="logo" :src="logo.img" class="top_menu_logo_img" :focusable="false"/>
    </div>
  </div>
</template>
<script lang='ts' setup>
import { StyleValue, ref } from 'vue';
import { ITopMenuBarConfig, ITopMenuBarBtns } from './index'
const props = withDefaults(defineProps<ITopMenuBarConfig>(), {
  topMode: 'rightLogo', btns: ()=>[]
})

const fontSize = 24
const btnPadding = 18
const iconMarginRight = 9
const btnIconSize = 24+iconMarginRight
const getBtnStyle = (item:ITopMenuBarBtns):StyleValue => {
  return {
    width: item.text.length*fontSize + (item.lIcon?btnIconSize:0) + (item.rIcon?btnIconSize:0) + (btnPadding*2) + 'px'
  }
}
</script>
<style scoped lang="less">
.top_menu{
  width: 1920px;
  height: 100px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 96px;
  padding-right: 96px;
  background-color: transparent;
}
.top_menu_list_box{
  width: 1000px;
  height: 50px;
  margin-top: 30px;
}
.top_menu_list{
  width: 1000px;
  height: 50px;
  background-color: transparent;
}
.top_menu_list_item{
  width: 1000px;
  height: 50px;
  display: flex;
  flex-direction: row;
  background-color: transparent;
}
.top_menu_btn{
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
.top_menu_btn_icon_box{
  position: relative;
  width: 24px;
  height: 24px;
  margin-top: 2px;
  margin-right: 9px;
  background-color: transparent;
}
.top_menu_btn_icon{
  position:absolute;
  left: 0.01px;
  top: 0.01px;
  width: 24px;
  height: 24px;
  background-color: transparent;
  z-index: 1;
}
.top_menu_btn_icon_right{
  width: 24px;
  height: 24px;
  margin-top: 2px;
  margin-left: 9px;
}
.top_menu_btn_txt{
  font-size: 24px;
  color: #BFBFBF;
  focus-color: #0E0E0E;
}
.top_menu_logo{
  width: 160px;
  height: 48px;
  margin-top: 30px;
}
.top_menu_logo_title{
  width: 160px;
  height: 48px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #343637;
  border-radius: 24px;
}
.top_menu_logo_icon{
  width: 30px;
  height: 24px;
  margin-top: 2px;
  margin-right: 5px;
}
.top_menu_logo_txt{
  font-size: 30px;
  color: #BFBFBF;
}
.top_menu_logo_img{
  width: 160px;
  height: 48px;
}

.top_menu_leftLogo{
  flex-direction: row-reverse;
  .top_menu_list_item{
    justify-content: flex-end;
  }
  .top_menu_btn{
    margin-right: 0px;
    margin-left: 24px;
  }
}
</style>