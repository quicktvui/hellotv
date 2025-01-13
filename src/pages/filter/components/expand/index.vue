<template>
  <qt-view
    class="filter-expand"
    :gradientBackground="{ colors: ['#00000000', '#0DFFFFFF'], orientation: 0 }"
    :blockFocusDirections="$props.blockFocusDir"
  >
    <qt-list-view
      class="filter-expand-list"
      ref="listRef"
      :singleSelectPosition="$props.singleSelectPos"
      :nextFocusName="{ up: 'topView', right: nextFocusNameRight }"
      :descendantFocusability="$props.expandAvailable ? 1 : 2"
      @item-focused="onItemFocused"
    >
      <qt-view class="filter-expand-list-item" :type="PrimaryType.TEXT" :focusable="true" eventFocus eventClick>
        <qt-text
          class="filter-expand-list-item-text"
          text="${name}"
          gravity="center|end"
          :showOnState="['normal', 'selected']"
          :focusable="false"
          :duplicateParentState="true"
        ></qt-text>
        <qt-text
          class="filter-expand-list-item-text"
          text="${name}"
          gravity="center|end"
          typeface="bold"
          showOnState="focused"
          :focusable="false"
          :duplicateParentState="true"
        ></qt-text>
      </qt-view>
    </qt-list-view>
  </qt-view>
</template>

<script setup lang="ts" name="FilterExpand">
import { ref } from 'vue'
import { QTIListView } from '@quicktvui/quicktvui3'
import { Primary, PrimaryType } from '../../adapter/interface'

defineProps({
  blockFocusDir: {
    type: Array,
    default: () => []
  },
  singleSelectPos: {
    type: Number,
    default: 0
  },
  expandAvailable: {
    type: Boolean,
    default: true
  }
})
const emits = defineEmits(['onListItemFocused'])

const listRef = ref<QTIListView>()
const nextFocusNameRight = ref<string>('sidebarList')

function init(listData: Primary[]) {
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

<style scoped lang="scss" src="../../scss/filter-expand.scss"></style>
