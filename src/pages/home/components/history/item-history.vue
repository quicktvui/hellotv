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
      :enableBlackBorder="false" name="myHistoryApiData01Name" eventClick eventFocus>
      <!-- textSpan="${apiData01TitleSpan}" text="${apiData01Title}" -->
      <div :showOnState="['focused']" class="his_bar_bg" flexStyle="${barStyle}" duplicateParentState :focusable="false" gradientBackground="${myHisBarBg}"></div>
      <div class="his_bar_inner" flexStyle="${barStyle}" duplicateParentState :focusable="false">
        <div class="his_text_box" :focusable="false" flexStyle="${barTitleStyle}" duplicateParentState>
          <text-view 
            class="his_text1" :focusable="false" flexStyle="${barTitleStyle}" duplicateParentState
            :showOnState="['normal','selected']" :ellipsizeMode="2" :lines="1"
            gravity="centerVertical" textSpan="${apiData01TitleSpan}"
          ></text-view>
          <text-view 
            class="his_text1 his_text_f" :focusable="false" flexStyle="${barTitleStyle}" duplicateParentState
            :showOnState="['focused']" :ellipsizeMode="3" :lines="1"
            gravity="centerVertical" textSpan="${apiData01TitleSpanF}"
          ></text-view>
        </div>
        
        <qt-text class="his_text2" :focusable="false" gravity="centerVertical|end" text="${apiData01SubTitle}"
          flexStyle="${barProgressStyle}" :duplicateParentState="true" />
      </div>
    </div>
    <div showIf="${showApiData01==true}" class="his_bar_bottom_border" flexStyle="${barBorderBottomStyle}" :focusable="false"></div>
    <div showIf="${showApiData02==true}" flexStyle="${barStyle2}" class="his_bar" :focusable="true" :focusScale="1.08"
      :enableBlackBorder="false" name="myHistoryApiData02Name" eventClick eventFocus>
      <!-- textSpan="${apiData02TitleSpan}" text="${apiData02Title}"-->
      <div :showOnState="['focused']" class="his_bar_bg" flexStyle="${barStyle2}" duplicateParentState :focusable="false" gradientBackground="${myHisBarBg}"></div>
      <div class="his_bar_inner" flexStyle="${barStyle2}" duplicateParentState :focusable="false">
        <div class="his_text_box" :focusable="false" flexStyle="${barTitleStyle}" duplicateParentState>
          <text-view 
          class="his_text1" :focusable="false" flexStyle="${barTitleStyle}" duplicateParentState
          :showOnState="['normal','selected']" :ellipsizeMode="2" :lines="1"
          gravity="center|start" textSpan="${apiData02TitleSpan}" />
          <text-view 
          class="his_text1 his_text_f" :focusable="false" flexStyle="${barTitleStyle}" duplicateParentState
          :showOnState="['focused']" :ellipsizeMode="3" :lines="1"
          gravity="center|start" textSpan="${apiData02TitleSpanF}" />
        </div>

        <qt-text class="his_text2" :focusable="false" gravity="centerVertical|end" text="${apiData02SubTitle}"
          flexStyle="${barProgressStyle}" :duplicateParentState="true" />
      </div>
    </div>
    <div showIf="${showApiData02==true}" class="his_bar_bottom_border" flexStyle="${barBorderBottomStyle}" :focusable="false"></div>
    <div 
      flexStyle="${allTextStyle}" class="his_bar his_all" :focusable="true" :focusScale="1.08"
      :enableBlackBorder="false" name="myHistoryApiAllName"
    >
      <div :showOnState="['focused']" class="his_bar_bg" flexStyle="${allTextStyle}" duplicateParentState :focusable="false" gradientBackground="${myHisBarBg}"></div>
      <div class="his_all_inner" flexStyle="${allTextStyle}" duplicateParentState :focusable="false">

        <div showIf="${showAllSubText}" class="his_all_txt_row_icon_box" flexStyle="${allImgSytle}" :focusable="false" duplicateParentState>
          <img :showOnState="['normal','selected']" class="his_all_txt_row" src="../../../../assets/my/record2.png" flexStyle="${allImgSytle}" :focusable="false" duplicateParentState/>
          <img :showOnState="['focused']" class="his_all_txt_row_f"src="../../../../assets/my/record3.png" flexStyle="${allImgSytle}" :focusable="false" duplicateParentState/>
        </div>

        <div showIf="${showAllSubText}" class="his_all_title_box" :focusable="false" duplicateParentState>
          <qt-text class="his_all_txt" autoWidth autoHeight :focusable="false" text="${allText}" gravity="centerVertical|start" :duplicateParentState="true" />
          <qt-text 
            class="his_all_txt2" flexStyle="${allSubTextSytle}"
            gravity="centerVertical|start" :focusable="false" text="${allSubText}" duplicateParentState
            :ellipsizeMode="2" :lines="1"
          />
        </div>
        <div showIf="${showAllSubText==false}" class="his_all_txt_row_box" flexStyle="${hisAllTitleBoxStyle}" :duplicateParentState="true">
          <qt-text class="his_all_txt his_text1" autoWidth autoHeight :focusable="false" text="${allText}" gravity="centerVertical|start" :duplicateParentState="true" />
          <div class="his_all_txt_row_icon_box" :focusable="false" duplicateParentState flexStyle="${allImgRowSytle}">
            <img :showOnState="['normal','selected']" class="his_all_txt_row" src="${allTextRightIcon}" :focusable="false" duplicateParentState flexStyle="${allImgRowSytle}"/>
            <img :showOnState="['focused']" class="his_all_txt_row_f" src="${allTextRightIconF}" :focusable="false" duplicateParentState flexStyle="${allImgRowSytle}"/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang='ts' setup>
// import { ref, onMounted } from 'vue';
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
  position: relative;
  background-color: transparent;
  border-radius: 20px;
}
.his_bar_bg{
  position: absolute;
  left: 0.01px;
  top: 0.01px;
  z-index: 1;
  background-color: transparent;
  border-radius: 20px;
}
.his_bar_inner{
  position: absolute;
  left: 0.01px;
  top: 0.01px;
  z-index: 2;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  border-radius: 20px;
}

.his_text2 {
  focus-color: #ffffff;
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

/* .his_all{} */
.his_all_inner{
  position: absolute;
  left: 0.01px;
  top: 0.01px;
  z-index: 2;
  display: flex;
  flex-direction: row;
  /* justify-content: space-between; */
  align-items: center;
  background-color: transparent;
  border-radius: 20px;
}
.his_all_txt{
  font-size: 34px;
  color: #ffffff;
  /* focus-color: #000000; */
}
.his_all_txt2{
  color: rgba(255, 255, 255, 0.5);
  font-size: 20px;
}
.his_all_title_box{
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background-color: transparent;
}
.his_all_txt_row_box {
  position: absolute;
  left: 0.01px;
  top: 0.01px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
}
.his_text_box{
  position: relative;
  background-color: transparent;
}
.his_text{
  position: absolute;
  left: 0.01px;
  top: 0.01px;
  z-index: 1;
  background-color: transparent;
}
.his_text_f{
  position: absolute;
  left: 0.01px;
  top: 0.01px;
  z-index: 2;
  background-color: transparent;
}
.his_all_txt_row_icon_box{
  position: relative;
  background-color: transparent;
}
.his_all_txt_row{
  position: absolute;
  left: 0.01px;
  top: 0.01px;
  z-index: 1;
  background-color: transparent;
}
.his_all_txt_row_f{
  position: absolute;
  left: 0.01px;
  top: 0.01px;
  z-index: 2;
  background-color: transparent;
}
</style>