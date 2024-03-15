<template>
  <div id="root">
    <es-router-view/>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
import {defineComponent} from "@vue/runtime-core";
import {ESLogLevel, useES, useESDevelop, useESDevice, useESLog, useESRuntime, ESNetworkInfo, useESNetwork } from "@extscreen/es3-core";
import {ESPlayerLogLevel, useESPlayer, useESPlayerLog} from "@extscreen/es3-player";
import {useGlobalApi, useMediaDataSource, useRequestManager} from "./api/UseApi";
import {useUserManager} from "./tools/user/useApi";
import BuildConfig from "./build/BuildConfig";
import {useLaunch} from "./tools/launch/useApi";
import {useESNativeRouter, useESRouter} from "@extscreen/es3-router";

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

    function onESCreate(app, params) {
      initESLog()
      network.addListener(connectivityChangeListener)
      return Promise.resolve()
        .then(() => request.init(es, develop, device, runtime, log))
        .then(() => globalApi.init(request))
        .then(() => mediaDataSource.init(request))
        .then(() => userManager.init())
        .then(() => launch.init(log, router, nativeRouter))
        .then(() => playerManager.init({
          debug: true,
          display: {
            screenWidth: device.getScreenWidth(),
            screenHeight: device.getScreenHeight(),
          },
          device: {
            // deviceType: runtime.getRuntimeDeviceType() ?? ''
            deviceType: 'ZLS58Gi4X' // 变相强制为硬解码
          }
        }))
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

    return {
      onESCreate
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
