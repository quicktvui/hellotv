<template>
  <!-- singleton -->
  <!-- disablePlaceholder -->
  <!-- <tv-item layout="${layout}" flexStyle="${style}" :focusable="true" singleton></tv-item> -->
  <div class="his_box" layout="${layout}" flexStyle="${style}" disablePlaceholderFocus :focusable="false" :clipChildren="false">
    <div showIf="${showApiData01==true}" flexStyle="${barStyle}" class="his_bar" :focusable="true" :focusScale="1.08"
      :enableBlackBorder="false" name="his_bar01" eventClick>
      <qt-text class="his_text1" :focusable="false" flexStyle="${barTitleStyle}" :ellipsizeMode="4" :lines="1"
        gravity="centerVertical|start" text="${apiData01Title}" :duplicateParentState="true" />
      <qt-text class="his_text2" :focusable="false" gravity="centerVertical|start" text="${apiData01SubTitle}"
        flexStyle="${barProgressStyle}" :duplicateParentState="true" />
    </div>
    <div showIf="${showApiData01==true}" class="his_bar_bottom_border" flexStyle="${barBorderBottomStyle}" :focusable="false"></div>
    <div showIf="${showApiData02==true}" flexStyle="${barStyle2}" class="his_bar" :focusable="true" :focusScale="1.08"
      :enableBlackBorder="false" name="his_bar02">
      <qt-text class="his_text1" :focusable="false" flexStyle="${barTitleStyle}" :ellipsizeMode="4" :lines="1"
        gravity="centerVertical|start" text="${apiData02Title}" :duplicateParentState="true" />
      <qt-text class="his_text2" :focusable="false" gravity="centerVertical|start" text="${apiData02SubTitle}"
        flexStyle="${barProgressStyle}" :duplicateParentState="true" />
    </div>
    <div showIf="${showApiData02==true}" class="his_bar_bottom_border" flexStyle="${barBorderBottomStyle}" :focusable="false"></div>
    <div flexStyle="${allTextStyle}" class="his_bar his_all" :focusable="true" :focusScale="1.08"
      :enableBlackBorder="false">
      <div class="his_all_title_box" autoHeight :duplicateParentState="true">
        <img showIf="${showAllSubText}" src="../../../../assets/my/record.png" flexStyle="${allImgSytle}" :focusable="false"/>
        <qt-text class="his_all_txt his_text1" autoWidth autoHeight :focusable="false" text="${allText}" gravity="centerVertical|start" :duplicateParentState="true" />
      </div>
      <qt-text 
        showIf="${showAllSubText}" class="his_all_txt his_text2" flexStyle="${allSubTextSytle}"
        gravity="centerVertical|start" :focusable="false" text="${allSubText}" :duplicateParentState="true"
        :ellipsizeMode="2" :lines="1"
      />
    </div>
  </div>
</template>
<script lang='ts' setup>
import { ref, onMounted } from 'vue';
</script>
<style scoped>
.his_box {
  background-color: #424650;
  border-radius: 8px;
}

.his_bar_bottom_border {
  background-color: rgba(255, 255, 255, 0.1);
}

.his_bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  /* border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: rgba(255, 255, 255, 0.1); */
  border-radius: 8px;
  focus-background-color: #ffffff;
}

.his_text1,
.his_text2 {
  focus-color: #000000;
}

.his_text1 {
  color: #ffffff;
}

.his_text2 {
  color: #909398;
  font-size: 22px;
}

.his_all{
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.his_all_title_box{
  display: flex;
  flex-direction: row;
  align-items: center;
}
</style>