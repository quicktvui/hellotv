<template>
<div class="d2s_section" :focusable="false" :clipChildren="false" flexStyle="${style}">
  <!-- 第一层tabs -->
  <tv-list
    list="${tabList}" horizontal :clipChildren="false" :focusable="false"
    resetOnDetach :endHintEnabled="false" useDiff enablePlaceholder
    :onScrollEnable="false" class="d2s_section_tabs" name="d2s_section_tabs_name"
    @item-focused="onItemFocused" :blockFocusDirections="['left', 'right']"
    flexStyle="${tabStyle}"
  >
    <D2SelectionTabItem />
  </tv-list>

  <!-- 第二层tabs -->
  <tv-list
    list="${firstShowTab.tabList}" horizontal :clipChildren="false" :focusable="false"
    resetOnDetach :endHintEnabled="false" useDiff enablePlaceholder
    :onScrollEnable="false" class="d2s_section_tabs2" name="d2s_section_tabs2_name"
    @item-focused="onItemFocused" :blockFocusDirections="['left', 'right']"
    sid="${firstShowTab.id}" flexStyle="${firstShowTab.tabStyle}"
  >
    <D2SelectionTabItem />
  </tv-list>

  <!-- 第三层 显示格子 -->
  <tv-list
    list="${firstShowList.itemList}" horizontal :clipChildren="false" :focusable="false"
    resetOnDetach :endHintEnabled="false" useDiff enablePlaceholder
    :onScrollEnable="false" class="d2s_section_tabs2" name="d2s_section_tabs2_name"
    @item-focused="onItemFocused" :blockFocusDirections="['left', 'right']"
    sid="${firstShowList.id}" flexStyle="${firstShowList.listStyle}"
  >
    <D2SelectionListItem />
  </tv-list>
</div>
</template>
<script lang='ts' setup>
import D2SelectionTabItem from './D2SelectionTabItem.vue'
import D2SelectionListItem from './D2SelectionListItem.vue'
import Hposter from '../../../components/Hposter/index.vue'

const onItemFocused = ()=> {}
</script>
<style scoped>
.d2s_section {
  /* width: 1824px; */
  /* height: 300px; */
  background-color: transparent;
  /* focus-background-color: #ffffff; */
}
.d2s_section_tabs{
  margin-left: -25px;
  background-color: transparent;
}
.d2s_section_tabs2 {
  background-color: transparent;
}
</style>