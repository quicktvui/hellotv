<template>
  <div id="root">
    <es-router-view/>
  </div>
</template>

<script lang="ts">
import { Native } from "@extscreen/es3-vue"
import { ref } from 'vue'
import {defineComponent} from "@vue/runtime-core";
import {
  ESLogLevel,
  useES,
  useESDevelop,
  useESDevice,
  useESLog,
  useESRuntime,
  ESNetworkInfo,
  useESNetwork,
  useESLocalStorage,
  useESEventBus
} from "@extscreen/es3-core"
import {ESPlayerLogLevel, useESPlayer, useESPlayerLog} from "@extscreen/es3-player";
import {
  useGlobalApi,
  useLoginDataSource,
  useMediaDataSource,
  useRequestManager, useUserManager
} from "./api/UseApi"
import BuildConfig from "./build/BuildConfig";
import {useLaunch} from "./tools/launch/useApi";
import {useESNativeRouter, useESRouter} from "@extscreen/es3-router";
import HistoryApi from './api/history/index'
import activity2Api from './api/activity2/index'

export default defineComponent({
  name: "App",
  setup() {

    const log = useESLog()
    const es = useES()
    const develop = useESDevelop()
    const device = useESDevice()
    const runtime = useESRuntime()
    const playerManager = useESPlayer()
    const router = useESRouter()
    const nativeRouter = useESNativeRouter()
    const launch = useLaunch()
    const playerLog = useESPlayerLog()

    //
    const request = useRequestManager()
    const globalApi = useGlobalApi()
    const mediaDataSource = useMediaDataSource()
    const userManager = useUserManager()
    const eventBus = useESEventBus()
    const localStore = useESLocalStorage()
    const loginApi = useLoginDataSource()

    function onESCreate(app, params) {
      initESLog()
      initDefaultThemeColor()
      network.addListener(connectivityChangeListener)
      switchDev()
      return Promise.resolve()
        .then(() => request.init(es, develop, device, runtime, log))
        .then(() => globalApi.init(request))
        .then(() => loginApi.init(request,userManager))
        .then(() => userManager.init(loginApi,localStore,eventBus))
        .then(() => mediaDataSource.init(request))
        .then(() => HistoryApi.init(request, localStore))
        .then(() => activity2Api.init(request))

        .then(() => launch.init(log, router, nativeRouter))
        .then(() => playerManager.init({
          debug: true,
          display: {
            screenWidth: device.getScreenWidth(),
            screenHeight: device.getScreenHeight(),
          },
          device: {
            deviceType: runtime.getRuntimeDeviceType() ?? ''
          }
        }))
    }

    function initDefaultThemeColor(){
      //设置默认焦点边框圆角
      Native.callNative('FocusModule', 'setDefaultFocusBorderCorner', 20);
      //设置默认焦点颜色
      Native.callNative('FocusModule', 'setDefaultFocusBorderColor', '#157AFC');
// //设置焦点框是否有内里黑色边框
//       Native.callNative('FocusModule', 'setDefaultFocusInnerBorderEnable',true);

//       //设置默认焦点边框是否开启
//       Native.callNative('FocusModule', 'setDefaultFocusBorderEnable', true);
// //设置默认焦点放大倍数
//       Native.callNative('FocusModule', 'setDefaultFocusScale', 1.1);
    }
    const network = useESNetwork()
    const isNetworkConnected = ref<boolean>(true)
    const connectivityChangeListener = {
      onConnectivityChange(networkInfo: ESNetworkInfo | null) {
        isNetworkConnected.value = network.isNetworkConnected()
        if (isNetworkConnected.value) {
          router.back()
        } else {
          router.push({ name: 'network' })
        }
      }
    }
    function initESLog() {
      if (BuildConfig.debug) {
        log.setMinimumLoggingLevel(ESLogLevel.DEBUG)
        playerLog.setMinimumLoggingLevel(ESPlayerLogLevel.DEBUG)
      } else {
        log.setMinimumLoggingLevel(ESLogLevel.WARN)
        playerLog.setMinimumLoggingLevel(ESPlayerLogLevel.WARN)
      }
    }
    const switchDev = () => {
      let devTotalMemory = device.getDeviceTotalMemory()
      let devResolution = device.getResolution()
      let devAndroidLevel = Number(device.getAndroidAPILevel())
      let dType = runtime.getRuntimeDeviceType() ?? ''
      if(devTotalMemory <= 1024 ||  devAndroidLevel < 22){
        BuildConfig.isLowEndDev = true
      }
    }

    function onESDestroy(){
      userManager.offUserEvent()
    }

    return {
      onESCreate,
      onESDestroy
    }
  }
});
</script>

<style scoped>
#root {
  width: 1920px;
  height: 1080px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
