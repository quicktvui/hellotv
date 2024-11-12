import { ESApp } from "@extscreen/es3-vue"
import { LoginQrCode } from "../../pages/login/build_data/LoginInfo"
import { UserInfo } from "../../pages/login/build_data/UserInfo"
import { LoginDataSourceKey } from "../UseApi"
import { ILoginDataSource } from "./ILoginDataSource"
import { qrCode } from "./mock/qr_code"
import { UserManager } from "./user/UserManager"

export function createUserApi():ILoginDataSource{
  let userManager:UserManager
  function init(...params: any[]): Promise<any> {
    userManager = params[0]
    return Promise.resolve()
  }
  function getLoginBackground():Promise<string>{
    //请求接口 更换接口数据
    return Promise.resolve("http://qcloudimg.a311.ottcn.com/data_center/files/2023/05/30/5ef2b018-9405-4d0e-b185-dbabfc34618c.jpg")
  }

  function getLoginQrCode(params:any):Promise<LoginQrCode>{
    //请求接口 更换接口数据
    const loginQRCode:LoginQrCode = {
      qrCodeUrl:qrCode,
      scene:"1793574620096778242"
    }
    return Promise.resolve(loginQRCode)
  }

  function getUserInfoByScene(scene:string):Promise<UserInfo>{
    //请求接口 更换接口数据
    const userInfo:UserInfo = {
      userId:"1559148621025222657",
      userToken:"8b3578f56b913d40f4420b7bb7d349fa36b04e5ead04aced",
      nickName:"神经鸭",
      userIcon:"http://eb118-file.cdn.bcebos.com/upload/30504bf71cf445e9ac70b9414371f657_1543269792.png"
    }
    return Promise.resolve(userInfo)
  }

  function getUserInfoByToken(token:string):Promise<UserInfo>{
    //请求接口 更换接口数据
    const userInfo:UserInfo = {
      userId:"1559148621025222657",
      userToken:"8b3578f56b913d40f4420b7bb7d349fa36b04e5ead04aced",
      nickName:"神经鸭2",
      userIcon:"http://eb118-file.cdn.bcebos.com/upload/30504bf71cf445e9ac70b9414371f657_1543269792.png"
    }
    return Promise.resolve(userInfo)
  }

  function loginOut():Promise<string>{
    return Promise.resolve("success")
  }
  return {
    install:function(app:ESApp){
      const instance = this
      app.provide(LoginDataSourceKey,instance)
    },
    init,
    getLoginBackground,
    getLoginQrCode,
    getUserInfoByScene,
    getUserInfoByToken,
    loginOut
  }
}
