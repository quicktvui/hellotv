import { ESEventBus, ESLocalStorage } from '@extscreen/es3-core'
import { EventBus } from '@extscreen/es3-vue'
import {
  userApi,
  LoginQrCode,
  USER_TOKEN_KEY,
  UserChangeListener,
  UserInfo,
  USER_INFO_CHANGED_EVENT
} from './impl-user'
import { qrCode } from './qr-code-mock'


class UserManager implements userApi {
  //当前应用发送事件工具类
  eventBus: ESEventBus
  //本地保存数据工具类
  localStorage: ESLocalStorage
  //用户监听列表
  listerList: Array<UserChangeListener> = []
  //当前用户信息
  userInfo: UserInfo | null = null

  init(...params: any[]): Promise<any> {
    this.eventBus = params[0]
    this.localStorage = params[1]
    //注册当前应用接收事件
    this.eventBus.on(USER_INFO_CHANGED_EVENT, (user: UserInfo) => {
      this.sendMsgEvent(user)
    })
    //注册底层接收消息事件
    // EventBus.$on(USER_INFO_CHANGED_EVENT,(user:UserInfo)=>{
    //   this.updateUserInfo(user)
    // })
    return Promise.resolve().then(() => this.initUserInfo())
  }

  /**
   * 初始化用户信息
   */
  initUserInfo(): Promise<any> {
    return new Promise(resolve => {
      //获取本地token
      this.localStorage.getString(USER_TOKEN_KEY, '').then(r_token => {
        const token = r_token
        if (token) {
          this.getUserInfoByToken(token).then(res => {
            if (res){
              this.setUserInfo(res)
            }else{
              this.clearUserInfo(false)
            }
            resolve()
          })
        } else {
          this.clearUserInfo(false)
          resolve()
        }
      })
    })
  }

  /**
   * 存储用户信息
   * @param user
   */
  setUserInfo(user: UserInfo|null) {
    this.userInfo = user
    //存储 token
    const token = user?.userToken ?? ''
    this.localStorage.putString(USER_TOKEN_KEY, token).then(() => {
      //存储 token Ok
    })
  }

  /**
   * 是否登录
   */
  isLogin(): boolean {
    return this.userInfo !== null
  }

  /**
   * 获取用户信息
   */
  getUserInfo():UserInfo|null{
    return this.userInfo
  }

  /**
   * 更新用户信息
   * @param user
   */
  updateUserInfo(user:UserInfo){
    this.setUserInfo(user)
    this.eventBus.emit(USER_INFO_CHANGED_EVENT,user)
  }

  /**
   * 删除用户信息
   */
  clearUserInfo(isEmit:boolean=true): void {
    this.userInfo = null
    this.localStorage.putString(USER_TOKEN_KEY,"").then(() =>{})
    const user:UserInfo = {}
    if (isEmit){
      this.eventBus.emit("onUserInfoChanged",user)
    }
  }

  /**
   * 添加监听
   * @param listener
   */
  addUserChangeListener(listener: UserChangeListener): void {
    const index = this.listerList.findIndex((l) => l === listener)
    if (index > -1) {
      return
    }
    this.listerList.push(listener)
  }

  /**
   * 移除监听
   * @param listener
   */
  removeUserChangeListener(listener: UserChangeListener): void {
    const index = this.listerList.findIndex((l) => l === listener)
    if (index > -1) {
      this.listerList.splice(index, 1)
    }
  }

  /**
   * 发送当前应用的用户信息变更监听
   * @param user
   */
  sendMsgEvent(user: UserInfo) {
    this.listerList.forEach(listener => {
      if (listener.onUserChanged) {
        listener.onUserChanged(user)
      }
    })
  }

  /**
   * 注销监听
   */
  offUserEvent():void{
    if (this.eventBus){
      this.eventBus.off("onUserInfoChanged")
    }
    EventBus.$off("onUserInfoChanged")
  }

  getLoginBackground(): Promise<string> {
    //todo 获取登录背景图 更换接口
    return Promise.resolve('http://extcdn.hsrc.tv/data_center/files/2023/05/30/5ef2b018-9405-4d0e-b185-dbabfc34618c.jpg')
  }

  getLoginQrCode(): Promise<LoginQrCode> {
    //todo 获取登录二维码 更换接口
    const loginQRCode:LoginQrCode = {
      qrCodeUrl:qrCode,
      scene:"1793574620096778242"
    }
    return Promise.resolve(loginQRCode)
  }

  /**
   * 获取用户信息api
   * @param scene
   */
  getUserInfoByScene(scene: string): Promise<UserInfo|null> {
    if (!scene) return Promise.resolve(null)
    //todo 获取用户信息 更换接口
    const userInfo:UserInfo = {
      userId:"1559148621025222657",
      userToken:"8b3578f56b913d40f4420b7bb7d349fa36b04e5ead04aced",
      nickName:"神经鸭",
      userIcon:"http://eb118-file.cdn.bcebos.com/upload/30504bf71cf445e9ac70b9414371f657_1543269792.png"
    }
    return Promise.resolve(userInfo)
  }

  /**
   * 获取用户信息  api
   * @param token
   */
  getUserInfoByToken(token: string): Promise<UserInfo|null> {
    if (!token) return Promise.resolve(null)
    //todo 获取用户信息 更换接口
    const userInfo:UserInfo = {
      userId:"1559148621025222657",
      userToken:"8b3578f56b913d40f4420b7bb7d349fa36b04e5ead04aced",
      nickName:"神经鸭",
      userIcon:"http://eb118-file.cdn.bcebos.com/upload/30504bf71cf445e9ac70b9414371f657_1543269792.png"
    }
    return Promise.resolve(userInfo)
  }

  loginOut(): Promise<string> {
    //todo 退出用户登录 更换接口
    this.clearUserInfo()
    return Promise.resolve('success')
  }
}
const userManager = new UserManager()
export default userManager
