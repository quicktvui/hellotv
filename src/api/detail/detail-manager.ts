import requestManager from '../request/request-manager'
import BuildConfig from "../../config/build-config"
import { DetailUrl, DetailMediaSeriesUrl, RecommendListUrl } from '../request/request-url'
import { DetailApi } from './impl-detail'
import { IMedia, IMediaSeriesItem, IRecommendItem } from '../../pages/detail/adapter/interface'


class DetailManager implements DetailApi{

  getMediaDetail(id:string):Promise<IMedia>{
    let url = `${DetailUrl}${id}?packageName=${BuildConfig.packageName}`
    return requestManager.get(url).then((res: any) => {
      let media: IMedia = res
      return Promise.resolve(media)
    })
  }

  getMediaSeriesList(id:string, page: number, limit: number):Promise<Array<IMediaSeriesItem>>{
    let url = `${DetailMediaSeriesUrl}${id}?packageName=${BuildConfig.packageName}&page=${page}&limit=${limit}`
    return requestManager.get(url).then((res: any) => {
      let mediaSeriesList: Array<IMediaSeriesItem> = res.items
      return Promise.resolve(mediaSeriesList)
    })
  }

  getRecommendList(id:string):Promise<Array<IRecommendItem>>{
    let url = `${RecommendListUrl}?packageName=${BuildConfig.packageName}&id=${id}&page=1&limit=12`
    return requestManager.get(url).then((res: any) => {
      let recommendist: Array<IRecommendItem> = res.items
      return Promise.resolve(recommendist)
    })
  }

}

const detailManager = new DetailManager()
export default detailManager
