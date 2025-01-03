<template>
  <qt-list-view class='media-menu-root-css' ref='mediaMenuRef' :horizontal='true' padding='90,0,0,0'
                :autofocusPosition='focusP'
                :useDiff='true'
                :listData='list'
                @item-focused='onItemFocus'
                @item-click='onItemClick'>
    <media-menu-text-item :type='1' />
    <media-menu-icon-item :type='2' />
  </qt-list-view>

</template>

<script lang='ts' setup name='media-menu-view'>
import { qtRef } from '@quicktvui/quicktvui3'
import { onBeforeUnmount, ref, toRaw, watch } from 'vue'
import { initDefaultMenuList } from '../build-data/media-control-adapter'
import MediaMenuIconItem from './media-menu-icon-item.vue'
import MediaMenuTextItem from './media-menu-text-item.vue'

const emits = defineEmits(['onItemFocused', 'onItemClicked'])
const props = defineProps({
  menuList: {
    type: Array,
    default: initDefaultMenuList()
  }
})

const mediaMenuRef = ref()
const list = qtRef()
const focusP = ref(-1)
let controlClick = false
let controlClickTimer:any = 0

watch(() => props.menuList, (newV) => {
  if (newV && newV.length > 0) {
    list.value = toRaw(newV)
  }
}, { immediate: true })

onBeforeUnmount(() => {
  clearTimeout(controlClickTimer)
})
const onItemFocus = (e) => {
  let focused = e.isFocused;
  let position = e.position
  const nameFlag = list.value[position].nameFlag
  emits('onItemFocused', focused,nameFlag)
}
const onItemClick = (e) => {
  let position = e.position
  const nameFlag = list.value[position].nameFlag
  //防止多次点击
  if (controlClick){
    clearTimeout(controlClickTimer)
    controlClickTimer = setTimeout(()=>{controlClick = false},1000)
    return
  }
  controlClick = true
  controlClickTimer = setTimeout(()=>{controlClick = false},1000)
  emits('onItemClicked', nameFlag,e)
}
const update = (position:number,str)=>{
  list.value[position].name = str
}
const changeList = (position,size,newData)=>{
  if(newData){
    list.value.splice(position,size,newData)
  } else {
    list.value.splice(position,size)
  }
}
defineExpose({update,changeList})

</script>

<style lang='scss' src='./scss/media-menu.scss'>

</style>
