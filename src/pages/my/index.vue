<template>
  <div class="my_page" :style="pageStyle" :gradientBackground="bg">
    <div v-if="cHeaderHeight" class="my_header" :style="cHeaderStyle">
      <img class="my_header_logo" :focusable="false" :src="logo" />
    </div>
    <qt-waterfall
      ref="waterfall" class="my_content" :style="contentStyle"
      :requestFocus="true" :list-data="contentData"
      :paddingRect="[0, 0, 0, 0]" @onItemClick='onItemClick'
    >
      <template v-slot:item>
        <MyTemplates />
      </template>
    </qt-waterfall>
    <qt-loading-view v-if="isLoading" class="my_page_loading" color="rgba(255,255,255,0.3)" :focusable="false" />
  </div>
</template>
<script lang='ts' setup>
import { CSSProperties, reactive, computed, ref, onBeforeUnmount } from 'vue';
// import { useLoginDataSource, useUserManager } from "../../api/UseApi"
import MyTemplates from './MyTemplates.vue'
// @ts-ignore
import myApi from '../../api/my/index.ts'
// @ts-ignore
import { Iconfig } from '../../api/my/types.ts'
import { qtRef, QTWaterfallSection } from '@quicktvui/quicktvui3'
// @ts-ignore
import myDataManager, { getUserData,dPageWidth, dPageheight, dPageMarginSpace, IBlockItemData, activity_redirectTypes } from './index.ts'
import { useESRouter, useESNativeRouter } from '@extscreen/es3-router';
import logo from '../../assets/cell-list-focus-img.png'
import userManager from '../../api/login/user/UserManager'
import {UserChangeListener} from '../../api/login/user/UserChangeListener'

const router = useESRouter()
const nRouter = useESNativeRouter()

const cHeaderHeight = 80
const isLoading = ref(true)
const configs = reactive<Iconfig>({})
const bg = ref<any>({ colors: ['#FF00040B', '#FF1A2334'] })
const configStyle = ref<CSSProperties>({})
const pageStyle = computed<CSSProperties>(() => {
  return {
    width: dPageWidth + 'px', height: dPageheight + 'px',
    ...configStyle.value
  }
})

const cHeaderStyle = computed<CSSProperties>(() => {
  return {
    width: (dPageWidth - dPageMarginSpace * 2) + 'px', height: cHeaderHeight + 'px',
    marginLeft: dPageMarginSpace + 'px'
  }
})
const contentStyle = computed<CSSProperties>(() => {
  return {
    width: dPageWidth + 'px',
    height: (dPageheight - cHeaderHeight) + 'px',
  }
})

const contentData = qtRef<QTWaterfallSection[]>()

const onItemClick = (parentPosition, position, item:IBlockItemData)=>{
  if(userManager.getUserInfo()){
    userManager.clearUserInfo()
    return
  }
  if(item._redirectType == activity_redirectTypes.innerRouter && item._router){
    const route = {
      name: item._router.url, //'series_view',
        params: item._router.params?{...item._router.params}:undefined
    }
    if(item._router.isReplace){
      router.replace(route);
    } else {
      router.push(route);
    }
  } else if(item._redirectType == activity_redirectTypes.innerApp && item._action){
    nRouter.launch([['-d', item._action]])
  }
}

let isUserChange = false
let isShow = true
const userChangeListener:UserChangeListener = {
  onUserChanged(user, state){
    isUserChange = true
    updateData()
  }
}
const updateData = async () => {
  if(isUserChange && isShow){
    isLoading.value = true

    // 更新用户信息
    const userinfo = contentData.value[0].itemList[0]
    const newInfo =  userManager.getUserInfo()
    getUserData(userinfo, newInfo)//因为使用了双向绑定，所以这里不需要再使用主动更新ui

    isUserChange = false
    isLoading.value = false
  }
}
// onBeforeUnmount(()=>{ })
defineExpose({
  onESCreate(params){
    isLoading.value = true
    myApi.initPageData(params).then(async (res) => {
      myApi.pageData = res;
      myApi.getConfig().then(config => {
        Object.assign(configs, config)
        if (config.bgColor) {
          configStyle.value.backgroundColor = config.bgColor
        } else if (config.gradientBg) {
          bg.value = config.gradientBg
        }
      })
      const datas = await myDataManager.getData()
      if(datas){
        contentData.value = datas
      }
      isLoading.value = false
    })

    userManager.addUserChangeListener(userChangeListener)
  },
  onESResume() {
    isShow = true
    updateData()
  },
  onESPause(){
    isShow = false
  },
  onESStop(){
    isShow = false
  },
  // onESRestart(){ },
  onESDestroy(){
    userManager.removeUserChangeListener(userChangeListener)
  }
})
</script>
<style scoped>
.my_page {
  position: relative;
  background-color: transparent;
}

.my_header {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  background-color: transparent;
}

.my_header_logo {
  width: 200px;
  height: 80px;
}

.my_content {
  background-color: transparent;
}
.my_page_loading {
  height: 100px; width: 100px;
  position: absolute;
  left: 900px;
  top: 500px;
  background-color: transparent;
  z-index: 999999;
}
</style>
