import requestManager from '../request/request-manager'
import { mediaDetailUrl } from '../request/request-url'
import { IMedia } from './impl-detail'


class DetailManager {

  getMediaDetail(mediaId:string):Promise<IMedia>{
    return requestManager.post(mediaDetailUrl+mediaId,{})
  }

}

const detailManager = new DetailManager()
export default detailManager
