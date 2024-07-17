<template>
<div class="d2_info_action3" :focusable="true" :style="pData.foLayoutStyle" :focusScale="1.05">
  <img class="d2_info_action3_img" :src="pData.img" :style="pData.foImgStyle" :focusable="false" duplicateParentState></img>
  <!-- <img showOnState="focused" class="d2_info_action3_imgf" :src="pData.iconf||pData.icon" :style="pData.foImgStyle" :focusable="false" duplicateParentState></img> -->
</div>
</template>
<script lang='ts' setup>
// import { } from 'vue';
import { IvideoDesAction } from '../../../api/details2/types';

const props = withDefaults(defineProps<{
  pData: IvideoDesAction
}>(),{})
</script>
<style scoped lang="less">
.d2_info_action3 {
  position: relative;
  width: 200px;
  height: 109px;
  border-radius: 9px;
  margin-right: 24px;
  background-color: rgba(102, 102, 102, 0.2);
  // focus-background-color: #ffffff;
}
.d2_info_action3_img{
  position: absolute;
  z-index: 1;
  width: 200px;
  height: 109px;
}
</style>