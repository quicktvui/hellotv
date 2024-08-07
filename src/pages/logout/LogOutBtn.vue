<template>
  <div 
    :focusable="true" ref="logoutBtnRef" eventClick class="logout_btn_size logout_btn_box" 
    :clipChildren="false" overflow="visible" :autofocus="isFocus">
    <div :showOnState="['normal']" class="logout_btn_size logout_btn_bg_d"
      :focusable="false" duplicateParentState :clipChildren="false" overflow="visible">
      <div class="logout_btn_bg_d_inner"></div>
    </div>
    <div :showOnState="['focused', 'selected']" class="logout_btn_size logout_btn_bg_f"
      :focusable="false" duplicateParentState :clipChildren="false" overflow="visible">
      <div class="logout_btn_bg_f_inner"></div>
    </div>
    <text-view 
      class="logout_btn" gravity="center" 
      :ellipsizeMode="2" :lines="1" :text="text" typeface="bold"
      :focusable="false" duplicateParentState></text-view>
  </div>
</template>
<script lang='ts' setup>
import { ref } from 'vue';
// import { Native } from "@extscreen/es3-vue"

// const btnBg_d = { colors: ['#8D8D8D', '#8D8D8D'], cornerRadii4: [40, 40, 40, 40], orientation: 6 }
// const btnBg_f = { colors: ['#FFA02D', '#FFA02D'], cornerRadii4: [40, 40, 40, 40], orientation: 6 }

interface Iprops {
  text: string; isFocus?:boolean
}
const props = withDefaults(defineProps<Iprops>(), {
  text: '', isFocus: false
})
const logoutBtnRef = ref()
// onMounted(()=>{
//   if(props.isFocus){
//     Native.callUIFunction(logoutBtnRef.value, 'requestFocus', []);
//   }
// })
</script>
<style scoped>
.logout_btn_size{
  width: 313px;
  height: 80px;
  border-radius: 42px;
}
.logout_btn_box{
  position: relative;
  background-color: transparent;
  focus-scale:1.05;
}
.logout_btn_bg_d{
  position: absolute;
  left: 0.01px;
  top: 0.01px;
  background-color: transparent;
  z-index: 1;
}
.logout_btn_bg_d_inner{
  width: 313px;
  height: 75px;
  border-radius: 38px;
  background-color: rgba(255,255,255,0.1);
  border-width: 1px;
  border-color: rgba(255,255,255,0.5);
}
.logout_btn_bg_f_inner{
  width: 313px;
  height: 75px;
  border-radius: 38px;
  background-color: #FFFFFF;
}
.logout_btn_bg_f{
  position: absolute;
  left: 0.01px;
  top: 0.01px;
  background-color: transparent;
  z-index: 2;
}
.logout_btn{
  width: 313px;
  height: 75px;
  position: absolute;
  left: 0.01px;
  top: 0.01px;
  background-color: transparent;
  z-index: 3;
  font-size: 38px;
  font-weight: bold;
  color: #ffffff;
  focus-color: #042F1F;
}
</style>