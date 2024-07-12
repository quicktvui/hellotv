<template>
  <tv-list
    list="${itemList}" horizontal :clipChildren="false" :focusable="false"
    resetOnDetach :endHintEnabled="false" useDiff enablePlaceholder
    :onScrollEnable="false" :setSelectChildPosition="0"
    class="rtcs_list" name="rtcs_list_name" flexStyle="${style}"
    @item-focused="onItemFocused" :blockFocusDirections="['left', 'right']"
  >
    <div :focusable="true" type="1" class="rtcs_list_poster" flexStyle="${style}">
      <img 
        :postDelay="300" :focusable="false" src="${numImg.url}" 
        flexStyle="${numImg.style}" class="rtcs_list_poster_num"
      />
      <img 
        :postDelay="300" :focusable="false" src="${image.src}" 
        flexStyle="${image.style}" class="rtcs_list_poster_img"
      />
      <div 
        class="rtcs_list_poster_cover" flexStyle="${coverStyle}" :focusable="false"
        duplicateParentState :enableBlackBorder="false"
      >
      </div>
    </div>
  </tv-list>
</template>
<script lang='ts' setup>
// @ts-ignore
import { rankingUi } from '../index.ts'
const onItemFocused = (e) => {
  if(e.hasFocus){
    rankingUi.updateCurrent(e.item.rwaData)
  }
}
</script>
<style scoped>
.rtcs_list {
  /* width: 1920px;
  height: 350px; */
  background-color: transparent;
}
.rtcs_list_poster {
  position: relative;
  background-color: transparent;
}
.rtcs_list_poster_num {
  background-color: transparent;
}
.rtcs_list_poster_img {
  position: absolute;
  right: 0.01px;
  top: 0.01px;
  z-index: 2;
  background-color: transparent;
  border-radius: 16px;
}
.rtcs_list_poster_cover {
  position: absolute;
  right: -5px;
  top: -5px;
  z-index: 10;
  border-radius: 16px;
  background-color: transparent;
  focus-border-style: solid;
}
</style>