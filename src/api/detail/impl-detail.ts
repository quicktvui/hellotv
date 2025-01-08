
import { IMedia, IMediaItem, IRecommendItem } from '../../pages/detail/adapter/interface'

export interface DetailApi {
  /**
   * 获取详情页详情数据
   */
  getMediaDetail(id:string): Promise<IMedia>
  /**
   * 获取详情页选集列表
   */
  getMediaSeriesList(id:string, page: number, limit: number): Promise<Array<IMediaItem>>
  /**
   * 获取相关推荐数据
   */
  getRecommendList(id:string): Promise<Array<IRecommendItem>>
  /**
   * 获取详情页播放请求地址
   */
  getPlayUrl(id: string, type: string): Promise<any>
  /**
   * 获取历史/收藏 数据
   */
  getRecordData(id:string, deviceId: string, type: string):Promise<any>
  /**
   * 上报历史/收藏
   */
  reportRecordData(data: any):Promise<any>
  /**
   * 删除历史/收藏
   */
  deleteRecordData(id:string, deviceId: string, type: string):Promise<any>
}
