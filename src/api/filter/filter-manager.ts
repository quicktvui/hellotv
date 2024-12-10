import BuildConfig from '../../config/build-config'
import requestManager from '../request/request-manager'
import { filterContentsUrl, filterListUrl, replacePlaceholders } from '../request/request-url'
import { FilterApi } from './imp-filter'

class FilterManager implements FilterApi {
  // 获取筛选列表
  async getFilterList(): Promise<any> {
    const replacements = {
      primaryId: '1848555233454727169',
      packageName: BuildConfig.packageName,
      secondaryId: '1848555233454727169'
    }
    const url = replacePlaceholders(filterListUrl, replacements)
    const resp = await requestManager.get(url)
    console.log('huan-xxx-', url, resp)
  }

  // 获取筛选内容
  async getFilterContents(): Promise<any> {
    const replacements = {
      packageName: BuildConfig.packageName,
      page: 1,
      limit: 10
    }
    const url = replacePlaceholders(filterContentsUrl, replacements)
    const resp = await requestManager.get(url)
    console.log('huan-xxx-', url, resp)
  }
}

export const filterManager = new FilterManager()
