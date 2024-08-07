<template>
<div class="logout" :focusable="false" duplicateParentState>
  <div class="logout_dailog" :focusable="false" :clipChildren="false" overflow="visible">
    <div class="logout_info" :focusable="false">
      <p class="logout_info_txt">退出将无法享受登录特权</p>
      <p class="logout_info_txt">您确定退出登录？</p>
      <!-- <text-view 
        class="logout_info_txt" :fontSize="30" :focusable="false"
        :ellipsizeMode="2":lines="2" gravity="center" typeface="bold"
        text="退出将无法享受登录特权 您确定退出登录？"></text-view> -->
    </div>
    <div class="logout_btns" :focusable="false" :clipChildren="false" overflow="visible">
      <LogOutBtn @click="logoutFn" text="退出登录"/>
      <LogOutBtn @click="notLogoutFn" isFocus text="保持登录"/>
    </div>
  </div>
</div>
</template>
<script lang='ts' setup>
import { useESRouter } from "@extscreen/es3-router";
// import { ref } from "vue";
import { useLoginDataSource } from "../../api/UseApi"
// import logout from '../../assets/my/logout.png'
import LogOutBtn from './LogOutBtn.vue'

const router = useESRouter()
const loginManager = useLoginDataSource()

const logoutFn = ()=>{
  loginManager.loginOut().then(()=>{
    router.back()
  })
}
const notLogoutFn = ()=>{
  router.back()
}
defineExpose({
  onESCreate(params){}
})
</script>
<style scoped>
.logout{
  /* position: relative; */
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 1920px;
  height: 1080px;
  background-color: rgba(0,0,0,0.8);
}
.logout_dailog{
  /* position: absolute;
  left: 362px;
  top: 162px; */
  width: 987px;
  height: 761px;
  display: flex;
  flex-direction: column;
  background-color: transparent;
}
.logout_info{
  width: 987px;
  height: 561px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-size: cover;
  justify-content: center;
  /* #3A4578 */
  background-color: rgba(0,0,0,0.9);
  /* border-radius: 20px; */
  background-size: cover;
}
.logout_info_txt{
  width: 490px;
  /* height: 130px; */
  font-size: 40px;
  line-height: 68px;
  color: #ffffff;
  font-weight: bold;
  text-align: center;
  background-color: transparent;
}
.logout_btns{
  width: 987px;
  height: 85px;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background-color: transparent;
  margin-top: 40px;
}

</style>