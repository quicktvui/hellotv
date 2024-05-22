<template>
<div class="my_page" :style="pageStyle" :gradientBackground="bg">
  <div v-if="cHeaderHeight" class="my_header" :style="cHeaderStyle">
    <img
      class="my_header_logo" :focusable="false" src="../../assets/cell-list-focus-img.png"
    />
  </div>
  <qt-waterfall
    ref="waterfall"
    class="my_content"
    :style="contentStyle"
    :requestFocus="true"
    :list-data="contentData"
    :paddingRect="[0,0,0,0]"
  >
    <template v-slot:item>
      <MyPoster />
      <MyPosterInfo />
    </template>
  </qt-waterfall>
</div>
</template>
<script lang='ts' setup>
import { CSSProperties, reactive, computed, ref, onMounted } from 'vue';
import MyPoster from './poster/index.vue'
import MyPosterInfo from './poster/info.vue'
// @ts-ignore
import myApi from '../../api/my/index.ts'
// @ts-ignore
import { Iconfig } from '../../api/my/types.ts'
import { qtRef, QTWaterfallSection } from '@quicktvui/quicktvui3'
// @ts-ignore
import { dPageWidth, dPageMarginSpace, transHistorySection } from './index.ts'
interface Iprops {
  height?: number;
  isHeader?: boolean;
}
const props = withDefaults(defineProps<Iprops>(),{
  height: 1080, isHeader: false
})
const configs = reactive<Iconfig>({
  headerHeight: 80
})
const bg = ref()
const configStyle = ref<CSSProperties>({})
const pageStyle = computed<CSSProperties>(()=>{
  return { 
    width: dPageWidth + 'px', height: props.height+'px',
    ...configStyle.value
  }
})

const cHeaderHeight = computed(()=>{
  return props.isHeader ? configs.headerHeight||0 : 0
})
const cHeaderStyle = computed<CSSProperties>(()=>{
  return {
    width: (dPageWidth-dPageMarginSpace*2) +'px', height: cHeaderHeight.value+'px',
    marginLeft: dPageMarginSpace+'px'
  }
})
const contentStyle = computed<CSSProperties>(()=>{
  return {
    width: dPageWidth + 'px',
    height: (props.height - cHeaderHeight.value) +'px',
  }
})

const contentData = qtRef<QTWaterfallSection[]>()
onMounted(()=>{
  myApi.initPageData({}).then(async(res)=>{
    myApi.pageData = res;
    myApi.getConfig().then(config=>{
      Object.assign(configs, config)
      if(config.bgColor){
        configStyle.value.backgroundColor = config.bgColor
      } else if(config.gradientBg){
        bg.value = config.gradientBg
      }
    })

    const historyRes = await myApi.getHistorys()
    contentData.value = [transHistorySection(false, historyRes.section)]
    console.log(contentData.value, '--lsj-contentData')
  })
})
defineExpose({
  async onESCreate(params){}
})
</script>
<style scoped>
.my_page {
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
.my_content{
  background-color: transparent;
}
</style>