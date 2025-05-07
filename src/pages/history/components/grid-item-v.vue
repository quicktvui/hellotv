<template>
  <qt-view
    class="history-raw-content-grid-item"
    :style="{ width: `260px`, height: $props.itemHeight + 'px' }"
    :focusable="true"
    :focusScale="1.03"
    :placeholderLayout="[-5, -5, 260, 368]"
    eventFocus
    eventClick
  >
    <!-- 焦点状态下的删除样式 -->
    <qt-view
      class="history-raw-content-grid-item-delete"
      style="width: 260px; height: 368px; background-color: transparent"
      showIf="${showDeleteCover}"
      :focusable="false"
      :duplicateParentState="true"
    >
      <qt-view
        class="history-raw-content-grid-item-delete"
        style="width: 260px; height: 368px; top: -1; left: -1"
        :showOnState="'focused'"
        :focusable="false"
        :duplicateParentState="true"
      >
        <qt-image style="width: 40px; height: 50px" :src="icDelete" :focusable="false"></qt-image>
      </qt-view>
    </qt-view>
    <!-- 外层这个div的作用是模拟placeholder, 如果没有启动placeholder, 把背景色加到图片上, 有时会闪一下页面背景色 -->
    <qt-view style="background-color: rgba(255, 255, 255, 0.1); border-radius: 16px" :focusable="false" :duplicateParentState="true">
      <qt-image
        style="width: 260px; height: 368px; background-color: transparent; border-radius: 16px"
        src="${image}"
        :enableFocusBorder="true"
        :focusable="false"
        :duplicateParentState="true"
      ></qt-image>
    </qt-view>
    <qt-text
      class="history-raw-content-grid-item-title"
      style="width: 260px"
      text="${title}"
      gravity="center|start"
      :boldOnFocus="true"
      :paddingRect="[12, 0, 12, 0]"
      :horizontalFadingEdgeEnabled="true"
      :lines="1"
      :ellipsizeMode="4"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-text>
    <qt-text
      class="history-raw-content-grid-item-progress"
      style="width: 260px"
      text="${progress}"
      gravity="center|start"
      :paddingRect="[12, 0, 12, 0]"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-text>
  </qt-view>
</template>

<script setup lang="ts">
import icDelete from '../../../assets/history/ic_delete.png'

defineProps({
  itemHeight: {
    type: Number,
    default: 260
  }
})
</script>

<style scoped lang="scss" src="../scss/history-raw.scss"></style>
