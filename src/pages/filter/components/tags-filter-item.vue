<template>
  <qt-view class="filter-line-item-root"
           :style="{height:filterHeight+'px'}"
           name="filter_line_item"
           autoWidth
           eventClick
           eventFocus
           :focusable="true">
    <div class="filter-line-item-focus" :style="{height:filterHeight+'px'}"
      autoWidth showOnState="focused"
      :duplicateParentState="true"
      :gradientBackground="{ colors: btnGradientFocusColor, cornerRadius: 30, orientation: 6 }"/>
    <qt-text class="filter-line-item-text" :style="{ height: filterHeight + 'px', selectColor: textSelectColor }"
             :duplicateParentState="true"
             :fontSize="30" gravity="center"
             autoWidth text="${filterShowName}"/>
  </qt-view>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/runtime-core"
import ThemeConfig from "../../../build/ThemeConfig";
import FilterConfig from "../build_data/FilterConfig"

export default defineComponent({
  name: "tags-filter-item",
  setup(props, context) {
    const textSelectColor = ThemeConfig.textColor
    const btnGradientFocusColor = ThemeConfig.btnGradientFocusColor
    const filterHeight = computed(()=>{return FilterConfig.filterTextHeight})
    return {
      textSelectColor,
      btnGradientFocusColor,
      filterHeight
    }
  }
})
</script>

<style src="../css/right-filter.css"></style>
