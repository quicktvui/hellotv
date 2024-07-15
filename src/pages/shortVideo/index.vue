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
        <short-video-section :type="1009" @loadMore="loadMore" :isStopPage="isStopPage"/>
      </template>
    </qt-waterfall>  
  </qt-view>
</template>
  
  <script lang="ts">
  import { computed, defineComponent } from "@vue/runtime-core"
  import {ref} from "vue";
  import {useESRouter} from "@extscreen/es3-router";
  import { ESKeyEvent,useESToast } from "@extscreen/es3-core"
  import {qtRef, QTIWaterfall, QTWaterfallItem, QTWaterfallSection,
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
      let isStopPage = ref(false)
      // 生命周期
      const onESCreate = (params) => {
        isStopPage.value = false
        init()
      }
      const init = async () => {
        let firstData = await appApi.getShortVideoPageData('mock数据',1,10)
        let waterfallSection = buildShortVideoAdapter()
        waterfallSection.itemList = firstData
        waterfallDatas.value = [waterfallSection]
      }
      const onItemClick = () => {}
      const onItemFocused = () => {
        // toast.showToast('12312')
      }
      const loadMore = async (pageNo: number) => {
        let data = await appApi.getShortVideoPageData('mock数据',pageNo,10)
        if(data.length < 1){
          isStopPage.value = true
        }else{
          // toast.showToast(pageNo+'uuuuuuuu'+data.length)
          console.log(pageNo,data,'88888888888888888888888888888888888888888888')
          // VirtualView.tvCall('short_video_waterfall','shortVideo1','requestFocus',[12])
          // Native.callUIFunction(short_video.value,'dispatchFunctionBySid', [`shortVideo111`,'requestFocus',[23]]);
          // Native.callUIFunction(short_video.value,'dispatchFunctionBySid', ['shortVideo111','addListData',data]);
          // const poster = data[12]
          // poster.title = "lululu"
          // Native.callNative('ExtendModule','callUIFunction', 'short_video_waterfall','addListData',['shortVideo111',data])
          // Native.callNative('ExtendModule','callUIFunction', 'shortVideo111','hasFocus',[0],(res)=>{
          //   console.log('lsj-dd:',res)
          // })
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
        short_video,waterfallRef,waterfallDatas,isStopPage,
        onItemClick,onItemFocused,loadMore,
        onKeyDown, onESCreate, onESStart, onESResume, onESStop, onESDestroy,
      }
    }
  })
  </script>
  
  <style scoped src="./css/short_video.css"></style>
  
  