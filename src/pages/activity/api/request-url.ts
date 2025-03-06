import BuildConfig from '../../../config/build-config'

//导航下内容接口
export const tabContentUrl = BuildConfig.requestBaseUrl + '/home/tabs/${id}?packageName=${packageName}&page=${page}&limit=${limit}'
//获取首页视频播放地址接口
export const activityPlayUrl = BuildConfig.requestBaseUrl +'/streams/${id}?packageName=${packageName}&type=${type}'

