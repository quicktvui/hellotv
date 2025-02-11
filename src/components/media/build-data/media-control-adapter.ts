import {
  ESIPlayerInterceptor, ESMediaSource,
  ESPlayerDefinition,
  ESPlayerPlayMode,
  ESPlayerRate
} from '@extscreen/es3-player'
import { ESMediaItem, ESMediaItemList } from '@extscreen/es3-player-manager'
import { Native } from '@extscreen/es3-vue'
import { QTListViewItem } from '@quicktvui/quicktvui3'
import { QTListViewItemDecoration } from '@quicktvui/quicktvui3/dist/src/list-view/core/QTListViewItemDecoration'
import { IMediaList, IMediaMenu, IMediaUrl, PlayMenuNameFlag } from './media-imp'
import xuanJiNormal from '../../../assets/component-media/ic_media_menu_xuanji_normal.png'
import xuanJiFocused from '../../../assets/component-media/ic_media_menu_xuanji_focused.png'
import settingNormal from '../../../assets/component-media/ic_media_menu_setting_normal.png'
import settingFocused from '../../../assets/component-media/ic_media_menu_setting_focused.png'

/**
 * 当前 View 中：速率，清晰度，播放模式都是在 底部菜单获取焦点后才创建
 * 阶梯加载 界面 node
 */
export enum IMediaViewState {
  //整体 view 显示隐藏状态
  STATE_MANAGER_VIEW_DISMISS = 0,
  STATE_MANAGER_VIEW_SHOW = 1,
  //速率 view 显示隐藏状态
  STATE_MENU_RATE_VIEW_DISMISS = 2,
  STATE_MENU_RATE_VIEW_SHOW = 3,
  //清晰度 view 显示隐藏状态
  STATE_MENU_DEFINITION_VIEW_DISMISS = 4,
  STATE_MENU_DEFINITION_VIEW_SHOW = 5,
  //播放模式 view 显示隐藏状态
  STATE_MENU_MODE_VIEW_DISMISS = 6,
  STATE_MENU_MODE_VIEW_SHOW = 7,
  // 进度条 seek 开始结束状态
  STATE_SEEK_BAR_START = 8,
  STATE_SEEK_BAR_END = 9,
  //试看提示展示
  STATE_TRY_SEE_SHOW = 10,
  STATE_TRY_SEE_DISMISS = 11
}

export function s_to_hs(s) {
  //计算分钟
  //算法：将秒数除以60，然后下舍入，既得到分钟数
  let h
  h = Math.floor(s / 60)
  //计算秒
  //算法：取得秒%60的余数，既得到秒数
  s = s % 60
  //将变量转换为字符串
  h += ''
  s += ''
  //如果只有一位数，前面增加一个0
  h = (h.length == 1) ? '0' + h : h
  s = (s.length == 1) ? '0' + s : s
  return h + ':' + s
}

/**
 * 初始化菜单列表
 */
export const initDefaultMenuList = (): Array<IMediaMenu> => [
  // {type:2,nameFlag:PlayMenuNameFlag.COLLECT,iconNormal:noCollectNormal,iconFocus:noCollectFocus,name:'收藏',decoration:{right:30},style:{width:menuWidth,height:72}},
  {
    type: 2,
    nameFlag: PlayMenuNameFlag.EPISODES,
    icon: {
      normal: 'file://'+xuanJiNormal,
      focused: 'file://'+xuanJiFocused
    },
    name: '选集',
    decoration: { right: 30 },
    style: { width: 170, height: 72 }
  },
  { type: 1, nameFlag: PlayMenuNameFlag.RATE, name: '倍速 1.0x', decoration: { right: 30 } },
  {
    type: 2, nameFlag: PlayMenuNameFlag.SETTING,
    icon: {
      normal: 'file://'+settingNormal,
      focused: 'file://'+settingFocused
    },
    name: '设置', style: { width: 170, height: 72 }
  }
]

/**
 *  build倍速
 * @param rateList
 */
export function buildPlayRates(rateList: Array<ESPlayerRate>): Array<QTListViewItem> {
  const itemList: Array<QTListViewItem> = []
  if (rateList && rateList.length) {
    for (let i = 0; i < rateList.length; i++) {
      const m = rateList[i]
      const item = buildItemPlayRate(m)
      itemList.push(item)
    }
  }
  return itemList
}

export function buildItemPlayRate(rate: ESPlayerRate): QTListViewItem {
  const name = (rate == 1 ? '1.0' : rate) + 'x'
  const decoration: QTListViewItemDecoration = {
    bottom: 20
  }
  return {
    type: 1,
    text: name,
    rate: rate,
    iconState: false,
    decoration: decoration
  }
}

/**
 * build 播放模式
 * @param modeList
 */
export function buildModes(modeList: Array<ESPlayerPlayMode>): Array<QTListViewItem> {
  const itemList: Array<QTListViewItem> = []
  if (modeList && modeList.length) {
    for (let i = 0; i < modeList.length; i++) {
      const m = modeList[i]
      const item = buildItemMode(m)
      itemList.push(item)
    }
  }
  return itemList
}

export function buildItemMode(mode: ESPlayerPlayMode): QTListViewItem {
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
  const decoration: QTListViewItemDecoration = {
    bottom: 16
  }
  return {
    type: 1,
    text: modeName,
    iconState: false,
    mode: mode,
    decoration: decoration
  }
}

export function getCurRateIndex(rate: ESPlayerRate, rateList: Array<ESPlayerRate>) {
  return getCurIndex(rate, rateList)
}

export function getCurModeIndex(mode: ESPlayerPlayMode, modeList: Array<ESPlayerPlayMode>): number {
  return getCurIndex(mode, modeList)
}

export function getCurIndex(item: any, list: Array<any>) {
  for (let i = 0; i < list.length; i++) {
    const m = list[i]
    if (item == m) {
      return i
    }
  }
  return -1
}

export function showNetSpeed() {
  Native.callNative('ESNetworkSpeedModule', 'showNetSpeed')
}

export function stopNetSpeed() {
  Native.callNative('ESNetworkSpeedModule', 'stopNetSpeed')
}

/**
 * build 清晰度
 * @param definitionList
 */
export function buildDefinitions(definitionList: Array<ESPlayerDefinition>): Array<QTListViewItem> {
  const itemList: Array<QTListViewItem> = []
  if (definitionList && definitionList.length) {
    for (let i = 0; i < definitionList.length; i++) {
      const m = definitionList[i]
      const item = buildItemDefinition(m, i)
      itemList.push(item)
    }
  }
  return itemList
}

export function buildItemDefinition(definition: ESPlayerDefinition): QTListViewItem {
  const definitionName = decodeDefinition(definition)
  const decoration: QTListViewItemDecoration = {
    bottom: 20
  }
  return {
    type: 1,
    text: definitionName,
    iconState: false,
    definition: definition,
    decoration: decoration
  }
}

export function decodeDefinition(definition): string {
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

export function encodeDefinition(definition: number = 0) {
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
  return getCurIndex(definition, definitionList)
}

export function buildPlayData(playData: Array<IMediaList>, interceptors?: Array<ESIPlayerInterceptor>): ESMediaItemList {
  const playList: ESMediaItemList = {
    index: 0,
    list: []
  }
  if (playData && playData.length > 0) {
    playData.map((item, index) => {
      const mediaItem_0: ESMediaItem = buildItem(item, index, interceptors)
      playList.list.push(mediaItem_0)
    })
  }
  return playList
}

export function buildMediaItemList(startIndex: number = 0, playDatas: Array<IMediaList>, interceptors?: Array<ESIPlayerInterceptor>): Array<ESMediaItem> {
  const itemList: Array<ESMediaItem> = []
  if (playDatas && playDatas.length > 0) {
    playDatas.map((item, index) => {
      const startP = index + startIndex
      const mediaItem_0: ESMediaItem = buildItem(item, startP, interceptors)
      itemList.push(mediaItem_0)
    })
  }
  return itemList
}

function buildItem(item: IMediaList, index: number, interceptors?: Array<ESIPlayerInterceptor>): ESMediaItem {
  const isRequestUrl = item?.isRequestUrl
  let mediaItem_0: ESMediaItem
  const all = {
    id: item.id,
    type: item.type,
    beforeSid: item?.beforeSid,
    sid: item?.sid,
    nextSid: item?.nextSid,
    index: index,
    title: item?.title,
    subTitle: item?.subTitle,
    albumName: item?.albumName
  }
  if (isRequestUrl) {
    mediaItem_0 = {
      interceptors: interceptors
    }
  } else {
    mediaItem_0 = {
      mediaSourceList: {
        index: 0,
        list: buildUrls(item.url ?? [])
      }
    }
  }
  mediaItem_0 = { ...mediaItem_0, ...all }
  return mediaItem_0
}

function buildUrls(mediaUrlList: IMediaUrl[]): Array<ESMediaSource> {
  const list: Array<ESMediaSource> = []
  for (let i = 0; i < mediaUrlList.length; i++) {
    const item = mediaUrlList[i]
    const mDefinition = item.definition ? Number(item.definition) : 1
    const mItem: ESMediaSource = { uri: item.playUrl, definition: mDefinition }
    list.push(mItem)
  }
  return list
}
