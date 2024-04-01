import { ESApp } from "@extscreen/es3-vue"
import { RequestManager } from "../../request/RequestManager"
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

  let requestManager: RequestManager

  function init(...params: any[]): Promise<any> {
    requestManager = params[0]
    return Promise.resolve()
  }
    function getMediaDetail(mediaId: string): Promise<IMedia> {
        return requestManager.cmsGet(mediaDetailUrl + `&ids=${mediaId}`)
            .then((result: any) => buildMedia(result.list[0]))
    }

    function getMediaDetails(ids: string, pageNo: number): Promise<any> {
        return requestManager.cmsGet(mediaDetailUrl + `&ids=${ids}&pg=${pageNo}`)
            .then((result: any) => {
                let details = {}
                result.list?.map((item: any) => details[item.vod_id] = item)
                return details
            })
    }

    function getMediaRecommendation(tabId: string): Promise<any> {
        return requestManager.cmsGet(mediaRecommendUrl + `&t=${tabId}&pagesize=100`)
            .then((result: any) => {
                let medias: Media[] = []
                for (let i = 0; i < 12; i++) {
                    const index = Math.floor(Math.random() * result.list?.length)
                    medias.push(result.list[index])
                }
                return buildMediaList(medias)
            })
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


