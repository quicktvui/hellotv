import {
  ESIPlayerInterceptor, ESMediaSourceList,
  ESPlayerInterceptorType,
  ESPlayerInterceptResult
} from "@extscreen/es3-player"
import { ESMediaItem } from "@extscreen/es3-player-manager"
import { IGlobalApi } from "../../../api/IGlobalApi"
import { encodeDefinition } from "../../../components/media/adapter/ControlDataAdapter"

export function createESHomeBGPlayerMediaInterceptor(globalApi:IGlobalApi): ESIPlayerInterceptor{
 async function intercept(...params:Array<any>):Promise<ESPlayerInterceptResult>{
    const mediaItem = params[0] as ESMediaItem
    const id:string  = mediaItem.id+""
    let playerUrl = await globalApi.getHomeBgVideoAssetsUrl(id)
   let mediaSourceList: ESMediaSourceList = {
     index: 0,
     list: [{
       uri: playerUrl.url,
       definition:playerUrl.definition ?? encodeDefinition()
     }]
   }
   let result: ESPlayerInterceptResult = {
     result: {
       mediaSourceList: mediaSourceList
     }
   }
   return Promise.resolve(result)
  }

  function release(): void {
  }

  return {
    id:"homeBGPlayerMediaInterceptor",
    type:ESPlayerInterceptorType.ES_PLAYER_INTERCEPTOR_TYPE_MEDIA_ITEM,
    intercept,
    release
  }
}
