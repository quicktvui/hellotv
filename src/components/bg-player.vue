<template>
  <qt-view class="bg_player" :clipChildren="false" ref="bg_root">
    <replace-child
      :focusable="false" :clipChildren="false"
      @onChildChanged="onChildChanged"
      ref="bg_player_replace_child"
      markChildSID="bg-player"
      :replaceOnVisibilityChanged='false'
      class="bg_player_replace_child"
      sid="bg_player_replace_child_sid">
    </replace-child>
    <qt-view sid="bg-player" class="bg_player_box"
      :clipChildren="true" :focusable="false"
       name='home_player'
      :style="{width:playerBoxWidth + 'px',height:playerBoxHeight + 'px'}">
      <qt-view :style="{width:playerWidth + 'px',height:playerHeight + 'px'}"
               v-if="playerInit"
               :focusable="false"
               :fillParent="true"
        class="playerBox" :clipChildren="false" >
        <es-player-manager :clipChildren="false"
          ref="playerManagerRef"
          class="player-manager"
          :focusable="false"
          :initPlayerWindowType="2"
          :playerList="playerList"
          @onPlayerPlaying="onVideoPlayerPlaying"
          @onPlayerCompleted="onVideoPlayerCompleted"
          @onPlayerInitialized="onPlayerInitialized"
        />
         <!-- 背景视频遮罩 信息 -->
        <!-- <qt-view class="home_bg_player_view_info" :visible="isFullScreen" :gradientBackground="{colors:['#00000000','#E6000000']}">
          <p class="info_name">{{playerInfo.name}}</p>
          <div class="info_score" v-if="playerInfo.score">
            <span class="info_score_txt">评分：</span>
            <span class="info_score_num">{{playerInfo.score}}</span>
          </div>
          <p class="info_major" v-if="playerInfo.major">主演: {{playerInfo.major}} </p>
        </qt-view> -->
      </qt-view>
      <qt-view class="item_player_focus_bg" :style="{width:playerWidth + 'px',height:playerHeight + 'px'}" :focusable="true"
               :enableFocusBorder="true" @click="onClickCellItem">
        <qt-img-transition ref="itemCellBgImgRef" class="item_cell_bg_img" :clipChildren="false"
                           :focusable="false"
                           :src="coverSrc"
                           :width="playerWidth"
                           :height="playerHeight"
        />
      </qt-view>
      <!-- 背景视频遮罩 -->
      <qt-view class="home_bg_player_view_mask" :visible="bgPlayerType===2"/>
      <!-- 小窗播放列表 -->
      <qt-view class="item_cell_list_front"
        :style="{width:playerListWidth + 'px',height:playerListHeight + 'px'}">
        <qt-list-view ref="listViewRef" :clipChildren="true" padding="0,0,0,1" v-if="listInit" :visible="bgPlayerType===1"
          :style="{width:playerListWidth + 'px',height:playerListHeight + 'px'}"
                      :bringFocusChildToFront="false"
                      :autoscroll='[currentPlayIndex,playerListHeight * 0.5 - 96 * 0.5]'
                      :singleSelectPosition="currentPlayIndex"
          @item-click="onItemClick"  @item-focused="onItemFocus">
          <qt-view :type="10001" name="iclf_item" class="iclf_item" :focusable="true" :enableFocusBorder="true"
            :style="{width: playerListWidth + 'px'}"
            :clipChildren="true" eventClick eventFocus :focusScale="1">
              <qt-text :focusable="false" :ellipsizeMode="2" :fontSize="26" gravity="left|center" :lines="2" :maxLines="2"
                :duplicateParentState="true"  class="iclf_item_text"  text="${title}" :paddingRect="[50,0,16,0]"/>
              <qt-view class="play_Mark" :focusable="false" :showOnState="['selected','focused']" :duplicateParentState="true">
                <play-mark :style="{width:'20px',height:'20px'}" :markColor="'#FF4E46'" :gap="-1" style="margin-left: 16px;" :focusable="false"/>
              </qt-view>
          </qt-view>
        </qt-list-view>
      </qt-view>
    </qt-view>
  </qt-view>
</template>

<script lang="ts">
import { useESRouter } from "@extscreen/es3-router"
import { ref, defineComponent, markRaw,nextTick } from "vue";
import { QTIListView,QTListViewItem } from "@quicktvui/quicktvui3";
import {ESMediaSource, ESMediaSourceList,ESPlayerPosition,ESPlayerPlayMode,useESPlayerDecodeManager,ESPlayerDecode} from "@extscreen/es3-player";
import { ESIPlayerManager, ESMediaItemList,ESMediaItem, ESPlayerManager} from "@extscreen/es3-player-manager";
import { ESVideoPlayer } from "@extscreen/es3-video-player";
import {ESLogLevel, useESLog, useESToast} from "@extscreen/es3-core";
import {watch} from "@vue/runtime-core";
import { useLaunch } from "../tools/launch/useApi"
import QtImgTransition from "./qt-img-transition.vue";
export enum CoveredPlayerType{
  TYPE_UNDEFINED = -1,
  TYPE_CELL = 0,
  TYPE_CELL_LIST = 1,
  TYPE_BG = 2,
}
export default defineComponent({
  name: 'waterfall-player',
  components: {
    QtImgTransition,
    'es-player-manager': ESPlayerManager,
  },
  props:{
    active:{
      type:Boolean,
      default:true
    }
  },
  setup(props,ctx) {
    const launch = useLaunch()
    const decode = useESPlayerDecodeManager()
    const router = useESRouter()
    let playerBoxWidth = ref<number>(0)
    let playerBoxHeight = ref<number>(0)
    let playerWidth = ref<number>(1920)
    let playerHeight = ref<number>(1080)
    let playerListWidth = ref<number>(478)
    let playerListHeight = ref<number>(0)
    let bgPlayerOpacity = ref(0)
    let bgPlayerType = ref(CoveredPlayerType.TYPE_UNDEFINED)
    const listViewRef = ref<QTIListView>()
    let listDataRec: Array<QTListViewItem> = [];
    const playerManagerRef = ref<ESIPlayerManager>()
    const playerList = ref([markRaw(ESVideoPlayer)])
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
    let coverOpacity =  ref(1)
    let coverSrc =  ref('')
    let listInit =  ref(false)
    let playerInit =  ref(false)
    let pauseOnCoverShow = ref(false)
    let isAnyPlaying = ref(false)
    let currentPlayIndex = ref(0)
    const log = useESLog()
    const toast = useESToast()
    // let playInfo = reactive({
    //   name: '',
    //   score: '',
    //   major: ''
    // })

    watch(()=> props.active,(value)=>{
      log.e('BG-PLAYER',`props.active change:${value}`)
        // if(!value){
        //   showCoverImmediately()
        // }else{
        //   dismissCoverDelayed()
        // }
    })
    const playAtIndex = (index : number)=> {
      let list = recordPlayerList
      currentPlayIndex.value = index
      if(list && list.length > index && index > -1){
        currentPlayIndex.value = index

        let item = list[index]
        log.e('BG-PLAYER',`playAtIndex item:${JSON.stringify(item)},index:${index}`)
        play(item.url)
        playerManagerRef.value?.setSize(playerWidth.value,playerHeight.value)
      }else{
        log.e('BG-PLAYER',`playAtIndex error list size = 0,index ${index} `)
      }
    }
    const doChangeParent = (cellReplaceSID : string, playerType:number,
                            boxWidth:number, boxHeight:number, playerWidth:number, playerHeight:number,
                            playerListData:any, playIndex:number)=>{
      bgPlayerOpacity.value = 0
      clearTimeout(delayShowTimer)
      // clearTimeout(delayShowPlayerTimer)
      bgPlayerType.value = playerType
      log.i(`BG-PLAYER`,`doChangeCell cellReplaceSID:${cellReplaceSID},playerType:${playerType},
      boxWidth:${boxWidth},boxHeight:${boxHeight},playerWidth:${playerWidth},playerHeight:${playerHeight},playIndex:${playIndex},playerListDataSize:${playerListData == null ? 0 : playerListData.length}`)
      //Native.callUIFunction(bg_root.value,'dispatchFunctionBySid', [cellReplaceSID,'setChildSID',['bg-player']]);
      showCoverImmediately()
      if(isAnyPlaying.value){
        stop()
      }
      let delayToPlay = 0
      if(!playerInit.value){
        playerInit.value = true
        delayToPlay += 2000
        log.e('BG-PLAYER',`doChangeParent 首次初始化播放器`)
      }
      let item0 = playerListData[0]
      setNextImage(item0.cover)
      currentPlayIndex.value = playIndex
      delayShowTimer = setTimeout(()=>{
        initComponent(playerListData,playerType)
        setSize(boxWidth,boxHeight,playerWidth,playerHeight)
        playAtIndex(playIndex)
        // delayShowPlayer(300)
      },delayToPlay)
    }

    const keepPlayerInvisible = (stopIfNeed : boolean = true)=>{
      log.e('DebugReplaceChild',`+++++keepPlayerInvisible pauseIfNeed:${stopIfNeed}`)
      // bgPlayerOpacity.value = 0
      // clearTimeout(delayShowPlayerTimer)
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
      bgPlayerOpacity.value = 0
        bg_root.value?.dispatchFunctionBySid('bg-player','changeAlpha',[0])
      clearTimeout(delayShowPlayerTimer)
        delayShowPlayerTimer=  setTimeout(() => {
        log.e('DebugReplaceChild',`----set bgPlayerOpacity 1 on changeParent`)
        bgPlayerOpacity.value = 1
            bg_root.value?.dispatchFunctionBySid('bg-player','changeAlpha',[1])
      },delay)
    }

    const initComponent = (playerListData: any,playerType:number) => {
      recordPlayerList=[]
      if(delayShowTimer) clearTimeout(delayShowTimer)
      if(delayShowItemCellBgImgTimer) clearTimeout(delayShowItemCellBgImgTimer)
      let item0 = playerListData[0]
      recordPlayerList = JSON.parse(JSON.stringify(playerListData))
      if(!playerIsInitialized.value) initPlayer();

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
          el.type = 10001;
          el.decoration = {};
          el.isPlaying = (i === 0);
          arr.push(el)
        }
        nextTick(() => {
          listDataRec = listViewRef.value!.init(arr)
          // setTimeout(() => {
          //   listViewRef.value?.setItemSelected(0,true)
          // }, 200);
        })
      }
    }
    let loopPlayListTimer: any = -1
    const startInterval = (index: number) => {
      if(loopPlayListTimer) clearTimeout(loopPlayListTimer)
      loopPlayListTimer = setTimeout(() => {
        dealwithItemPlay(recordPlayerList[index],index)
      },5000)
    }
    const reset = () => {
      log.e('BG-PLAYER',`reset`)
      clearInterval(loopPlayListTimer)
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
      playerWidth.value = pWidth
      playerHeight.value = pHeight
      // playerManagerRef.value?.setSize(playerWidth,playerHeight)
      playerManagerRef.value?.setSize(playerWidth.value,playerHeight.value)
    }
    // cell-img-transition api

    const setNextImage = (backgroundImage: any) => {
      log.d('BG-PLAYER',`setCellNextImage bg:${backgroundImage}`)
      // if(backgroundImage) itemCellBgImgRef.value?.setNextImage(backgroundImage);
      // else itemCellBgImgRef.value?.setNextImage(recordPlayerList[currentPlayIndex.value].cover);
        // coverSrc.value = backgroundImage
        if(backgroundImage != '') {
          coverSrc.value = backgroundImage
          // isShowVideoBjText.value = false
        }
        else {
          // isShowVideoBjText.value = true
          coverSrc.value = 'http://qcloudcdn.a311.ottcn.com/channelzero_image/web_static/extend_screen/mood/video_bj_01.png'
      }
        //coverSrc.value = recordPlayerList[currentPlayIndex.value].cover
    }

    function resetCellImage () {
      itemCellBgImgRef.value?.reset()
    }
    const showCoverImmediately = (pausePlay = false) =>{
      //itemCellBgImgRef.value?.setNextImage(recordPlayerList[currentPlayIndex.value].cover)
      clearTimeout(dismissCoverTimer)
      coverOpacity.value = 1
      pauseOnCoverShow.value = pausePlay
      if(coverSrc.value != ''){
        itemCellBgImgRef.value.setNextImage(coverSrc.value)
      }
      log.d('BG-PLAYER',`showCoverImmediately pausePlay:${pausePlay}`)
    }
    // const dismissCoverDelayed = () => {
    //   clearTimeout(dismissCellCoverTimer)
    //   dismissCellCoverTimer = setTimeout(()=>{
    //     //itemCellBgImgRef.value?.setNextColor(0)
    //     log.e('WATERFALL-TABS',`exe DismissCellCover!!!`)
    //     //props.active = true
    //     coverOpacity.value = 0
    //   },1000)
    // }
    // img-transition api

    const requestDismissCover = (delay= 1000) => {
        if(recordPlayerList[currentPlayIndex.value].url){
          clearTimeout(dismissCoverTimer)
          pauseOnCoverShow.value = false
          log.d('BG-PLAYER',`requestDismissCover`)
          dismissCoverTimer = setTimeout(()=>{
            //itemCellBgImgRef.value?.setNextColor(0)
            itemCellBgImgRef.value.setNextColor()
            coverOpacity.value = 0
            //activeState.value = false
            //bgRef.value?.setNextColor(0)
          },delay)
        }
    }
    //player api
    const initPlayer = () => playerManagerRef.value?.initialize()
    const play = (url:string) => {
      log.e('BG-PLAYER',`play url :${url}`)
      let mediaItem_0: ESMediaItem = {
        mediaSourceList: {
          index: 0,
          list: [{
            // uri: 'http://qcloudcdn.a311.ottcn.com/data_center/videos/SHORT/DEFAULT/2023/08/25/7d3623ae-c002-4929-b5a2-fe10bca06bfc.mp4'
            uri: url
          }]
        },
      }
      let playList: ESMediaItemList = {
        index: 0,
        list: [mediaItem_0]
      }
      playerManagerRef.value?.playMediaList(playList);
    }
    const release = () => {
      log.e('BG-PLAYER',`release called`)
      playerManagerRef.value?.release()
    }
    const stop = () => {
      log.e('BG-PLAYER',`stop called`)
      playerManagerRef.value?.stop()
    }

    const stopIfNeed = () => {
      log.e('BG-PLAYER',`stop called`)
      if(isAnyPlaying.value){
        isAnyPlaying.value = false
        playerManagerRef.value?.stop()
      }
    }
    const pause = () => {
      log.d('BG-PLAYER',`pause`)
      playerManagerRef.value?.stop()
    }
    const resume = () => {
      log.d('BG-PLAYER',`resume`)
      //FIXME 这里使用了start方法，应该是resume?
      playerManagerRef.value?.resume()
    }
    const setPlayMediaListMode = (playMode: ESPlayerPlayMode ) => playerManagerRef.value?.setPlayMediaListMode(playMode)
    let dismissCoverTimer: any
    let dismissCellCoverTimer: any
    const onVideoPlayerPlaying = () => {
      clearTimeout(dismissCoverTimer)
      log.e('BG-PLAYER',`onVideoPlayerPlaying pauseOnCoverShow:${pauseOnCoverShow.value}`)
      isAnyPlaying.value = true
      if(pauseOnCoverShow.value){
        pause()
      }else{
        requestDismissCover(1500)
      }
    }

    const isBGPlay = ()=>{
      return bgPlayerType.value == CoveredPlayerType.TYPE_BG
    }
    const onClickCellItem = (e) => {
      router.push({
        name: 'screen_main_view',
        params: {}
      });
    }
    const onItemClick = (e) => {
      router.push({
        name: 'screen_main_view',
        params: {}
      });
    }
    const onItemFocus = (e) => {
      onItemFocusTimer && clearTimeout(onItemFocusTimer)
      onItemFocusTimer = setTimeout(()=>{
        if(e.hasFocus && e.position != currentPlayIndex.value){
          dealwithItemPlay(e.item,e.position)
        }
      },400)

    }
    const dealwithItemPlay = (item: any,nextIndex:any) => {
      listViewRef.value?.clearPostTask()
      if(delayUpdateItemTimer) clearTimeout(delayUpdateItemTimer)
      listViewRef.value?.setItemSelected(nextIndex,true)
      setNextImage(item.cover)

      showCoverImmediately()
      delayUpdateItemTimer = setTimeout(() => {
        listDataRec[currentPlayIndex.value].isPlaying = false
        currentPlayIndex.value = nextIndex
        stop()
        listDataRec[nextIndex].isPlaying = true
        play(item.url)
        playerManagerRef.value?.setSize(playerWidth.value,playerHeight.value)
      },300)
    }
    const onPlayerInitialized = () => {
      // decode.setDecode(ESPlayerDecode.ES_PLAYER_DECODE_HARDWARE)
      playerIsInitialized.value = true
    }
    const onVideoPlayerCompleted = () => {
      if(bgPlayerType.value == CoveredPlayerType.TYPE_CELL_LIST){
        clearInterval(loopPlayListTimer)
        if(currentPlayIndex.value + 1 >= recordPlayerList.length) dealwithItemPlay(recordPlayerList[0],0)
        else dealwithItemPlay(recordPlayerList[currentPlayIndex.value + 1],currentPlayIndex.value + 1)
      }
    }
    const onChildChanged = (e) => {
      // console.log(e,'onChildChangedonChildChangedonChildChangedonChildChangedonChildChanged')
    }
    return {
      playerList,bg_player_replace_child,bgPlayerOpacity,itemCellBgImgRef,reset,bg_root,
      playerManagerRef,release,stop,pause,resume,initPlayer,play,
      playerBoxWidth,playerBoxHeight,playerListWidth,playerListHeight,
      playerWidth,playerHeight,playerIsInitialized,
      listViewRef,onItemClick,currentPlayIndex,onItemFocus,onClickCellItem,
      requestDismissCover,
      setNextImage, delayShowPlayer,playerInit,
      onVideoPlayerPlaying,onVideoPlayerCompleted,onPlayerInitialized,
      initComponent,setSize,onChildChanged,coverOpacity, showCoverImmediately,
      coverSrc,playAtIndex,doChangeParent,bgPlayerType,listInit,pauseOnCoverShow,isAnyPlaying,stopIfNeed,
      keepPlayerInvisible
    };
  },
});
</script>

<style>
.bg_player{width: 1920px;height: 1080px;background-color: transparent;
 flex-direction: row;justify-content: center;align-items: center;}
.bg_player_replace_child{width: 1920px;height: 1080px;background-color: transparent;position: absolute;}
.bg_player_box{width: 1920px;height: 1080px;background-color: transparent;position: absolute;border-radius: 8px;top: 0;left: 0;}
.playerBox{
  background-color: rgba(0, 0, 0, 0.1);
  focus-border-style: solid;
  focus-border-color: #fff;
  focus-border-width: 2px;
  focus-border-radius: 0;
}
.player-manager{
  width: 1920px;
  height: 1080px;
  background-color: transparent;
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  border-radius: 8px;
}
.home_bg_player_view_mask{
  background-color: rgba(0,0,0,0.5);
  width: 1920px;
  height: 1080px;
  top: 0;
  position: absolute;
}
.item_cell_bg_img{
  background-color: transparent;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 0px;
}

.item_cell_list_front{background-color: rgba(255,255,255,0.1);position: absolute;right: 0;top: 0;}
.iclf_item{
  height: 96px;
  background-color: transparent;
  border-bottom-width: 1px;
  border-bottom-color: rgba(255,255,255,0.1);
  focus-border-style: solid;
  focus-border-color: #fff;
  focus-border-width: 2px;
  focus-border-radius: 0;
  focus-background-color: #fff;
  z-index: 99;
}

.item_player_focus_bg{
  focus-border-style: solid;
  focus-border-color: #fff;
  focus-border-radius: 0;
  background-color: transparent;
  position: absolute;
  left: 0;
  top: 0;
  border-radius: 0px;
}

.iclf_item .play_Mark{width: 45px;height: 30px;background-color: transparent;position: absolute;left: 0;top: 38px;}
.iclf_item_text{position: absolute;height: 96px;color: #fff;left: 0; focus-color:#000;width: 482px;
select-color:#FF4E46;background-color: transparent;}
</style>
