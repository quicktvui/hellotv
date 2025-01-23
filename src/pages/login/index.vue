<template>
  <qt-view class="login-root-css">
    <!--背景图-->
    <img class="login-img-css" :src="background"/>
    <!--二维码-->
    <qt-view class="login-qr-code-root-css">
      <!--文字二维码   -->
      <qt-qr-code class="login-qr-code-css"
                  v-if="isNetQrCode"
                  :content="qrCodeUrl"
                  :optimize="true"/>
      <!--图片二维码-->
      <img class="login-qr-code-css" v-else :src="qrCodeUrl"/>
      <!--扫码提示-->
      <qt-text class="login-qr-code-tip-css"
               :gradientBackground="{colors:['#F4F4F4','#F4F4F4'], cornerRadii4: [0, 0, 20, 20],orientation:0}"
               :focusable="false"
               gravity="center"
               :fontSize="36" text="微信扫码登录"/>
    </qt-view>
    <!-- 协议-->
    <qt-view class="login-agreement-root-css" :focusable="true" :requestFocus="true" @click="onAgreementClick">
      <qt-text class="login-agreement-text-css" :focusable="false" gravity="center" :fontSize="30" text="登录即代表您同意《用户协议》和《隐私协议》"/>
      <qt-view class="login-agreement-bottom-line-css"/>
    </qt-view>
  </qt-view>

</template>

<script lang="ts">
import { useESRouter } from "@extscreen/es3-router"
import { defineComponent } from "@vue/runtime-core"
import { ESLogLevel, useESLog } from "@extscreen/es3-core"
import { ref, watch } from "vue"
import { UserChangeListener, UserChangeType } from "../../api/login/user/UserChangeListener"
import { useLoginDataSource, useUserManager } from "../../api/UseApi"
import { UserInfo } from "./build_data/UserInfo"

export default defineComponent({
  name: "index",
  setup(props, context) {
    const log = useESLog()
    const router =useESRouter()
    const loginManager = useLoginDataSource()
    const userManager = useUserManager()
    let background = ref("")
    let qrCodeUrl = ref("")
    let isNetQrCode = ref(false)
    let scene = ref("")

    const listener:UserChangeListener = {
      onUserChanged(user:UserInfo|null, state:UserChangeType){
        //todo 模拟扫码登录成功后关闭操作
        setTimeout(()=>{router.back()},5000)
      }
    }

    function onESCreate(params) {
      userManager.addUserChangeListener(listener)
      //获取背景图片
      loginManager.getLoginBackground().then(res=>{
        background.value = res
      })
      //获取二维码
      loginManager.getLoginQrCode("").then(res=>{
        const codeUrl = res.qrCodeUrl
        if (res.scene != null) {
          scene.value = res.scene
        }
        isNetQrCode.value = codeUrl.substring(0,4) === "http"
        if (!isNetQrCode.value){
          qrCodeUrl.value = `data:image/png;base64,${res.qrCodeUrl}`
        }else{
          qrCodeUrl.value = res.qrCodeUrl
        }
      })
    }

    function onESStart() {

    }

    function onESRestart() {

    }

    function onESResume() {

    }

    function onESPause() {

    }

    function onESStop() {

    }

    function onESDestroy() {
      userManager.removeUserChangeListener(listener)
    }
    function onAgreementClick(e){

    }

    watch([()=>scene.value],(newValue,oldValue)=>{
      if (newValue[0]){
        //todo 此处可以注册接收推送的服务接收用户数据或者轮询获取用户数据的接口
        loginManager.getUserInfoByScene(newValue[0]).then(user=>{
          if (user){
            //存储用户信息
            userManager.updateUserInfo(user,UserChangeType.UPDATE)
          }
        })
      }
    })

    return {
      onESCreate,
      onESStart,
      onESResume,
      onESPause,
      onESStop,
      onESRestart,
      onESDestroy,
      onAgreementClick,

      background,
      isNetQrCode,
      qrCodeUrl
    }
  }
})
</script>

<style src="./css/login.css">

</style>
