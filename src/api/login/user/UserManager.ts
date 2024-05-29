import { ESEventBus } from "@extscreen/es3-core/dist/src/eventbus/ESEventBus"
import { ESLocalStorage } from "@extscreen/es3-core/dist/src/local/ESLocalStorage"
import { ESApp, EventBus } from "@extscreen/es3-vue"
import { UserInfo } from "../../../pages/login/build_data/UserInfo"
import { IBaseApi } from "../../IBaseApi"
import { UserManagerKey } from "../../UseApi"
import { ILoginDataSource } from "../ILoginDataSource"
import { USER_TOKEN_KEY, UserChangeListener, UserChangeType } from "./UserChangeListener"

export interface UserManager extends IBaseApi{

  isLogin(): boolean

  getUserInfo(): UserInfo | null

  updateUserInfo(user: UserInfo,state:UserChangeType): void

  clearUserInfo(): void

  addUserChangeListener(listener: UserChangeListener): void

  removeUserChangeListener(listener: UserChangeListener): void

  offUserEvent():void
}

export function createUserManager(): UserManager {

  let loginApi:ILoginDataSource
  let localStorage:ESLocalStorage
  let eventBus:ESEventBus
  let _userInfo: UserInfo | null = null

  const listerList: Array<UserChangeListener> = []

  function init(...params: any[]): Promise<any> {
    //此处可以执行 获取本地用户数据等初始化逻辑
    loginApi = params[0]
    localStorage = params[1]
    eventBus = params[2]
    //注册当前应用接收事件
    eventBus.on("onUserInfoChanged",(user:UserInfo,state:UserChangeType)=>{
      sendMsgEvent(user,state)
    })
    return Promise.resolve().then(()=>initUserInfo())
  }



  function initUserInfo(){
    return new Promise(resolve => {
      localStorage.getString(USER_TOKEN_KEY,"").then(r_token =>{
        const token = r_token
        if (token){
          loginApi.getUserInfoByToken(token).then(res=>{
            if (res){
              setUserInfo(res)
            }
            resolve()
          })
        }else{
          resolve()
        }
      })
    })

  }

  function isLogin(): boolean {
    return _userInfo !== null
  }

  function getUserInfo() {
    return _userInfo
  }

  function setUserInfo(user: UserInfo){
    _userInfo = user
    //存储 token
    const token = user.userToken??""
    localStorage.putString(USER_TOKEN_KEY, token).then(r =>{
      //存储 token Ok
    })
  }

  function updateUserInfo(user: UserInfo,state:UserChangeType): void {
    setUserInfo(user)
    //发送通知
    eventBus.emit("onUserInfoChanged",user,state)
  }

  function clearUserInfo(): void {
    _userInfo = null
    localStorage.putString(USER_TOKEN_KEY,"").then(r =>{})
    const user:UserInfo = {}
    eventBus.emit("onUserInfoChanged",user,UserChangeType.DELETE)
  }

  function addUserChangeListener(listener: UserChangeListener): void {
    const index = listerList.findIndex((l) => l === listener)
    if (index > -1) {
      return
    }
    listerList.push(listener)
  }

  function removeUserChangeListener(listener: UserChangeListener): void {
    const index = listerList.findIndex((l) => l === listener)
    if (index > -1) {
      listerList.splice(index, 1)
    }
  }

  function sendMsgEvent(user:UserInfo,state:UserChangeType){
    listerList.forEach(listener =>{
      try {
        if (listener.onUserChanged){
          listener.onUserChanged(user,state)
        }
      }catch (e) {

      }
    })
  }
  function offUserEvent():void{
    if (eventBus){
      eventBus.off("onUserInfoChanged")
    }
    EventBus.$off("onUserInfoChanged")
  }

  return {
    install: function(app: ESApp) {
      const instance = this
      app.provide(UserManagerKey, instance)
      //注册底层接收消息事件
      EventBus.$on("onUserInfoChanged",(user:UserInfo,state:UserChangeType)=>{
        updateUserInfo(user,state)
      })
    },
    init,
    isLogin,
    getUserInfo,
    updateUserInfo,
    clearUserInfo,
    addUserChangeListener,
    removeUserChangeListener,
    offUserEvent
  }
}
