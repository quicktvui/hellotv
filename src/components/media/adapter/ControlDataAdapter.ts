import {
  ESIPlayerInterceptor,
  ESPlayerDefinition,
  ESPlayerPlayMode,
  ESPlayerRate
} from "@extscreen/es3-player"
import { ESMediaItem, ESMediaItemList } from "@extscreen/es3-player-manager"
import { ESMediaSource } from "@extscreen/es3-player/dist/src/core/ESMediaSource"
import { QTListViewItem } from "@quicktvui/quicktvui3"
import { QTListViewItemDecoration } from "@quicktvui/quicktvui3/dist/src/list-view/core/QTListViewItemDecoration"
import { ref } from "vue"
import { IMediaUrl } from "../../../api/media/IMediaUrl"
import xuanJiIcon from '../../../assets/def_media/ic_def_media_menu_xuanji.png'
import xuanJiFocusIcon from '../../../assets/def_media/ic_def_media_menu_xuanji_focus.png'
import settingIcon from '../../../assets/def_media/ic_def_media_menu_setting.png'
import settingFocusIcon from '../../../assets/def_media/ic_def_media_menu_setting_focus.png'
import { ESDefMediaList } from "../impl/ESDefMediaList"

export const bottomMenuClickEventBusName = "onBottomMenuPlayClicked"
export enum PlayMenuNameFlag{
  NEXT = "next",
  EPISODES = "episodes",
  RATE = "rate",
  RATE_ITEM = "rateItem",
  DEFINITION = "definition",
  DEFINITION_ITEM = "definitionItem",
  SETTING = "setting",
  SETTING_ITEM = "settingItem"
}

export const defList = ()=>[
  // {type:2,nameFlag:PlayMenuNameFlag.EPISODES,iconNormal:xuanJiIcon,iconFocus:xuanJiFocusIcon,name:'选集',decoration:{right:30}},
  {type:1,nameFlag:PlayMenuNameFlag.RATE,name:'倍速 2.0x',decoration:{right:30}},
  {type:1,nameFlag:PlayMenuNameFlag.DEFINITION,name:'标清',decoration:{right:30}},
  {type:2,nameFlag:PlayMenuNameFlag.SETTING,iconNormal:settingIcon,iconFocus:settingFocusIcon,name:'设置'},
]
export const resultMap:Map<String, number> = new Map<String, number>()
export function initMenuList(list=defList()){
  if (list && list.length > 0){
    list.map((item,index)=>{
      resultMap.set(item.nameFlag,index)
    })
  }
}

export const useMenuList = ()=>{
  const customList = ref<any[]>()
  return {
    customList,
    setList(newList:any[]){
      customList.value = newList
    }
  }

}

export function buildPlayData(playDatas:Array<ESDefMediaList>,interceptors?:Array<ESIPlayerInterceptor>):ESMediaItemList{
  let playList: ESMediaItemList = {
    index: 0,
    list: []
  }
  if (playDatas && playDatas.length > 0){
    playDatas.map((item,index)=>{
      const isRequestUrl = item.isRequestUrl
      let mediaItem_0: ESMediaItem
      if (isRequestUrl){
        mediaItem_0 = {
          id:item.id,
          title:item.title,
          subTitle:item.subTitle,
          interceptors:interceptors,
        }
      }else{
        mediaItem_0 = {
          id:item.id,
          title:item.title,
          subTitle:item.subTitle,
          mediaSourceList: {
            index: 0,
            list: buildUrls(item.url??[])
          },
        }
      }
      playList.list.push(mediaItem_0)
    })
  }
  return playList
}

function buildUrls(mediaUrlList:IMediaUrl[]):Array<ESMediaSource>{
  let list:Array<ESMediaSource> = []
  for (let i = 0; i < mediaUrlList.length; i++) {
    const item = mediaUrlList[i]
    const mItem:ESMediaSource = {uri:item.playUrl,definition:Number(item.definition)??1}
    list.push(mItem)
  }
  return list
}

export function buildPlayRates(rateList: Array<ESPlayerRate>): Array<QTListViewItem>{
  const itemList: Array<QTListViewItem> = []
  if (rateList && rateList.length) {
    for (let i = 0; i < rateList.length; i++) {
      const m = rateList[i]
      const item = buildItemPlayRate(m,i)
      itemList.push(item)
    }
  }
  return itemList
}

export function buildItemPlayRate(rate: ESPlayerRate, index: number):QTListViewItem{
  let name = rate + 'X'
  let decoration: QTListViewItemDecoration = {
    bottom: 20
  }
  return {
    type: 1,
    text: name,
    rate: rate,
    iconState:false,
    decoration: decoration
  }
}

export function getCurRateIndex(rate: ESPlayerRate, rateList: Array<ESPlayerRate>){
  return getCurIndex(rate,rateList)
}

export function buildDefinitions(definitionList: Array<ESPlayerDefinition>): Array<QTListViewItem>{
  const itemList: Array<QTListViewItem> = []
  if (definitionList && definitionList.length) {
    for (let i = 0; i < definitionList.length; i++) {
      const m = definitionList[i]
      const item = buildItemDefinition(m,i)
      itemList.push(item)
    }
  }
  return itemList
}

export function buildItemDefinition(definition: ESPlayerDefinition, index: number): QTListViewItem{
  let definitionName = decodeDefinition(definition)
  let decoration: QTListViewItemDecoration = {
    bottom: 20
  }
  return {
    type: 1,
    text: definitionName,
    iconState:false,
    definition: definition,
    decoration: decoration
  }
}

export function decodeDefinition(definition):string{
  let definitionName = ''
  switch (definition) {
    case ESPlayerDefinition.ES_PLAYER_DEFINITION_SD:
      definitionName = '标清'
      break
    case ESPlayerDefinition.ES_PLAYER_DEFINITION_HD:
      definitionName = '高清'
      break
    case ESPlayerDefinition.ES_PLAYER_DEFINITION_FULL_HD:
      definitionName = '超清'
      break
    case ESPlayerDefinition.ES_PLAYER_DEFINITION_ORIGINAL:
      definitionName = '原画'
      break
    case ESPlayerDefinition.ES_PLAYER_DEFINITION_BLUERAY:
      definitionName = '蓝光'
      break
    case ESPlayerDefinition.ES_PLAYER_DEFINITION_FOURK:
      definitionName = '4K'
      break
    case ESPlayerDefinition.ES_PLAYER_DEFINITION_2K:
      definitionName = '2K'
      break
  }
  return definitionName
}

export function encodeDefinition(definition:number=0){
  let resultDefinition = ESPlayerDefinition.ES_PLAYER_DEFINITION_UNKNOWN
  switch (definition) {
    case 0:
      resultDefinition = ESPlayerDefinition.ES_PLAYER_DEFINITION_SD
      break
    case 1:
      resultDefinition = ESPlayerDefinition.ES_PLAYER_DEFINITION_HD
      break
    case 2:
      resultDefinition = ESPlayerDefinition.ES_PLAYER_DEFINITION_FULL_HD
      break
    case 3:
      resultDefinition = ESPlayerDefinition.ES_PLAYER_DEFINITION_FOURK
      break
  }
  return resultDefinition
}
export function getCurDefinitionIndex(definition: ESPlayerDefinition, definitionList: Array<ESPlayerDefinition>): number {
  return getCurIndex(definition,definitionList)
}

export function buildModes(modeList: Array<ESPlayerPlayMode>): Array<QTListViewItem> {
  const itemList: Array<QTListViewItem> = []
  if (modeList && modeList.length) {
    for (let i = 0; i < modeList.length; i++) {
      const m = modeList[i]
      const item = buildItemMode(m, i)
      itemList.push(item)
    }
  }
  return itemList
}

export function buildItemMode(mode: ESPlayerPlayMode, index: number): QTListViewItem {
  let modeName = ''
  switch (mode) {
    case ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ONCE:
      modeName = '单次播放'
      break
    case ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_ORDER:
      modeName = '顺序播放'
      break
    case ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_SHUFFLE:
      modeName = '随机播放'
      break
    case ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_REPEAT:
      modeName = '单片循环'
      break
    case ESPlayerPlayMode.ES_PLAYER_PLAY_MODE_LOOP:
      modeName = '自动连播'
      break
  }
  let decoration: QTListViewItemDecoration = {
    bottom: 16
  }
  return {
    type: 1,
    text: modeName,
    iconState:false,
    mode: mode,
    decoration: decoration
  }
}

export function getCurModeIndex(mode: ESPlayerPlayMode, modeList: Array<ESPlayerPlayMode>): number {
  return getCurIndex(mode,modeList)
}

function getCurIndex(item:any,list:Array<any>){
  for (let i = 0; i < list.length; i++) {
    const m = list[i]
    if (item == m) {
      return i
    }
  }
  return -1
}

