<template>
  <qt-view class="short_video" ref="short_video" sid="short_video_waterfall">
    <bg-player class="bgPlayerRef" ref="bgPlayerRef" :clipChildren="false" 
      :defaultBgParentOpacity="1"/>

    <!-- 顶部按钮 -->
    <top-btns-view :logo-right="true" style="left: -24px;">
      <template #btnItem>
        <img-text-btn-view ref="top_search_btn" name="top_search_btn"
          style="width: 145px;height: 60px;margin-right: 10px"
          text="搜索" icon="ic_top_search.png" focus-icon="ic_top_search.png"
          :focusable="true" :icon-left="true" @click="onClick"/>
      </template>
    </top-btns-view>
     
    <qt-waterfall class="short_video_waterfall"
      @onItemClick="onItemClick"
      @onItemFocused="onItemFocused"
      :enablePlaceholder="false"
      :skipRequestFocus="true"
      :endHintEnabled="false"
      ref="waterfallRef"
      :disableScrollOnFirstScreen="true"
      :blockFocusDirections="['down']"
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
  import {ref, reactive} from "vue";
  import {useESRouter} from "@extscreen/es3-router";
  import { ESKeyEvent,useESToast } from "@extscreen/es3-core"
  import {qtRef, QTIWaterfall, QTWaterfallItem, QTWaterfallSection,QTWaterfall,
    VirtualView, QTWaterfallSectionType, QTWaterfallItemType
  } from "@quicktvui/quicktvui3";
  import shortVideoSection from "./component/short_video_section.vue";
  import {buildShortVideoAdapter} from "./build_data/adapter";
  import { useGlobalApi } from "../../api/UseApi"
  import {Native} from "@extscreen/es3-vue";
  import bgPlayer, { CoveredPlayerType } from "../../components/bg-player.vue"
  import TopBtnsView from "../../components/top-btns-view.vue";
  import ImgTextBtnView from "../../components/img-text-btn-view.vue";
  import { useLaunch } from "../../tools/launch/useApi";
  
  export default defineComponent({
    name: "search",
    components: {shortVideoSection, bgPlayer, TopBtnsView, ImgTextBtnView},
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
      const launch = useLaunch()
      const short_video = ref()
      const waterfallRef = ref<QTIWaterfall>()
      const waterfallDatas = qtRef<QTWaterfallSection[]>()
      let currentSecondTabIndex = ref(-1)
      let currentListItemIndex = ref(-1)
      const bgPlayerRef = ref()
      let delayDealwithplayerTimer: any = -1
      let videoInfo = reactive({
        tag: '独家',
        score: '9.7分',
        sort: '治愈/泡面/萌系/美食/原创',
        desc: '每个人都有不可告人的一面。这是一个世界各国均暗地里进行激烈情 报战的时代。奥斯塔尼亚（Ostania）···'
      })
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
      const onItemClick = (parentPosition, position, item) => {
        let obj = {
          item: item
        }
        launch.launch(obj)
      }
      const onItemFocused = async (parentPosition, position, isFocused, item, e) => {
        if(isFocused){
          if(item.name == 'list_section_item' && currentListItemIndex.value != position){
            currentListItemIndex.value = position
            bgPlayerRef.value.initPlayBg(item.poster)
            bgPlayerRef.value.showCoverImmediately()
            bgPlayerRef.value.stopIfNeed()
            delayDealwithplayerTimer = setTimeout( () => {
              bgPlayerRef.value.play(item)
            }, 300)
            videoInfo.desc = item.videoInfo.desc
            videoInfo.score = item.videoInfo.score
            videoInfo.sort = item.videoInfo.sort
            videoInfo.tag = item.videoInfo.tag
          }
        }
      }
      const loadMore = async (pageNo: number, sectionIndex: number, tabIndex: number) => {
        let data = await appApi.getShortVideoPageData('mock数据',pageNo,10)
        if(data.length > 0){
          let listSID =  waterfallRef.value?.getSection(sectionIndex)!.listSID
          if(pageNo > 1) VirtualView.call(listSID,'addListData',data)
          else VirtualView.call(listSID,'setListData',data)
        }
        if(!bgPlayerRef.value.playerInit && pageNo == 1){
          // clearTimeout(delayDealwithplayerTimer)
          bgPlayerRef.value.doChangeParent('', 2,
            1920, 1080, 1140, 640,
            [{  
              cover: data[0].poster,
              id: data[0].id,
              isRequestUrl: false,
              url: data[0].url,
              tag: data[0].videoInfo.tag ??'',
              score: data[0].videoInfo.score ??'',
              sort: data[0].videoInfo.sort ??'',
              desc: data[0].videoInfo.desc ??'',
              isShow: true
            }],
            0,732,135
          )
        }
      }
      const onClick = (e) => {
        router.push({
          name: 'search',
          params: {}
        });
      }
      const onESStart = () => {}
      const onESResume = () => {}
      const onESStop = () => {}
      function onKeyDown(keyEvent: ESKeyEvent): boolean {
        return false
      }
      const onESDestroy = () => {
      }
      const onBackPressed = () => {
        router.back()
      }
      
     
      return {
        short_video,waterfallRef,waterfallDatas,bgPlayerRef,videoInfo,
        onClick,
        onItemClick,onItemFocused,loadMore,
        onKeyDown, onESCreate, onESStart, onESResume, onESStop, onESDestroy,
      }
    }
  })
  </script>
  
<style scoped src="./css/short_video.css">

</style>
  
  