<template>
  <div class="my_page" :style="pageStyle" :gradientBackground="bg">
    <qt-waterfall
      ref="waterfall"
      class="my_content"
      :style="contentStyle"
      :requestFocus="true"
      :listData="contentData"
      :paddingRect="[0, 0, 0, 0]"
      @onItemClick="onItemClick"
    >
      <template v-slot:item>
        <my-templates />
      </template>
    </qt-waterfall>
    <qt-loading-view v-if="isLoading" class="my_page_loading" color="rgba(255,255,255,0.3)" :focusable="false" />
  </div>
</template>

<script lang="ts" setup>
import { computed, CSSProperties, nextTick, Ref, ref } from 'vue'
import MyTemplates from './my-templates.vue'
import myApi from '../../api/my/index'
import { qtRef, QTWaterfallSection } from '@quicktvui/quicktvui3'
import { dPageheight, dPageWidth, IBlockItemData, myDataManager2, transCenterSection, transHistorySection } from './my-data-manager'
import userManager from '../../api/user/user-manager'
import { UserChangeListener, UserInfo } from '../../api/user/impl-user'
import { QTIWaterfall } from '@quicktvui/quicktvui3/dist/src/waterfall/core/QTIWaterfall'
import { useESToast } from '@extscreen/es3-core'

const toast = useESToast()
const isLoading = ref(true)
const lastClickSid = ref('')
const bg = ref<any>({ colors: ['#FF1C222B', '#FF00040B'] })
const configStyle = ref<CSSProperties>({})
const pageStyle = computed<CSSProperties>(() => {
  return {
    width: dPageWidth + 'px',
    height: dPageheight + 'px',
    ...configStyle.value
  }
})

const contentStyle = computed<CSSProperties>(() => {
  return {
    width: dPageWidth + 'px',
    height: dPageheight + 'px'
  }
})
const waterfall: Ref<QTIWaterfall | undefined> = ref()
const contentData = qtRef<QTWaterfallSection[]>()

const onItemClick = (pageId, sectionId, item: IBlockItemData) => {
  if (item.jumpParams.options === '') {
    toast.showToast('跳转页面')
  } else {
    myDataManager2.routerLaunch(item)
    lastClickSid.value = item._id
  }
}

let isUserChange = false
let isShow = true
const userChangeListener: UserChangeListener = {
  onUserChanged: (userInfo) => {
    isUserChange = true
    updateData(userInfo)
  }
}
const updateData = async (newInfo?: UserInfo | null) => {
  if (!newInfo) {
    newInfo = userManager.getUserInfo()
  }
  console.log('updateData:' + isUserChange + ' ' + isShow + ' userInfo:' + !!newInfo)
  if (isUserChange && isShow) {
    isLoading.value = true
    // 更新用户信息
    const newVipInfo = await myApi.getVipInfo()
    contentData.value[0] = transCenterSection(newVipInfo, newInfo)
    isUserChange = false
  }
  // 更新历史数据，对比当前数据，需要注意当前判断是根据的文字，可能存在文字相同不更新的问题
  const historyRes = await myApi.getHistorys()
  const hisSection = transHistorySection(historyRes, newInfo)
  let oldHistory = ''
  if (contentData.value[1]) {
    oldHistory = JSON.stringify(contentData.value[1].itemList.map((e) => ({ title: e.title.text, subTitle: e.subTitle.text })))
  }
  let newHistory = JSON.stringify(hisSection.itemList.map((e) => ({ title: e.title.text, subTitle: e.subTitle.text })))
  // console.log('oldHistory:'+JSON.stringify(oldHistory))
  // console.log('newHistory:'+JSON.stringify(newHistory))
  if (oldHistory != newHistory) {
    contentData.value[1] = hisSection
  }
  isLoading.value = false
  //自动寻焦点
  if (lastClickSid.value) {
    console.log('autofocus:' + lastClickSid.value)
    waterfall.value?.setAutoFocus(lastClickSid.value, 0)
    lastClickSid.value = ''
  }
}

defineExpose({
  onESCreate(params) {
    isLoading.value = true
    myApi.initPageData(params).then(async (res) => {
      const datas = await myDataManager2.getData()
      if (datas) {
        contentData.value = datas
      }
      isLoading.value = false
    })

    userManager.addUserChangeListener(userChangeListener)
    //添加卡片监听
  },
  onESResume() {
    isShow = true
    updateData()
  },
  onESPause() {
    isShow = false
  },
  onESStop() {
    isShow = false
  },
  // onESRestart(){ },
  onESDestroy() {
    userManager.removeUserChangeListener(userChangeListener)
  }
})
</script>

<style scoped>
.my_page {
  position: relative;
  background-color: transparent;
}

.my_content {
  background-color: transparent;
}
.my_page_loading {
  height: 100px;
  width: 100px;
  position: absolute;
  left: 900px;
  top: 500px;
  background-color: transparent;
  z-index: 999999;
}
</style>
