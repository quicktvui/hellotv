
import { IMedia, IMediaSeriesItem, IRecommendItem } from '../../pages/detail/adapter/interface'

export interface DetailApi {
  /**
   * 获取详情页详情数据
   */
  getMediaDetail(id:string): Promise<IMedia>
  
  /**
   * 获取详情页选集列表
   */
  getMediaSeriesList(id:string, page: number, limit: number): Promise<Array<IMediaSeriesItem>>

  /**
   * 获取相关推荐数据
   */
  getRecommendList(id:string): Promise<Array<IRecommendItem>>

}
