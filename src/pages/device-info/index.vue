<template>
  <div class="device-info-root-css" :gradientBackground="{ colors: ThemeConfig.bgGradientColor, orientation: 0 }">
    <span class="device-info-title">相关信息</span>
    <qt-list-view class="device-info-list" :listData="mInfoList">
      <div class="device-info-item-root" :type="1">
        <qt-text class="device-info-item-text device-info-item-name" :lines="1" :fontSize="36" gravity="center|start" text="${name}" />
        <qt-text class="device-info-item-text device-info-item-value" :lines="1" :fontSize="36" gravity="center|end" text="${info}" />
        <div style="position: absolute; width: 1020px; height: 2px; top: 118px; background-color: rgba(255, 255, 255, 0.1)" />
      </div>
    </qt-list-view>
  </div>
</template>

<script lang="ts" setup>
import { qtRef } from '@quicktvui/quicktvui3'
import userManager from '../../api/user/user-manager'
import ThemeConfig from '../../config/theme-config'
import BuildConfig from '../../config/build-config'
defineOptions({
  name: 'index'
})
const mInfoList = qtRef()
const onESCreate = () => {
  initDeviceInfo()
}
const initDeviceInfo = () => {
  const userId = userManager.getUserInfo()?.userId
  const isLogin = userManager.isLogin()
  const macE = qt.device.getDeviceEthMac()
  const macW = qt.device.getDeviceWifiMac()
  let mac = macE
  if (mac && macW) {
    mac = mac + '/' + macW
  } else {
    if (!mac) {
      mac = macW
    }
  }
  const ipAddress = qt.device.getIPAddress()
  const versionRelease = qt.develop.getVersionName() + '-' + BuildConfig.VUE_PLUGIN_VERSION
  const clientType = qt.device.getBuildModel() + '-' + qt.develop.getChannel()
  const dnum = qt.runtime.getRuntimeDeviceId()
  const infoList: any = []
  infoList.push({
    type: 1,
    name: '用户ID ',
    info: isLogin ? userId : '未登录'
  })
  infoList.push({
    type: 1,
    name: '软件版本号 ',
    info: versionRelease
  })
  infoList.push({
    type: 1,
    name: '设备机型 ',
    info: clientType
  })
  infoList.push({
    type: 1,
    name: 'IP地址 ',
    info: ipAddress
  })
  infoList.push({
    type: 1,
    name: 'MAC地址 ',
    info: mac
  })
  infoList.push({
    type: 1,
    name: '设备序列号 ',
    info: dnum
  })
  mInfoList.value = infoList
}
defineExpose({ onESCreate })
</script>

<style lang="scss" src="./scss/device-info.scss"></style>
