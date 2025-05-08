<template>
  <qt-view
    class="grid-item-v"
    :style="$props.style"
    :focusable="true"
    :focusScale="themeConfig.placeHolderFocusScale"
    eventFocus
    eventClick
  >
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
    <!-- 评分 -->
    <qt-view class="grid-item-v-score" :gradientBackground="scoreGradient" :focusable="false">
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
  </qt-view>
</template>

<script setup lang="ts" name="GridItemVertical">
import themeConfig from '../config/theme-config'

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

.grid-item-v-img {
  background-color: transparent;
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
</style>
