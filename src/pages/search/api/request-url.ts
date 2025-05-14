import BuildConfig from '../../../config/build-config'

export const searchHistoryUrl = BuildConfig.requestBaseUrl + '/search/history'
export const searchSuggestionsUrl =
  BuildConfig.requestBaseUrl + '/search/suggestions?packageName=${packageName}&type=${type}&keyword=${keyword}&page=${page}&limit=${limit}'
export const searchContentsUrl =
  BuildConfig.requestBaseUrl + '/search?packageName=${packageName}&query=${query}&page=${page}&limit=${limit}'
export const searchHotRecommendUrl = BuildConfig.requestBaseUrl + '/recommendations?packageName=${packageName}&page=${page}&limit=${limit}'

export const searchTabsUrl = BuildConfig.requestBaseUrl + '/search/tabs?packageName=${packageName}&query=${query}'

export const searchTabContentsUrl =
  BuildConfig.requestBaseUrl + '/search/tabs/${tabId}?packageName=${packageName}&query=${query}&page=${page}&limit=${limit}'
