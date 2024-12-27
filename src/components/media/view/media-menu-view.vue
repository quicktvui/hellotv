<template>
  <qt-list-view class='media-menu-root-css' ref='mediaMenuRef' :horizontal='true' padding="90,0,0,0"
                :autofocusPosition="focusP"
                :useDiff="true"
                :listData="list"
                @item-focused="onItemFocus"
                @item-click="onItemClick">
    <media-menu-text-item :type='1'/>
    <media-menu-icon-item :type='2'/>
  </qt-list-view>

</template>

<script lang='ts' setup name='MediaMenuView'>
import { qtRef } from '@quicktvui/quicktvui3'
import { ref } from 'vue'
import MediaMenuIconItem from './media-menu-icon-item.vue'
import MediaMenuTextItem from './media-menu-text-item.vue'

const emits = defineEmits(['onItemFocused','onItemClicked'])

const mediaMenuRef = ref()
const list = qtRef()
const focusP = ref(-1)

const onItemFocus = (e)=>{

}
const onItemClick = (e)=>{

}
defineExpose({})

</script>

<style lang='scss'>

</style>
