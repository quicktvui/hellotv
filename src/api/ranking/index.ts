import { RankBaseApi } from './base'
import { IrankingConfig } from './types'

class RankApi extends RankBaseApi {

  getConfig(): IrankingConfig {
    const dConfig = super.getConfig()
    return dConfig
  }
}

const rankApi = new RankApi()
export default rankApi