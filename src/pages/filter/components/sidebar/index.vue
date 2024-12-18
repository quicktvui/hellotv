<template>
  <qt-view class="filter-sidebar" :gradientBackground="{ colors: ['#00000000', '#10141A'], orientation: 0 }">
    <qt-list-view
      class="filter-sidebar-list"
      ref="listRef"
      name="sidebarList"
      :nextFocusName="{ up: 'topView', right: 'contentGrid' }"
      @item-focused="onItemFocused"
    >
      <!-- 二级分类标题 -->
      <qt-view class="filter-sidebar-list-item" :type="1" :focusable="false">
        <qt-text
          class="filter-sidebar-list-item-text"
          style="color: #ffffff; font-size: 40px"
          text="电视剧"
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
          <qt-image style="width: 34px; height: 34px; margin-right: 16px" :src="icFilterFocus"></qt-image>
          <qt-text
            class="filter-sidebar-list-item-text"
            text="筛选"
            autoWidth
            gravity="center"
            :focusable="false"
            :duplicateParentState="true"
          ></qt-text>
        </qt-view>
      </qt-view>
      <!-- 普通文本 -->
      <qt-view class="filter-sidebar-list-item" :type="3" :focusable="true" eventFocus eventClick>
        <qt-text
          class="filter-sidebar-list-item-text"
          text="${title}"
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
import icFilterFocus from '../../../../assets/filter/ic_filter_focus.png'

const emits = defineEmits(['onListItemFocused'])

const listRef = ref<QTIListView>()

function init() {
  const listData: any[] = [
    { type: 1, title: '电视剧' },
    { type: 2, title: '筛选' }
  ]
  for (let i = 1; i <= 10; i++) {
    listData.push({
      type: 3,
      title: '武侠江湖' + i
    })
  }
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
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  focus-background-color: #ffffff;
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
