<template>
<div class="d2_info_action2" :focusable="true" :style="pData.foLayoutStyle" :focusScale="1.05" :clipChildren="false" eventClick eventFocus>
  <div v-if="pData.gradientBg||pData.gradientBgf" class="d2_info_action_bg" :style="pData.foLayoutStyle" :focusable="false" duplicateParentState>
    <div :showOnState="['normal','selected']" class="d2_info_action_bg_n" :gradientBackground="pData.gradientBg" :style="pData.foLayoutStyle" :focusable="false" duplicateParentState></div>
    <div showOnState="focused" class="d2_info_action_bg_f" :gradientBackground="pData.gradientBgf||pData.gradientBg" :style="pData.foLayoutStyle" :focusable="false" duplicateParentState></div>
  </div>
  <div class="d2_info_action_inner" :focusable="false" duplicateParentState :style="pData.foLayoutStyle" :clipChildren="false">
    <div class="d2_info_action_inner_btn1" :clipChildren="false">
      <div class="d2_info_action_icon_box" :focusable="false" duplicateParentState>
        <img :showOnState="['normal','selected']" class="d2_info_action_icon" :src="pData.icon" :focusable="false" duplicateParentState/>
        <img showOnState="focused" class="d2_info_action_icon" :src="pData.iconf||pData.icon" :focusable="false" duplicateParentState/>
      </div>
      <span class="d2_info_action_txt" :focusable="false" duplicateParentState>{{ pData.txt }}</span>
    </div>
    <div class="d2_info_action_inner_split" :focusable="false" :collapsable="false" :clipChildren="false"><span></span></div>
    <div class="d2_info_action_inner_btn2" :focusable="false" :clipChildren="false">
      <p class="d2_info_action_inner_btn2_year">{{pData.vipDuration}}</p>
      <p class="d2_info_action_inner_btn2_price"><span class="d2_info_action_inner_btn2_price_num">{{pData.price}}</span><span class="d2_info_action_inner_btn2_price_unit">元</span></p>
      <p class="d2_info_action_inner_btn2_o_price">{{pData.oPrice}}元</p>
    </div>
  </div>
</div>
</template>
<script lang='ts' setup>
// import { StyleValue, computed } from 'vue';
import { IvideoDesAction } from '../../../api/details2/types';

const props = withDefaults(defineProps<{
  pData: IvideoDesAction
}>(),{})
// :gradientBackground="{type: 0, shape: 0,colors: ['#0D1F41', '#1B2143'],cornerRadii4: [20, 20, 20, 20]}"
</script>
<style scoped lang="less">
.d2_info_action2 {
  position: relative;
  width: 300px;
  height: 109px;
  border-radius: 9px;
  margin-right: 24px;
  background-color: rgba(102, 102, 102, 0.2);
}
.d2_info_action_bg{
  position: absolute;
  z-index: 1;
  width: 300px;
  height: 109px;
  background-color: transparent;
}
.d2_info_action_bg_n{
  position: absolute;
  z-index: 1;
  width: 300px;
  height: 109px;
  background-color: transparent;
}
.d2_info_action_bg_f{
  position: absolute;
  z-index: 1;
  width: 300px;
  height: 109px;
  background-color: transparent;
}
.d2_info_action_inner{
  position: absolute;
  z-index: 2;
  width: 300px;
  height: 109px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
}
.d2_info_action_inner_btn1{
  width: 139px;
  height: 109px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}
.d2_info_action_inner_split{
  width: 1px;
  height: 80px;
  background-color: #b1734a;
}
.d2_info_action_inner_btn2{
  width: 159px;
  height: 109px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}
.d2_info_action_inner_btn2_year{
  font-size: 22px;
  color: #603314;
}
.d2_info_action_inner_btn2_price{
  font-size: 20px;
  color: #603314;
}
.d2_info_action_inner_btn2_price_num{
  font-size: 20px;
  color: red;
}
.d2_info_action_inner_btn2_price_unit{
  font-size: 20px;
  color: #603314;
}
.d2_info_action_inner_btn2_o_price{
  font-size: 18px;
  color: #827166;
  text-decoration: line-through;
}
.d2_info_action_icon_box{
  position: relative;
  width: 30px;
  height: 30px;
  margin-bottom: 10px;
}
.d2_info_action_icon{
  position: absolute;
  width: 30px;
  height: 30px;
  z-index: 1;
}
.d2_info_action_txt{
  font-size: 24px;
  color: #603314;
}
</style>