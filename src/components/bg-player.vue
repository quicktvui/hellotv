<template>
  <qt-view class="bg_player" :clipChildren="false" ref="bg_root" :style="{zIndex:zIndex}">
    <replace-child
      :focusable="false" :clipChildren="false"
      ref="bg_player_replace_child"
      markChildSID="bg-player"
      :replaceOnVisibilityChanged='false'
      class="bg_player_replace_child"
      sid="bg_player_replace_child_sid">
    </replace-child>
    <!--  此div的作用是让bg_player在一开始的时候不显示，否则如果瀑布流首屏配置了播放器，就会先闪现在左上角一下-->
    <div class='bg_player' sid='default_bg_parent' :opacity="defaultBgParentOpacity">
      <qt-view sid="bg-player" class="bg_player_box"
        :clipChildren="true" :focusable="false" name='home_player'
        :gradientBackground="showBgColor?(bgPlayerType==2?
        {type: 0, shape: 0,colors: ['#0D1F41', '#1B2143'],cornerRadii4: [0, 0, 0, 0]}:
        {type: 0, shape: 0,colors: ['#0D1F41', '#1B2143'],cornerRadii4: [20, 20, 20, 20]}):undefined"
        :style="{width:playerBoxWidth + 'px',height:playerBoxHeight + 'px'}">
        <qt-view :style="{width: (playerBoxWidth) + 'px',height:(playerBoxHeight) + 'px'}"
          v-if="playerInit" :focusable="false" :fillParent="true" class="playerBox" :clipChildren="false">
          <media-def-player
            ref="playerManagerRef"
            class="player-manager"
            :player-left="playerLeft"
            :player-top="playerTop"
            :clipChildren="false"
            :is-show-player-controller="true"
            @onPlayerPlaying="onVideoPlayerPlaying"
            @onPlayerCompleted="onVideoPlayerCompleted"
            @onPlayerInitialized="onPlayerInitialized"/>
        </qt-view>
        <!--  -->
        <qt-view class="item_player_focus_bg"
          :style="{width:(bgPlayerType==2? playerWidth: playerWidth + 30) + 'px',
          height:(bgPlayerType==2? playerHeight: playerHeight + 20) + 'px',
          left: bgPlayerType==2? playerLeft : playerLeft - 15,
          top: bgPlayerType==2? playerTop : playerTop - 10}"
          :focusable="bgPlayerType==2?false:true" :enableFocusBorder="true" @click="onClickCellItem">
          <bg-player-img ref="itemCellBgImgRef" class="item_cell_bg_img" :clipChildren="false"
            :borderRadius="bgPlayerType==2?0:20"
            :focusable="false" :width="(bgPlayerType==2? playerWidth: playerWidth + 30)"
            :height="(bgPlayerType==2? playerHeight: playerHeight + 20)" :transitionTime="600"/>
        </qt-view>
        <!-- 背景视频遮罩 -->
        <qt-view class="home_bg_player_view_mask" :visible="bgPlayerType===2"
          :style="{width:playerWidth + 'px',height:playerHeight + 'px',left: playerLeft,top: playerTop}"/>
        <!-- 背景视频阴影 -->
        <img
          :visible="isShowShadow"
          v-if="playerWidth&&playerHeight" 
          src="../assets/ranking/bg_shadow.png" class="bg_player_shadow_img" :focusable="false"
          :style="{width:(playerWidth+2) + 'px',height:(playerHeight+2) + 'px',left: (playerLeft-1),top: (playerTop-1)}"/>
        <!-- 小窗播放列表 -->
        <qt-view class="item_cell_list_front"
          :style="{width:playerListWidth + 'px',height:playerListHeight + 'px'}">
          <qt-list-view ref="listViewRef" :clipChildren="true" padding="0,0,0,1" v-if="listInit" :visible="bgPlayerType===1"
            :style="{width:playerListWidth + 'px',height:playerListHeight + 'px'}"
            :bringFocusChildToFront="false"
            :autoscroll='[currentPlayIndex,playerListHeight * 0.5 - 96 * 0.5]'
            :singleSelectPosition="currentPlayIndex"
            @item-click="onItemClick"  @item-focused="onItemFocus">
            <!-- 小窗列表 文字类型 10001-->
            <qt-view :type="10001" name="iclf_item" class="iclf_item" :focusable="true" :enableFocusBorder="true"
              :style="{width: playerListWidth + 'px'}"
              :clipChildren="true" eventClick eventFocus :focusScale="1">
                <qt-text :focusable="false" :ellipsizeMode="2" :fontSize="26" gravity="left|center" :lines="2" :maxLines="2"
                  :duplicateParentState="true"  class="iclf_item_text"  text="${title}" :paddingRect="[50,0,40,0]"/>
                <qt-view class="play_Mark" :focusable="false" :showOnState="['selected','focused']" :duplicateParentState="true">
                  <play-mark :style="{width:'20px',height:'20px'}" :markColor="'#157AFC'" :gap="-1" style="margin-left: 16px;" :focusable="false"/>
                </qt-view>
            </qt-view>
            <!-- 小窗列表 图片类型 10002-->
            <qt-view :type="10002" name="iclf_item2" class="iclf_item2" :focusable="true" :enableFocusBorder="true"
              :style="{width: playerListWidth + 'px'}"
              :clipChildren="true" eventClick eventFocus :focusScale="1">
                <qt-image src="${thumbnail}" :focusable="false" class="iclf_item_thumbnail" :style="{width: (playerListWidth - 2) + 'px'}"/>
                <qt-view class="iclf_item_thumbnail_mask" :gradientBackground="{colors:['#00000000','#E6000000']}" :focusable="false"
                  :style="{width: playerListWidth + 'px'}" :showOnState="['normal']" :duplicateParentState="true"/>
                <qt-view class="play_Mark" :focusable="false" :showOnState="['selected','focused']" :duplicateParentState="true">
                  <play-mark :style="{width:'20px',height:'20px'}" :markColor="'#157AFC'" :gap="-1" style="margin-left: 16px;" :focusable="false"/>
                </qt-view>
            </qt-view>
          </qt-list-view>
        </qt-view>
      </qt-view>
    </div>
    <qt-view class="bg_player_video_info" :focusable="false" :visible="videoInfo.isShow && (bgPlayerLevel == 'after')">
      <qt-view class="bgvi_t" :focusable="false" >
        <qt-text autoWidth gravity="left|center" :lines="1" :fontSize="30" :focusable="false"
          class="bgvi_t_text" :duplicateParentState="true" :text="`${videoInfo.score} ${videoInfo.sort}`" />
        <span class="bgvi_t_tag" :focusable="false" v-if="videoInfo.tag?true:false">{{ videoInfo.tag }}</span>
      </qt-view>
      <qt-text autoWidth gravity="left|top" :lines="2" :maxLines=2 :fontSize="30" :focusable="false"
        class="bgvi_b_text" :duplicateParentState="true"
        :text="`${videoInfo.desc}`" />
      <qt-view class="bgvi_btn" :focusable="true" name="bgvi_btn" :nextFocusName="{ left: 'list_section' }" @click="toDetail">
        <qt-text autoWidth gravity="center" :lines="1" :fontSize="30" :focusable="false"
          class="bgvi_btn_text" :duplicateParentState="true" text="看全集" />
      </qt-view>
    </qt-view>
  </qt-view>
</template>

<script lang="ts">
import { useESRouter } from "@extscreen/es3-router"
import { ref, defineComponent, nextTick, reactive, onMounted } from "vue";
import { QTIListView,QTListViewItem,VirtualView } from "@quicktvui/quicktvui3";
import { ESPlayerPlayMode,ESIPlayerInterceptor } from "@extscreen/es3-player"
import { ESMediaItemList,ESMediaItem } from "@extscreen/es3-player-manager";
import { useESEventBus, useESLog, useESToast, ESKeyEvent } from "@extscreen/es3-core";
import { TabPlayItem } from "../pages/home/build_data/tab_content/impl/TabPlayItem"
import { encodeDefinition } from "./media/adapter/ControlDataAdapter"
import MediaDefPlayer from "./media/media-def-player.vue"
import QtImgTransition from "./qt-img-transition.vue";
import BuildConfig from "../build/BuildConfig";
import bgPlayerImg from "./bg-player-img.vue";

export enum CoveredPlayerType{
  TYPE_UNDEFINED = -1,
  TYPE_CELL = 0,
  TYPE_CELL_LIST = 1,
  TYPE_BG = 2,
}
export default defineComponent({
  name: 'waterfall-player',
  components: {
    MediaDefPlayer,
    QtImgTransition,bgPlayerImg,
  },
  props: {
    defaultBgParentOpacity:{
      type:Number, default: 0
    },
    borderRadius: {
      type: Number, default:0
    },
    showBgColor:{
      type:Boolean, default:true
    }
  },
  setup(props,ctx) {
    const router = useESRouter()
    const toast = useESToast()
    const esEventBus = useESEventBus()
    let playerBoxWidth = ref<number>(0)
    let playerBoxHeight = ref<number>(0)
    let playerWidth = ref<number>(0)
    let playerHeight = ref<number>(0)
    let playerListWidth = ref<number>(478)
    let playerListHeight = ref<number>(0)
    let bgPlayerType = ref(CoveredPlayerType.TYPE_UNDEFINED)
    let playerLeft = ref<number>(0)
    let playerTop = ref<number>(0)
    const listViewRef = ref<QTIListView>()
    let listDataRec: Array<QTListViewItem> = [];
    let bgPlayerLevel = ref('after')
    const playerManagerRef = ref()

    const itemCellBgImgRef = ref();
    let bg_player_replace_child = ref()
    let bg_root = ref()
    let playerIsInitialized = ref(false)
    let delayShowTimer:any = -1
    let delayShowPlayerTimer:any = -1
    let delayShowItemCellBgImgTimer:any = -1
    let delayUpdateItemTimer:any = -1
    let onItemFocusTimer:any = -1
    let recordPlayerList: Array<any> = []
    let coverSrc =  ''
    let curCoverSrc = ""
    let cellListFocused = false
    let listInit =  ref(false)
    let playerInit =  ref(false)
    let pauseOnCoverShow = ref(false)
    let isAnyPlaying = ref(false)
    let currentPlayIndex = ref(0)
    let mediaInterceptor:ESIPlayerInterceptor | undefined
    let leftNum = ref(0)
    let topNum = ref(0)
    let bottomNum = ref(0)
    const log = useESLog()
    let zIndex = ref(0)
    let videoInfo = reactive({
      tag: '独家',
      score: '9.7分',
      sort: '治愈/泡面/萌系/美食/原创',
      desc: '每个人都有不可告人的一面。这是一个世界各国均暗地里进行激烈情 报战的时代。奥斯塔尼亚（Ostania）···',
      isShow: false
    })
    let lifeCycle = ""
    let play_type = ref(1)
    onMounted((()=>{
      esEventBus.on("bg-player-life-cycle",updateLifeCycle)
    }))
    function updateLifeCycle(lifeCycleName:string){
      lifeCycle = lifeCycleName
      if (lifeCycleName === 'onESDestroy'){
        esEventBus.off("bg-player-life-cycle")
      }
    }
    const playAtIndex = (index : number, playType = 1)=> {
      let list = recordPlayerList
      currentPlayIndex.value = index
      if(list && list.length > index && index > -1){
        currentPlayIndex.value = index
        let item = list[index]
        console.log("111",list)
        console.log("",playType)
        if(playType == 2) play2(list)
        else  play(item)
        if(!BuildConfig.isLowEndDev) playerManagerRef.value?.setSize(playerWidth.value,playerHeight.value)
      }else{
        log.e('BG-PLAYER',`playAtIndex error list size = 0,index ${index} `)
      }
    }
    const doChangeParent = (cellReplaceSID : string, playerType:number, boxWidth:number, boxHeight:number,playerWidth1:number,
      playerHeight1:number,playerListData:any, playIndex:number,pLeft: number, pRight: number,playType:number,interceptor?:ESIPlayerInterceptor) => {
        playerLeft.value = pLeft
        playerTop.value = pRight
        play_type.value = playType??1
        mediaInterceptor = interceptor
        clearTimeout(delayShowTimer)
        bgPlayerType.value = playerType
        showCoverImmediately()
        if(isAnyPlaying.value){
          stop()
        }
        let delayToPlay = 300
        if(!playerInit.value){
          playerInit.value = true
          delayToPlay += 1699
        }
        let item0 = playerListData[0]
        setVideoInfo(item0)
        initPlayBg(item0.cover)
        currentPlayIndex.value = playIndex
        delayShowTimer = setTimeout(()=>{
          initComponent(playerListData,playerType)
          setSize(boxWidth,boxHeight,playerWidth1,playerHeight1)
          if (lifeCycle !== "onESStop"){
            playAtIndex(playIndex, playType)
          }
        },delayToPlay)
    }

    const keepPlayerInvisible = (stopIfNeed : boolean = true)=>{
      log.e('DebugReplaceChild',`+++++keepPlayerInvisible pauseIfNeed:${stopIfNeed}`)
      // clearTimeout(delayShowPlayerTimer)
      playerLeft.value = 0
      playerTop.value = 0
      if(stopIfNeed){
        if(isAnyPlaying.value){
          isAnyPlaying.value = false
          stop()
        }
      }
    }

    /**
     *
     * @param delay delay执行显示
     * @param pauseIfNeed
     * @param showAfterDelay
     */
    const delayShowPlayer = (delay : number = 300)=>{
      log.e('BG-PLAYER',`+++++delayShowPlayer delay:${delay}`)
      bg_root.value?.dispatchFunctionBySid('bg-player','changeAlpha',[0])
      clearTimeout(delayShowPlayerTimer)
        delayShowPlayerTimer=  setTimeout(() => {
        log.e('DebugReplaceChild',`----set bgPlayerOpacity 1 on changeParent`)
        bg_root.value?.dispatchFunctionBySid('bg-player','changeAlpha',[1])
      },delay)
    }

    const initComponent = (playerListData: any,playerType:number) => {
      recordPlayerList=[]
      if(delayShowTimer) clearTimeout(delayShowTimer)
      if(delayShowItemCellBgImgTimer) clearTimeout(delayShowItemCellBgImgTimer)
      recordPlayerList = JSON.parse(JSON.stringify(playerListData))
      if(!playerIsInitialized.value && play_type.value == 1) initPlayer();

      if(playerType == CoveredPlayerType.TYPE_CELL){
        setPlayMediaListMode(3)
      }else if(playerType == CoveredPlayerType.TYPE_BG){
        setPlayMediaListMode(3)
      }else if(playerType == CoveredPlayerType.TYPE_CELL_LIST){
        listInit.value = true
        setPlayMediaListMode(3)
        if(!playerListData) return
        let arr: Array<QTListViewItem> = []
        for (let i = 0; i < playerListData.length; i++) {
          let el = playerListData[i]
          el.thumbnail = ''
          el.type = el.thumbnail ? 10002 : 10001;
          el.decoration = {};
          arr.push(el)
        }
        nextTick(() => {
          listDataRec = listViewRef.value!.init(arr)
        })
      }
    }

    const reset = () => {
      log.e('BG-PLAYER',`reset`)
      clearTimeout(delayShowTimer)
      clearTimeout(delayShowPlayerTimer)
      stop()
      release()
    }
    const setSize = (width:number,height:number,pWidth:number,pHeight:number) => {
      playerBoxWidth.value = width
      playerBoxHeight.value = height
      playerListWidth.value = width - pWidth
      playerListHeight.value = height
      playerWidth.value = bgPlayerType.value == CoveredPlayerType.TYPE_BG ?  pWidth : pWidth - 30
      playerHeight.value = bgPlayerType.value == CoveredPlayerType.TYPE_BG ?  pHeight : pHeight - 20
      // toast.showShortToast(playerHeight.value+'yyyyyyyyyyy'+playerWidth.value)
      if(!BuildConfig.isLowEndDev) {
        if (bgPlayerType.value == CoveredPlayerType.TYPE_BG){
          playerManagerRef.value?.setFullWindow()
        }else{
          playerManagerRef.value?.setSmallWindow()
        }
        playerManagerRef.value?.setSize(playerWidth.value, playerHeight.value)
      }
    }
    // cell-img-transition api

    const initPlayBg = (backgroundImage: any) => {
      curCoverSrc = backgroundImage
      let imgBg = !!backgroundImage ? backgroundImage : 'http://qcloudcdn.a311.ottcn.com/channelzero_image/web_static/extend_screen/mood/video_bj_01.png'
      setBgImage(imgBg)
    }

    const showCoverImmediately = (pausePlay = false) =>{
      clearTimeout(dismissCoverTimer)
      pauseOnCoverShow.value = pausePlay
    }

    const setCurBg = ()=>{
      if (curCoverSrc){
        coverSrc = curCoverSrc
        itemCellBgImgRef.value.setNextImage(curCoverSrc)
      }else{
        coverSrc = ""
        itemCellBgImgRef.value.setNextColor(0)
      }
    }

    const setBgImage = (imgUrl:string)=>{
      if(coverSrc === imgUrl) return
      coverSrc = imgUrl
      if (imgUrl) itemCellBgImgRef.value.setNextImage(imgUrl)
      else itemCellBgImgRef.value.setNextColor(0)
    }

    const requestDismissCover = (delay= 1000) => {
      // if(isAnyPlaying.value){
        clearTimeout(dismissCoverTimer)
        pauseOnCoverShow.value = false
        dismissCoverTimer = setTimeout(()=>{
          setBgImage("")
        },delay)
      // }
    }
    //player api
    const initPlayer = () => {if(!BuildConfig.isLowEndDev) playerManagerRef.value?.initialize()}
    const play = (item:TabPlayItem) => {
      if(BuildConfig.isLowEndDev) return
      const isRequestUrl = item.isRequestUrl
      let mediaItem_0: ESMediaItem
      let playList: ESMediaItemList
      if (isRequestUrl && mediaInterceptor){
        mediaItem_0 = {
          id:item.id,
          interceptors:[mediaInterceptor],
        }
      }
      else{
        const url = item.url
        mediaItem_0 = {
          mediaSourceList: {
            index: 0,
            list: [{
              uri: url,
              definition:encodeDefinition()
            }]
          },
        }
      }
      playList = {
        index: 0,
        list: [mediaItem_0]
      }
      playerManagerRef.value?.playMediaList(playList);
      playerManagerRef.value?.setSize(playerWidth.value,playerHeight.value)
    }
    // 走播放器媒体列表相关播放模式
    const play2 =(list: any) => {
      const playList:ESMediaItemList = playerManagerRef.value?.initPlayData([],3,[mediaInterceptor])
      playList.value?.playMediaList(playList);
      setTimeout(() => {
        loadMoreMediaList(0,list)
        playMediaItemByIndex(0)
      }, 200);
    }
    const loadMoreMediaList = (start:number, list:any) => {
      playerManagerRef.value?.loadMoreMediaList(start,list)
    }
    const playMediaItemByIndex = (index:number) => {
      playerManagerRef.value?.playMediaItemByIndex(index)
    }

    const getPlayingMediaIndex = (): number => {
      return playerManagerRef.value?.getPlayingMediaIndex()
    }

    const isMenuShow = (): boolean => {
      return playerManagerRef.value?.isMenuShow()
    }

    const release = () => {
      log.e('BG-PLAYER',`release called`)
      if(!BuildConfig.isLowEndDev) playerManagerRef.value?.release()
    }
    const stop = () => {
      log.e('BG-PLAYER',`stop called`)
      if(!BuildConfig.isLowEndDev) playerManagerRef.value?.stop()
      if(isAnyPlaying.value) {
        isAnyPlaying.value = false
      }
    }

    const stopIfNeed = () => {
      log.e('BG-PLAYER',`stop called`)
      if(isAnyPlaying.value){
        isAnyPlaying.value = false
        if(!BuildConfig.isLowEndDev) playerManagerRef.value?.stop()
      }
    }
    const pause = () => {
      if(!BuildConfig.isLowEndDev) playerManagerRef.value?.pause()
      if(isAnyPlaying.value) {
        isAnyPlaying.value = false
      }
    }
    const start = () => {
      if(!BuildConfig.isLowEndDev) playerManagerRef.value?.start(0)
    }
    const resume = () => {
      //FIXME 这里使用了start方法，应该是resume?
      if(!BuildConfig.isLowEndDev) playerManagerRef.value?.resume()
    }
    const setPlayMediaListMode = (playMode: ESPlayerPlayMode ) => {
      if(!BuildConfig.isLowEndDev) playerManagerRef.value?.setPlayMediaListMode(playMode)
    }
    let dismissCoverTimer: any
    const onVideoPlayerPlaying = () => {
      clearTimeout(dismissCoverTimer)
      isAnyPlaying.value = true
      if(pauseOnCoverShow.value){
        pause()
      }else{
        requestDismissCover(1300)
      }
    }

    const onClickCellItem = (e) => {
      router.push({
        name: 'screen_main_view',
        params: {}
      });
      //事件需要大于onItemFocus 中的时间
      clearTimeout(onItemFocusTimer)
      setTimeout(()=>{stop()},900)
    }
    const onItemClick = (e) => {
      router.push({
        name: 'screen_main_view',
        params: {}
      });
      //事件需要大于onItemFocus 中的时间
      clearTimeout(onItemFocusTimer)
      setTimeout(()=>{ stop()},900)
    }
    const onItemFocus = (e) => {
      cellListFocused = e.hasFocus
      if(e.hasFocus && e.position != currentPlayIndex.value){
        onItemFocusTimer && clearTimeout(onItemFocusTimer)
        onItemFocusTimer = setTimeout(()=>{
          dealwithItemPlay(e.item,e.position)
        },400)
      }
    }
    const dealwithItemPlay = (item: any,nextIndex:any) => {
      listViewRef.value?.clearPostTask()
      delayUpdateItemTimer && clearTimeout(delayUpdateItemTimer)
      listViewRef.value?.setItemSelected(nextIndex,true)
      initPlayBg(item.cover)
      showCoverImmediately()
      delayUpdateItemTimer = setTimeout(() => {
        stop()
        currentPlayIndex.value = nextIndex
        play(item)
        playerManagerRef.value?.setSize(playerWidth.value,playerHeight.value)
      },600)
    }
    const onPlayerInitialized = () => {
      // decode.setDecode(ESPlayerDecode.ES_PLAYER_DECODE_HARDWARE)
      playerIsInitialized.value = true
    }
    const onVideoPlayerCompleted = () => {
      if(bgPlayerType.value == CoveredPlayerType.TYPE_CELL_LIST){
        if (!cellListFocused){
          if(currentPlayIndex.value + 1 >= recordPlayerList.length) dealwithItemPlay(recordPlayerList[0],0)
          else dealwithItemPlay(recordPlayerList[currentPlayIndex.value + 1],currentPlayIndex.value + 1)
        }
      }
    }
    const setVideoInfo = (obj:any) => {
      videoInfo.desc = obj.desc
      videoInfo.score = obj.score
      videoInfo.sort = obj.sort
      videoInfo.tag = obj.tag
      // toast.showToast(videoInfo.tag)
      videoInfo.isShow = obj.isShow
    }
    const toDetail = () => {
      router.push({name: 'detail2'})
    }
    const onKeyDown = (keyEvent :ESKeyEvent):boolean => {
      return playerManagerRef.value?.onKeyDown(keyEvent)
    }
    const onKeyUp = (keyEvent :ESKeyEvent):boolean => {
      return playerManagerRef.value?.onKeyUp(keyEvent)
    }
    const onBackPressed = () => {
      playerManagerRef.value?.onBackPressed()
    }
    const isShowShadow = ref(false)//是否显示边框阴影
    return {
      isShowShadow,
      changeShadow(boo:boolean){//设置边框阴影
        isShowShadow.value = boo
      },
      bg_player_replace_child,itemCellBgImgRef,reset,bg_root,leftNum,topNum,bottomNum,videoInfo,bgPlayerLevel,
      playerManagerRef,release,stop,pause,resume,initPlayer,play,start,
      playerBoxWidth,playerBoxHeight,playerListWidth,playerListHeight,
      playerWidth,playerHeight,playerIsInitialized,playerLeft,playerTop,
      listViewRef,onItemClick,currentPlayIndex,onItemFocus,onClickCellItem,
      requestDismissCover,setCurBg,setBgImage,
      initPlayBg, delayShowPlayer,playerInit,
      onVideoPlayerPlaying,onVideoPlayerCompleted,onPlayerInitialized,
      initComponent, setSize, showCoverImmediately,
      playAtIndex,doChangeParent,bgPlayerType,listInit,pauseOnCoverShow,isAnyPlaying,stopIfNeed,
      keepPlayerInvisible,zIndex,
      setVideoInfo,toDetail,onKeyDown,onKeyUp,
      loadMoreMediaList,playMediaItemByIndex,getPlayingMediaIndex,isMenuShow,onBackPressed
    };
  },
});
</script>

<style>
.bg_player{width: 1920px;height: 1080px;background-color: transparent;
 flex-direction: row;justify-content: center;align-items: center;position: absolute}
.bg_player_replace_child{width: 1920px;height: 1080px;background-color: transparent;position: absolute;}
.bg_player_box{background-color: transparent;position: absolute;border-radius: 0;left: 0;top: 0;}
.playerBox{
  /* background-color: rgba(0, 0, 0, 0.1); */
  background-color: transparent;
  border-radius: 0;
  focus-border-style: solid;
  focus-border-color: #fff;
  focus-border-width: 2px;
  focus-border-radius: 0;
}
.player-manager{
  background-color: transparent;
  align-items: center;
  position: absolute;
  /* left: 10;
  top: 10; */
}
.home_bg_player_view_mask{
  background-color: rgba(0,0,0,0.5);
  position: absolute;
}
.item_cell_bg_img{
  background-color: transparent;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 0px;
}

.item_cell_list_front{
  background-color: transparent;
  position: absolute;
  right: 0;
  top: 0;
}
.iclf_item{
  height: 96px;
  background-color: transparent;
  border-bottom-width: 1px;
  border-bottom-color: rgba(255,255,255,0.1);
  /* focus-border-style: solid;
  focus-border-color: #fff;
  focus-border-width: 2px;
  focus-border-radius: 0;
  focus-background-color: #fff; */
  z-index: 99;
}
.iclf_item2{
  height: 96px;
  background-color: transparent;
  border-bottom-width: 1px;
  border-bottom-color: transparent;
  focus-border-style: solid;
  focus-border-color: #fff;
  focus-border-width: 2px;
  focus-border-radius: 0;
  z-index: 100;
}

.item_player_focus_bg{
  /* focus-border-style: solid;
  focus-border-color: #157AFC;
  focus-border-radius: 0; */
  background-color: transparent;
  position: absolute;
  /* left: 10;
  top: 10; */
  border-radius: 20px;
}

.iclf_item .play_Mark{
  width: 45px;
  height: 30px;
  background-color: transparent;
  position: absolute;
  left: 0;
  top: 23px;
  z-index: 101;
}
.iclf_item_text{
  position: absolute;
  height: 96px;
  color: #fff;
  left: 0;
  focus-color:#157AFC;
  width: 482px;
  select-color:#157AFC;
  background-color: transparent;
}
.iclf_item_thumbnail{
  position: absolute;
  height: 96px;
  left: 1px;
  top: 0;
  z-index: 22;
}
.iclf_item_thumbnail_mask{
  position: absolute;
  height: 96px;
  z-index: 23;
}
.iclf_item2 .play_Mark{
  width: 45px;
  height: 30px;
  background-color: transparent;
  position: absolute;
  left: 0;
  top: 38px;
  z-index: 24;
}

.bg_player_video_info{
  width: 1140px;
  height: 150px;
  background-color: transparent;
  position: absolute;
  left: 732px;
  bottom: 30px;
}
.bgvi_t{
  width: 1140px;
  height: 38px;
  flex-direction: row;
}
.bgvi_t_text{
  width: 440px;
  color: #FF9F0A;
  height: 38px;
}
.bgvi_t_tag{
  width: 63px;
  height: 30px;
  color: #fff;
  font-size: 24px;
  text-align: center;
  line-height: 30px;
  background-color: #0A84FF;
  align-self: center;
  border-radius: 2px;
}
.bgvi_b_text{
  width: 900px;
  height: 90px;
  color: #636363;
  margin-top: 12px;
}
.bgvi_btn{
  position: absolute;
  right: 0;
  bottom: 21px;
  width: 146px;
  height: 49px;
  border-radius: 24.5px;
  background-color: #252525;
  focus-background-color: #fff;
}
.bgvi_btn_text{
  width: 146px;
  height: 49px;
  color: #BFBFBF;
  focus-color: #333;
}
.bg_player_shadow_img{
  position: absolute;
  background-color: transparent;
}
</style>
