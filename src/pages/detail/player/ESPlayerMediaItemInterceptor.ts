import {
  ESIPlayerInterceptor,
  ESMediaSourceList,
  ESPlayerInterceptorType,
  ESPlayerInterceptResult
} from "@extscreen/es3-player";
import {ESMediaItem} from "@extscreen/es3-player-manager";
import {IMediaDataSource} from "../../../api/media/IMediaDataSource";
import {buildMediaSourceList} from "../adapter/PlayerDataAdapter";
import {MEDIA_PLAYER_ERROR_AUTH} from "../component/IMediaPlayerErrors";

/**
 * 播放媒资分集鉴权
 */
export function createESPlayerMediaItemAuthInterceptor(dataSource: IMediaDataSource): ESIPlayerInterceptor {

  function intercept(...params: Array<any>): Promise<ESPlayerInterceptResult> {
    const mediaItem = params[0] as ESMediaItem
    return new Promise<ESPlayerInterceptResult>((resolve, reject) => {
      dataSource.getMediaItemAuthorization(mediaItem.id + "")
        .then((mediaAuthorization) => {
          if (mediaAuthorization && mediaAuthorization.auth) {
            let result: ESPlayerInterceptResult = {
              result: {
                authorization: mediaAuthorization,
              }
            }
            resolve(result)
          } else {
            reject({
              errorCode: MEDIA_PLAYER_ERROR_AUTH,
              errorMessage: '鉴权失败'
            })
          }
        }, error => {
          reject({
            errorCode: MEDIA_PLAYER_ERROR_AUTH,
            errorMessage: '鉴权失败'
          })
        })
    })
  }

  function release(): void {
  }

  return {
    id: 'ESPlayerMediaItemAuthInterceptor',
    type: ESPlayerInterceptorType.ES_PLAYER_INTERCEPTOR_TYPE_MEDIA_ITEM,
    intercept,
    release
  }
}


/**
 * 请求解析地址
 */
export function createESPlayerMediaSourceListInterceptor(dataSource: IMediaDataSource): ESIPlayerInterceptor {

  function intercept(...params: Array<any>): Promise<ESPlayerInterceptResult> {
    const mediaItem = params[0] as ESMediaItem
    return new Promise<ESPlayerInterceptResult>((resolve, reject) => {
      dataSource.getMediaItemUrl(mediaItem.id + "")
        .then((mediaUrlList) => {
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
        }, error => {
          reject(error)
        })
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
