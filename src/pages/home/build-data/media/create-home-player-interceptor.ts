import {
  ESIPlayerInterceptor, ESMediaSourceList,
  ESPlayerInterceptorType,
  ESPlayerInterceptResult
} from '@extscreen/es3-player'
import { ESMediaItem } from '@extscreen/es3-player-manager'
import homeManager from '../../../../api/home/home-manager'
import { encodeDefinition } from '../../../../components/media/build-data/media-control-adapter'

export const createHomePlayerInterceptor = (): ESIPlayerInterceptor => {
  const intercept = async (...params:Array<any>):Promise<ESPlayerInterceptResult> => {
    try {
      const mediaItem = params[0] as ESMediaItem
      const id:string  = mediaItem.id+""
      const type:number = mediaItem.type
      const urls = await homeManager.getHomePlayUrl(id,type)
      if (urls && urls.length>0){
        const mediaSourceList: ESMediaSourceList = {
          index: 0,
          list: [{
            uri: urls[0].playUrl,
            definition:urls[0].definition ?? encodeDefinition()
          }]
        }
        const result: ESPlayerInterceptResult = {
          result: {
            mediaSourceList: mediaSourceList
          }
        }
        return Promise.resolve(result)
      }else{
        return Promise.reject("数据为空")
      }
    }catch (e) {
      return Promise.reject(e)
    }
  }
  const release = ()=>{}
  return {
    id:'homePlayerInterceptor',
    type:ESPlayerInterceptorType.ES_PLAYER_INTERCEPTOR_TYPE_MEDIA_ITEM,
    intercept,
    release
  }
}
