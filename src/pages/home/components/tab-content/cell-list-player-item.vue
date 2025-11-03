<template>
  <tv-item class="cell-player-item-root-css" layout="${layout}" flexStyle="${style}" :enableFocusBorder='false'
           :focusScale="1" disablePlaceholderFocus
           :focusable="false" :clipChildren="true"  eventClick eventFocus>
    <img class='cell-player-list-item-bg'
         sid='${image.sid}'
         flexStyle='${image.style}'
         src='${image.normal}'
         :postDelay='100'
         :duplicateParentState='true'
         :enableFocusBorder='true'
         :focusable='false' />
    <qt-replace-child
      class='cell-player-item-replace'
      flexStyle="${play.style}"
      sid="${play.sid}"
      eventReceiverSID="homeTabsSid"
      :postDelay="300"
      :focusable="false"
      :clipChildren="false"
      :replaceOnVisibilityChanged="false"
      :markChildSID="TabContentConfig.homeBgPlaySid"
    >
    </qt-replace-child>
    <qt-list-view
      flexStyle='${listStyle}'
      sid='${cellListSid}'
      :clipChildren="true"
      :clipPadding='true'
      :singleSelectPosition="0"
      list='${play.buildPlayData}'
      :refocusType="'KeepPosition'"
      :skipRequestFocus="true"
      :resetOnDetach="true"
      :endHintEnabled="false"
      :verticalFadingEdgeEnabled="true">
      <!-- 文字-->
      <bg-player-cell-list-item-text :type='86'/>
      <bg-player-cell-list-item-img
        :type="82"
        :imgStyle="{ borderTopRightRadius: `${borderRadius}px` }"
      />
      <bg-player-cell-list-item-img
        :type="83" />
      <bg-player-cell-list-item-img
        :type="84"
        :imgStyle="{ borderBottomRightRadius: `${borderRadius}px` }"/>

    </qt-list-view>
  </tv-item>
</template>

<script lang="ts" setup name="cell-list-player-item">
import { ref } from 'vue'
import TabContentConfig from '../../adapter/tab-content/tab-content-config'
import BgPlayerCellListItemImg from './bg-player-cell-list-item-img.vue'
import BgPlayerCellListItemText from './bg-player-cell-list-item-text.vue'
import ThemeConfig from '../../../../config/theme-config.ts'
const borderRadius = ref(ThemeConfig.focusBorderCorner)
defineExpose({})
</script>

<style lang="scss" src="../../scss/cell-player-item.scss"></style>
