import {inject, InjectionKey} from "vue";
import { ILoginDataSource } from "./login/ILoginDataSource"
import { UserManager } from "./login/user/UserManager"
import {IMediaDataSource} from "./media/IMediaDataSource";
import {IGlobalApi} from "./IGlobalApi";

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

//login
export const LoginDataSourceKey = Symbol("LoginDataSourceKey") as InjectionKey<ILoginDataSource>
export function useLoginDataSource():ILoginDataSource{
  return inject(LoginDataSourceKey)!
}
//user
export const UserManagerKey = Symbol('UserManagerKey') as InjectionKey<UserManager>

export function useUserManager(): UserManager {
  return inject(UserManagerKey)!
}
