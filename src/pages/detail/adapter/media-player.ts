import { IMedia, IMediaItem, IMediaUrl } from "./interface";
import { ESMediaItem } from "@extscreen/es3-player-manager";
import {
  ESIPlayerInterceptor,
  ESMediaSource,
  ESPlayerDefinition,
  ESPlayerPlayMode, ESPlayerRate,
  ESMediaSourceList,
  ESPlayerInterceptorType,
  ESPlayerInterceptResult
} from "@extscreen/es3-player";
import { DetailApi } from "../../../api/detail/impl-detail";
import { QTCollapse, QTListViewItem } from "@quicktvui/quicktvui3";
import { QTListViewItemDecoration } from "@quicktvui/quicktvui3/dist/src/list-view/core/QTListViewItemDecoration";


//--------------------------------------播放器数据-------------------------------------------------
export function buildMediaList(page: number, mediaList: Array<IMediaItem>, mediaItemInterceptors: Array<ESIPlayerInterceptor>, media?: any): Array<ESMediaItem> {
  const list = mediaList;
  const itemList: Array<ESMediaItem> = []
  if (list && list.length) {
    for (let i = 0; i < list.length; i++) {
      const m = list[i]
      const item = buildMediaItem(page, i, m, mediaItemInterceptors, media)
      itemList.push(item)
    }
  }
  return itemList
}
export function buildMediaItem(page: number, index: number, mediaItem: IMediaItem, mediaItemInterceptors: Array<ESIPlayerInterceptor>, media?: any): ESMediaItem {
  let mediaIndex = Number(page * 10) + Number(index)
  let mItem: ESMediaItem = {
    id: mediaItem.id,
    index: mediaIndex,
    title: mediaItem.title,
    interceptors: mediaItemInterceptors,
    analyzeParams: {
    //   platformId: media.platformId,
      metaId: media.id,
    //   assetLongId: mediaItem.rawData.assetLongId,
      episodeId: mediaItem.id,
      episode: media.episodes,
      assetLongTitle: media.title,
      episodeTitle: mediaItem.subTitle,
      assetLongCoverH: media.cover,
      assetLongCoverV: media.cover
    },
    position: {
      support: (media._prevPlayIndex>=0 && media._prevPlayIndex==mediaIndex) ? true : false,
      position: media.history?.currentPlayTime
    },
    vipType: mediaItem.vipType
  }
  return mItem
}
//build播放器数据
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
//media-player Interceptor 鉴权 + 请求播放地址
export function createESPlayerMediaSourceListInterceptor(detailManager: DetailApi): ESIPlayerInterceptor {
  function intercept(...params: Array<any>): Promise<ESPlayerInterceptResult> {
    const mediaItem = params[0] as ESMediaItem
    console.log(mediaItem,'mediaItemmediaItemmediaItem')
    return new Promise<ESPlayerInterceptResult>(async (resolve, reject) => {
      if(mediaItem.vipType == '0'){
        let mediaUrlList = await detailManager.getPlayUrl(mediaItem.id + "",'2')
        mediaUrlList = [
          {
            definition: 1080,
            playUrl: 'http://qcloudcdn.a311.ottcn.com/channelzero/2024/02/05/110e7a35-1ba3-4d87-a8ea-0f462de40866.mp4'
          }
         ]
        console.log(mediaUrlList, 'getPlayUrlgetPlayUrl')
        let mediaSourceList: ESMediaSourceList = {
          index: -1,
          list: buildMediaSourceList(mediaUrlList)
        }
        let result: ESPlayerInterceptResult = {
          result: {
            mediaSourceList: mediaSourceList,
          }
        }
        resolve(result)
      }else{
        reject({errorCode: -1,errorMessage: '请付费后观看'})
      }
    })
  }

  function release(): void {
  }

  return {
    id: 'ESPlayerMediaSourceListInterceptor',
    type: ESPlayerInterceptorType.ES_PLAYER_INTERCEPTOR_TYPE_MEDIA_ITEM,
    intercept,
    release
  }
}