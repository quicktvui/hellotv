  import BuildConfig from "../build/BuildConfig";

  //Home请求url
  export const tabListUrl = BuildConfig.requestBaseUrl+"/v2/zero/arrange/menu/menuZero" //tab
  export const tabContentUrl = BuildConfig.requestBaseUrl+"/v3/zero/arrange/layoutByMenuCode"
  export const tabGetPlayUrl = BuildConfig.requestBaseUrl+"/v1/zero/recommend/assetdetail/"

  //detail请求URL
  export const mediaDetailUrl = BuildConfig.requestBaseUrl+"/v2/zero/media/assetlong/meta/"
  export const mediaRecommendUrl = BuildConfig.requestBaseUrl+"/v1/zero/media/assetlong/recommend/"
  export const episodeListUrl = BuildConfig.requestBaseUrl+"/v2/zero/media/assetlong/episodeList/"
  export const episodePlayUrlUrl = BuildConfig.requestBaseUrl+"/v1/zero/media/assetlong/episode/playUrl/"
  export const mediaAuthUrl = BuildConfig.requestBaseUrl+"/v2/zero/paid/accountAuth/authAssetLong"
  export const episodeAuthUrl = BuildConfig.requestBaseUrl+"/v2/zero/paid/accountAuth/authAssetLongEpisode"
  //filter请求URL
  export const filterEntryUrl = BuildConfig.requestBaseUrl+"/v2/zero/tag/search/"
  export const filterContentUrl = BuildConfig.requestBaseUrl+"/v1/zero/media/assetlong/search/assetlongByTags"

  //search请求URL
  export const hotSearchUrl=BuildConfig.requestBaseUrl+"/v1/zero/media/assetlong/search/keyword"

