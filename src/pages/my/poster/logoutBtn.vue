<template>
  <div 
    :type="108" layout="${layout}" flexStyle="${style}" :focusable="false" 
    class="my_logout_btn" disablePlaceholderFocus disablePlaceholder
  >
  <div class="my_logout_btn_box" :focusable="true" eventClick eventFocus>
    <div :showOnState="['focused','selected']" class="my_logout_btn_bg p_ab" :focusable="false" duplicateParentState >
      <!-- <div class="my_logout_btn_bg_inner" :focusable="false"></div> -->
      <!-- <img src="../../../assets/ic_btn_right.png" class="my_logout_btn_icon" :focusable="false"/> -->
    </div>
    <div :showOnState="['normal']" class="my_logout_btn_bg_no p_ab" :focusable="false" duplicateParentState>
      <!-- <div class="my_logout_btn_bg_no_inner" :focusable="false"></div> -->
    </div>
    <text-view 
      class="my_logout_btn_text p_ab" :focusable="false" duplicateParentState
      gravity="center" text="${title.text}" typeface="bold"
    />
  </div>
  </div>
</template>
<script lang='ts' setup>
</script>
<style scoped>
.my_logout_btn {
  background-color: transparent;
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: center;
}
.my_logout_btn_box{
  width: 314px;
  height: 75px;
  position: relative;
  background-color: transparent;
}
.p_ab{
  width: 314px;
  height: 75px;
  position: absolute;
  left: 0.01px;
  top: 0.01px;
  border-radius: 35px;
}
.my_logout_btn_bg{
  z-index: 1;
  background-color: #ffffff;
}
.my_logout_btn_bg_inner{
  width: 314px;
  height: 70px;
  background-color: #FFE60D;
  border-radius: 35px;
}
.my_logout_btn_bg_no{
  z-index: 2;
  background-color: rgba(255,255,255,0.15);
}
.my_logout_btn_bg_no_inner{
  width: 314px;
  height: 70px;
  background-color: #41C1FF;
  border-radius: 35px;
}
.my_logout_btn_text{
  height: 70px;
  font-size: 32px;
  color: #ffffff;
  focus-color: #023B2B;
  z-index: 3;
}
.my_logout_btn_icon{
  position: absolute;
  right: 11px;
  top: 8px;
  width: 32px;
  height: 22px;
  z-index: 2;
}
</style>