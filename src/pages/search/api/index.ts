import requestManager from '../../../tools/request'
import { Contents, Recommends, SearchApi, Suggestions, Tab } from './interface'
import {
  searchSuggestionsUrl,
  searchContentsUrl,
  searchHotRecommendUrl,
  searchTabsUrl,
  searchTabContentsUrl,
  searchHistoryUrl
} from './request-url'
import { replacePlaceholders } from '../../../tools/common'
import config from '../../../config/build-config'

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

  // 添加搜索历史
  addHistory(keyword: string) {
    return requestManager.post(searchHistoryUrl, { query: keyword })
  }

  // 清空搜索历史
  clearHistory() {
    return requestManager.delete(searchHistoryUrl)
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

  // 获取搜索Tab列表
  getTabs(query: string): Promise<Tab[]> {
    return requestManager.get(
      replacePlaceholders(searchTabsUrl, {
        packageName: config.packageName,
        query
      })
    )
  }

  // 获取搜索Tab内容
  getTabContents(query: string, tabId: string, page: number = 1, limit: number = 10): Promise<Contents> {
    return requestManager.get(
      replacePlaceholders(searchTabContentsUrl, {
        packageName: config.packageName,
        query,
        tabId,
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
