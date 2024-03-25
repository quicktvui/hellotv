import { ESApp } from "@extscreen/es3-vue";
import { RequestManager } from "../../request/RequestManager";
import { MediaDataSourceKey } from "../../UseApi";
import { IMediaDataSource } from "../IMediaDataSource";
import { IMedia } from "../IMedia";
import { buildMedia, buildMediaList } from "./MediaDataAdapter";
import { Media } from "./Media";
import { IMediaUrl } from "../IMediaUrl";
import { IMediaAuthorization } from "../IMediaAuthorization";
import {
    episodeAuthUrl,
    episodeListUrl, episodePlayUrlUrl, mediaAuthUrl,
    mediaDetailUrl,
    mediaRecommendUrl
} from "../../RequestUrl";

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

    function getMediaRecommendation(mediaId: string, tabId: string): Promise<any> {
        return requestManager.cmsGet(mediaRecommendUrl + `?ids=${mediaId}&t=${tabId}`)
            .then(async (result: any) => {

                // 补充详情数据
                let ids: string[] = []
                result.list?.map((item: any) => ids.push(item.vod_id))
                if (ids.length > 0) {
                    result.details = await getMediaDetails(ids.join(','), 1)
                }

                return buildMediaList(result.list, result.details)
            })
    }

    function getMediaItemList(mediaItemListId: string, pageNo: number, pageSize: number, media?: IMedia): Promise<Array<IMedia>> {
        if (media) {
            return Promise.resolve([media])
        }

        return requestManager.post(episodeListUrl + mediaItemListId, {
            'action': 'detail',
            'param': {
                "pageNo": Number(pageNo + 1),
                "pageSize": pageSize,
            }
        }).then((mediaList: Array<Media>) => buildMediaList(mediaList))
    }

    function getMediaItemUrl(mediaItemId: string): Promise<Array<IMediaUrl>> {
        return requestManager.post(episodePlayUrlUrl + mediaItemId, {})
    }

    function getMediaAuthorization(mediaId: string): Promise<IMediaAuthorization | null | undefined> {
        return requestManager.post(mediaAuthUrl, {
            'data': mediaId
        })
    }

    function getMediaItemAuthorization(mediaItemId: string): Promise<IMediaAuthorization | null | undefined> {
        return requestManager.post(episodeAuthUrl, {
            'data': mediaItemId
        })
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


