<template>
  <div 
    :type="105" layout="${layout}" flexStyle="${style}" :focusable="true" 
    class="my_poster_btn" eventClick eventFocus
  >
    <text-view 
      class="my_poster_btn_txt" :focusable="false" autoWidth autoHeight :duplicateParentState="true"
      :ellipsizeMode="2" :lines="1" :postDelay="200" gravity="center" text="${title.text}"
    />
  </div>
</template>
<script lang='ts' setup>
</script>
<style scoped>
.my_poster_btn {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #2A2F39;
  border-style: solid;
  border-width: 1px;
  border-color: #696A80;
  border-radius: 20px;
  focus-border-color: #ffffff;
  focus-border-style: solid;
}
.my_poster_btn_txt{
  color: #ffffff;
  /* focus-color: #000000; */
}
</style>