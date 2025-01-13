import BuildConfig from '../../../config/build-config'

export const filterLeftListUrl = BuildConfig.requestBaseUrl + '/filter/${primaryId}/tags?packageName=${packageName}'
export const filterContentsUrl =
  BuildConfig.requestBaseUrl + '/filter/${primaryId}/contents?packageName=${packageName}&query=${query}&page=${page}&limit=${limit}'
