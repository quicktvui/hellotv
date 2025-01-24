import BuildConfig from '../../../config/build-config'

export const historyRecordsUrl = BuildConfig.requestBaseUrl + '/records?id=${deviceId}&type=${type}&page=${page}&limit=${limit}'
