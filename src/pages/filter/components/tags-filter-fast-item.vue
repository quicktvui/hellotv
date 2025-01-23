<template>
    <qt-view class="filter-fast-item-root"
             :style="{height:filterRecordHeight+'px'}"
             name="filter_fast_item"
             autoWidth
             eventClick
             eventFocus
             :focusable="true">
      <div class="filter-fast-item-focus" :style="{ height: filterRecordHeight + 'px' }" autoWidth
        :duplicateParentState="true" showOnState="focused" :focusable="false"
        :gradientBackground="{ colors: btnGradientFocusColor, cornerRadius: 30, orientation: 6 }"/>
        <qt-text class="filter-fast-item-text" :style="{ height: filterRecordHeight + 'px', selectColor: textSelectColor }"
                 :duplicateParentState="true" :focusable="false"
                 :fontSize="30" gravity="center"
                 autoWidth text="${filterShowName}"/>
    </qt-view>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/runtime-core"
import ThemeConfig from "../../../build/ThemeConfig";
import FilterConfig from "../build_data/FilterConfig"

export default defineComponent({
  name: "tags-filter-fast-item",
  setup(props, context) {
    const textSelectColor = ThemeConfig.textColor
    const btnGradientFocusColor = ThemeConfig.btnGradientFocusColor
    const filterRecordHeight = computed(()=>{return FilterConfig.filterRecordHeight})

    return {
      textSelectColor,
      btnGradientFocusColor,
      filterRecordHeight
    }
  }
})
</script>

<style src="../css/right-filter.css"></style>
