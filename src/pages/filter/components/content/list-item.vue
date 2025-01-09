<template>
  <qt-list-view
    class="filter-main-conditions-list-row"
    :style="{ width: $props.width, height: $props.height }"
    horizontal
    list="${list}"
    singleSelectPosition="${defaultSelectedPos}"
    :padding="'0,0,120,0'"
    :useDiff="true"
    :focusMemory="false"
    :enableSelectOnFocus="false"
    :nextFocusName="{ left: 'sidebarList' }"
    :blockFocusDirections="['right']"
    @item-click="onListItemClick"
  >
    <qt-view class="filter-main-conditions-list-row-item" :type="ListItemType.TEXT" sid="${sid}" :focusable="true" eventFocus eventClick>
      <qt-view style="height: 40px; background-color: transparent" autoWidth :focusable="false" :duplicateParentState="true">
        <qt-text
          class="filter-main-conditions-list-row-item-text"
          autoWidth
          text="${name}"
          :showOnState="['normal', 'selected']"
          :focusable="false"
          :duplicateParentState="true"
        ></qt-text>
        <qt-text
          class="filter-main-conditions-list-row-item-text"
          autoWidth
          text="${name}"
          typeface="bold"
          :showOnState="'focused'"
          :focusable="false"
          :duplicateParentState="true"
        ></qt-text>
      </qt-view>
    </qt-view>
  </qt-list-view>
</template>

<script setup lang="ts">
import { ListItemType } from '../../adapter/interface'

defineProps({
  width: {
    type: Number,
    default: 1920
  },
  height: {
    type: Number,
    default: 66
  }
})
const emits = defineEmits(['onListItemClick'])

function onListItemClick(evt) {
  emits('onListItemClick', evt)
}
</script>

<style scoped lang="scss">
.filter-main-conditions-list-row {
  width: 1920px;
  height: 66px;
  background-color: transparent;
}

.filter-main-conditions-list-row-item {
  height: 54px;
  background-color: transparent;
  padding: 24px;
  border-radius: 30px;
  justify-content: center;
  focus-background-color: $gl-theme-btn-bg-focus-color;
}

.filter-main-conditions-list-row-item-text {
  position: absolute;
  height: 40px;
  color: $text-normal-color;
  font-size: 30px;
  focus-color: $text-focus-color;
  select-color: $text-select-color;
}
</style>
