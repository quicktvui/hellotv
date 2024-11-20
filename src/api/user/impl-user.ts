export const USER_TOKEN_KEY = "userTokenKey"
export const USER_INFO_CHANGED_EVENT = "onUserInfoChanged"
type fn_user_changed = (user: UserInfo | null) => void

/**
 * 用户类
 */
export interface UserInfo {
  userId?: string
  userToken?: string
  nickName?: string
  userIcon?: string

  [prop: string]: any
}

export interface LoginQrCode {
  //二维码地址
  qrCodeUrl: string
  //标识
  scene?: string
}

export interface UserChangeListener {
  onUserChanged?: fn_user_changed
}

export interface userApi {

  /**
   * 获取登录背景图片
   */
  getLoginBackground(): Promise<string>

  /**
   * 获取登录二维码
   */
  getLoginQrCode(params: any): Promise<LoginQrCode>

  /**
   * 根据二维码 scene获取用户信息
   */
  getUserInfoByScene(scene: string): Promise<UserInfo>

  /**
   * 根据 token 获取用户数据
   * @param token
   */
  getUserInfoByToken(token: string): Promise<UserInfo>

  /**
   * 退出登录
   */
  loginOut(): Promise<string>
}
