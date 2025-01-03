import { SearchApi, Suggestions } from './interface'
import { searchSuggestionsUrl, searchContentsUrl, replacePlaceholders } from '../request/request-url'
import requestManager from '../request/request-manager'
import config from '../../config/build-config'

class SearchManager implements SearchApi {
  // 获取搜索建议
  getSuggestions(type: 'hot' | 'guess' | 'all'): Promise<Suggestions> {
    return requestManager.get(
      replacePlaceholders(searchSuggestionsUrl, {
        packageName: config.packageName,
        type
      })
    )
  }

  // 获取搜索内容
  getContents(query?: string, page: number = 1, limit: number = 10): Promise<any> {
    return requestManager.get(
      replacePlaceholders(searchContentsUrl, {
        packageName: config.packageName,
        query,
        page,
        limit
      })
    )
  }
}

const searchManager = new SearchManager()
export default searchManager
