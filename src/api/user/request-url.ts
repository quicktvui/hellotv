import BuildConfig from '../../config/build-config'

export const userInfoUrl = BuildConfig.requestBaseUrl + '/v2/zero/user/device/isLogin'
export const getUserAccountList = BuildConfig.requestBaseUrl + '/v1/zero/paid/accountAuth/getUserAccountList'

export const urlGetLongHistory = BuildConfig.requestBaseUrl + '/v1/zero/user/playHistory/list'
export const urlGetAgreementConfig = BuildConfig.requestBaseUrl + '/v3/zero/user/agreement/getCodePackConfig'
