import { RequestManager } from "../request/RequestManager";
import {IDetail2Config,IAnyobj} from './types'
import { Detail2Base } from './base'

class Detail2Api extends Detail2Base {

  getConfig(): IDetail2Config {
    const dConfig = super.getConfig()
    // dConfig.isShowTop = false
    return dConfig
  }
}

const detail2Api = new Detail2Api()
export default detail2Api