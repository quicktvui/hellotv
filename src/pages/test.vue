<template>
  <div style="width: 1920px;height: 1080px;background-color: #669940;padding-left: 200px;padding-top: 200px;flex-direction: row">
    <media-def-player
      ref="PlayerManagerRef"
      class="media-test-css"
      :initPlayerWindowType="2"
      @onPlayerPlaying="onVideoPlayerPlaying"
      @onPlayerCompleted="onVideoPlayerCompleted"
      @onPlayerInitialized="onPlayerInitialized"
    />
    <bg-player-img ref="itemCellBgImgRef"
                   class="media-test-img-bg-css"
                   :style="{width:`${playerWidth}px`,height:`${playerHeight}px`}"
                   :focusable="false"
                   :width="playerWidth"
                   :height="playerHeight"
                   :transitionTime="800"
    />
    <img-text-btn-view
      :icon-left="true"
      text="测试"
      :focusable="true"
      style="width: 205px;height: 60px;margin-left: 10px;"
      :autofocus="true"
      name="test_btn"
      ref="test_btn"
      icon="ic_top_screen.png"
      focus-icon="ic_top_screen.png"
      @click="onClick"
      @focus="onFocus"/>
    <img-text-btn-view
      :icon-left="true"
      text="全屏"
      :focusable="true"
      style="width: 205px;height: 60px;margin-left: 30px;"
      name="test_btn2"
      ref="test_btn2"
      icon="ic_top_screen.png"
      focus-icon="ic_top_screen.png"
      @click="onClick"
      @focus="onFocus"/>

  </div>

</template>

<script lang="ts">
import { ESIPlayerInterceptor } from "@extscreen/es3-player"
import { ESMediaItem, ESMediaItemList } from "@extscreen/es3-player-manager"
import { useESRouter } from "@extscreen/es3-router"
import { defineComponent } from "@vue/runtime-core"
import { ESKeyEvent, useESLog } from "@extscreen/es3-core"
import { ref } from "vue"
import { useGlobalApi } from "../api/UseApi"
import BgPlayerImg from "../components/bg-player-img.vue"
import ImgTextBtnView from "../components/img-text-btn-view.vue"
import { encodeDefinition } from "../components/media/adapter/ControlDataAdapter"
import MediaDefPlayer from "../components/media/media-def-player.vue"
import { createESHomeBGPlayerMediaInterceptor } from "./home/play_interceptor/createESHomeBGPlayerMediaInterceptor"

export default defineComponent({
  name: "test",
  components: { BgPlayerImg, MediaDefPlayer, ImgTextBtnView },
  setup(props, context) {
    const log = useESLog()
    const router = useESRouter()
    const PlayerManagerRef = ref()
    const itemCellBgImgRef = ref()
    let playerWidth = ref<number>(1920)
    let playerHeight = ref<number>(1080)
    let mediaInterceptor: ESIPlayerInterceptor
    const globalApi = useGlobalApi()
    let recordPlayerList: Array<any> = []
    let playerIsInitialized = ref(false)

    const onClick = (e)=>{
      const name = e.target.attributes.name
    }
    const onFocus = (e)=>{
      const name = e.target.attributes.name
    }
    const onESCreate = (params)=>{
      mediaInterceptor = createESHomeBGPlayerMediaInterceptor(globalApi)
      const playData = [{
        id:'1532310053293928449',
        title:'特斯拉自动驾驶遭遇“水土不服”？懂车帝原创全面评测Model 3',
        cover:'http://cms.hmon.tv/common/static/file/2024/05/31/ce5b63bc-5f2f-4171-871c-b709b9cb822a.png',
        url:"",
        isRequestUrl:true
      }]
      let imgBg = playData[0].cover
      setBgImage(imgBg)

      setTimeout(()=>{
        initComponent(playData,2)
        setSize()
        playByIndex(0)
      },2000)
    }

    const initComponent = (playerListData: any,playerType:number)=>{
      recordPlayerList=[]
      recordPlayerList = JSON.parse(JSON.stringify(playerListData))
      if(!playerIsInitialized.value) initPlayer();
      PlayerManagerRef.value?.setPlayMediaListMode(3)
    }
    const initPlayer = () => {
      PlayerManagerRef.value?.initialize()
    }
    const setSize = ()=>{
      PlayerManagerRef.value?.setFullWindow()
      PlayerManagerRef.value?.setSize(playerWidth.value, playerHeight.value)
    }

    const playByIndex= (index:number)=>{
      let list = recordPlayerList
      let item = list[index]
      play(item)
      PlayerManagerRef.value?.setSize(playerWidth.value,playerHeight.value)
    }

    const play =(item:any)=>{
      const isRequestUrl = item.isRequestUrl
      let mediaItem_0: ESMediaItem
      let playList: ESMediaItemList
      if (isRequestUrl && mediaInterceptor){
        mediaItem_0 = {
          id:item.id,
          title:item.title,
          subTitle:'2020年 12月 17日完结 ｜ 100万+播放',
          interceptors:[mediaInterceptor],
        }
      }else{
        const url = item.url
        mediaItem_0 = {
          mediaSourceList: {
            index: 0,
            list: [{
              uri: url,
              definition: encodeDefinition()
            }]
          },
        }
      }
      playList = {
        index: 0,
        list: [mediaItem_0]
      }
      PlayerManagerRef.value?.playMediaList(playList);
    }

    const onVideoPlayerPlaying = ()=>{
      setBgImage("")
    }
    const onVideoPlayerCompleted = ()=>{

    }
    const onPlayerInitialized = ()=>{
      playerIsInitialized.value = true
    }

    const setBgImage = (imgUrl:string)=>{
      if (imgUrl) itemCellBgImgRef.value.setNextImage(imgUrl)
      else itemCellBgImgRef.value.setNextColor(0)
    }
    const onKeyDown = (keyEvent: ESKeyEvent):boolean=>{
      if (PlayerManagerRef.value?.onKeyDown(keyEvent)) {
        return true
      }
      return false
    }
    const onKeyUp = (keyEvent: ESKeyEvent):boolean=>{
      if (PlayerManagerRef.value?.onKeyUp(keyEvent)) {
        return true
      }
      return false
    }
    const onBackPressed = ():boolean=>{
      if (PlayerManagerRef.value?.onBackPressed()) {
        return true
      }
      router.back()
      return true
    }

    return {
      PlayerManagerRef,
      itemCellBgImgRef,

      onClick,
      onFocus,
      onESCreate,
      onVideoPlayerPlaying,
      onVideoPlayerCompleted,
      onPlayerInitialized,
      onKeyDown,
      onKeyUp,
      onBackPressed,

      playerHeight,
      playerWidth,
    }
  }
})
</script>

<style>
.media-test-css{
  position: absolute;
  background-color: transparent;
}

.media-test-img-bg-css {
  background-color: transparent;
  position: absolute;
  left: 0;
  top: 0;
}
</style>
