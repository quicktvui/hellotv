<template>
  <tv-item class="small-four-section-root-css" flexStyle="${style}" layout="${layout}"
           :clipChildren="false"
           :clipPadding="false" >
    <text-view
      style="color: #ffffff;background-color: transparent;width:1000px"
      :lines="1"
      flexStyle="${titleStyle}"
      :focusable="false" textSize="${titleStyle.fontSize}" text="${title}"
    />
    <qt-list-view class="small-4k-section-list"
                  horizontal :infiniteParams='{
                  scrollOffset:530,
                  minChildScale:0.86
              }'
                  flexStyle="${listStyle}"
                  list="${itemList}"
                  :blockFocusDirections="['left','right']"
                  :clipChildren="false"
                  :clipPadding="false"
                  makeChildVisibleType="center"
                  :enableSelectOnFocus="true"
                  :autoSelectPosition="1000000000">
      <qt-view :type="TabContentItemType.TYPE_WATERFALL_SECTION_SMALL_4K_ITEM"
               class="small-4k-list-item-root-css"
               name="${name}" flexStyle="${style}"
               :clipChildren="false" :focusable="true" :enableFocusBorder="true"
               eventClick eventFocus>
        <img class="small-4k-list-item-img" sid="${sid}"
             postDelay="100" :focusable="false" flexStyle="${image.style}"
             src="${image.normal}"/>
      </qt-view>
    </qt-list-view>
    <qt-replace-child
      style="background-color: transparent;position:absolute;"
      layout="${mLayout}" flexStyle="${replaceChildStyle}"
      :postDelay='300'
      sid="sectionSmall4kReplaceChildSid"
      :markChildSID="TabContentConfig.homeBgPlaySid"
      :focusable="false" :clipChildren="false"
      :replaceOnVisibilityChanged='false'>
    </qt-replace-child>

  </tv-item>
</template>

<script lang='ts' setup name='small-four-section'>
import TabContentItemType from '../../../adapter/tab-content/tab-content-item-type.ts'
import TabContentConfig from '../../../adapter/tab-content/tab-content-config.ts'

defineExpose({})

</script>

<style lang='scss' src='../../../scss/small-four-section.scss'>

</style>
