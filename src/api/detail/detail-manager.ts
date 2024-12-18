import requestManager from '../request/request-manager'
import BuildConfig from "../../config/build-config"
import { DetailUrl } from '../request/request-url'
import { DetailApi } from './impl-detail'
import { IDetailInfo } from '../../pages/detail/build-data/interface/index'


class DetailManager implements DetailApi{

  getMediaDetail(id:string):Promise<IDetailInfo>{
    let url = `${DetailUrl}${id}?packageName=${BuildConfig.packageName}`
    return requestManager.get(url).then((res: any) => {
      let detailInfo: IDetailInfo = res
      return Promise.resolve(detailInfo)
    })
  }

}

const detailManager = new DetailManager()
export default detailManager
