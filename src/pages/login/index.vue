<template>
  <div class='login-root-css'>
    <!--背景图-->
    <img class='login-img-css' :src='background' />
        <!--二维码-->
        <qt-view class='login-qr-code-view-css'>
          <!--文字二维码   -->
          <qt-qr-code class='login-qr-code-css'
                      v-if='isNetQrCode'
                      :content='qrCodeUrl'
                      :optimize='true' />
          <!--图片二维码-->
          <img class='login-qr-code-css' v-else :src='qrCodeUrl' />
          <!--扫码提示-->
          <qt-text class='login-qr-code-tip-css'
                   :gradientBackground="{colors:['#F4F4F4','#F4F4F4'], cornerRadii4: [0, 0, 20, 20],orientation:0}"
                   :focusable='false'
                   gravity='center'
                   :font-size='36' text='微信扫码登录' />
        </qt-view>
        <!-- 协议-->
        <qt-view class='login-agreement-root-css' :focusable='true' :requestFocus='true'
                 @click='onAgreementClick'>
          <qt-text class='login-agreement-text-css' :focusable='false' gravity='center' :font-size='30'
                   text='登录即代表您同意《用户协议》和《隐私协议》' />
          <qt-view class='login-agreement-bottom-line-css' />
        </qt-view>
  </div>

</template>

<script lang='ts' setup name='index'>

import { useESRouter } from '@extscreen/es3-router'
import { ref, watch } from 'vue'
import { UserChangeListener, UserInfo } from '../../api/user/impl-user'
import userManager from '../../api/user/user-manager'

const router = useESRouter()
//全局背景图
let background = ref('')
//是否网络地址
let isNetQrCode = ref(false)
//二维码地址
let qrCodeUrl = ref('')
//获取scene
let scene = ref('')
//用户信息事件监听
const listener: UserChangeListener = {
  onUserChanged(user: UserInfo | null) {
    if (user) {
      //todo 模拟扫码登录成功后关闭操作
      setTimeout(() => {
        router.back()
      }, 5000)
    }
  }
}
const onESCreate = () => {
  //添加监听
  userManager.addUserChangeListener(listener)
  //获取背景
  userManager.getLoginBackground().then(res => {
    background.value = res
  })
  //获取登录二维码
  userManager.getLoginQrCode().then(res => {
    const codeUrl = res.qrCodeUrl
    if (res.scene != null) {
      scene.value = res.scene
    }
    isNetQrCode.value = codeUrl.substring(0, 4) === 'http'
    if (!isNetQrCode.value) {
      qrCodeUrl.value = `data:image/png;base64,${res.qrCodeUrl}`
    } else {
      qrCodeUrl.value = res.qrCodeUrl
    }
  })
}
watch([() => scene.value], async (newValue) => {
  if (newValue[0]) {
    //todo 此处可以注册接收推送的服务接收用户数据或者轮询获取用户数据的接口
    const user = await userManager.getUserInfoByScene(newValue[0])
    if (user) {
      //存储用户信息
      userManager.updateUserInfo(user)
    }
  }
})
const onESDestroy = () => {
  //退出界面 移除监听
  userManager.removeUserChangeListener(listener)
}

function onAgreementClick() {

}

defineExpose({onESCreate,onESDestroy})

</script>

<style lang='scss'>
@use "./scss/login.scss";

</style>
