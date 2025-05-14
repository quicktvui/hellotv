<template>
  <qt-view
    class="grid-item-v"
    :style="$props.style"
    :focusable="true"
    :focusScale="themeConfig.placeHolderFocusScale"
    eventFocus
    eventClick
  >
    <!-- 焦点状态下的删除样式 -->
    <qt-view
      showIf="${showDeleteCover}"
      class="grid-item-v-delete"
      style="background-color: transparent"
      :focusable="false"
      :duplicateParentState="true"
    >
      <qt-view
        class="grid-item-v-delete"
        :style="$props.imageStyle"
        :showOnState="'focused'"
        :focusable="false"
        :duplicateParentState="true"
      >
        <qt-image style="width: 40px; height: 50px" :src="icDelete" :focusable="false"></qt-image>
      </qt-view>
    </qt-view>
    <!-- 外层这个div的作用是模拟placeholder, 如果没有启动placeholder, 把背景色加到图片上, 有时会闪一下页面背景色 -->
    <qt-view style="background-color: rgba(255, 255, 255, 0.1); border-radius: 16px" :focusable="false" :duplicateParentState="true">
      <!-- 封面 -->
      <qt-image
        class="grid-item-v-img"
        :style="$props.imageStyle"
        src="${cover}"
        :postDelay="100"
        :enableFocusBorder="true"
        :focusable="false"
        :duplicateParentState="true"
      ></qt-image>
    </qt-view>
    <!-- 角标 -->
    <qt-text
      showIf="${showCorner}"
      class="grid-item-v-corner"
      :style="{ top: 0, left: $props.style?.width.replace('px', '') - 75 }"
      text="${corner}"
      gravity="center"
      :focusable="false"
      :gradientBackground="{ colors: ['#73E59E', '#299B49'], orientation: 0, cornerRadii4: [0, 16, 0, 16] }"
    ></qt-text>
    <!-- 评分 -->
    <qt-view showIf="${showRating}" class="grid-item-v-score" :gradientBackground="scoreGradient" :focusable="false">
      <qt-text class="grid-item-v-score-text" text="${score}" :focusable="false"></qt-text>
    </qt-view>
    <!-- 标题 -->
    <qt-text
      class="grid-item-v-text"
      text="${title}"
      :paddingRect="[12, 0, 12, 0]"
      :boldOnFocus="true"
      :horizontalFadingEdgeEnabled="true"
      :lines="1"
      :ellipsizeMode="4"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-text>
    <!-- 播放进度 -->
    <qt-text
      showIf="${showProgress}"
      class="grid-item-v-progress"
      :style="{ width: $props.style?.width }"
      text="${progress}"
      gravity="center|start"
      :paddingRect="[12, 0, 12, 0]"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-text>
  </qt-view>
</template>

<script setup lang="ts" name="GridItemVertical">
import themeConfig from '../config/theme-config'
import icDelete from '../assets/history/ic_delete.png'

defineProps({
  style: {
    type: Object,
    default: () => ({
      width: `260px`,
      height: `414px`
    })
  },
  imageStyle: {
    type: Object,
    default: () => ({
      width: `260px`,
      height: `368px`,
      borderRadius: `${themeConfig.focusBorderCorner}px`
    })
  }
})

// 评分背景色
const scoreGradient = {
  colors: ['#00000000', '#CC000000'],
  orientation: 0,
  cornerRadii4: [0, 0, themeConfig.focusBorderCorner, themeConfig.focusBorderCorner]
}
</script>

<style scoped lang="scss">
.grid-item-v {
  background-color: transparent;
}

.grid-item-v-delete {
  background-color: rgba(0, 0, 0, 0.65);
  border-radius: 16px;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0.01px;
  left: 0.01px;
  z-index: 100;
}

.grid-item-v-img {
  background-color: transparent;
}

.grid-item-v-corner {
  width: 75px;
  height: 35px;
  background-color: transparent;
  position: absolute;
  color: white;
  font-size: 24px;
}

.grid-item-v-score {
  width: 260px;
  height: 90px;
  background-color: transparent;
  position: absolute;
  top: 278px;
}

.grid-item-v-score-text {
  width: 60px;
  height: 40px;
  background-color: transparent;
  margin-left: 20px;
  margin-top: 49px;
  color: #ff5415;
  font-size: 24px;
}

.grid-item-v-text {
  width: 260px;
  height: 40px;
  background-color: transparent;
  margin-top: 11px;
  font-size: 30px;
  color: rgba(255, 255, 255, 0.5);
  focus-color: #ffffff;
}

.grid-item-v-progress {
  height: 34px;
  background-color: transparent;
  color: rgba(255, 255, 255, 0.35);
  font-size: 24px;
  focus-color: rgba(255, 255, 255, 0.75);
}
</style>
