//
import { ESApp } from "@extscreen/es3-vue"
import {LaunchKey} from "./useApi";
import {ESNativeRouter, Router} from "@extscreen/es3-router";
import {ESLog, ESLogLevel} from "@extscreen/es3-core";

export const launchRedirectType = {
    router: 1, out: 2
}

  
export interface Launch {

    install(app: ESApp): void

    init(...params: any[]): Promise<any>;

    launch(item:any): void;
    jumpLogin(item?:any): void;
    jumpVipPay(item?:any): void
}

export function createLaunch(): Launch {

    const TAG = 'Launch'

    let log: ESLog
    let router: Router
    let nativeRouter: ESNativeRouter

    function init(...params: any[]): Promise<any> {
        log = params[0]
        router = params[1]
        nativeRouter = params[2]
        return Promise.resolve();
    }

    function launch(item): void {
        if (log.isLoggable(ESLogLevel.DEBUG)) {
            log.d(TAG, '------launch------->>>>', item)
        }
        if (!item.item) {
            if (log.isLoggable(ESLogLevel.DEBUG)) {
                log.d(TAG, '------launch-----error-->>>>')
            }
            return
        }
        const data = item.item
        const redirectType = data.redirectType;
        switch (redirectType) {
            //内部跳转
          case 1: case '1':
                const argsStr = data.innerArgs;
                const args = JSON.parse(argsStr)
                if (log.isLoggable(ESLogLevel.DEBUG)) {
                    log.d(TAG, '------launch---params---->>>>', args.params)
                }
                router.push({
                    name: args.url,
                    params: args.params
                });
                break
            //外部跳转
            case 2: case '2':
                break
            default:
                break
        }
    }

    function jumpLogin(item?:any) {
        //统一跳转登录的页面，每个业务各自实现具体逻辑
    }
    function jumpVipPay(item?:any) {
        //统一跳转支付的页面，每个业务各自实现具体逻辑
    }
    
    return {
        install: function (app: ESApp) {
            const instance = this
            app.provide(LaunchKey, instance)
        },
        init,
        launch,
        jumpLogin,
        jumpVipPay
    }
}

const launch = createLaunch()
export default launch
