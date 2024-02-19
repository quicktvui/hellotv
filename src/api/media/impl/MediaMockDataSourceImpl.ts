import {ESApp} from "@extscreen/es3-vue";
import {RequestManager} from "../../request/RequestManager";
import {MediaDataSourceKey} from "../../UseApi";
import {IMediaDataSource} from "../IMediaDataSource";
import {IMedia} from "../IMedia";
import {buildMedia, buildMediaList} from "./MediaDataAdapter";
import {IMediaUrl} from "../IMediaUrl";
import {IMediaAuthorization} from "../IMediaAuthorization";
import {
  MEDIA_1703598812798386177_MOCK_DATA,
} from "../mock/media_detail_1703598812798386177";
import {
  MEDIA_1745001057714049026_MOCK_DATA,
} from "../mock/media_detail_1745001057714049026";

export function createMediaMockDataSource(): IMediaDataSource {
  const mediaDetailDataMap = new Map()

  let mediaDetail

  let requestManager: RequestManager

  function init(...params: any[]): Promise<any> {
    requestManager = params[0]
    //1.----------------------------富滇风云-----------------------------------
    mediaDetailDataMap.set('1703598812798386177', MEDIA_1703598812798386177_MOCK_DATA)
    //2.----------------------------微生物的世界-----------------------------------
    mediaDetailDataMap.set('1745001057714049026', MEDIA_1745001057714049026_MOCK_DATA)
    return Promise.resolve()
  }

  function getMediaDetail(mediaId: string): Promise<IMedia> {
    mediaDetail = mediaDetailDataMap.get(mediaId);
    return Promise.resolve(buildMedia(mediaDetail.detail.data))
  }

  function getMediaRecommendation(mediaId: string): Promise<Array<IMedia>> {
    return Promise.resolve(buildMediaList(mediaDetail.recommendation.data))
  }

  function getMediaItemList(mediaItemListId: string, pageNo: number, pageSize: number): Promise<Array<IMedia>> {
    let page = pageNo - 1
    if (page < 0) {
      page = 0
    }
    return Promise.resolve(buildMediaList(mediaDetail.itemList[page].data))
  }

  function getMediaItemUrl(mediaItemId: string): Promise<Array<IMediaUrl>> {
    return Promise.resolve(mediaDetail.playUrl.data)
  }

  function getMediaAuthorization(mediaId: string): Promise<IMediaAuthorization | null | undefined> {
    return Promise.resolve(mediaDetail.authorization.data)
  }

  function getMediaItemAuthorization(mediaItemId: string): Promise<IMediaAuthorization | null | undefined> {
    return Promise.resolve(mediaDetail.itemAuthorization.data)
  }

  return {
    install: function (app: ESApp) {
      const instance = this
      app.provide(MediaDataSourceKey, instance)
    },
    init,
    getMediaDetail,
    getMediaRecommendation,
    getMediaItemList,
    getMediaItemUrl,
    getMediaAuthorization,
    getMediaItemAuthorization
  }
}


