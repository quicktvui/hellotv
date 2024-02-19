import {inject, InjectionKey} from "vue";
import {RequestManager} from "./request/RequestManager";
import {IMediaDataSource} from "./media/IMediaDataSource";
import {IGlobalApi} from "./IGlobalApi";
//request
export const RequestManagerKey = Symbol('RequestManagerKey') as InjectionKey<RequestManager>
export function useRequestManager(): RequestManager {
  return inject(RequestManagerKey)!
}

//app api
export const GlobalApiKey = Symbol('GlobalApiKey') as InjectionKey<IGlobalApi>
export function useGlobalApi(): IGlobalApi {
  return inject(GlobalApiKey)!
}

//detail
export const MediaDataSourceKey = Symbol('MediaDataSourceKey') as InjectionKey<IMediaDataSource>
export function useMediaDataSource(): IMediaDataSource {
  return inject(MediaDataSourceKey)!
}
