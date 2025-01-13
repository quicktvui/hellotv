import BuildConfig from '../../../config/build-config'

//导航数据接口
export const tabListUrl = BuildConfig.requestBaseUrl + '/home/tabs?packageName=' //tab
//导航下内容接口
export const tabContentUrl = BuildConfig.requestBaseUrl + '/home/tabs/${id}?packageName=${packageName}&page=${page}&limit=${limit}'
//获取首页视频播放地址接口
export const homePlayUrl = BuildConfig.requestBaseUrl +'/streams/${id}?packageName=${packageName}&type=${type}'
//获取 4K世界 数据
export const home4KUrl = BuildConfig.requestBaseUrl + '/home/tabs/4k/${id}?packageName=${packageName}'
