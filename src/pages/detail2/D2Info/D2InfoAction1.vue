<template>
<div class="d2_info_action" :focusable="true" :style="pData.foLayoutStyle" :focusScale="1.05">
  <div v-if="pData.gradientBg||pData.gradientBgf" class="d2_info_action_bg" :style="pData.foLayoutStyle" :focusable="false" duplicateParentState>
    <div :showOnState="['normal','selected']" class="d2_info_action_bg_n" :gradientBackground="pData.gradientBg" :style="pData.foLayoutStyle" :focusable="false" duplicateParentState></div>
    <div showOnState="focused" class="d2_info_action_bg_f" :gradientBackground="pData.gradientBgf||pData.gradientBg" :style="pData.foLayoutStyle" :focusable="false" duplicateParentState></div>
  </div>
  <div class="d2_info_action_inner" :focusable="false" duplicateParentState :style="pData.foLayoutStyle">
    <div class="d2_info_action_icon_box" :focusable="false" duplicateParentState>
      <img :showOnState="['normal','selected']" class="d2_info_action_icon" :src="pData.icon" :focusable="false" duplicateParentState/>
      <img showOnState="focused" class="d2_info_action_icon" :src="pData.iconf" :focusable="false" duplicateParentState/>
    </div>
    <span class="d2_info_action_txt" :focusable="false" duplicateParentState>{{ pData.txt }}</span>
  </div>
</div>
</template>
<script lang='ts' setup>
import { StyleValue, computed } from 'vue';
import { IvideoDesAction } from '../../../api/details2/types';

const props = withDefaults(defineProps<{
  pData: IvideoDesAction
}>(),{})
// :gradientBackground="{type: 0, shape: 0,colors: ['#0D1F41', '#1B2143'],cornerRadii4: [20, 20, 20, 20]}"
</script>
<style scoped>
.d2_info_action {
  position: relative;
  width: 156px;
  height: 109px;
  border-radius: 9px;
  margin-right: 24px;
  background-color: rgba(102, 102, 102, 0.2);
  focus-background-color: #ffffff;
}
.d2_info_action_bg{
  position: absolute;
  z-index: 1;
  width: 156px;
  height: 109px;
  background-color: transparent;
}
.d2_info_action_bg_n{
  position: absolute;
  z-index: 1;
  width: 156px;
  height: 109px;
}
.d2_info_action_bg_f{
  position: absolute;
  z-index: 1;
  width: 156px;
  height: 109px;
}
.d2_info_action_inner{
  position: absolute;
  z-index: 2;
  width: 156px;
  height: 109px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  color: #BFBFBF;
  focus-color: #0E0E0E;
}
</style>