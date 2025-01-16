import requestManager from '../../../tools/request'
import BuildConfig from "../../../config/build-config"
import { DetailUrl, DetailMediaSeriesUrl, RecommendListUrl, 
  PlayUrl, RecordsUrl } from './request-url'
import { IMedia, IMediaItem, IRecommendItem, DetailApi} from '../adapter/interface'


class DetailManager implements DetailApi{
  //获取详情页数据
  getMediaDetail(id:string):Promise<IMedia>{
    const url = `${DetailUrl}${id}?packageName=${BuildConfig.packageName}`
    return requestManager.get(url).then((res: any) => {
      const media: IMedia = res
      return Promise.resolve(media)
    })
  }
  //获取详情页选集列表
  getMediaSeriesList(id:string, page: number, limit: number):Promise<Array<IMediaItem>>{
    const url = `${DetailMediaSeriesUrl}${id}?packageName=${BuildConfig.packageName}&page=${page}&limit=${limit}`
    return requestManager.get(url).then((res: any) => {
      const mediaSeriesList: Array<IMediaItem> = res.items
      return Promise.resolve(mediaSeriesList)
    })
  }
  //获取详情页推荐列表
  getRecommendList(id:string):Promise<Array<IRecommendItem>>{
    const url = `${RecommendListUrl}?packageName=${BuildConfig.packageName}&id=${id}&page=1&limit=12`
    return requestManager.get(url).then((res: any) => {
      const recommendist: Array<IRecommendItem> = res.items
      return Promise.resolve(recommendist)
    })
  }
  //获取播放地址
  getPlayUrl(id:string, type: string):Promise<any>{
    const url = `${PlayUrl}${id}?packageName=${BuildConfig.packageName}&type=${type}`
    return requestManager.get(url).then((res: any) => {
      return Promise.resolve(res)
    })
  }
  //获取历史/收藏 数据
  getRecordData(id:string, deviceId: string, type: string):Promise<any>{
    const url = `${RecordsUrl}/${id}?packageName=${BuildConfig.packageName}&deviceId=${deviceId}&recordType=${type}`
    return requestManager.get(url).then((res: any) => {
      return Promise.resolve(res)
    })
  }
  //上报历史/收藏
  reportRecordData(data: any):Promise<any>{
    const url = `${RecordsUrl}?packageName=${BuildConfig.packageName}`
    return requestManager.post(url,data).then((res: any) => {
      return Promise.resolve(res)
    })
  }
  //删除历史/收藏
  deleteRecordData(id:string, deviceId: string, type: string):Promise<any>{
    const url = `${RecordsUrl}/${deviceId}?recordId=${id}&recordType=${type}`
    return requestManager.delete(url).then((res: any) => {
      return Promise.resolve(res)
    })
  }
}

const detailManager = new DetailManager()
export default detailManager
