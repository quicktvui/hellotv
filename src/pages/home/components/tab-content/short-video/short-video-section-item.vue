<template>
  <qt-view
    class='short-video-section-list-item-root-css'
    flexStyle='${style}'
    :focusable='true'
    eventClick
    eventFocus
    :enableFocusBorder='true'
  >
    <img class='short-video-section-list-item-img' :focusable='false' :postDelay='300' src='${image.normal}'/>
    <qt-view class='short-video-section-list-item-content-div' :duplicateParentState='true' :focusable='false'>
      <qt-text class='short-video-section-list-item-text'
               :focusable='false' :showOnState="['normal']"
               :fontSize='28' :ellipsizeMode='2'  :paddingRect="[16,12,12,0]"
               gravity='start|top' :lines='2' :duplicateParentState='true' text='${title.text}'/>
      <qt-text class='short-video-section-list-item-text'
               :focusable='false' :showOnState="['selected','focused']"
               :fontSize='28' :ellipsizeMode='2'  :paddingRect="[16,12,12,0]"
               gravity='start|top' :lines='2' :duplicateParentState='true' text='${title.textFocus}'/>
      <qt-view class='short-video-section-list-item-play-mark' :duplicateParentState='true'
               :focusable='false' :showOnState="['selected','focused']" >
        <play-mark style='width:25px;height:20px;margin-left: 16px' :focusable='false'
                   :markColor="'#FFFFFF'" :gap="3" />
      </qt-view>

      <qt-text class='short-video-section-list-item-sub-title'
               :duplicateParentState='true' :fontSize='24' :lines='1' :paddingRect="[16,0,12,0]"
               :ellipsizeMode='2' gravity='start|center' text='${title.sub}'/>

    </qt-view>

  </qt-view>

</template>

<script lang='ts' setup>
defineOptions({
  name: 'short-video-section-item'
})
defineExpose({})

</script>

<style lang='scss' src='../../../scss/short-video-section.scss'>

</style>
