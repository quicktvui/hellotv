<template>
  <qt-view class="filter-content-item-h" :focusable="true" :focusScale="1.06" eventFocus eventClick>

    <!-- 海报图 -->
    <qt-view class="filter-content-item-h-img" :focusable="false" :enableFocusBorder="true" duplicateParentState>
      <qt-image class="filter-content-item-h-img" src="${poster}" :focusable="false" :postDelay="300"/>
    </qt-view>

    <!-- 角标 -->
    <qt-view class="filter-content-item-h-corner" :focusable="false">
      <!-- 文字 -->
      <qt-text class="filter-content-item-h-corner-text" text="VIP | 新番" flexStyle="${corner.style}" gravity="center" :focusable="false"></qt-text>
      <!-- 图片 -->
      <qt-image class="filter-content-item-h-corner-img" src="${cornerImg}" flexStyle="${corner.style}" :focusable="false"/>
    </qt-view>

    <!-- 主标题 -->
    <qt-view class="filter-content-item-h-title" autoHeight :focusable="false" duplicateParentState>
      <!-- 样式一 普通省略展示、焦点滚动展示 -->
      <!-- <qt-text class="filter-content-item-h-title-text" autoHeight
        text="${title}" :showOnState="['normal', 'selected']" :lines="1" :ellipsizeMode="2" :focusable="false" duplicateParentState></qt-text>
      <qt-text class="filter-content-item-h-title-text" style="position: absolute;" autoHeight
        text="${title}" showOnState="focused" :ellipsizeMode="3" :focusable="false" duplicateParentState></qt-text> -->

      <!-- 样式二 全部最大两行展示 -->
      <qt-text class="filter-content-item-h-title-text" autoHeight text="${title}" :maxLines="2" :ellipsizeMode="2" :focusable="false" duplicateParentState></qt-text>
    </qt-view>
    <!-- 副标题 -->
    <qt-text class="filter-content-item-h-title-sub" text="更新至第6话" :focusable="false"></qt-text>
    <!-- 推荐语 -->
    <qt-text class="filter-content-item-h-title-sub" text="奇境入梦，我在其中" :focusable="false"></qt-text>

  </qt-view>
</template>

<style scoped>
.filter-content-item-h {
  width: 321px;
  height: 277px;
  background-color: transparent;
}

.filter-content-item-h-img {
  width: 321px;
  height: 180px;
  background-color: transparent;
  border-radius: 9px;
  focus-border-radius: 9px;
  margin-bottom: 15px;
}

.filter-content-item-h-corner {
  width: 150px;
  height: 50px;
  background-color: transparent;
  position: absolute;
  top: 15;
  left: 171;
}

.filter-content-item-h-corner-text {
  width: 150px;
  height: 50px;
  background-color: red;
  color: #FFFFFF;
  font-size: 24px;
}

.filter-content-item-h-corner-img {
  width: 150px;
  height: 50px;
  background-color: yellow;
}

.filter-content-item-h-title {
  width: 321px;
  /* height: 29px; */
  background-color: transparent;
  top: -5;
}

.filter-content-item-h-title-text {
  width: 321px;
  /* height: 29px; */
  background-color: transparent;
  color: #BFBFBF;
  font-size: 24px;
  focus-color: #FFFFFF;
}

.filter-content-item-h-title-sub {
  width: 321px;
  height: 23px;
  background-color: transparent;
  color: #656565;
  font-size: 18px;
}
</style>
