
import { IDetailInfo } from '../../pages/detail/build-data/interface/index'

export interface DetailApi {
  /**
   * 获取详情页专辑数据
   */
  getMediaDetail(id:string): Promise<IDetailInfo>

 

}
