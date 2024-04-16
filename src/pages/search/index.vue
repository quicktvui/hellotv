<template>
  <qt-view class="search_root" ref="search_root">
    <!-- 背景渐变 -->
    <qt-view class="search_root_bg" :gradientBackground="{ colors: ['#252930', '#2F3541'] }" :focusable="false" />
    <!-- scroll-view -->
    <scroll-view ref="search_scroll_view" class="search_scroll_view" :horizontal="true" :focusable="false"
      name="search_scroll_view" :onScrollEnable="true" makeChildVisibleType="none">
      <qt-view class="scroll_view_content" :style="{ width: rootWidth }" :useAdvancedFocusSearch="true"
        :focusable="false">
        <!-- 搜索键盘 -->
        <search-keyboard ref="search_keyboard" name="search_keyboard_view"
          :blockFocusDirections="['up', 'down', 'left']" :nextFocusName="{ right: 'search_center_view' }"
          @inputChange="onInputChange" @scroll-to-index="onNeedScrollTo" />
        <!-- 搜索内容 -->
        <search-center v-if="isShowCenterSearch" v-show="!loading" :descendantFocusability="loading ? 2 : 1"
          ref="search_center" name="search_center_view"
          :blockFocusDirections="['up', 'down', showResultLoading ? 'right' : '']"
          :nextFocusName="{ right: 'search_result_view' }" @keyword-select="onKeywordSelect"
          @close-loading="closeLoading" @start-loading="startLoadResultLoading" :search-letter="searchLetter"
          @scroll-to-index="onNeedScrollTo" />
        <!-- 搜索结果 -->
        <search-result :visible="!loading" ref="search_result" name="search_result_view"
          :blockFocusDirections="['up', 'down']" :keyword="selectKeyword" :show-is-full-screen="scrollState === 1"
          :nextFocusName="{ left: 'search_center_view', }" @scroll-to-index="onNeedScrollTo"
          @close-loading="closeLoading" @close-self-loading="closeResultLoading" />
      </qt-view>
    </scroll-view>
    <qt-view v-if="loading" :style="{ left: loadingLeft + 'px', width: loadingWidth + 'px' }"
      class="search_start_loading" :focusable="false" :gradientBackground="{ colors: ['#ff252930', '#FF2F3541'] }">
      <qt-loading-view color="rgba(255,255,255,0.3)" style="height: 100px;width:100px" :focusable="false" />
    </qt-view>
    <!-- 页面loading-->
    <qt-view v-if="showResultLoading && isShowCenterSearch" :focusable="false" class="search_result_loading"
      :style="{ width: rightLoadingWidth }" :gradientBackground="{ colors: ['#252930', '#2F3541'] }">
      <qt-loading-view style="width: 100px;height: 100px;" />
    </qt-view>
  </qt-view>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/runtime-core"
import { ref } from "vue";
import searchKeyboard from "./component/search-keyboard.vue";
import searchCenter from "./component/search-center.vue";
import searchResult from "./component/search-result.vue";
import { useESRouter, useESNativeRouter } from "@extscreen/es3-router";
import SearchConfig from "./build_data/SearchConfig"
import { ESKeyEvent } from "@extscreen/es3-core"

export default defineComponent({
  name: "search",
  components: { searchKeyboard, searchCenter, searchResult },
  props: {
    height: {
      type: String,
      default: "80px"
    }
  },
  setup(props, context) {
    const isShowCenterSearch = computed(() => SearchConfig.isShowCenterSearch)
    const rightLoadingWidth = computed(() => SearchConfig.rightLoading)
    const rootWidth = computed(() => SearchConfig.isShowCenterSearch ? 3073 : 2554)
    const loadingWidth = computed(() => (1920 - SearchConfig.leftWidth))
    const loadingLeft = computed(() => SearchConfig.leftWidth)
    const router = useESRouter()
    const search_root = ref()
    const search_scroll_view = ref()
    const search_keyboard = ref()
    const search_center = ref()
    const search_result = ref()
    const curItemSid = ref("")
    const defaultItemSid = ref("")
    let selectKeyword = ref('')
    let searchLetter = ref('')
    let scrollState = ref(0)
    let showResultLoading = ref(true)
    let loading = ref(false)
    let curChildIndex = 0
    //todo
    let delayHandleFocusChange: any = -1
    let selectKeyWordTimer: any = -1
    // 生命周期
    const onESCreate = (params) => {
      //无词条列表时，直接获取推荐列表
      if (!SearchConfig.isShowCenterSearch) {
        loading.value = true
        showResultLoading.value = false
        search_result.value!.initTab(true)
      }
    }
    const onESStart = () => { }
    const onESResume = () => { }
    const onESStop = () => { }
    function onKeyDown(keyEvent: ESKeyEvent): boolean {
      if (curChildIndex !== 2) {
        search_result.value.cancelAll()
      }
      return false
    }
    const onESDestroy = () => {
      delayHandleFocusChange && clearTimeout(delayHandleFocusChange)
      selectKeyWordTimer && clearTimeout(selectKeyWordTimer)
    }

    const startLoadResultLoading = (isShow: boolean) => {
      showResultLoading.value = isShow
    }

    const onKeywordSelect = (keyword: string) => {
      if (selectKeyword.value === keyword) {
        showResultLoading.value = false
        return
      }
      selectKeyWordTimer && clearTimeout(selectKeyWordTimer)
      selectKeyWordTimer = setTimeout(() => {
        selectKeyword.value = keyword;
      }, 500)
    }
    const onInputChange = (inputText: string) => {
      loading.value = true
      if (isShowCenterSearch.value) {
        searchLetter.value = inputText;
      } else {
        if (selectKeyword.value === inputText) {
          showResultLoading.value = false
          return
        }
        showResultLoading.value = false
        selectKeyWordTimer && clearTimeout(selectKeyWordTimer)
        selectKeyWordTimer = setTimeout(() => {
          selectKeyword.value = inputText;
        }, 500)
      }
    }
    const closeLoading = () => {
      setTimeout(() => { loading.value = false }, 500)
    }
    const closeResultLoading = () => {
      showResultLoading.value = false
    }

    const onNeedScrollTo = (index: number, delay: number) => {
      curChildIndex = index
      delayHandleFocusChange && clearTimeout(delayHandleFocusChange)
      delayHandleFocusChange = setTimeout(() => {
        if (index == 0 || index == 1) {
          if (scrollState.value == 0) return;
          scrollState.value = 0;
        }
        if (index == 2) {
          if (scrollState.value == 1) return;
          scrollState.value = 1;
        }
      }, delay)

    }
    //按键 返回
    const onBackPressed = () => {
      if (scrollState.value === 1) {
        onNeedScrollTo(0, 0)
        search_keyboard.value.requestDefaultFocus();
        return
      } else {
        router.back()
      }
    }
    return {
      search_root, search_scroll_view, scrollState,
      search_keyboard, onInputChange,
      search_center, onKeywordSelect, startLoadResultLoading,
      search_result, selectKeyword, searchLetter, isShowCenterSearch, rootWidth, loading, loadingWidth,
      loadingLeft, showResultLoading, rightLoadingWidth,
      onNeedScrollTo, onKeyDown,
      onESCreate, onESStart, onESResume, onESStop, onESDestroy, onBackPressed, closeLoading, closeResultLoading
    }
  }
})
</script>

<style scoped src="./css/search.css"></style>
