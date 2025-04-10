export const USER_TOKEN_KEY = 'userTokenKey'
export const USER_INFO_CHANGED_EVENT = 'onUserInfoChanged'
export const PAY_SUCCESS_EVENT = 'onPaySuccess'
export const PAY_SUCCESS_ALL_EVENT = 'onUserPaySuccessUpdate'
export const USER_INFO_ALL_CHANGED_EVENT = 'onUserLoginStatusChanged'
type fn_user_changed = (user: UserInfo | null) => void
type fn_pay_success = () => void

export interface ShareUserInfo {
  openId: string
  nickname: string
  headImage: string
  sex: string
  lastLonginMac: string
  sourcePackageName: string
  userToken: string
}

/**
 * 用户类
 */
export interface UserInfo {
  userId?: string
  userToken?: string
  headImage?: string
  nickname?: string
  userIcon?: string
  needAuthPhone?: boolean
  [prop: string]: any
}

export interface JumpPayParams {
  fromId?: string
  fromName?: string
  //详情页传
  assetId?: string
  //详情页传
  assetName?: string
  //是否绘本  详情页传
  isPicBook?: boolean
  //内容聚合页传
  productId?: string
  //积分 是否直接关闭
  isDirectFinish?: boolean
  //积分 是否展示订购信息
  isShowOrderBtn?: boolean
}

export interface UserChangeListener {
  onUserChanged?: fn_user_changed
  onPaySuccess?: fn_pay_success
}
