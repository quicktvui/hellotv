<template>
  <qt-view class="search_root" ref="search_root">
    <!-- 背景渐变 -->
    <qt-view class="search_root_bg" :gradientBackground="{colors:['#252930', '#2F3541']}" :focusable="false"/>
    <!-- scroll-view -->
    <scroll-view  ref="search_scroll_view" class="search_scroll_view" :horizontal="true" :focusable="false"
      name="search_scroll_view" :onScrollEnable="true" makeChildVisibleType="none">
      <qt-view class="scroll_view_content" :style="{width:rootWidth}" :useAdvancedFocusSearch="true" :focusable="false">
        <!-- 搜索键盘 -->
        <search-keyboard
          ref="search_keyboard"
          name="search_keyboard_view"
          :blockFocusDirections="['up', 'down','left']"
          :nextFocusName="{right:'search_center_view'}"
          @inputChange="onInputChange"
          @scroll-to-index="onNeedScrollTo"/>
        <!-- 搜索内容 -->
        <search-center
          v-if="isShowCenterSearch"
          v-show="!loading"
          :descendantFocusability="loading ? 2 : 1"
          ref="search_center"
          name="search_center_view"
          :blockFocusDirections="['up', 'down']"
          :nextFocusName="{right:'search_result_view'}"
          @keyword-select="onKeywordSelect"
          @close-loading="closeLoading"
          :search-letter="searchLetter"
          @scroll-to-index="onNeedScrollTo"/>
        <!-- 搜索结果 -->
        <search-result
          v-show="!loading"
          ref="search_result"
          name="search_result_view"
          :blockFocusDirections="['up', 'down']"
          :keyword="selectKeyword"
          :show-is-full-screen="scrollState === 1"
          :nextFocusName="{left:'search_center_view',}"
          @scroll-to-index="onNeedScrollTo"/>
      </qt-view>
    </scroll-view>
    <qt-view v-if="loading" :style="{left:loadingLeft+'px',width:loadingWidth+'px'}" class="search_start_loading" :focusable="false"
             :gradientBackground="{ colors: ['#ff252930','#FF2F3541'] }">
      <qt-loading-view color="rgba(255,255,255,0.3)" style="height: 100px;width:100px" :focusable="false"/>
    </qt-view>
  </qt-view>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/runtime-core"
import {ref} from "vue";
import searchKeyboard from "./component/search-keyboard.vue";
import searchCenter from "./component/search-center.vue";
import searchResult from "./component/search-result.vue";
import {useESRouter, useESNativeRouter} from "@extscreen/es3-router";
import SearchConfig from "./build_data/SearchConfig"

export default defineComponent({
  name: "search",
  components: {searchKeyboard,searchCenter,searchResult},
  props:{
    height:{
      type:String,
      default: "80px"
    }
  },
  setup(props, context) {
    const isShowCenterSearch = computed(()=>SearchConfig.isShowCenterSearch)
    const rootWidth = computed(()=> SearchConfig.isShowCenterSearch ? 3073 : 2554)
    const loadingWidth = computed(()=>(1920-SearchConfig.leftWidth))
    const loadingLeft = computed(()=>SearchConfig.leftWidth)
    const router = useESRouter()
    const search_root = ref()
    const search_scroll_view = ref()
    const search_keyboard = ref()
    const search_center = ref()
    const search_result = ref()
    let selectKeyword = ref('')
    let searchLetter = ref('')
    let scrollState = ref(0)
    let loading = ref(false)
    // 生命周期
    const onESCreate = (params) => {
      search_keyboard.value!.initComponent()
      if (SearchConfig.isShowCenterSearch){
        search_center.value!.initComponent()
      }else{
        //todo 获取推荐数据
      }
    }
    const onESStart = () => {}
    const onESResume = () => {}
    const onESStop = () => {}
    const onESDestroy = () => {}

    const onKeywordSelect = (keyword: string) => {
     selectKeyword.value = keyword;
      // searchLetter = searchLetter;
    }
    const onInputChange = (inputText: string) => {
      loading.value = true
      if (isShowCenterSearch){
        searchLetter.value = inputText;
      }else{

      }
    }
    const closeLoading = ()=> {
      setTimeout(()=>{loading.value = false},300)

    }

    const onNeedScrollTo = (index: number) => {
      if (index == 0) {
        if (scrollState.value == 0) return;
        scrollState.value = 0;
      }
      if (index == 2) {
        if (scrollState.value == 1) return;
        scrollState.value = 1;
      }
    }
    //按键 返回
    const onBackPressed = () => {
      if (scrollState.value === 1){
        onNeedScrollTo(0)
        search_keyboard.value.requestDefaultFocus();
        return
      }else{
        // this.$refs.search_result_view.dealFocus()
        router.back()
      }
    }
    return {
      search_root,search_scroll_view,scrollState,
      search_keyboard,onInputChange,
      search_center,onKeywordSelect,
      search_result,selectKeyword,searchLetter,isShowCenterSearch,rootWidth,loading,loadingWidth,loadingLeft,
      onNeedScrollTo,
      onESCreate, onESStart, onESResume, onESStop, onESDestroy, onBackPressed,closeLoading
    }
  }
})
</script>

<style scoped src="./css/search.css"></style>

