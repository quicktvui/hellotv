<template>
  <qt-view
    class="filter-sidebar"
    :gradientBackground="{ colors: ['#00000000', '#10141A'], orientation: 0 }"
    :blockFocusDirections="$props.blockFocusDir"
  >
    <qt-list-view
      class="filter-sidebar-list"
      ref="listRef"
      name="sidebarList"
      :singleSelectPosition="$props.singleSelectPos"
      :nextFocusName="{ up: 'topView', right: nextFocusNameRight }"
      @item-focused="onItemFocused"
    >
      <list-item-title :type="1" />
      <!-- 筛选按钮、图标 -->
      <list-item-filter :type="2" />
      <!-- 筛选按钮、图标样式二 -->
      <list-item-filter-title :type="3" />
      <!-- 普通文本 -->
      <list-item-text :type="9" :textStyle="$props.listItemTextStyle" :textGravity="$props.listItemTextGravity" />
      <!-- 横线 -->
      <list-item-line :type="10" />
    </qt-list-view>
  </qt-view>
</template>

<script setup lang="ts" name="FilterSidebar">
import { ref } from 'vue'
import { QTIListView } from '@quicktvui/quicktvui3'
import { secondary } from '../../adapter/interface'
import ListItemTitle from './list-item-title.vue'
import ListItemFilter from './list-item-filter.vue'
import ListItemFilterTitle from './list-item-filter-title.vue'
import ListItemText from './list-item-text.vue'
import ListItemLine from './list-item-line.vue'

defineProps({
  blockFocusDir: {
    type: Object,
    default: []
  },
  singleSelectPos: {
    type: Number,
    default: 1
  },
  listItemTextStyle: {
    type: Object,
    default: {}
  },
  listItemTextGravity: {
    type: String,
    default: 'center'
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
