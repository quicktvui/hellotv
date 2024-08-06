<template>
<div class="d2s_section" :focusable="false" :clipChildren="false" flexStyle="${style}" :blockFocusDirections="['left', 'right']">
  <tv-list
    list="${itemList}" horizontal :clipChildren="false" :focusable="false"
    resetOnDetach :endHintEnabled="false" useDiff enablePlaceholder
    :onScrollEnable="false" class="d2s_section_tabs" name="d2s_section_tabs_name"
    :blockFocusDirections="['left', 'right']" flexStyle="${style}"
    sid="${listSID}"
  >
    <D2SelectionTabItem />
    <Hposter :borderRadius="20" />
    <D2SelectionListItem />
  </tv-list>
</div>
</template>
<script lang='ts' setup>
import D2SelectionTabItem from './D2SelectionTabItem.vue'
import D2SelectionListItem from './D2SelectionListItem.vue'
import Hposter from '../../../components/Hposter/index.vue'
</script>
<style scoped>
.d2s_section {
  background-color: transparent;
}
</style>