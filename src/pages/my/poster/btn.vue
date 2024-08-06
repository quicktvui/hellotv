<template>
  <div 
    :type="105" layout="${layout}" flexStyle="${style}" :focusable="true" 
    class="my_poster_btn" eventClick eventFocus
  >
  <!-- gradientBackground="${focusedBgColor}" -->
  <div :showOnState="['focused','selected']" flexStyle="${style}" class="my_poster_btn_bg" :focusable="false" duplicateParentState gradientBackground="${focusedBgColor}"></div>
  <div :showOnState="['normal']" flexStyle="${style}" class="my_poster_btn_bg_no" :focusable="false" duplicateParentState></div>
  <div class="my_poster_btn_inner" flexStyle="${style}" :focusable="false" duplicateParentState>
    <text-view 
      class="my_poster_btn_txt" :focusable="false" autoWidth autoHeight :duplicateParentState="true"
      :ellipsizeMode="2" :lines="1" :postDelay="200" gravity="center" text="${title.text}"
      typeface="bold"
    />
  </div>
  </div>
</template>
<script lang='ts' setup>
</script>
<style scoped>
.my_poster_btn {
  position: relative;
  border-radius: 20px;
  background-color: transparent;
}
.my_poster_btn_bg{
  position: absolute;
  left: 0;
  top: 0;
  z-index: 2;
  background-color: transparent;
  border-radius: 20px;
}
.my_poster_btn_bg_no{
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
  background-color: rgba(255,255,255,0.15);
  border-style: solid;
  border-width: 1px;
  border-color: rgba(255,255,255,0.5);
  border-radius: 16px;
}
.my_poster_btn_inner{
  position: absolute;
  left: 0;
  top: 0;
  z-index: 3;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: 16px;
}
.my_poster_btn_txt{
  color: #ffffff;
  font-size: 36px;
  focus-color: #023B2B;
}
</style>