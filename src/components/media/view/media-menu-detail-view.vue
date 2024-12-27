<template>
  <div class='media-menu-detail-root-css' :visible="isShowView" :gradientBackground='{ colors: ["#D9000000", "#00000000"],orientation:2 }'>
    <span class='detail-title' :focusable='false'>{{title}}</span>
    <qt-list-view class='detail-list' v-if='initMenu'
                  ref='detailListRef' blockFocusDirections='["left","right","up", "down"]'
                  :singleSelectPosition="selectedIndex"
                  :listData="list"
                  :useDiff="true"
                  :enableSelectOnFocus="false"
                  @itemFocus="onItemFocus"
                  @itemClick="onItemClick" >
      <media-menu-detail-item :type='1'/>
    </qt-list-view>
  </div>

</template>

<script lang='ts' setup name='MediaMenuDetailView'>
import { QTIListView, QTListViewItem, qtRef } from '@quicktvui/quicktvui3'
import { ref } from 'vue'
import MediaMenuDetailItem from './media-menu-detail-item.vue'

const emits = defineEmits(['onItemClicked','onItemFocused'])
const props = defineProps({
  //菜单名称
  itemName:{
    type:String,
    default:''
  },
  //菜单标题
  title:{
    type:String,
    default:''
  }
})
//列表数据
const list = qtRef<Array<QTListViewItem>>([])
const detailListRef = ref<QTIListView>()
//是否展示整体 view
const isShowView = ref(false)
//是否初始化菜单
const initMenu = ref(false)
//默认选中项
const selectedIndex = ref(-1)
/**
 * 初始化
 */
const init = ()=>{
  if (!initMenu.value){
    initMenu.value = true
  }
}
/**
 * 设置数据
 * @param data
 */
const setList = (data:Array<QTListViewItem>)=>{
  if (list.value.length > 0){
    return
  }
  list.value = data
}
const showView = ()=>{
  isShowView.value = true
  detailListRef.value?.setItemFocused(selectedIndex.value)
}
const dismissView = ()=>{
  isShowView.value = false
}
const getViewShowState = ():boolean=>{
  return isShowView.value
}
const setSelectedIndex =(index)=>{
  if (index === selectedIndex.value) return
  if (selectedIndex.value > -1){
    list.value[selectedIndex.value].iconState=false
  }
  list.value[index].iconState=true
  selectedIndex.value = index
}
const onItemFocus = (e)=>{
  emits("onItemFocused",e.isFocused,props.itemName)
}
const onItemClick = (e)=>{
  let position = e.position
  const isSameLocation = selectedIndex.value === position
  emits("onItemClicked",props.itemName,list.value[position],isSameLocation)
  if (isSameLocation) return
  setSelectedIndex(position)
}

defineExpose({init,setList,showView,dismissView,getViewShowState,setSelectedIndex})

</script>

<style lang='scss' src='./scss/media-menu.scss'>

</style>
