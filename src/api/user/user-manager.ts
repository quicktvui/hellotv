import { ESEventBus, ESSharedDataMode } from '@extscreen/es3-core'
import { EventBus } from '@extscreen/es3-vue'
import BuildConfig from '../../config/build-config'
import { isJSON } from '../../tools'
import requestManager from '../../tools/request'
import {
  PAY_SUCCESS_ALL_EVENT,
  PAY_SUCCESS_EVENT,
  ShareUserInfo,
  USER_INFO_ALL_CHANGED_EVENT,
  USER_INFO_CHANGED_EVENT,
  UserChangeListener,
  UserInfo
} from './impl-user'
import { userInfoUrl } from './request-url'

class UserManager {
  shareParams = {
    packageName: BuildConfig.payPackageName,
    secretKey: BuildConfig.secretKey
  }
  shareUserInfoKey = BuildConfig.payPackageName + 'es_user_share_login_user'
  //当前应用发送事件工具类
  eventBus: ESEventBus
  //用户监听列表
  listerList: Array<UserChangeListener> = []
  //公享用户信息
  shareUserInfo: ShareUserInfo | null = null
  //当前用户信息
  userInfo: UserInfo | null = null

  init(...params: any[]): Promise<any> {
    this.eventBus = params[0]
    //注册当前应用接收事件
    this.eventBus.on(USER_INFO_CHANGED_EVENT, (user: UserInfo) => {
      this.sendMsgEvent(user)
    })
    this.eventBus.on(PAY_SUCCESS_EVENT, () => {
      this.sendPayMsgEvent()
    })

    //注册底层接收消息事件
    EventBus.$on(USER_INFO_ALL_CHANGED_EVENT, (status) => this.userInfoChangedEvent(status))
    EventBus.$on(PAY_SUCCESS_ALL_EVENT, (status) => this.onPaySuccessEvent(status))
    return Promise.resolve().then(() => this.initUser(''))
  }
  /**
   * 初始化用户信息
   */
  initUser(status): Promise<any> {
    if (status && (status.clear || status.noUpdate)) {
      if (status.clear) {
        this.clearUserInfo()
      }
      return Promise.resolve()
    } else {
      return Promise.resolve()
        .then(() => this.initShareInfo())
        .then(() => this.initPrivateInfo(status))
    }
  }

  /**
   * 全局监听回调
   * @param status
   */
  userInfoChangedEvent(status) {
    this.initUser(status).then(() => {
      this.eventBus.emit(USER_INFO_CHANGED_EVENT, this.userInfo)
    })
  }

  onPaySuccessEvent(status) {
    this.eventBus.emit(PAY_SUCCESS_EVENT, status)
  }

  /**
   * 初始化共享用户数据
   */
  initShareInfo() {
    return new Promise((resolve) => {
      try {
        qt.shareData.getString(this.shareParams, this.shareUserInfoKey, '').then(
          (userInfo) => {
            if (userInfo !== '') {
              if (isJSON(userInfo)) {
                this.shareUserInfo = JSON.parse(userInfo)
              } else {
                //兼容存储数据错误
                this.shareUserInfo = null
                qt.shareData
                  .putString(this.shareParams, this.shareUserInfoKey, '', ESSharedDataMode.ES_SHARED_DATA_MODE_WORLD_WRITEABLE)
                  .then(() => {
                    //清除共享数据 success
                  })
              }
            } else {
              this.shareUserInfo = null
            }
            resolve()
          },
          (error) => {
            qt.log.e('user-manager', error)
            this.shareUserInfo = null
            resolve()
          }
        )
      } catch (e) {
        qt.log.e('user---manager', e)
        resolve()
      }
    })
  }

  /**
   * 初始化私有用户信息
   * @param status
   */
  initPrivateInfo(status): Promise<UserInfo | null> {
    return new Promise((resolve) => {
      if (this.isLogin()) {
        const isSwitch = status && !!status.switchLogin
        if (!this.userInfo || isSwitch) {
          if (isSwitch) {
            this.userInfo = null
          }
          //获取接口数据
          this.requestUserInfo(true).then(
            (res) => {
              if (res && res.data && res.message && isJSON(res.message)) {
                this.userInfo = JSON.parse(res.message)
                resolve()
              } else {
                this.clearUserInfo()
                resolve()
              }
            },
            (error) => {
              qt.log.e('user--manager', error)
              this.clearUserInfo()
              resolve()
            }
          )
        } else {
          resolve()
        }
      } else {
        resolve()
      }
    })
  }

  /**
   * 是否登录
   */
  isLogin(): boolean {
    return this.shareUserInfo !== null && this.shareUserInfo.userToken !== ''
  }

  /**
   * 获取用户信息
   */
  getUserInfo(): UserInfo | null {
    return this.userInfo
  }

  /**
   * 删除用户信息
   */
  clearUserInfo(): void {
    this.userInfo = null
    this.shareUserInfo = null
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
    this.listerList.forEach((listener) => {
      if (listener.onUserChanged) {
        listener.onUserChanged(user)
      }
    })
  }
  sendPayMsgEvent() {
    this.listerList.forEach((listener) => {
      if (listener.onPaySuccess) {
        listener.onPaySuccess()
      }
    })
  }

  /**
   * 注销监听
   */
  offUserEvent(): void {
    if (this.eventBus) {
      this.eventBus.off('onUserInfoChanged')
    }
    EventBus.$off('onUserInfoChanged')
    //清空所有监听
    if (this.listerList && this.listerList.length > 0) {
      const length = this.listerList.length
      this.listerList.splice(0, length)
    }
  }

  /**
   * 请求用户数据
   * @param resultNeedObject
   */
  requestUserInfo(resultNeedObject = false) {
    const userToken = JSON.stringify({ shareUserToken: this.shareUserInfo?.userToken })
    const data = {
      data: userToken
    }
    return requestManager.post(userInfoUrl, data, resultNeedObject)
  }
}
const userManager = new UserManager()
export default userManager
