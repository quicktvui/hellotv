<template>
  <div class="my_page" :style="pageStyle" :gradientBackground="bg">
    <div v-if="cHeaderHeight" class="my_header" :style="cHeaderStyle">
      <img class="my_header_logo" :focusable="false" :src="configs.headerLogo" />
    </div>
    <qt-waterfall ref="waterfall" class="my_content" :style="contentStyle" :requestFocus="true" :list-data="contentData"
      :paddingRect="[0, 0, 0, 0]" @onItemClick='onItemClick'
    >
      <template v-slot:item>
        <MyPoster />
        <MyPosterInfo />
        <MyPosterCard />
        <MyPosterUser />
      </template>
    </qt-waterfall>
    <qt-loading-view v-if="isLoading" class="my_page_loading" color="rgba(255,255,255,0.3)" :focusable="false" />
  </div>
</template>
<script lang='ts' setup>
import { CSSProperties, reactive, computed, ref, onBeforeUnmount } from 'vue';
import MyPoster from './poster/index.vue'
import MyPosterInfo from './poster/info.vue'
import MyPosterCard from './poster/card.vue'
import MyPosterUser from './poster/user.vue'
// @ts-ignore
import myApi from '../../api/my/index.ts'
// @ts-ignore
import { Iconfig } from '../../api/my/types.ts'
import { qtRef, QTWaterfallSection } from '@quicktvui/quicktvui3'
// @ts-ignore
import { dPageWidth, dPageMarginSpace, transHistorySection, transMoreSectin, transOrderSection, IBlockItemData, activity_redirectTypes } from './index.ts'
import { useESRouter, useESNativeRouter } from '@extscreen/es3-router';

const router = useESRouter()
const nRouter = useESNativeRouter()

interface Iprops {
  height?: number;
  isHeader?: boolean;
}
const props = withDefaults(defineProps<Iprops>(), {
  height: 1080, isHeader: false
})

const isLoading = ref(true)
const configs = reactive<Iconfig>({
  headerHeight: 80
})
const bg = ref()
const configStyle = ref<CSSProperties>({})
const pageStyle = computed<CSSProperties>(() => {
  return {
    width: dPageWidth + 'px', height: props.height + 'px',
    ...configStyle.value
  }
})

const cHeaderHeight = computed(() => {
  return props.isHeader&&configs.headerLogo ? configs.headerHeight || 0 : 0
})
const cHeaderStyle = computed<CSSProperties>(() => {
  return {
    width: (dPageWidth - dPageMarginSpace * 2) + 'px', height: cHeaderHeight.value + 'px',
    marginLeft: dPageMarginSpace + 'px'
  }
})
const contentStyle = computed<CSSProperties>(() => {
  return {
    width: dPageWidth + 'px',
    height: (props.height - cHeaderHeight.value) + 'px',
  }
})

const contentData = qtRef<QTWaterfallSection[]>()

const onItemClick = (parentPosition, position, item:IBlockItemData)=>{
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
const updateData = async () => {
  const orderRes = await myApi.getOrderInfo()
  const historyRes = await myApi.getHistorys()
  const moreRes = await myApi.getMoreList()
  moreRes.map(item => item.section)
  contentData.value = [
    transOrderSection(false, orderRes),
    transHistorySection(false, historyRes),
    ...transMoreSectin(false, moreRes)
  ]
  isLoading.value = false
}
onBeforeUnmount(()=>{
  console.log('lsj----onUnmounted')
})
defineExpose({
  init(params) {
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
      updateData()
    })
  },
  update(){
    isLoading.value = true
    updateData()
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