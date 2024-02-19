<template>
  <qt-view :focusable="true" ref="search_result_item_long" :enableFocusBorder="true"  class="search_result_item_root" 
    layout="${layout}" eventClick eventFocus>
    <qt-image 
      class="search_result_item_poster"
      src="${poster}" 
      :focusable="false"
      :need-empty-bg="true"
      :need-crop="false"
      :border-radius="0"
      postDelay="300"
      :style="{'border-top-left-radius':8,'border-bottom-left-radius':8}"/>
    <qt-view class="search_item_block" showIf="${isShowCornerContent==true}" :focusable="false">
      <qt-text 
        :focusable="false"
        autoWidth
        :lines="1"
        :select="true"
        :ellipsizeMode="2"
        :font-size="23"
        postDelay="200"
        gravity="centerHorizontal"
        :paddingRect="[6,0,6,0]"
        style="padding-left: 6px;padding-right: 6px;"
        :gradientBackground="{ colors: ['#A06419', '#CDA048'], cornerRadii4: [0, 8, 0, 8], orientation: 6 }"
        text="${cornerContent}"
        class="cornerContent_text"/>
    </qt-view>
    <qt-view class="search_result_item_score_root" showIf="${isScore==true}" :focusable="false"
      :gradientBackground="{colors:['#00000000', '#E5000000'], cornerRadii4: [0, 0, 0, 8]}">
      <qt-text 
        :focusable="false"
        :lines="1"
        :select="true"
        :ellipsizeMode="2"
        :font-size="24"
        text="${score}"
        class="search_result_item_score_text"/>
    </qt-view>
    <qt-view :duplicateParentState="true" class="search_result_item_content" :focusable="false">
      <qt-view class="search_item_title_root" :duplicateParentState="true" :focusable="false">
        <qt-text :focusable="false"
          :lines="1"
          :showOnState="['normal','selected']"
          :select="true"
          :ellipsizeMode="2"
          style="color:white;"
          :font-size="34"
          text="${title}"
          class="search_result_item_title"/>
          
        <qt-text :focusable="false"
          :select="true"
          showOnState="focused"
          :ellipsizeMode="3"
          :font-size="34"
          text="${title}"
          :duplicateParentState="true"
          class="search_result_item_title"/>
      </qt-view>
      <qt-view :duplicateParentState="true" class="search_result_item_line" :focusable="false"/>
      <qt-view class="search_result_item_subtitle1_root" :duplicateParentState="true" :focusable="false">
        <qt-text :focusable="false"
          :lines="1"
          :showOnState="['normal','selected']"
          :select="true"
          :ellipsizeMode="2"
          :font-size="28"
          text="${description1}"
          class="search_result_item_subtitle1"/>
        <qt-text :focusable="false"
          :lines="1"
          showOnState="focused"
          :select="true"
          :ellipsizeMode="2"
          style="color:#333"
          :font-size="28"
          text="${description1}"
          class="search_result_item_subtitle1"/>
      </qt-view>
      <qt-view class="search_result_item_subtitle2_root" :duplicateParentState="true" :focusable="false">
        <qt-text :focusable="false"
          :lines="2"
          :showOnState="['normal','selected']"
          :select="true"
          :ellipsizeMode="2"
          :font-size="28"
          text="${description2}"
          class="search_result_item_subtitle2"/>
        <qt-text :focusable="false"
          :lines="2"
          showOnState="focused"
          :select="true"
          :ellipsizeMode="2"
          style="color:#333"
          :font-size="28"
          text="${description2}"
          class="search_result_item_subtitle2"/>
      </qt-view>
    </qt-view>
  </qt-view>
</template>
    
<script lang="ts">
import {defineComponent} from "@vue/runtime-core";
export default defineComponent({
  name: "search-result-long-item",
  setup(props, context) {
      
    return {
    }
  },
});
    
</script>
    
<style>
  .search_result_normal_item {position: absolute;background-color: transparent;overflow: hidden }
  .search_result_item_root {
    width: 556px;
    height: 335px;
    display: flex;
    flex-direction: row;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, .06);
    focus-background-color: white;
    position: absolute;
  }
  
  .search_result_item_poster {
    width: 238px;
    height: 335px;
  }
  
  .search_result_item_score_root {
    width: 238px;
    height: 65px;
    background-color: transparent;
    position: absolute;
    top: 270px;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
  
  .search_result_item_score_text {
    width: 238px;
    height: 65px;
    /* color: #FC5E1B; */
    color: #fc5e1b;
    position: absolute;
    top: 30px;
    left: 15px;
  }
  
  .search_result_item_content {
    width: 278px;
    height: 297px;
    margin-left: 24px;
    margin-right: 16px;
    margin-top: 38px;
    display: flex;
    flex: 1;
    flex-direction: column;
  }
  
  .search_item_title_root {
    width: 278px;
    height: 40px;
    left: 0;
    right: 0;
    display: flex;
  }
  
  .search_result_item_title {
    width: 278px;
    left: 0;
    right: 0;
    height: 40px;
    color: black;
    position: absolute;
  }
  
  .search_result_item_line {
    width: 278px;
    height: 1px;
    border-radius: 1px;
    background-color: rgba(255, 255, 255, .2);
    focus-background-color: rgba(51, 51, 51, .8);
    margin-top: 40px;
    margin-bottom: 38px;
  }
  .search_result_item_subtitle1_root{
    width: 278px;
    height: 40px;
    background-color: transparent;
  }
  .search_result_item_subtitle1 {
    width: 278px;
    height: 40px;
    left: 0;
    right: 0;
    position: absolute;
    color: rgba(255, 255, 255, .5);
  }
  .search_result_item_subtitle2_root{
    background-color: transparent;
    width: 278px;
    height: 80px;
  }
  .search_result_item_subtitle2{
    width: 278px;
    height: 80px;
    left: 0;
    right: 0;
    position: absolute;
    color: rgba(255, 255, 255, .5);
  }
  
  .search_item_block {
    width: 556px;
    height: 36px;
    background-color: transparent;
    position: absolute;
    left: 0;
    top: 0px;
    flex-direction: row-reverse;
  }
  
  .cornerContent_text {
    /* width: 70px; */
    height: 36px;
    color: #ffffff;
    padding: 8px 0 8px 0;
  }
  
  .search_item_block_vip {
    background-color: transparent;
    width: 70px;
    height: 38px;
    position: absolute;
    /* display: flex;
    flex-direction: row-reverse;
    justify-content: center;
    align-items: center; */
    left: 0px;
    top: 0px;
  }
  
  .search_item_block_vip_text {
    width: 70px;
    height: 38px;
    color: #ffffff;
  }   

</style>
    