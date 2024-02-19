<template>
  <qt-view class="search_root" ref="search_root">
    <!-- 背景渐变 -->
    <qt-view class="search_root_bg" :gradientBackground="{colors:['#252930', '#2F3541']}" :focusable="false"/>
    <!-- scroll-view -->
    <scroll-view  ref="search_scroll_view" class="search_scroll_view" :horizontal="true" :focusable="false"
      name="search_scroll_view" :onScrollEnable="true" makeChildVisibleType="none">
      <qt-view class="scroll_view_content" :useAdvancedFocusSearch="true" :focusable="false">
        <!-- 搜索键盘 -->
        <search-keyboard
          ref="search_keyboard"
          name="search_keyboard_view"
          :blockFocusDirections="['up', 'down']"
          :nextFocusName="{right:'search_center_view'}"
          @inputChange="onInputChange"
          @scroll-to-index="onNeedScrollTo"/>
        <!-- 搜索内容 -->
        <search-center
          ref="search_center"
          name="search_center_view"
          :blockFocusDirections="['up', 'down']"
          :nextFocusName="{right:'search_result_view'}"
          @keyword-select="onKeywordSelect"
          :search-letter="searchLetter"
          @scroll-to-index="onNeedScrollTo"/>
        <!-- 搜索结果 -->
        <search-result
          ref="search_result"
          name="search_result_view"
          :blockFocusDirections="['up', 'down']"
          :keyword="selectKeyword"
          :show-is-full-screen="scrollState == 1"
          :nextFocusName="{left:'search_center_view',}"
          @scroll-to-index="onNeedScrollTo"/>
      </qt-view>
    </scroll-view>
  </qt-view>
</template>

<script lang="ts">
import {defineComponent} from "@vue/runtime-core";
import {ref} from "vue";
import searchKeyboard from "./component/search-keyboard.vue";
import searchCenter from "./component/search-center.vue";
import searchResult from "./component/search-result.vue";
import {useESRouter, useESNativeRouter} from "@extscreen/es3-router";

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
    const router = useESRouter()
    const search_root = ref()
    const search_scroll_view = ref()
    const search_keyboard = ref()
    const search_center = ref()
    const search_result = ref()
    let selectKeyword = ref('')
    let searchLetter = ref('')
    let scrollState = ref(0)
    // 生命周期
    const onESCreate = (params) => {
      search_keyboard.value!.initComponent()
      search_center.value!.initComponent()
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
      searchLetter.value = inputText;
    }

    const onNeedScrollTo = (index: number) => {
      console.log(index,'onNeedScrollToonNeedScrollToonNeedScrollToonNeedScrollTo')
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
      search_result,selectKeyword,searchLetter,
      onNeedScrollTo,
      onESCreate, onESStart, onESResume, onESStop, onESDestroy, onBackPressed
    }
  }
})
</script>

<style scoped src="./css/search.css"></style>

