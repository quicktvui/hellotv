/**
 * 请求体
 */
export interface RequestData {
  [prop: string]: any
}

/**
 * 基础请求体
 */
export interface RequestBodyParams {
  developer: RequestDevelopParams
  device: RequestDeviceParams
  param: RequestData
  user: RequestUserParams
  runtime: RequestRuntimeParams
}

/**
 * APK 底座参数
 */
export interface RequestDevelopParams {
  packagename: string
  vercode: number
  vername: string
  dynamicCode: number
}

/**
 * 设备相关参数
 */
export interface RequestDeviceParams {
  brand: string
  clientType: string
  dnum: string
  mac: string
  esMac: string
  esWifiMac: string
  manufacturer: string
  model: string
  deviceVersion: string
}

/**
 * SDK 相关参数
 */
export interface RequestRuntimeParams {
  sdkVersion: number
  sdkCID: string
  runtimeID: string,
  hostPackageName: string
  hostVersion: number
  hostChannel: string
  snCode: string
}

/**
 * 用户参数
 */
export interface RequestUserParams {
  userId: string
  userToken: string
  nickname: string
}
