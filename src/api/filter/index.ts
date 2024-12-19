import { FilterApi, Filters } from './interface'
import { filterContentsUrl, filterLeftListUrl, replacePlaceholders } from '../request/request-url'
import requestManager from '../request/request-manager'
import config from '../../config/build-config'

class FilterManager implements FilterApi {
  // 获取筛选左侧列表
  getFilters(primaryId: string, secondaryId: string): Promise<Filters> {
    return requestManager.get(
      replacePlaceholders(filterLeftListUrl, {
        packageName: config.packageName,
        primaryId,
        secondaryId
      })
    )
  }

  // 获取筛选内容
  getContents(query?: string, page: number = 1, limit: number = 10): Promise<any> {
    return requestManager.get(
      replacePlaceholders(filterContentsUrl, {
        packageName: config.packageName,
        query,
        page,
        limit
      })
    )
  }
}

const filterManager = new FilterManager()
export default filterManager
