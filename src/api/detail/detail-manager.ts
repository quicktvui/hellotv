import requestManager from '../request/request-manager'
import BuildConfig from "../../config/build-config"
import { DetailUrl, DetailMediaSeriesUrl, RecommendListUrl, playUrl } from '../request/request-url'
import { DetailApi } from './impl-detail'
import { IMedia, IMediaItem, IRecommendItem } from '../../pages/detail/adapter/interface'


class DetailManager implements DetailApi{

  getMediaDetail(id:string):Promise<IMedia>{
    const url = `${DetailUrl}${id}?packageName=${BuildConfig.packageName}`
    return requestManager.get(url).then((res: any) => {
      const media: IMedia = res
      return Promise.resolve(media)
    })
  }

  getMediaSeriesList(id:string, page: number, limit: number):Promise<Array<IMediaItem>>{
    const url = `${DetailMediaSeriesUrl}${id}?packageName=${BuildConfig.packageName}&page=${page}&limit=${limit}`
    return requestManager.get(url).then((res: any) => {
      const mediaSeriesList: Array<IMediaItem> = res.items
      return Promise.resolve(mediaSeriesList)
    })
  }

  getRecommendList(id:string):Promise<Array<IRecommendItem>>{
    const url = `${RecommendListUrl}?packageName=${BuildConfig.packageName}&id=${id}&page=1&limit=12`
    return requestManager.get(url).then((res: any) => {
      const recommendist: Array<IRecommendItem> = res.items
      return Promise.resolve(recommendist)
    })
  }

  getPlayUrl(id:string, type: string):Promise<any>{
    const url = `${playUrl}${id}?packageName=${BuildConfig.packageName}&type=${type}`
    return requestManager.get(url).then((res: any) => {
      return Promise.resolve(res)
    })
  }

}

const detailManager = new DetailManager()
export default detailManager
