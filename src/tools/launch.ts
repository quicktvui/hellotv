import { ESDevelop } from '@extscreen/es3-core'
import { ESNativeRouter, RouteLocationRaw, Router } from '@extscreen/es3-router'

export interface LaunchParams {
  //0：快应用之间跳转； 1： 快应用内部跳转； 3：第三方应用跳转
  type: string | number
  //type = 0 option是字符串；1、3：option是对象
  options:
    | string
    | {
        //外层 type = 3 存在 值：ACTION、ACTIVITY、URL
        type?: string
        //type=3存在
        packageName?: string
        //type = ACTIVITY 存在
        activityPath?: string
        //type = URL 存在
        url?: string
        //type = ACTION 存在
        action?: string
        //"[{\"key\":\"activityKey\",\"value\":\"666\",\"type\":\"string\"},{\"key\":\"activityKey1\",\"value\":\"888\",\"type\":\"int\"}]"
        //外层type=1 params 是对象，外层 type=3 params字符串
        params?: object | string
        //外层type=1 name 存在
        name?: string
      }
}

class Launch {
  //内部路由
  router: Router
  //跳转三方路由
  nativeRouter: ESNativeRouter
  //获取本地包名
  develop: ESDevelop
  allowClick = false

  init(...params: any[]): Promise<any> {
    this.router = params[0]
    this.nativeRouter = params[1]
    this.develop = params[2]
    return Promise.resolve()
  }

  /**
   * 跳转方法
   * @param item
   */
  launch(item: LaunchParams): void {
    //防止同时触发多次跳转
    if (this.allowClick) return
    this.allowClick = true
    setTimeout(() => {
      this.allowClick = false
    }, 1000)
    if (!item) return
    const type = item.type
    switch (type) {
      //快应用间跳转
      case 0:
      case '0':
        this.jumpType0(item)
        break
      //快应用内部跳转
      case 1:
      case '1':
        this.jumpType1(item)
        break
      //三方应用跳转
      case 3:
      case '3':
        this.jumpType3(item)
        break
    }
  }

  /**
   * 快应用间跳转
   * "options":{
        "type": 0,
        "options": "esapp://action/start?es_pkg=es.com.fishing.tv&from=fishing&args={\"url\":\"find\",\"params\":{\"home\":1}}"
     }
   * @param item
   */
  jumpType0(item: LaunchParams) {
    const url = item.options
    if (url && typeof url === 'string') {
      this.launchByUrl(url, true, '', [])
    }
  }

  /**
   * 内部跳转
   * "options":{
        "name": "series_view",
        "params": {
            "mediaId": "1732640344681091074",
            "startPosition": "0"
        }
     }
   * @param item
   */
  jumpType1(item: LaunchParams) {
    const options = item.options
    if (options && typeof options !== 'string') {
      this.router.push(<RouteLocationRaw>options).then(() => {})
    }
  }

  /**
   * 跳转三方应用
   * @param item
   */
  jumpType3(item: LaunchParams) {
    const options = item.options
    if (typeof options !== 'string') {
      const type = options.type
      const packageName = options.packageName
      let params = []
      if (options.params && typeof options.params === 'string') {
        params = JSON.parse(options.params)
      }
      switch (type) {
        case 'URL':
          this.launchByUrl(options.url, false, packageName, params)
          break
        case 'ACTIVITY':
          this.launchByActivity(packageName + '/' + options.activityPath, packageName, params)
          break
        case 'ACTION':
          this.launchByAction(options.action, packageName, params)
          break
      }
    }
  }

  /**
   * URL  scheme跳转
   * @param url
   * @param isUseLocalPkg
   * @param packageName
   * @param params
   */
  launchByUrl(url, isUseLocalPkg: boolean = true, packageName = '', params = []) {
    if (!url) return
    const args: Array<any> = []
    args.push(['-d', url])
    if (!url.includes('-p')) {
      if (isUseLocalPkg) {
        const mPackageName = this.develop.getPackageName()
        args.push(['-p', mPackageName])
      } else if (packageName) {
        args.push(['-p', packageName])
      }
    }
    this.jumpNative(args, params)
  }

  /**
   * ACTION 跳转
   * @param action
   * @param packageName
   * @param params
   */
  launchByAction(action, packageName, params) {
    const args: Array<any> = []
    args.push(['-a', action])
    args.push(['-p', packageName])
    this.jumpNative(args, params)
  }

  /**
   * ACTIVITY 跳转
   * @param activityPath
   * @param packageName
   * @param params
   */
  launchByActivity(activityPath, packageName, params) {
    const args: Array<any> = []
    if (activityPath) {
      args.push(['-n', activityPath])
    }
    // args.push(['-a', "android.intent.action.VIEW"]);
    args.push(['-p', packageName])
    this.jumpNative(args, params)
  }

  /**
   * 封装跳转
   * @param args
   * @param params
   */
  jumpNative(args: Array<any> = [], params = []) {
    const mParam = this.buildParams(params)
    if (mParam && mParam.length > 0) {
      args.push(mParam)
    }
    this.nativeRouter.launch(args).then(() => {})
  }

  /**
   * build参数
   * @param params
   */
  buildParams(params: []) {
    let mParam = []
    if (params && params.length > 0) {
      for (const item of params) {
        const key = item['key']
        const value = item['value']
        const type = item['type']
        mParam = this.decodeParams(key, value, type)
      }
    }
    return mParam
  }

  /**
   * 解析参数
   * @param key
   * @param value
   * @param type
   */
  decodeParams(key, value, type) {
    let param = []
    switch (type.toLowerCase()) {
      case 'string':
        param = ['--es', key, value]
        break
      case 'int':
        param = ['--ei', key, value]
        break
      case 'boolean':
        param = ['--ez', key, value]
        break
    }
    return param
  }

  /**
   * 跳转个人中心
   */
  launchMy() {
    this.router.push({
      name: 'my',
      params: {}
    })
  }

  /**
   * 跳转搜索
   */
  launchSearch() {
    this.router.push({
      name: 'search',
      params: {}
    })
  }

  /**
   * 跳转详情
   */
  launchDetail(jumpId: string) {
    this.router.push({
      name: 'detail',
      params: { id: jumpId }
    })
  }
}

const launch = new Launch()
export default launch
