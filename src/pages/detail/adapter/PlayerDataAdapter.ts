import { IMedia } from "../../../api/media/IMedia";
import { ESMediaItem } from "@extscreen/es3-player-manager";
import {
  ESIPlayerInterceptor,
  ESMediaSource,
  ESPlayerDefinition,
  ESPlayerPlayMode, ESPlayerRate
} from "@extscreen/es3-player";
import { IMediaUrl } from "../../../api/media/IMediaUrl";
import { QTCollapse, QTListViewItem } from "@quicktvui/quicktvui3";
import { QTListViewItemDecoration } from "@quicktvui/quicktvui3/dist/src/list-view/core/QTListViewItemDecoration";


//--------------------------------------播放器数据-------------------------------------------------
export function buildMediaItemList(page: number, mediaList: Array<IMedia>, mediaItemInterceptors: Array<ESIPlayerInterceptor>): Array<ESMediaItem> {
  const list = mediaList;
  const itemList: Array<ESMediaItem> = []
  if (list && list.length) {
    for (let i = 0; i < list.length; i++) {
      const m = list[i]
      const item = buildMediaItem(page, i, m, mediaItemInterceptors)
      itemList.push(item)
    }
  }
  return itemList
}

export function buildMediaItem(page: number, index: number, media: IMedia, mediaItemInterceptors: Array<ESIPlayerInterceptor>): ESMediaItem {
  let mediaIndex = Number(page * 10) + Number(index)
  let mediaItem: ESMediaItem = {
    id: media.id,
    index: mediaIndex,
    title: media.title,
    playUrl: media.playUrl,
    interceptors: mediaItemInterceptors,
    position: {
      support: media.id == media.playId,
      position: media.playPosition
    }
  }

  if (media.itemListCount == 1) {
    mediaItem.playId = media.playUrl.split('$')[0]
  }

  return mediaItem
}

//---------------------------------------------------------------------------------------
export function buildMediaSourceList(mediaList: Array<IMediaUrl>): Array<ESMediaSource> {
  const itemList: Array<ESMediaSource> = []
  if (mediaList && mediaList.length) {
    for (let i = 0; i < mediaList.length; i++) {
      const m = mediaList[i]
      const item = buildMediaSource(m)
      itemList.push(item)
    }
  }
  return itemList
}

export function buildMediaSource(mediaUrl: IMediaUrl): ESMediaSource {
  let definition = ESPlayerDefinition.ES_PLAYER_DEFINITION_UNKNOWN
  switch (parseInt(mediaUrl.definition)) {
    case 0:
      definition = ESPlayerDefinition.ES_PLAYER_DEFINITION_SD
      break
    case 1:
      definition = ESPlayerDefinition.ES_PLAYER_DEFINITION_HD
      break
    case 2:
      definition = ESPlayerDefinition.ES_PLAYER_DEFINITION_FULL_HD
      break
    case 3:
      definition = ESPlayerDefinition.ES_PLAYER_DEFINITION_FOURK
      break
  }

  let mediaSource: ESMediaSource = {
    uri: mediaUrl.playUrl,
    definition: definition
  }
  return mediaSource
}

//---------------------------------------菜单------------------------------------------------
export function buildCollapseMenu(mediaListVisible: boolean): QTCollapse {
  const itemList = [
    {
      height: 160,
      collapseHeight: 100
    },
    {
      height: 160,
      collapseHeight: 100
    },
    {
      height: 160,
      collapseHeight: 100
    }
  ]
  let defaultIndex: number = 2
  if (mediaListVisible) {
    defaultIndex = 3
    itemList.push({
      height: 300,
      collapseHeight: 240
    },)
  }

  const collapse: QTCollapse = {
    width: 1920,
    height: 780,
    defaultIndex: defaultIndex,
    itemList: itemList
  }
  return collapse
}

//---------------------------------------播放模式------------------------------------------------

export function getPlayModeIndex(mode: ESPlayerPlayMode, modeList: Array<ESPlayerPlayMode>): number {
  for (let i = 0; i < modeList.length; i++) {
    const m = modeList[i]
    if (mode == m) {
      return i
    }
  }
  return -1
}

export function buildPlayModeList(modeList: Array<ESPlayerPlayMode>): Array<QTListViewItem> {
  const itemList: Array<QTListViewItem> = []
  if (modeList && modeList.length) {
    for (let i = 0; i < modeList.length; i++) {
      const m = modeList[i]
      const item = buildPlayMode(m, i)
      itemList.push(item)
    }
  }
  return itemList
}

export function buildPlayMode(mode: ESPlayerPlayMode, index: number): QTListViewItem {
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
      modeName = '循环播放'
      break
  }
  let decoration: QTListViewItemDecoration = {
    right: 16
  }
  if (index == 0) {
    decoration = {
      left: 90,
      right: 16
    }
  }
  return {
    iconStyle: {
      width: 0,
      height: 0,
    },
    type: 1,
    text: modeName,
    mode: mode,
    decoration: decoration
  }
}

//------------------------------------------清晰度---------------------------------------------

export function getDefinitionIndex(definition: ESPlayerDefinition, definitionList: Array<ESPlayerDefinition>): number {
  for (let i = 0; i < definitionList.length; i++) {
    const m = definitionList[i]
    if (definition == m) {
      return i
    }
  }
  return -1
}

export function buildDefinitionList(definitionList: Array<ESPlayerDefinition>): Array<QTListViewItem> {
  const itemList: Array<QTListViewItem> = []
  if (definitionList && definitionList.length) {
    for (let i = 0; i < definitionList.length; i++) {
      const m = definitionList[i]
      const item = buildDefinition(m, i)
      itemList.push(item)
    }
  }
  return itemList
}

export function buildDefinition(definition: ESPlayerDefinition, index: number): QTListViewItem {
  let name = ''
  switch (definition) {
    case ESPlayerDefinition.ES_PLAYER_DEFINITION_SD:
      name = '标清'
      break
    case ESPlayerDefinition.ES_PLAYER_DEFINITION_HD:
      name = '高清'
      break
    case ESPlayerDefinition.ES_PLAYER_DEFINITION_FULL_HD:
      name = '超清'
      break
    case ESPlayerDefinition.ES_PLAYER_DEFINITION_ORIGINAL:
      name = '原画'
      break
    case ESPlayerDefinition.ES_PLAYER_DEFINITION_BLUERAY:
      name = '蓝光'
      break
    case ESPlayerDefinition.ES_PLAYER_DEFINITION_FOURK:
      name = '4K'
      break
    case ESPlayerDefinition.ES_PLAYER_DEFINITION_2K:
      name = '2K'
      break
  }
  let decoration: QTListViewItemDecoration = {
    right: 16
  }
  if (index == 0) {
    decoration = {
      left: 90,
      right: 16
    }
  }
  return {
    iconStyle: {
      width: 0,
      height: 0,
    },
    type: 1,
    text: name,
    definition: definition,
    decoration: decoration
  }
}


//---------------------------------------倍速------------------------------------------------

export function getPlayRateIndex(rate: ESPlayerRate, rateList: Array<ESPlayerRate>): number {
  for (let i = 0; i < rateList.length; i++) {
    const m = rateList[i]
    if (rate == m) {
      return i
    }
  }
  return -1
}

export function buildPlayRateList(rateList: Array<ESPlayerRate>): Array<QTListViewItem> {
  const itemList: Array<QTListViewItem> = []
  if (rateList && rateList.length) {
    for (let i = 0; i < rateList.length; i++) {
      const m = rateList[i]
      const item = buildPlayRate(m, i)
      itemList.push(item)
    }
  }
  return itemList
}

export function buildPlayRate(rate: ESPlayerRate, index: number): QTListViewItem {
  let name = rate + 'X'
  let decoration: QTListViewItemDecoration = {
    right: 16
  }
  if (index == 0) {
    decoration = {
      left: 90,
      right: 16
    }
  }
  return {
    iconStyle: {
      width: 0,
      height: 0,
    },
    type: 1,
    text: name,
    rate: rate,
    decoration: decoration
  }
}
