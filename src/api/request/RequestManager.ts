//
import {RequestBodyParams} from "./RequestBody/RequestBodyParams";
import {ESApp} from "@extscreen/es3-vue";
import {RequestDevelopParams} from "./RequestBody/RequestDevelopParams";
import {
  ESDevelop,
  ESDevice, ESLog, ESLogLevel,
  ESRuntime,
} from "@extscreen/es3-core";
import {RequestDeviceParams} from "./RequestBody/RequestDeviceParams";
import {RequestBaseParams} from "./RequestBody/RequestBaseParams";
import {RequestUserParams} from "./RequestBody/RequestUserParams";
import {RequestRuntimeParams} from "./RequestBody/RequestRuntimeParams";
import {ES} from "@extscreen/es3-core/dist/src/es/ES";
import {RequestData} from "./RequestBody/RequestData";
import BuildConfig from "../../build/BuildConfig";
import {RequestManagerKey} from "../UseApi";

export interface RequestManager {
  install(app: ESApp): void

  init(...params: any[]): Promise<any>

  post(url: string, data: RequestData): Promise<any>

  get(url: string, data: RequestData): Promise<any>

  updateUserParams(userInfo: RequestUserParams): void
}

//
const TAG = 'RequestManager'

export function createRequestManager(): RequestManager {
  let requestParams: RequestBodyParams
  let es: ES
  let develop: ESDevelop
  let device: ESDevice
  let runtime: ESRuntime
  let log: ESLog

  function init(...params: any[]): Promise<any> {
    es = params[0]
    develop = params[1]
    device = params[2]
    runtime = params[3]
    log = params[4]

    const developParams = initDeveloperRequestParams()
    const deviceParams = initDeviceRequestParams()
    const baseParams = initParamsRequestParams()
    const userParams = initUserRequestParams()
    const runtimeParams = initRuntimeBaseParams()
    //封装公共参数
    requestParams = {
      developer: developParams,
      device: deviceParams,
      param: baseParams,
      user: userParams,
      runtime: runtimeParams,
    }
    if (log.isLoggable(ESLogLevel.DEBUG)) {
      log.d(TAG, '-----------initRequestBaseParams-------------->>>>' + requestParams)
    }
    return Promise.resolve()
  }

  function initDeveloperRequestParams(): RequestDevelopParams {
    return {
      packagename: BuildConfig.packageName,
      vercode: develop.getVersionCode(),
      vername: develop.getVersionName(),
      dynamicCode: 1,
    }
  }

  function initDeviceRequestParams(): RequestDeviceParams {
    let mac = device.getDeviceEthMac();
    let es_mac = device.getDeviceEthMac();
    if (!mac) {
      mac = device.getDeviceWifiMac()
    }
    let wifi_mac = device.getDeviceWifiMac();
    mac = mac.replace(/:/g, '').toLowerCase();
    if (es_mac) {
      es_mac = es_mac.replace(/:/g, '').toLowerCase();
    }
    if (wifi_mac) {
      wifi_mac = wifi_mac.replace(/:/g, '').toLowerCase();
    }
    return {
      brand: device.getBuildBrand(),
      clientType: runtime.getRuntimeDeviceType() ?? '',
      dnum: runtime.getRuntimeDeviceId() ?? '',
      mac: mac,
      esMac: es_mac,
      esWifiMac: wifi_mac,
      manufacturer: device.getBuildManufacturer(),
      model: device.getBuildModel(),
      deviceVersion: device.getBuildVersionRelease(),
    }
  }

  function initParamsRequestParams(): RequestBaseParams {
    return {
      // channelCode: develop.getChannel(),
      channelCode: 'CHANGHONG',
      versionCode: develop.getVersionCode()
    }
  }

  function initUserRequestParams(): RequestUserParams {
    return {
      userId: '',
      userToken: '',
      nickname: ''
    }
  }

  function updateUserParams(userInfo: RequestUserParams): void {
    if (requestParams.user) {
      requestParams.user = {
        userId: userInfo.userId,
        userToken: userInfo.userToken,
        nickname: userInfo.nickname
      }
    }
  }

  function initRuntimeBaseParams(): RequestRuntimeParams {
    return {
      sdkVersion: es.getESSDKVersionCode(),
      sdkCID: runtime.getRuntimeDeviceId() ?? '',
      runtimeID: '',
      hostPackageName: develop.getPackageName(),
      hostVersion: develop.getVersionCode(),
      hostChannel: develop.getChannel(),
      snCode: ''
    }
  }

  function post<T>(url: string, data: RequestData): Promise<T> {
    return request('POST', url, data)
  }

  function get<T>(url: string, params: string, normalCode = 200): Promise<T> {
    return new Promise((resolve, reject) => {
      const requestUrl = url + params;
      fetch(requestUrl, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
        .then((response) => {
          return response.json();
        })
        .then((responseJson) => {
          if (responseJson.code == 200) {
            /**
             * 注意这里的code值是否符合当前接口的正常返回值
             * 有一个接口没code......只能拿'success'字段作为判断请求
             * **/
            if (responseJson.data) {
              resolve(responseJson.data);
            } else if (responseJson.success) {
              resolve(responseJson.data);
            } else {
              reject({
                code: responseJson.code,
                message: responseJson.message,
              });
            }
          } else if (responseJson.msg == "ok") {
            resolve(responseJson.weatherType);
          } else {
            reject({
              code: responseJson.status,
              message: "服务器忙，请稍后重试！",
            });
          }
        })
        .catch((err) => {
          reject({
            code: "-1",
            message: "发生错误，请稍后重试！",
          });
        });
    });
  }

  function request<T>(method: string, url: string, data: RequestData): Promise<T> {
    return new Promise((resolve, reject) => {
      const requestUrl = url
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '-----------request-------------->>>>requestUrl:' + requestUrl)
      }
      //每次请求更新用户信息
      requestParams.user = initUserRequestParams()
      //
      let requestData = {...requestParams, ...data, ...requestParams.param}
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d(TAG, '################### REQUEST START ########################')
        log.d(TAG, 'requestUrl:' + requestUrl)
        log.d(TAG, 'requestData:' + JSON.stringify(requestData))
        log.d(TAG, '################### REQUEST END ########################')
      }
      fetch(requestUrl, {
        method: method,
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      }).then((response) => {
        return response.json()
      }).then((responseJson) => {
        if (log.isLoggable(ESLogLevel.DEBUG)) {
          log.d(TAG, '################### RESPONSE START ########################')
          log.d(TAG, 'response:' + JSON.stringify(responseJson))
          log.d(TAG, '################### RESPONSE END   ########################')
        }
        if (responseJson.code === 0) {
          resolve(responseJson.data)
        } else {
          reject({
            code: responseJson.code,
            message: responseJson.message
          })
        }
      }).catch(error => {
        reject({
          code: '-1',
          message: '发生错误，请稍后重试！' + error
        })
      })
    })
  }

  return {
    install: function (app: ESApp) {
      const instance = this
      app.provide(RequestManagerKey, instance)
    },
    init,
    post,
    get,
    updateUserParams
  }
}
