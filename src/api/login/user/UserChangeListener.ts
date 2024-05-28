import {UserInfo} from "../../../pages/login/build_data/UserInfo";
export const USER_TOKEN_KEY = "userTokenKey"
export enum UserChangeType{
  UPDATE = 1,
  DELETE = 2,
}
type fn_user_changed = (user:UserInfo|null, state:UserChangeType)=>void
export interface UserChangeListener {
  onUserChanged?:fn_user_changed
}
