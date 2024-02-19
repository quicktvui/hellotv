//
import {QTWaterfallItem} from "@quicktvui/quicktvui3";
import {App} from "vue";
import {LaunchKey} from "./useApi";
import {ESNativeRouter, Router} from "@extscreen/es3-router";
import {ESLog, ESLogLevel} from "@extscreen/es3-core";

export interface Launch {

    install(app: App): void

    init(...params: any[]): Promise<any>;

    launch(item: QTWaterfallItem): void
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
            case 1:
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
            case 2:
                break
            default:
                break
        }
    }

    return {
        install: function (app: App) {
            const instance = this
            app.provide(LaunchKey, instance)
        },
        init,
        launch,
    }
}
