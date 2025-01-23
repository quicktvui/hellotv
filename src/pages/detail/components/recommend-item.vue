<template>
  <qt-view class="recommend-item-root"
    flexStyle="${style}"
    layout="${layout}"
    name="detail-recommend-item"
    :focusable="true"
    :focusScale="ThemeConfig.placeHolderFocusScale"
    eventFocus
    eventClick>
    <!-- 海报图 -->
    <qt-view
      class="recommend-item-img"
      :focusable="false"
      :enableFocusBorder="true"
      duplicateParentState>
      <qt-image
        class="recommend-item-img"
        flexStyle="${image.style}"
        src="${image.src}"
        :focusable="false"
        :postDelay="300"/>
    </qt-view>
    <!-- 角标 -->
    <img class="recommend-item-corner-img" :postDelay="300" flexStyle="${corner.style}" src="${recommend-item}" :focusable="false"/>
    <div class="recommend-item-corner-text-box" :focusable="false" showIf="${corner.enable==true}">
      <qt-text
        class="recommend-item-corner-text"
        :focusable="false"
        :textSize="20"
        :ellipsizeMode="2"
        :lines="1"
        typeface="bold"
        gravity="center"
        :postDelay="100"
        gradientBackground="${corner.background}"
        autoWidth
        text="${corner.text}"
      />
    </div>
    <!-- 评分 -->
    <qt-view
      class="recommend-item-score"
      :focusable="false"
      :gradientBackground="{colors:['#00000000', '#E5000000'], cornerRadii4: [0, 0, 9, 9]}">
      <qt-text
        class="recommend-item-score-text"
        :fontSize="24"
        :paddingRect="[15,0,0,6]"
        text="${score}"
        :focusable="false"
      />
    </qt-view>
    <!-- 标题 -->
    <qt-view
      class="recommend-item-title"
      :duplicateParentState="true"
      :focusable="false">
      <qt-text
        class="recommend-item-title-text"
        :fontSize="30"
        :ellipsizeMode="2"
        :lines="1"
        :duplicateParentState="true"
        :paddingRect="[0,14,0,0]"
        text="${title.text}"
        :focusable="false"
        :select="true"
      />
    </qt-view>
  </qt-view>
</template>

<script setup lang='ts' name='RecommendItem'>
import ThemeConfig from "../../../config/theme-config";
</script>

<style lang='scss' scoped>
.recommend-item-root{
  background-color: transparent;
  .recommend-item-img{
    border-radius: $theme-img-border;
    focus-border-color: $theme-focus-border-color;
    focus-border-style: solid;
    z-index: 1;
    background-color: rgba(255,255,255,0.1);
  }
  .recommend-item-corner-img{
    position: absolute;
    z-index: 1000;
    top: 6px;
    right:6px;
  }
  .recommend-item-corner-text-box{
    width: 260px;
    height: 36px;
    background-color: transparent;
    position: absolute;
    left: 0;
    right: 0.1;
    flex-direction: row-reverse;
    z-index: 99999;
    .recommend-item-corner-text{
      padding: 4px 8px;
      margin: 4px;
      z-index: 1000;
      height: 36px;
      color: #ffffff;
    }
  }
  .recommend-item-score{
    background-color: transparent;
    z-index: 1000;
    height: 65px;
    position: absolute;
    left: 0;
    bottom: 54px;
    .recommend-item-score-text{
      width: 260px;
      height: 32px;
      top: 28px;
      color: #FC5E1B;
      z-index: 1000;
      background-color: transparent;
      position: absolute;
    }
  }
  .recommend-item-title{
    width: 260px;
    height: 54px;
    position: absolute;
    left: 0;
    top: 368px;
    z-index: 110;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border-bottom-left-radius: 9px;
    border-bottom-right-radius: 9px;
    background-color: transparent;
    .recommend-item-title-text{
      width: 260px;
      height: 54px;
      background-color: transparent;
      color: rgba(255, 255, 255, .5);
      focus-color: rgba(255, 255, 255, 1);
    }
  }
}
</style>
