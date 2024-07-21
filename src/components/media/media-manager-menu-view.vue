<template>
  <div class="media-manager-speed-root-css" :visible="isShowView"
       :gradientBackground="{ colors: ['#D9000000', '#00000000'],orientation:2 }">
    <span class="media-manager-speed-title-css" :focusable="false">{{title}}</span>
    <qt-list-view ref="mediaMenuListViewRef" v-if="initMenu"
                  class="media-manager-speed-list-css"
                  :blockFocusDirections="['left','right','up', 'down']"
                  :singleSelectPosition="selectedIndex"
                  :listData="list"
                  :useDiff="true"
                  :enableSelectOnFocus="false"
                  @item-focus="onItemFocus"
                  @item-click="onItemClick" >
      <media-right-menu-item :type="1"/>

    </qt-list-view>

  </div>
</template>

<script lang="ts">
import { QTIListView, QTListViewItem, qtRef } from "@quicktvui/quicktvui3"
import { defineComponent } from "@vue/runtime-core"
import { ESLogLevel, useESLog } from "@extscreen/es3-core"
import { ref } from "vue"
import MediaRightMenuItem from "./media-right-menu-item.vue"

export default defineComponent({
  name: "media-manager-menu-view",
  components: { MediaRightMenuItem },
  props:{
    itemName:String,
    title:String
  },
  setup(props, context) {
    const log = useESLog()
    const mediaMenuListViewRef = ref<QTIListView>()
    const initMenu = ref(false)
    const selectedIndex = ref<number>(-1)
    const isShowView = ref(false)
    let list = qtRef<Array<QTListViewItem>>([])
    const init =()=>{
      if (!initMenu.value){
        initMenu.value = true
      }
    }
    const setList = (data:Array<QTListViewItem>)=>{
      list.value = data
    }

    const showView =()=>{
      isShowView.value = true
      mediaMenuListViewRef.value?.setItemFocused(selectedIndex.value)
    }
    const dismissView=()=>{
      isShowView.value = false
    }

    const getViewShowState=():boolean=>{
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
      context.emit('onItemClicked', e.isFocused,props.itemName)
    }
    const onItemClick = (e)=>{
      let position = e.position
      const isSameLocation = selectedIndex.value === position
      context.emit('onItemClicked', props.itemName,list.value[position],isSameLocation)
      if (isSameLocation) return
      setSelectedIndex(position)
    }

    return {
      mediaMenuListViewRef,
      list,
      selectedIndex,
      initMenu,
      init,
      setList,
      showView,
      dismissView,
      getViewShowState,
      setSelectedIndex,
      onItemClick,
      onItemFocus,
      isShowView,
    }
  }
})
</script>

<style>
.media-manager-speed-root-css {
  width: 760px;
  height: 1080px;
  position: absolute;
  padding-left: 100px;
  right: 0;
  top:0;
  background-color: #669966;
}

.media-manager-speed-title-css {
  width: 200px;
  margin-top: 143px;
  height: 34px;
  line-height: 34px;
  text-align: left;
  color: #FFFFFF;
  font-size: 30px;
  background-color: transparent;
}

.media-manager-speed-list-css {
  margin-top: 36px;
  width: 564px;
  height: 840px;
  background-color: transparent;
}
</style>
