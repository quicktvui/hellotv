import BuildConfig from "../build/BuildConfig";

// Home请求url
export const tabListUrl = () => BuildConfig.requestBaseUrl
export const tabContentUrl = () => BuildConfig.requestBaseUrl + '?ac=videolist'
export const tabGetPlayUrl = () => BuildConfig.requestBaseUrl + "/v1/zero/recommend/assetdetail/"

// detail请求URL
export const mediaDetailUrl = () => BuildConfig.requestBaseUrl + '?ac=detail'
export const mediaRecommendUrl = () => BuildConfig.requestBaseUrl + '?ac=videolist'
export const episodeListUrl = () => BuildConfig.requestBaseUrl + "/v2/zero/media/assetlong/episodeList/"
export const episodePlayUrlUrl = () => BuildConfig.requestBaseUrl + "/v1/zero/media/assetlong/episode/playUrl/"
export const mediaAuthUrl = () => BuildConfig.requestBaseUrl + "/v2/zero/paid/accountAuth/authAssetLong"
export const episodeAuthUrl = () => BuildConfig.requestBaseUrl + "/v2/zero/paid/accountAuth/authAssetLongEpisode"

// filter请求URL
export const filterEntryUrl = () => BuildConfig.requestBaseUrl + "/v2/zero/tag/search/"
export const filterContentUrl = () => BuildConfig.requestBaseUrl + "/v1/zero/media/assetlong/search/assetlongByTags"

// search请求URL
export const hotSearchUrl = () => BuildConfig.requestBaseUrl + '?ac=list'
export const searchLongUrl = () => BuildConfig.requestBaseUrl + "/v1/zero/media/assetlong/search/assetlongByKeyword"
export const searchBookUrl = () => BuildConfig.requestBaseUrl + "/v1/zero/media/assetlong/search/pictureBookByKeyword"
export const searchShortUrl = () => BuildConfig.requestBaseUrl + "/v1/zero/media/search/assetByKeyword"
// history url
export const urlGetHistory = () => BuildConfig.requestBaseUrl + '/v1/zero/user/playHistory/listUnion'
export const urlGetLongHistory = () => BuildConfig.requestBaseUrl + '/v1/zero/user/playHistory/list'///v1/zero/user/playHistory/get
export const urlGetShortHistory = () => BuildConfig.requestBaseUrl + '/v1/zero/user/playHistory/listShort'
export const urlGetBookHistory = () => BuildConfig.requestBaseUrl + '/v1/zero/user/playHistory/listPicture'
export const urlSaveHistory = () => BuildConfig.requestBaseUrl + '/v1/zero/user/playHistory/save'
export const urlSaveShortHistory = () => BuildConfig.requestBaseUrl + '/v1/zero/user/playHistory/saveShort'

// live
export const defaultSourceUrl = () => BuildConfig.defaultSourceUrl
