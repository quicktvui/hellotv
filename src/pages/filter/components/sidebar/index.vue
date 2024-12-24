<template>
  <qt-view class="filter-sidebar" :gradientBackground="{ colors: ['#00000000', '#10141A'], orientation: 0 }">
    <qt-list-view
      class="filter-sidebar-list"
      ref="listRef"
      name="sidebarList"
      :singleSelectPosition="$props.singleSelectPos"
      :nextFocusName="{ up: 'topView', right: nextFocusNameRight }"
      @item-focused="onItemFocused"
    >
      <!-- 筛选按钮、图标 -->
      <list-item-filter :type="2" />
      <!-- 普通文本 -->
      <list-item-text :type="9" :textStyle="{ width: `222px`, marginLeft: `98px` }" :textGravity="'center|start'" />
    </qt-list-view>
  </qt-view>
</template>

<script setup lang="ts" name="FilterSidebar">
import { ref } from 'vue'
import { QTIListView } from '@quicktvui/quicktvui3'
import { secondary } from '../../adapter/interface'
import ListItemFilter from './list-item-filter.vue'
import ListItemText from './list-item-text.vue'

defineProps({
  singleSelectPos: {
    type: Number,
    default: 1
  }
})
const emits = defineEmits(['onListItemFocused'])

const listRef = ref<QTIListView>()
const nextFocusNameRight = ref<string>('contentGrid')

function init(listData: secondary[]) {
  listRef.value?.init(listData)
}

function onItemFocused(evt) {
  emits('onListItemFocused', evt)
}

function setNextFocusNameRight(s: string) {
  nextFocusNameRight.value = s
}

defineExpose({ init, setNextFocusNameRight })
</script>

<style scoped lang="scss" src="../../scss/filter-sidebar.scss"></style>
