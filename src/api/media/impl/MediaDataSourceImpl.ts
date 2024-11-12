import { ESApp } from "@extscreen/es3-vue"
import requestManager from "../../request/request-manager"
import { MediaDataSourceKey } from "../../UseApi"
import { IMediaDataSource } from "../IMediaDataSource"
import { IMedia } from "../IMedia"
import { buildMedia, buildMediaAuthorization, buildMediaList } from "./MediaDataAdapter"
import { Media } from "./Media"
import { IMediaUrl } from "../IMediaUrl"
import { IMediaAuthorization } from "../IMediaAuthorization"
import {
  episodeAuthUrl,
  episodeListUrl, episodePlayUrlUrl, mediaAuthUrl,
  mediaDetailUrl,
  mediaRecommendUrl
} from "../../RequestUrl"
import { MediaAuthorization } from "./MediaAuthorization"

export function createMediaDataSource(): IMediaDataSource {

  function init(...params: any[]): Promise<any> {
    return Promise.resolve()
  }

  function getMediaDetail(mediaId: string): Promise<IMedia> {
    return requestManager.post(mediaDetailUrl + mediaId, {})
      .then((media: Media) => buildMedia(media))
  }

  function getMediaRecommendation(mediaId: string): Promise<Array<IMedia>> {
    return requestManager.post(mediaRecommendUrl + mediaId, {})
      .then((mediaList: Array<Media>) => buildMediaList(mediaList))
  }

  function getMediaItemList(mediaItemListId: string, pageNo: number, pageSize: number): Promise<Array<IMedia>> {
    return requestManager.post(episodeListUrl + mediaItemListId, {
      "action": "detail",
      "param": {
        "pageNo": Number(pageNo + 1),
        "pageSize": pageSize
      }
    }).then((mediaList: Array<Media>) => buildMediaList(mediaList))
  }

  function getMediaItemUrl(mediaItemId: string): Promise<Array<IMediaUrl>> {
    return requestManager.post(episodePlayUrlUrl + mediaItemId, {})
  }

  function getMediaAuthorization(mediaId: string): Promise<IMediaAuthorization | null | undefined> {
    return requestManager.post(mediaAuthUrl, {
      "data": mediaId
    }).then((authorization: MediaAuthorization) => buildMediaAuthorization(authorization))
  }

  function getMediaItemAuthorization(mediaItemId: string): Promise<IMediaAuthorization | null | undefined> {
    return requestManager.post(episodeAuthUrl, {
      "data": mediaItemId
    }).then((authorization: MediaAuthorization) => buildMediaAuthorization(authorization))
  }

  return {
    install: function(app: ESApp) {
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


