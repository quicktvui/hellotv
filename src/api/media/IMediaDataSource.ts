import { ESApp } from "@extscreen/es3-vue";
import { IMedia } from "./IMedia";
import { IMediaUrl } from "./IMediaUrl";
import { IMediaAuthorization } from "./IMediaAuthorization";

export interface IMediaDataSource {

    install(app: ESApp): void

    init(...params: any[]): Promise<any>

    getMediaDetail(mediaId: string): Promise<IMedia | null | undefined>

    getMediaRecommendation(tabId: string): Promise<Array<IMedia>>

    getMediaItemList(mediaItemListId: string, pageNo: number, pageSize: number, media?: IMedia): Promise<Array<IMedia>>

    getMediaItemUrl(mediaItemId: string): Promise<Array<IMediaUrl>>

    getMediaAuthorization(mediaId: string): Promise<IMediaAuthorization | null | undefined>

    getMediaItemAuthorization(mediaItemId: string): Promise<IMediaAuthorization | null | undefined>
}

