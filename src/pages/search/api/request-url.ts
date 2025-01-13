import BuildConfig from '../../../config/build-config'

export const searchSuggestionsUrl =
  BuildConfig.requestBaseUrl + '/search/suggestions?packageName=${packageName}&type=${type}&keyword=${keyword}&page=${page}&limit=${limit}'
export const searchContentsUrl =
  BuildConfig.requestBaseUrl + '/search?packageName=${packageName}&query=${query}&page=${page}&limit=${limit}'
export const searchHotRecommendUrl = BuildConfig.requestBaseUrl + '/recommendations?packageName=${packageName}&page=${page}&limit=${limit}'
