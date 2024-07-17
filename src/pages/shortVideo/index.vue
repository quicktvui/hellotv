<template>
  <qt-view class="short_video" ref="short_video" sid="short_video_waterfall">
    <qt-waterfall class="short_video_waterfall"
      @onItemClick="onItemClick"
      @onItemFocused="onItemFocused"
      :enablePlaceholder="false"
      :skipRequestFocus="true"
      :endHintEnabled="false"
      ref="waterfallRef"
      :disableScrollOnFirstScreen="true"
      :blockFocusDirections="['up','down']"
      :list-data="waterfallDatas"
      :useDiff="true">
      <template v-slot:section>
        <short-video-section :type="1009" @loadMore="loadMore"/>
      </template>
    </qt-waterfall>  
  </qt-view>
</template>
  
  <script lang="ts">
  import { computed, defineComponent } from "@vue/runtime-core"
  import {ref} from "vue";
  import {useESRouter} from "@extscreen/es3-router";
  import { ESKeyEvent,useESToast } from "@extscreen/es3-core"
  import {qtRef, QTIWaterfall, QTWaterfallItem, QTWaterfallSection,QTWaterfall,
    VirtualView, QTWaterfallSectionType, QTWaterfallItemType
  } from "@quicktvui/quicktvui3";
  import shortVideoSection from "./component/short_video_section.vue";
  import {buildShortVideoAdapter} from "./build_data/adapter";
  import { useGlobalApi } from "../../api/UseApi"
  import {Native} from "@extscreen/es3-vue";
  
  export default defineComponent({
    name: "search",
    components: {shortVideoSection},
    props:{
      height:{
        type:String,
        default: "80px"
      }
    },
    setup(props, context) {
      const appApi = useGlobalApi()
      const router = useESRouter()
      const toast = useESToast()
      const short_video = ref()
      const waterfallRef = ref<QTIWaterfall>()
      const waterfallDatas = qtRef<QTWaterfallSection[]>()
      let currentSecondTabIndex = ref(-1)
      // 生命周期
      const onESCreate = (params) => {
        let waterfallData: QTWaterfall = {
          width: 1920,
          height: 1080
        }
        waterfallRef.value?.init(waterfallData)
        init()
      } 
      const init = async () => {
        // let firstData = await appApi.getShortVideoPageData('mock数据',1,10)
        let waterfallSection = buildShortVideoAdapter()
        // waterfallSection.itemList = firstData
        // waterfallDatas.value = [waterfallSection]
        waterfallRef.value?.setSectionList([waterfallSection])
      }
      const onItemClick = () => {}
      const onItemFocused = async (parentPosition, position, isFocused, item, e) => {
        if(isFocused && item.name == 'tab_list_section_item' && currentSecondTabIndex.value != position){
          currentSecondTabIndex.value = position
          // let listSID = waterfallDatas.value[0].listSID
          let listSID =  waterfallRef.value?.getSection(parentPosition)!.listSID
          let data = await appApi.getShortVideoPageData('mock数据',1,10)
          VirtualView.call(listSID,'setListData',data)
        }
      }
      const loadMore = async (pageNo: number, sectionIndex: number) => {
        let data = await appApi.getShortVideoPageData('mock数据',pageNo,10)
        if(data.length > 0){
          let listSID =  waterfallRef.value?.getSection(sectionIndex)!.listSID
          VirtualView.call(listSID,'addListData',data)
        }
      }

      const onESStart = () => {}
      const onESResume = () => {}
      const onESStop = () => {}
      function onKeyDown(keyEvent: ESKeyEvent): boolean {
        return false
      }
      const onESDestroy = () => {
      }
     
      return {
        short_video,waterfallRef,waterfallDatas,
        onItemClick,onItemFocused,loadMore,
        onKeyDown, onESCreate, onESStart, onESResume, onESStop, onESDestroy,
      }
    }
  })
  </script>
  
  <style scoped src="./css/short_video.css"></style>
  
  