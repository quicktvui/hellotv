<template>
  <qt-view class="screen-right-qt-view-root-css" :style="{width:rightContentWidth+'px',height:rightContentHeight+'px'}">
    <scroll-view ref="screen_right_scroll_content" name="screen_right_scroll_content"
      class="screen-right-scroll-root-css" :style="{width:rightContentWidth+'px',height:rightContentHeight+'px'}"
      :clipChildren="false" :clipPadding="false"      
      :focusable="false" :onScrollEnable="true" makeChildVisibleType="none">

      <qt-view :v-show="!loading"
        class="screen-right-qt-view-css" :style="{width:rightContentWidth+'px',height:(rightContentHeight+640)+'px'}"
        :clipChildren="false" :clipPadding="false"      
        :useAdvancedFocusSearch="true" :focusable="false">

        <!-- 筛选条件 -->
        <qt-view :style="{ width: rightContentWidth+'px', minHeight: '1px', backgroundColor: 'transparent' }">
          <qt-list-view v-if="filterVisible" ref="screen_right_filters" name="screen_right_filters"
            class="screen-right-filter-root" :style="{ width: rightContentWidth + 'px', height: filterHeight }"
            :autofocusPosition="isFirstLoad ? 0 : -1"
            :triggerTask="switchData(hideSelectTask)"
            :enableSelectOnFocus="false"
            @item-click="onFilterClick"
          >
            <qt-list-view ref="screen_right_filter_line" name="screen_right_filter_line"
              class="screen-right-filter-line" :style="{ width: rightContentWidth + 'px' }"
              cachePoolName="filter_line" nextFocusLeftSID="screen_left_tags" flexStyle="${filterLineStyle}"
              :type="1" list="${list}"
              :endHintEnabled="false" horizontal :clipChildren="false" :useDiff="true"
              :enableSelectOnFocus="false" singleSelectPosition="${defaultSelectPosition}"
              :focusMemory="false" :blockFocusDirections="['right']"
              @item-focused="onFilterFocused" @item-click="onFilterClick"
            >
              <!-- 普通筛选条件 -->
              <tags-filter-item :type="11"/>
              <!-- 快速筛选头部提示 -->
              <tags-filter-fast-item-left-tip :type="12"/>
              <!-- 快速筛选 -->
              <tags-filter-fast-item :type="13"/>
            </qt-list-view>
            <!-- 横线 -->
            <tags-filter-fast-line :type="2" :focusable="false"/>
            <!-- 更多筛选项 -->
            <tags-filter-more-btn :type="3" :focusable="true"/>
          </qt-list-view>
        </qt-view>

        <!-- 筛选结果 -->
        <qt-grid-view :v-show='!filterClickLoading' ref="screen_right_content" name="screen_right_content"
          class="screen-right-content" :style="{width:rightContentWidth+'px',height:rightContentHeight+'px'}"
          :autofocusPosition="isFirstLoad?(filterVisible?-1:0):-1"
          :descendantFocusability="(loading || filterClickLoading) ? 2 : 1"
          :triggerTask="switchData(filterTriggerTask)"
          :cachePool="{name:'filter_content',size:{1:40,}}"
          :blockFocusDirections="['right','down']"
          :enablePlaceholder="false"
          :spanCount="spanCount" :openPage="true" :preloadNo="4"
          :focusable="false" :pageSize="screenPageSize"
          nextFocusLeftSID="screen_left_tags"
          :listenBoundEvent="true" :useDiff="true"
          :listenHasFocusChange="true"
          :clipChildren="false" :clipPadding="false"
          :loadMore="loadMoreScreenContent"
          :loadingDecoration="{top:15,left:30,bottom:70}"
          @scroll-state-changed="onScrollStateChanged"
          @item-focused="onItemFocused"
          @item-click="onItemClick"
          :padding="'50,24,50,0'"
        >
          <!-- 筛选内容竖图 -->
          <tags-content-item-v :type="1"/>
          <!-- 筛选内容横图 -->
          <tags-content-item-h :type="2"/> <!-- :placeholderLayout="[-5, -5, 321, 180]" -->
          <!-- 底部提示 -->
          <template #footer>
            <qt-text class="screen-right-content-no-more" :style="{width:(rightContentWidth-160)+'px'}"
              :focusable="false" :type="1003" text="${text}" :fontSize="30" :lines="1" gravity="top|center"/>
          </template>
          <!--分页加载 Loading -->
          <template #loading>
            <qt-view class="screen-right-content-more-loading" :style="{width:(rightContentWidth-160)+'px'}" :type="1002" :focusable="false">
              <qt-loading-view color="rgba(21,122,252,0.3)" style="height: 40px;width:40px;"  :focusable="false"/>
            </qt-view>
          </template>
        </qt-grid-view>

      </qt-view>
    </scroll-view>

    <!-- tag切换loading -->
    <qt-view v-if="loading" class="screen-right-content-loading" :style="{width:rightContentWidth+'px',height:rightContentHeight+'px'}"
      :clipChildren="false" :focusable='false'
    >
      <qt-loading-view color="rgba(21,122,252,0.3)" style="height: 100px; width: 100px" :focusable='false'/>
    </qt-view>
    
    <!-- tag筛选点击loading -->
    <qt-view v-if="!loading && filterClickLoading" class="screen-right-filter-click-loading"
      :style="{top:filterHeight,width:rightContentWidth+'px',height: (rightContentHeight-filterHeight)+'px'}"
      :clipChildren="false" :focusable='false'
    >
      <qt-loading-view color="rgba(21,122,252,0.3)" style="height: 100px; width: 100px" :focusable='false'/>
    </qt-view>
    
    <!-- 空结果 -->
    <qt-view v-if="empty" class="screen-right-content-empty" :style="{width:rightContentWidth+'px',height:rightContentHeight+'px'}">
      <img style="width: 560px;height: 350px;" :src="emptyImg"/>
      <span :style="{fontSize: 30,color: 'rgba(255, 255, 255, 0.5)',marginTop: '26px'}">暂无数据</span>
    </qt-view>

    <!-- tag筛选记录 -->
    <qt-view :visible="false" ref="screen_right_selected_tags" name="screen_right_selected_tags"
      class="screen-right-selected-tags" :style="{width:rightContentWidth+'px',height:filterRecordHeight+'px'}"
    >
      <!-- 当前选中tags -->
      <qt-list-view ref="screen_record_list"
        class="screen-right-record-list" :style="{width:(rightContentWidth-66)+'px',height:filterRecordHeight+'px'}"
        horizontal :focusable="false"
      >
        <tags-filter-record :type="14" :focusable="false"/>
      </qt-list-view>
    </qt-view>
  </qt-view>
</template>

<script lang="ts">
import {nextTick, ref, toRaw } from "vue";
import { computed, defineComponent } from "@vue/runtime-core"
import { ESLogLevel, useESLog, useESToast } from '@extscreen/es3-core'
import {useGlobalApi} from "../../../api/UseApi";
import FilterConfig from "../build_data/FilterConfig"
import {
  buildScreenContent, clearAllFilterCondition, clearFastFilterCondition,
  getCurRecordFilter,
  getCurScreenCondition,
  getFilterConditionData,
  getFilterHeight,
  getFilterLength,
  getOffsetY,
  getScrollHeight, isAllFilterListHasData, isFastFilterListHasData,
  updateAllFilterCondition,
  updateFastFilterCondition
} from "../build_data/useTagsData";
import { getFilterMoreItem } from '../build_data/tags/TagsAdapter';
import {
  QTIGridView,
  QTGridViewItem,
  QTIListView,
  QTIView,
  QTIViewVisibility
} from "@quicktvui/quicktvui3";
import TagsContentItemV from "./tags-content-item-v.vue";
import TagsContentItemH from "./tags-content-item-h.vue";
import {QTListViewItem} from "@quicktvui/quicktvui3/dist/src/list-view/core/QTListViewItem";
import TagsFilterItem from "./tags-filter-item.vue";
import TagsFilterFastLine from "./tags-filter-fast-line.vue";
import TagsFilterMoreBtn from "./tags-filter-more-btn.vue";
import TagsFilterFastItemLeftTip from "./tags-filter-fast-item-left-tip.vue";
import TagsFilterFastItem from "./tags-filter-fast-item.vue";
import TagsFilterRecord from "./tags-filter-record.vue";
import {ESIScrollView} from "@extscreen/es3-component";
import { useLaunch } from '../../../tools/launch/useApi'

export default defineComponent({
  name: "tags-content",
  components: {
    TagsFilterRecord,
    TagsFilterFastItem,
    TagsFilterFastItemLeftTip,
    TagsFilterFastLine,
    TagsFilterMoreBtn,
    TagsFilterItem,
    TagsContentItemV,
    TagsContentItemH
  },
  emits:['unBlockFocus'],
  setup(props, context) {
    const screenPageSize = computed(()=>{return FilterConfig.screenPageSize})
    const isShowLeftList = computed(()=>{return FilterConfig.isShowLeftList})
    const isShowTopView = computed(()=>{return FilterConfig.isShowTopView})
    const rightContentWidth = computed(()=>{return FilterConfig.isShowLeftList ? FilterConfig.rightContentWidth:1856})
    const rightContentHeight = computed(()=>{return FilterConfig.isShowTopView ? FilterConfig.rightContentHeight:1060})
    const filterRecordHeight = computed(()=>{return FilterConfig.filterRecordHeight})
    const posterMode = ref<1|2>(2) // 1: 竖图、2: 横图
    const spanCount = ref(posterMode.value === 1 ? FilterConfig.spanVCount : FilterConfig.spanHCount)

    //工具变量
    const log = useESLog()
    const globalApi = useGlobalApi()
    const launch = useLaunch()
    const toast = useESToast()
    //组件变量
    const screen_right_content = ref<QTIGridView>()
    const screen_right_filters = ref<QTIListView>()
    const screen_record_list = ref<QTIListView>()
    const screen_right_selected_tags = ref<QTIView>()
    const screen_right_scroll_content = ref<ESIScrollView>()
    //数据变量
    let screenRightContentData: QTGridViewItem[] = [];
    let screenRightFiltersData: QTListViewItem[] = []
    //本地变量
    let curPageNum = 1
    let isFirstRequest: boolean = false
    let curType: number = -1
    let curTags: string = ""
    let curTagPosition: number = -1
    let curFilterParentPosition = -1
    let curFilterItemPosition = -1
    let focusList:Array<number> = []
    //全局常量
    const emptyImg = ref("http://qcloudcdn.a311.ottcn.com/channelzero_image/web_static/extend_screen/public_images/ic_data_empty.png")

    //全局变量
    let filterHeight = ref(0)
    let filterVisible = ref(false)
    let loading = ref(true)
    let filterClickLoading = ref(false)
    let empty = ref(false)
    let screenItemContentFocus = ref(false)
    let scrollY = ref(0)
    let filterTriggerTask = ref<Array<any>>([])
    let hideSelectTask = ref<Array<any>>([])
    let isFirstLoad = ref(true)

    function init(){
      hideSelectTask.value = [
        {
          event: 'onFocusAcquired',
          target: 'screen_right_selected_tags',
          function: 'changeVisibility',
          params: ['invisible'],
        },
        {
          event: 'onFocusAcquired',
          target: 'screen_right_scroll_content',
          function: 'scrollToWithOptions',
          params: [{x: 0, y:  getScrollHeight() * -1, duration: 300}],
        },
      ]
    }

    function setFilterHeight(moreLimit: number = 0) {
      //单个列表的高度+间距
      filterHeight.value = getFilterHeight(moreLimit)
    }

    function onScrollStateChanged(e) {
      scrollY.value = e.offsetY
    }

    function onItemFocused(e) {
      screenItemContentFocus.value = e.isFocused
      if (e.isFocused){
        const focusValue = focusList[0]
        if (focusValue !== 3){
          focusList[0] = 3
        }
      }
    }

    function onItemClick(e) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d("onItemClick==", e)
      }
      const item = e.item
      launch.launch(item)
    }

    function onFilterClick(e) {
      if (e) {
        // 扩展筛选项
        if (e.item.type === 3) {
          setFilterHeight()
          setFilterTriggerTask()
          screen_right_filters.value?.setDisplay(false)
          screen_right_filters.value?.blockRootFocus()
          screenRightFiltersData.splice(FilterConfig.filterMoreLimit, 1, ...getFilterMoreItem())
          setTimeout(() => {
            screen_right_filters.value?.unBlockRootFocus()
            screen_right_filters.value?.setItemFocused(FilterConfig.filterMoreLimit)
            screen_right_filters.value?.setDisplay(true)
          }, 400)
          return
        }

        filterClickLoading.value = true
        const parentPosition = e.parentPosition
        const itemPosition = e.position
        if (parentPosition === curFilterParentPosition && itemPosition === curFilterItemPosition){
          return
        }
        curFilterParentPosition = parentPosition
        curFilterItemPosition = itemPosition
        //更新当前值
        screenRightFiltersData[parentPosition].defaultSelectPosition = itemPosition

        if(screenRightFiltersData[parentPosition].isFastList){
          //更新快速标签原始数据值
          updateFastFilterCondition(itemPosition)
          //清除普通标签
          clearAllFilterCondition(0)
          //更新普通标签
          if (isAllFilterListHasData()){
            const filterData = JSON.parse(JSON.stringify(screenRightFiltersData))
            filterData.forEach((item,index)=>{
              if (!item.isFastList){
                screenRightFiltersData[index].defaultSelectPosition = 0
              }
            })
          }
        }else{
          //更新普通标签原始数据
          updateAllFilterCondition(parentPosition,itemPosition)
          //清除快速标签
          clearFastFilterCondition()
          //更新快速标签
          if (isFastFilterListHasData()){
            screenRightFiltersData[screenRightFiltersData.length-1].defaultSelectPosition = -1
          }
        }
       getScreenByTags(1,curType,"",curTagPosition,false,true)
      }
    }

    function onFilterFocused(e){
      if (e.isFocused){
        focusList = []
      }
    }

    function clearContentFocus(){
      screen_right_content.value?.clearFocus()
    }

    function onScrollToTop() {
      const delay = curType === 3 ? 400 : 200
      if (curType === 3){
        screen_right_content.value?.scrollToSelected(0,true)
        const y = getScrollHeight() * -1
        screen_right_scroll_content.value?.scrollToWithOptions(0,y,300)
      }else{
        screen_right_content.value?.scrollToTop()
      }

      setTimeout(()=>{
        context.emit("unBlockFocus")
        if (curType === 3){
          screen_right_filters.value?.setItemFocused(0)
        }else{
          screen_right_content.value?.setItemFocused(0)
        }
      },delay)
      scrollY.value = 0
    }

    function switchData(data) {
      return toRaw(data)
    }

    function getScreenByTags(pageNum: number, type: number, tagNames: string, position: number, isLoadMore: boolean = false, isClick: boolean) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d("getScreenByTags===", `type==${type}==tagName==${tagNames}`)
      }
      curPageNum = pageNum
      curType = type
      curTagPosition = position
      if (curPageNum === 1) {
        empty.value = false
      }
      isFirstRequest = true
      if (type === 3) {//筛选
        curTags = getCurScreenCondition() //获取筛选条件
        if (isClick){
          setFilterTriggerTask()
          setRecordTip()
        }
        if (!isLoadMore && !isClick) {
          setRecordTip()
          setFilterHeight(FilterConfig.filterMoreLimit)
          setFilterTriggerTask()
          filterVisible.value = true
        }
        let filterList: Array<QTListViewItem> = []
        if (!isLoadMore && !isClick) {
          filterList = getFilterConditionData(FilterConfig.filterMoreLimit)
        }
        nextTick(() => {
          if (!isLoadMore && !isClick) {
            screenRightFiltersData = screen_right_filters.value!.init(filterList)
          }
          setTimeout(() => {
            setScreenResultData(curPageNum, curType, curTags,isClick)
            loading.value = false
          }, 300)
        })
      }
      else {
        if (!isLoadMore && !isClick){
          if (focusList.length > 0 && focusList[0] === 3){
            focusList = []
            screen_right_selected_tags.value?.setVisibility(QTIViewVisibility.INVISIBLE)
            const y = getScrollHeight() * -1
            screen_right_scroll_content.value?.scrollToWithOptions(0,y,300)
          }
        }
        filterTriggerTask.value = []
        curTags = tagNames
        filterVisible.value = false

        setScreenResultData(curPageNum, curType, curTags,isClick)
      }
    }

    function setFilterTriggerTask() {
      const length = getFilterLength(FilterConfig.filterMoreLimit)
      filterTriggerTask.value = (length > 1) ? [
        getOffsetY() ? {
          event: 'onFocusAcquired',
          target: 'screen_right_selected_tags',
          function: 'changeVisibility',
          params: ['visible'],
        } : {},
        {
          event: 'onFocusAcquired',
          target: 'screen_right_scroll_content',
          function: 'scrollToWithOptions',
          params: [{x: 0, y: filterHeight.value, duration: 300}],
        }] : []
    }

    function setRecordTip(){
      const recordList: Array<QTListViewItem> = getCurRecordFilter()
      screen_record_list.value?.init(recordList)
      screen_record_list.value!.stopPage()
    }

    function setScreenResultData(pageNum: number, type: number, tagNames: string,isClick: boolean) {
      globalApi.getScreenContentByTags(tagNames, curPageNum).then((res: Array<any>) => {
        const screenContentList: Array<QTGridViewItem> = buildScreenContent(res, curPageNum, posterMode.value)
        if (screenContentList && screenContentList.length > 0) {
          if (curPageNum === 1) {
            screenRightContentData = screen_right_content.value!.init(screenContentList)
            //设置 gridview滚动到顶部并设置 selected
            if (screenRightContentData && screenRightContentData.length > 0) {
              screen_right_content.value?.scrollToSelected(0, true)
            }
            if (type !== 3) {
              loading.value = false
            }else{
              const delay = isClick ? 300 : 0
              setTimeout(()=>{
                filterClickLoading.value = false
              },delay)
            }
          } else {
            if (screenRightContentData && screenRightContentData.length > 0) {
              screenRightContentData.push(...screenContentList)
            }
          }
          if(isFirstLoad.value){
            setTimeout(()=>{isFirstLoad.value = false},500)
          }
        } else {
          if (curPageNum === 1) {//首次无数据,且已经添加过数据
            if (screenRightContentData && screenRightContentData.length > 0) {
              screenRightContentData!.splice(0)
            }
            if (type !== 3) {
              loading.value = false
              empty.value = true
            }else{
              filterClickLoading.value = false
              toast.showToast("没有更多内容啦！")
            }
          } else {
            if (screenRightContentData && screenRightContentData.length > 0) {
              setTimeout(()=>{screen_right_content.value!.stopPage()},400)
            }
          }
        }
      })
    }

    function loadMoreScreenContent(e) {
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.d("loadMoreScreenContent===loadMoreScreenContent--", e)
      }
      if (isFirstRequest) {
        curPageNum++
        getScreenByTags(curPageNum, curType, curTags, curTagPosition, true, false)
      }

    }

    return {
      init,
      getScreenByTags,
      loadMoreScreenContent,
      onScrollStateChanged,
      onItemFocused,
      onItemClick,
      onFilterClick,
      onFilterFocused,
      onScrollToTop,
      switchData,
      clearContentFocus,

      screen_right_content,
      screen_right_filters,
      screen_record_list,
      screen_right_selected_tags,
      screen_right_scroll_content,

      emptyImg,
      hideSelectTask,

      filterHeight,
      filterVisible,
      loading,
      filterClickLoading,
      empty,
      scrollY,
      screenItemContentFocus,
      filterTriggerTask,
      screenPageSize,
      isFirstLoad,
      isShowLeftList,
      isShowTopView,
      rightContentWidth,
      rightContentHeight,
      filterRecordHeight,
      spanCount
    }
  }
})
</script>

<style src="../css/tags-right-content.css"></style>
