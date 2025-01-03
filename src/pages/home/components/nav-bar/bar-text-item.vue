<template>
  <div class='bar-text-item-root-css'
       :focusable='true'
       autoWidth
       :sateBackgroundPadding='[10, 10]'
       :clipChildren='false'
       eventFocus
       eventClick>
    <!--    选中样式 如果高度相同可以直接在父view直接写选中背景-->
    <div class='bar-text-focus-bg' :focusable='false'
         :duplicateParentState='true' showOnState='focused' autoWidth />
    <!--    角标-->
    <div :duplicateParentState='true' v-if='showCorner'
         :class="['bar-text-corner-root-default',
         {'bar-text-corner-left':cornerLeft,
         'bar-text-corner-right':cornerRight}]" :focusable='false'>
      <img class='bar-text-corner-img' :duplicateParentState='true'
           showOnState='normal' src='${corner.normal}'>
      <img class='bar-text-corner-img' :duplicateParentState='true'
           showOnState='focused' src='${corner.focused}'>
      <img class='bar-text-corner-img' :duplicateParentState='true'
           showOnState='selected' src='${corner.selected}'>
    </div>
    <!--    标题-->
    <qt-text
      class='bar-text-title-normal' :duplicateParentState='true'
      autoWidth gravity='center' showOnState='normal'
      :lines='1'
      fontSize='${titleSize}'
      text='${text}'
    />
    <qt-text
      class='bar-text-title-select-focus' :duplicateParentState='true'
      autoWidth gravity='center' :showOnState="['selected','focused']"
      :lines='1'
      fontSize='${titleSize}'
      text='${text}' />
    <!--    选中下划线-->
    <div class='bar-text-select-line' :duplicateParentState='true'
         showOnState='selected' :focusable='false' />
  </div>

</template>

<script lang='ts' setup name='bar-text-item'>

defineProps({
  showCorner: {
    type: Boolean,
    default: false
  },
  cornerLeft: {
    type: Boolean,
    default: false
  },
  cornerRight: {
    type: Boolean,
    default: false
  }
})
defineExpose({})

</script>

<style lang='scss' src='../../scss/bar-text-item.scss'>

</style>
