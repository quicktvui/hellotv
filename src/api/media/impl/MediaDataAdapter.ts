import { IMedia } from "../IMedia";
import { Media } from "./Media";
import { IMediaAuthorization } from "../IMediaAuthorization";
import { MediaAuthorization } from "./MediaAuthorization";
import { IMediaAuthType } from "../IMediaAuthType";

export function buildMedia(media: Media): IMedia {
    let m: IMedia = {
        id: media.vod_id,
        title: media.vod_name,

        type: '1',
        tags: media.vod_tag,
        //
        coverH: media.vod_pic,
        coverV: '',
        directors: media.vod_director,

        //
        language: media.vod_lang,
        releaseDate: media.vod_time,
        licenceNum: '0',
        //
        subtitle: media.vod_sub,
        actors: media.vod_actor,
        introduction: media.vod_content,

        score: media.vod_score,

        itemList: {
            id: media.vod_id,
            title: media.vod_name,
            count: 1,
            type: 1,
            enable: false
        },
        //
        itemListId: media.vod_id,
        // 分集的总数
        itemListCount: 1,
        // 权益类型
        authType: IMediaAuthType.MEDIA_AUTH_TYPE_FREE,
        // 播放地址
        playUrl: media.vod_play_url
    }
    return m
}

export function buildMediaList(mediaList: Array<Media>): Array<IMedia> {
    const medias: Array<IMedia> = []
    for (let i = 0; i < mediaList.length; i++) {
        const m = mediaList[i]
        medias.push(buildMedia(m))
    }
    return medias
}

export function buildMediaAuthorization(authorization: MediaAuthorization): IMediaAuthorization {
    let mediaType = IMediaAuthType.MEDIA_AUTH_TYPE_VIP
    if (authorization.typeCode == 'FREE') {
        mediaType = IMediaAuthType.MEDIA_AUTH_TYPE_FREE
    }

    let auth: IMediaAuthorization = {
        id: authorization.assetLongId,
        auth: authorization.auth,
        payType: authorization.payType,
        type: mediaType,
        typeName: authorization.typeName,
    }
    return auth
}
