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
    <qt-view class="filter-main-conditions-list-row-item" :type="1" :focusable="true" eventFocus eventClick>
      <qt-text
        class="filter-main-conditions-list-row-item-text"
        autoWidth
        text="${name}"
        :focusable="false"
        :duplicateParentState="true"
      ></qt-text>
    </qt-view>
  </qt-list-view>
</template>

<script setup lang="ts">
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

<style scoped>
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
  focus-background-color: #ffffff;
}

.filter-main-conditions-list-row-item-text {
  height: 40px;
  color: rgba(255, 255, 255, 0.35);
  font-size: 30px;
  focus-color: #13161b;
  select-color: #ffffff;
}
</style>
