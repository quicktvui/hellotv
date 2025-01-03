import BuildConfig from '../../config/build-config'

/***********首页接口**************/
//导航数据接口
export const tabListUrl = BuildConfig.requestBaseUrl + '/home/tabs?packageName=' //tab
//导航下内容接口
export const tabContentUrl = BuildConfig.requestBaseUrl + '/home/tabs/${id}?packageName=${packageName}&page=${page}&limit=${limit}'

//详情页接口
export const DetailUrl = BuildConfig.requestBaseUrl + '/album/details/'
export const DetailMediaSeriesUrl = BuildConfig.requestBaseUrl + '/album/episodes/'
export const RecommendListUrl = BuildConfig.requestBaseUrl + '/recommendations'
export const playUrl = BuildConfig.requestBaseUrl + '/streams/'
//用户接口

//筛选页接口
export const filterLeftListUrl = BuildConfig.requestBaseUrl + '/filter/${primaryId}/tags?packageName=${packageName}'
export const filterContentsUrl =
  BuildConfig.requestBaseUrl + '/filter/${primaryId}/contents?packageName=${packageName}&query=${query}&page=${page}&limit=${limit}'

//搜索页接口
export const searchSuggestionsUrl = BuildConfig.requestBaseUrl + '/search/suggestions?packageName=${packageName}&type=${type}'
export const searchContentsUrl =
  BuildConfig.requestBaseUrl + '/search?packageName=${packageName}&query=${query}&page=${page}&limit=${limit}'

export function replacePlaceholders(template, replacements): string {
  return template.replace(/\$\{(\w+)\}/g, (match, placeholder) => {
    return replacements[placeholder] || '' // 如果替换项不存在，则返回空字符串
  })
}
