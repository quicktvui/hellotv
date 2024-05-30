<template>
  <!-- singleton -->
  <!-- disablePlaceholder -->
  <!-- <tv-item layout="${layout}" flexStyle="${style}" :focusable="true" singleton></tv-item> -->
  <div 
    class="his_box" layout="${layout}" flexStyle="${style}" 
    disablePlaceholderFocus :focusable="false" :clipChildren="false"
    gradientBackground="${myHisGradientBackground}"
  >
    <div showIf="${showApiData01==true}" flexStyle="${barStyle}" class="his_bar" :focusable="true" :focusScale="1.08"
      :enableBlackBorder="false" name="myHistoryApiData01Name" eventClick>
      <!-- textSpan="${apiData01TitleSpan}" text="${apiData01Title}" -->
      <text-view 
        class="his_text1" :focusable="false" flexStyle="${barTitleStyle}" 
        :ellipsizeMode="4" :lines="1"
        gravity="centerVertical" textSpan="${apiData01TitleSpan}" 
        :duplicateParentState="true"
      ></text-view>
      <qt-text class="his_text2" :focusable="false" gravity="centerVertical|end" text="${apiData01SubTitle}"
        flexStyle="${barProgressStyle}" :duplicateParentState="true" />
    </div>
    <div showIf="${showApiData01==true}" class="his_bar_bottom_border" flexStyle="${barBorderBottomStyle}" :focusable="false"></div>
    <div showIf="${showApiData02==true}" flexStyle="${barStyle2}" class="his_bar" :focusable="true" :focusScale="1.08"
      :enableBlackBorder="false" name="myHistoryApiData02Name" eventClick @click="clickBar" @focus="focusBar">
      <!-- textSpan="${apiData02TitleSpan}" text="${apiData02Title}"-->
      <text-view class="his_text1" :focusable="false" flexStyle="${barTitleStyle}" :ellipsizeMode="4" :lines="1"
        gravity="center|start" textSpan="${apiData02TitleSpan}"  :duplicateParentState="true" />
      <qt-text class="his_text2" :focusable="false" gravity="centerVertical|end" text="${apiData02SubTitle}"
        flexStyle="${barProgressStyle}" :duplicateParentState="true" />
    </div>
    <div showIf="${showApiData02==true}" class="his_bar_bottom_border" flexStyle="${barBorderBottomStyle}" :focusable="false"></div>
    <div 
      flexStyle="${allTextStyle}" class="his_bar his_all" :focusable="true" :focusScale="1.08"
      :enableBlackBorder="false" name="myHistoryApiAllName"
    >
      <div class="his_all_title_box" flexStyle="${hisAllTitleBoxStyle}" autoHeight :duplicateParentState="true">
        <img showIf="${showAllSubText}" src="../../../../assets/my/record.png" flexStyle="${allImgSytle}" :focusable="false"/>
        <qt-text showIf="${showAllSubText}" class="his_all_txt his_text1" autoWidth autoHeight :focusable="false" text="${allText}" gravity="centerVertical|start" :duplicateParentState="true" />
        <div showIf="${showAllSubText==false}" class="his_all_txt_row_box" flexStyle="${hisAllTitleBoxStyle}" autoHeight :duplicateParentState="true">
          <qt-text class="his_all_txt his_text1" autoWidth autoHeight :focusable="false" text="${allText}" gravity="centerVertical|start" :duplicateParentState="true" />
          <img class="his_all_txt_row" src="../../../../assets/my/right_row.png" :focusable="false" flexStyle="${allImgRowSytle}"/>
        </div>
      </div>
      <qt-text 
        showIf="${showAllSubText}" class="his_text2" flexStyle="${allSubTextSytle}"
        gravity="centerVertical|start" :focusable="false" text="${allSubText}" :duplicateParentState="true"
        :ellipsizeMode="2" :lines="1"
      />
    </div>
  </div>
</template>
<script lang='ts' setup>
import { useESRouter } from '@extscreen/es3-router';
import { ref, onMounted } from 'vue';

const router = useESRouter()
const clickBar = ()=>{
  console.log('lsj-clickBar')
  // router.push({ name: 'my' })
}
const focusBar = (ev)=>{
  console.log('lsj-focusBar', ev)
}
</script>

<style scoped>
.his_box {
  background-color: transparent;
  /* 424650 */
  border-radius: 20px;
  border-width: 1px;
  border-style: solid;
  border-color: #696A80;
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
  font-size: 30px;
  color: #ffffff;
  /* color: rgba(255, 255, 255, 0.5); */
}

.his_text2 {
  color: rgba(255, 255, 255, 0.5);
  font-size: 20px;
}

.his_all{
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
}
.his_all_txt{
  font-size: 30px;
  color: #ffffff;
  focus-color: #000000;
}
.his_all_title_box{
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: transparent;
}
.his_all_txt_row_box {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
}
</style>