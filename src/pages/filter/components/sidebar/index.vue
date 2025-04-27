<template>
  <qt-view
    class="filter-sidebar"
    :gradientBackground="{ colors: ['#00000000', '#0DFFFFFF'], orientation: 0 }"
    :blockFocusDirections="['right']"
  >
    <qt-list-view
      class="filter-sidebar-list"
      ref="listRef"
      name="sidebarList"
      :autoscroll="[$props.singleSelectPos, 432]"
      :singleSelectPosition="$props.singleSelectPos"
      :nextFocusName="{ up: 'topView', right: nextFocusNameRight }"
      @item-focused="onItemFocused"
    >
      <list-item-title :type="SecondaryType.TITLE" />
      <!-- 筛选按钮、图标 -->
      <list-item-filter :type="SecondaryType.FILTER" />
      <!-- 筛选按钮、图标样式二 -->
      <list-item-filter-title :type="SecondaryType.FILTER_TITLE" />
      <!-- 普通文本 -->
      <list-item-text :type="SecondaryType.TEXT" :textStyle="$props.listItemTextStyle" :textGravity="$props.listItemTextGravity" />
      <!-- 横线 -->
      <list-item-line :type="SecondaryType.LINE" />
    </qt-list-view>
  </qt-view>
</template>

<script setup lang="ts" name="FilterSidebar">
import { ref } from 'vue'
import { QTIListView } from '@quicktvui/quicktvui3'
import { Secondary, SecondaryType } from '../../adapter/interface'
import ListItemTitle from './list-item-title.vue'
import ListItemFilter from './list-item-filter.vue'
import ListItemFilterTitle from './list-item-filter-title.vue'
import ListItemText from './list-item-text.vue'
import ListItemLine from './list-item-line.vue'

defineProps({
  blockFocusDir: {
    type: Array,
    default: () => []
  },
  singleSelectPos: {
    type: Number,
    default: 1
  },
  listItemTextStyle: {
    type: Object,
    default: () => {}
  },
  listItemTextGravity: {
    type: String,
    default: 'center|end'
  }
})
const emits = defineEmits(['onListItemFocused'])

const listRef = ref<QTIListView>()
const nextFocusNameRight = ref<string>('contentGrid')

function init(listData: Secondary[]) {
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
