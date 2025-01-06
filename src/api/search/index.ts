import { Contents, Recommends, SearchApi, Suggestions } from './interface'
import { searchSuggestionsUrl, searchContentsUrl, replacePlaceholders, searchHotRecommendUrl } from '../request/request-url'
import requestManager from '../request/request-manager'
import config from '../../config/build-config'

class SearchManager implements SearchApi {
  // 获取搜索建议
  getSuggestions(type: 'hot' | 'guess' | 'all', keyword?: string, page: number = 1, limit: number = 10): Promise<Suggestions> {
    return requestManager.get(
      replacePlaceholders(searchSuggestionsUrl, {
        packageName: config.packageName,
        type,
        keyword,
        page,
        limit
      })
    )
  }

  // 获取搜索内容
  getContents(query?: string, page: number = 1, limit: number = 10): Promise<Contents> {
    return requestManager.get(
      replacePlaceholders(searchContentsUrl, {
        packageName: config.packageName,
        query,
        page,
        limit
      })
    )
  }

  // 获取热门推荐
  getHotRecommends(page?: number, limit?: number): Promise<Recommends> {
    return requestManager.get(
      replacePlaceholders(searchHotRecommendUrl, {
        packageName: config.packageName,
        page,
        limit
      })
    )
  }
}

const searchManager = new SearchManager()
export default searchManager
