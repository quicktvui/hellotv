<template>
  <qt-list-view ref="mediaControlRef"
                :horizontal="true"
                name="mediaControlRef"
                class="media_control_root_css"
                padding="90,0,0,0"
                :listData="list"
                @item-focused="onItemFocused"
                @item-click="onItemClicked">
    <media-control-item-view :type="1" />
    <media-control-item-icon-view :type="2"/>
  </qt-list-view>
</template>

<script lang="ts">
import { qtRef } from "@quicktvui/quicktvui3"
import { defineComponent } from "@vue/runtime-core"
import { ESLogLevel, useESLog } from "@extscreen/es3-core"
import { ref, toRaw, watch } from "vue"
import { defList } from "./adapter/ControlDataAdapter"
import MediaControlItemIconView from "./media-control-item-icon-view.vue"
import MediaControlItemView from "./media-control-item-view.vue"
export default defineComponent({
  name: "media-control-view",
  components: { MediaControlItemIconView, MediaControlItemView },
  props:{
    menuList:{
      type:Array,
      default:defList()
    }
  },
  setup(props, context) {
    const log = useESLog()
    const list = qtRef()
    const mediaControlRef = ref()
    watch(()=>props.menuList,(newV,oldV)=>{
      if (newV && newV.length>0){
        list.value = toRaw(newV)
      }
    },{immediate:true})

    function onItemFocused(e){
      let focused = e.isFocused;
      let position = e.position
      const nameFlag = list.value[position].nameFlag
      context.emit('onItemFocused', focused,nameFlag)
    }

    function onItemClicked(e){
      let position = e.position
      const nameFlag = list.value[position].nameFlag
      context.emit('onItemClicked', nameFlag,e)
    }
    function update(position:number,str){
      list.value[position].name = str
    }

    function updateList(){}

    return {
      mediaControlRef,
      list,
      onItemFocused,
      onItemClicked,
      update
    }
  }
})
</script>

<style>
.media_control_root_css {
  width: 1920px;
  height: 72px;
  background-color: transparent;
}
</style>
