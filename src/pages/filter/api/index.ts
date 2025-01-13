import { FilterApi, Filters } from '../adapter/interface'
import { filterContentsUrl, filterLeftListUrl } from './request-url'
import requestManager from '../../../tools/request/request-manager'
import config from '../../../config/build-config'
import {replacePlaceholders} from '../../../tools/common'


class FilterManager implements FilterApi {
  // 获取筛选左侧列表
  getFilters(primaryId: string): Promise<Filters> {
    return requestManager.get(
      replacePlaceholders(filterLeftListUrl, {
        packageName: config.packageName,
        primaryId
      })
    )
  }

  // 获取筛选内容
  getContents(primaryId: string, query?: string, page: number = 1, limit: number = 10): Promise<any> {
    return requestManager.get(
      replacePlaceholders(filterContentsUrl, {
        packageName: config.packageName,
        primaryId,
        query,
        page,
        limit
      })
    )
  }
}

const filterManager = new FilterManager()
export default filterManager
