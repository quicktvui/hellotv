<template>
  <qt-view class="filter-sidebar" :gradientBackground="{ colors: ['#00000000', '#10141A'], orientation: 0 }">
    <qt-list-view
      class="filter-sidebar-list"
      ref="listRef"
      name="sidebarList"
      :singleSelectPosition="1"
      :nextFocusName="{ up: 'topView', right: 'contentGrid' }"
      @item-focused="onItemFocused"
    >
      <!-- 二级分类标题 -->
      <qt-view class="filter-sidebar-list-item" :type="1" :focusable="false">
        <qt-text
          class="filter-sidebar-list-item-text"
          style="color: #ffffff; font-size: 40px"
          text="${name}"
          gravity="center"
          typeface="bold"
        ></qt-text>
      </qt-view>
      <!-- 筛选按钮、图标 -->
      <qt-view class="filter-sidebar-list-item" :type="2" :focusable="true" eventFocus eventClick>
        <qt-view
          style="background-color: transparent; flex-direction: row; align-items: center; justify-content: center"
          :focusable="false"
          :duplicateParentState="true"
        >
          <qt-view class="filter-sidebar-list-item-img" :focusable="false" :duplicateParentState="true">
            <qt-image
              class="filter-sidebar-list-item-img"
              style="position: absolute"
              :src="icFilterNormal"
              showOnState="normal"
              :focusable="false"
              :duplicateParentState="true"
            ></qt-image>
            <qt-image
              class="filter-sidebar-list-item-img"
              style="position: absolute"
              :src="icFilterFocused"
              showOnState="focused"
              :focusable="false"
              :duplicateParentState="true"
            ></qt-image>
            <qt-image
              class="filter-sidebar-list-item-img"
              style="position: absolute"
              :src="icFilterSelected"
              showOnState="selected"
              :focusable="false"
              :duplicateParentState="true"
            ></qt-image>
          </qt-view>
          <qt-text
            class="filter-sidebar-list-item-text"
            text="${name}"
            autoWidth
            gravity="center"
            :focusable="false"
            :duplicateParentState="true"
          ></qt-text>
        </qt-view>
      </qt-view>
      <!-- 普通文本 -->
      <qt-view class="filter-sidebar-list-item" :type="9" :focusable="true" eventFocus eventClick>
        <qt-text
          class="filter-sidebar-list-item-text"
          text="${name}"
          gravity="center"
          :focusable="false"
          :duplicateParentState="true"
        ></qt-text>
      </qt-view>
    </qt-list-view>
  </qt-view>
</template>

<script setup lang="ts" name="FilterSidebar">
import { ref } from 'vue'
import { QTIListView } from '@quicktvui/quicktvui3'
import { secondary } from '../../adapter/interface'
import icFilterNormal from '../../../../assets/filter/ic_filter_normal.png'
import icFilterFocused from '../../../../assets/filter/ic_filter_focused.png'
import icFilterSelected from '../../../../assets/filter/ic_filter_selected.png'

const emits = defineEmits(['onListItemFocused'])

const listRef = ref<QTIListView>()

function init(listData: secondary[]) {
  listRef.value?.init(listData)
}

function onItemFocused(evt) {
  emits('onListItemFocused', evt)
}

defineExpose({ init })
</script>

<style scoped>
.filter-sidebar {
  width: 340px;
  height: 960px;
  background-color: transparent;
}

.filter-sidebar-list {
  width: 340px;
  height: 960px;
  background-color: transparent;
}

.filter-sidebar-list-item {
  width: 340px;
  height: 106px;
  background-color: transparent;
  border-radius: 8px;
  focus-background-color: #ffffff;
}

.filter-sidebar-list-item-img {
  width: 34px;
  height: 34px;
  background-color: transparent;
  margin-right: 16px;
}

.filter-sidebar-list-item-text {
  width: 340px;
  height: 106px;
  background-color: transparent;
  color: rgba(255, 255, 255, 0.5);
  font-size: 36px;
  focus-color: #13161b;
  select-color: #ffffff;
}
</style>
