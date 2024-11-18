import { ESDevelop, ESDevice, ESLog, ESRuntime } from "@extscreen/es3-core"
import { ES } from "@extscreen/es3-core/dist/src/es/ES"
import BuildConfig from "../../config/build-config"
// import { UserInfo } from "../../pages/login/build_data/UserInfo"
import {
  RequestBodyParams,
  RequestData,
  RequestDevelopParams,
  RequestDeviceParams,
  RequestUserParams,
  RequestRuntimeParams
} from "./request-data"

class RequestManager{
  requestParams: RequestBodyParams
  es: ES
  develop: ESDevelop
  device: ESDevice
  runtime: ESRuntime
  log: ESLog
  init(...params: any[]): Promise<any>{
    this.es = params[0]
    this.develop = params[1]
    this.device = params[2]
    this.runtime = params[3]
    this.log = params[4]
    this.initRequestParams()
    return Promise.resolve()
  }

  /**
   * 初始化基础参数
   */
  initRequestParams(){
    const developParams:RequestDevelopParams = this.initDevelopParams()
    const deviceParams:RequestDeviceParams = this.initDeviceParams()
    const baseParams:RequestData = this.initOtherParams()
    const userParams:RequestUserParams = this.initUserParams()
    const runtimeParams:RequestRuntimeParams = this.initRuntimeParams()
    this.requestParams = {
      developer: developParams,
      device: deviceParams,
      param: baseParams,
      user: userParams,
      runtime: runtimeParams,
    }
  }

  initDevelopParams():RequestDevelopParams{
    return {
      packagename: BuildConfig.packageName,
      vercode: this.develop.getVersionCode(),
      vername: this.develop.getVersionName(),
      dynamicCode: BuildConfig.VUE_PLUGIN_VERSION,
    }
  }

  initDeviceParams(): RequestDeviceParams {
    let mac = this.device.getDeviceEthMac();
    let es_mac = this.device.getDeviceEthMac();
    if (!mac) {
      mac = this.device.getDeviceWifiMac()
    }
    let wifi_mac = this.device.getDeviceWifiMac();
    mac = mac.replace(/:/g, '').toLowerCase();
    if (es_mac) {
      es_mac = es_mac.replace(/:/g, '').toLowerCase();
    }
    if (wifi_mac) {
      wifi_mac = wifi_mac.replace(/:/g, '').toLowerCase();
    }
    return {
      brand: this.device.getBuildBrand(),
      clientType: this.runtime.getRuntimeDeviceType() ?? '',
      dnum: this.runtime.getRuntimeDeviceId() ?? '',
      mac: mac,
      esMac: es_mac,
      esWifiMac: wifi_mac,
      manufacturer: this.device.getBuildManufacturer(),
      model: this.device.getBuildModel(),
      deviceVersion: this.device.getBuildVersionRelease(),
    }
  }

  initOtherParams(): RequestData {
    return {
      channelCode: this.develop.getChannel(),
      versionCode: this.develop.getVersionCode()
    }
  }

  initUserParams(): RequestUserParams {
    return {
      userId: '',
      userToken: '',
      nickname: ''
    }
  }

  initRuntimeParams(): RequestRuntimeParams {
    return {
      sdkVersion: this.es.getESSDKVersionCode(),
      sdkCID: this.runtime.getRuntimeDeviceId() ?? '',
      runtimeID: '',
      hostPackageName: this.develop.getPackageName(),
      hostVersion: this.develop.getVersionCode(),
      hostChannel: this.develop.getChannel(),
      snCode: ''
    }
  }

  /**
   * 更新用户数据
   * @param userInfo
   */
  // updateUserParams(userInfo:UserInfo){
  //   if (this.requestParams.user) {
  //     this.requestParams.user = <RequestUserParams>{
  //       userId: userInfo.userId,
  //       userToken: userInfo.userToken,
  //       nickname: userInfo.nickname
  //     }
  //   }
  // }

  /**
   * 获取param参数
   */
  getParams(){
    return this.requestParams.param
  }

  get<T>(url:string,timeout= 30000):Promise<T>{
    const requestUrl = encodeURI(url)
    const options:RequestInit = {
      method:"GET",
      headers:{
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      }
    }
    return this.request(requestUrl,options,timeout)
  }

  post<T>(url:string,data:RequestData,timeout=30000):Promise<T>{
    //更新用户信息
    this.requestParams.user = this.initUserParams()
    const requestData = {...this.requestParams, ...data}
    const body = JSON.stringify(requestData)
    const options:RequestInit = {
      method:'POST',
      headers:{
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:body
    }
    return this.request(url,options,timeout)
  }

  request<T>(url,requestInit:RequestInit,timeout=30000):Promise<T>{
    let rejectInstance:any = null
    const ajaxTimer = setTimeout(() => {
      if(rejectInstance){
        rejectInstance({ code: 502, message: 'request timeout' })
      }
    }, timeout)
    return new Promise(((resolve, reject) => {
      rejectInstance = reject
      fetch(url,requestInit).then(response =>{
        clearTimeout(ajaxTimer)
        return response.json()
      }).then(res=>{
        if (res.code == 200){
          resolve(res.data)
        }else{
          reject({
            code: res.code,
            message: "服务器忙，请稍后重试！",
          });
        }
      }).catch(()=>{
        clearTimeout(ajaxTimer)
        reject({ code: -1, message: '发生错误，请稍后重试！' })
      })
    }))
  }
}

const requestManager = new RequestManager()
export default requestManager
