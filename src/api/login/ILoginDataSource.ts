import { LoginQrCode } from "../../pages/login/build_data/LoginInfo"
import { UserInfo } from "../../pages/login/build_data/UserInfo"
import { IBaseApi } from "../IBaseApi"


export interface ILoginDataSource extends IBaseApi{
  /**
   * 获取登录背景图片
   */
  getLoginBackground(): Promise<string>

  /**
   * 获取登录二维码
   */
  getLoginQrCode(params:any):Promise<LoginQrCode>

  /**
   * 根据二维码 scene获取用户信息
   */
  getUserInfoByScene(scene: string):Promise<UserInfo>

  /**
   * 根据 token 获取用户数据
   * @param token
   */
  getUserInfoByToken(token:string):Promise<UserInfo>

  /**
   * 退出登录
   */
  loginOut():Promise<string>
}
