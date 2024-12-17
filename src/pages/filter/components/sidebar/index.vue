<template>
  <qt-view class="filter-sidebar">
    <qt-list-view class="filter-sidebar-list" ref="listRef" name="sidebarList" :nextFocusName="{ up: 'topView', right: 'contentGrid' }">
      <qt-view class="filter-sidebar-list-item" :type="1" :focusable="false">
        <qt-text
          class="filter-sidebar-list-item-text"
          style="color: #ffffff; font-size: 40px"
          text="电视剧"
          gravity="center"
          typeface="bold"
        ></qt-text>
      </qt-view>
      <qt-view class="filter-sidebar-list-item" :type="2" :focusable="true">
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

const listRef = ref<QTIListView>()

function init() {
  const listData: any[] = [{ type: 1, title: '电视剧' }]
  for (let i = 1; i <= 10; i++) {
    listData.push({
      type: 2,
      title: '武侠江湖' + i
    })
  }
  listRef.value?.init(listData)
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
