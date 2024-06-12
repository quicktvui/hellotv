<template>
  <div class="h_content" ref="hContentRef" :focusable="false" :height="pHeight" :width="pWidth"
    :blockFocusDirections="rBlockFocusDirections" :clipChildren="false" :nextFocusName="gvNextFocusName">
    <!-- :nextFocusName="{ up: 'h_tab_name' }" :disablePlaceholder="true" -->
    <qt-grid-view v-show="pageState !== pageStates.empty" class="grid_view" ref="gridViewRef" :height="pHeight"
      :width="pWidth" name="content_grid_name" @item-click="onItemClick" :clipChildren="false" :clipPadding="false"
      :spanCount="pConfig.contentColumn" :areaWidth="pWidth" :focusable="false" padding="0,0,0,20" :pageSize="0"
      :blockFocusDirections="['down']" :openPage="true" :preloadNo="1" :listenBoundEvent="true" :loadMore="loadMoreFn"
      @item-bind="onItemBind" @scroll-state-changed="onScrollStateChanged" :enableSelectOnFocus="false" 
      :enablePlaceholder="false" :requestFocus="isRequestFocus" 
      @item-focused="onItemFocuseFn" :selected="false"
      :enableStatesOnFocus="enableStatesOnFocusArr"
    >
      <!-- @scroll-state-changed="onScrollStateChanged" -->
      <qt-view type="1001" class="content_type" :focusable="false">
        <text-view :focusable="false" :duplicateParentState="true" :fontSize="38" gravity="centerVertical"
          class="content_type_name" text="${assetTitle}" />
      </qt-view>
      <HContentPoster :type="10001" :clipChildren="false" />
      <qt-text showIf="${editMode==false}" :type="1003" class="screen-right-content-no-more" gravity="center"
        :focusable="false" text="已经到底啦，按【返回键】回到顶部"></qt-text>
      <!--分页加载 Loading 1002  name="loading" type="1003" -->
      <template v-slot:loading>
        <qt-view class="screen-right-content-more-loading" :type="1002" name="loading" :focusable="false">
          <qt-loading-view color="rgba(255,255,255,0.3)" style="height: 40px;width: 40px;" :focusable="false" />
        </qt-view>
      </template>

    </qt-grid-view>
    <qt-view v-show="isShowScreenLoading" class="screen-right-content-loading" :clipChildren="false" :focusable="false">
      <qt-loading-view color="rgba(255,255,255,0.3)" style="height: 100px; width: 100px" :focusable="false" />
      <qt-text v-show="screenLoadingTxt" class="loading_txt" :text="screenLoadingTxt" gravity="center"
        :focusable="false"></qt-text>
    </qt-view>
    <HistoryEmpty v-show="pageState === pageStates.empty" :msg="emptyTxt" :bigImg="pConfig.emptyImg"
      :focusable="false" />
  </div>
</template>
<script lang='ts' setup>
import { nextTick, ref } from "vue";
import {
  QTIListView
} from '@quicktvui/quicktvui3';
import { useESToast } from "@extscreen/es3-core";
// @ts-ignore
import { getContentList, getContentCategoryConfig } from '../index.ts'
// @ts-ignore
import api from '../../../api/history/index.ts'
import HistoryEmpty from './HistoryEmpty.vue'
import { useESRouter } from "@extscreen/es3-router";
import HContentPoster from './HContentPoster/index.vue'
import { Native } from "@extscreen/es3-vue";
import { IcurrentItemParams } from "../../../api/history/baseApi";
import { Iconfig } from "../config";

const props = withDefaults(defineProps<{
  detailPageName?: string; emptyTxt?: string; pHeight?: number;
  pWidth?: number; pConfig: Iconfig, setDataCallBack: (boo: boolean) => void
}>(), {
  pHeight: 900, pWidth: 1570
})

const isEdit = ref(false)
const pageStates = { init: -1, empty: 0, loading: 1, ready: 2, noMore: 3 }
const pageState = ref(pageStates.init)
const rBlockFocusDirections = ref<any[]>([])

const router = useESRouter()
const gridViewRef = ref<QTIListView>();
const hContentRef = ref()
const toast = useESToast()
const isShowScreenLoading = ref(true)
const screenLoadingTxt = ref('')
let gridDataRec: any[] = []
let preCurrentMenu: any = null
let preCurrentFilter: any = null
let isFirst = true
let contentDataHeight = 0
let initRowsHeight = 0
let prePageNum = 0
let contentLenth = 0
let contentScrollY = 0
let isInit = true
let prevItemIndex: string | number = -1
let isReStartload = false
const isRequestFocus = ref(true)

const gvNextFocusName = ref({up: 'h_tab_name'})

const emits = defineEmits(['emContentClearAll', 'emInitNoData'])
const onItemBind = () => { }
const onItemClick = (arg) => {
  if (isEdit.value) {
    if (isShowScreenLoading.value) return //正在删除，防止重复点击
    isShowScreenLoading.value = true
    screenLoadingTxt.value = '正在删除...'
    api.deleteContent(preCurrentMenu, preCurrentFilter, {
      index: arg.position,
      item: arg.item
    }).then(res => {
      isShowScreenLoading.value = false
      screenLoadingTxt.value = ''
      if (res) {
        const index = gridDataRec.findIndex(item => {
          return item._key === arg.item._key
        })
        gridDataRec.splice(index, 1)
        contentLenth--
        if (contentLenth <= 0) {
          gridViewRef.value?.clearFocus()
          gridDataRec!.splice(0)
          isEdit.value = false
          pageState.value = pageStates.empty
          emits('emContentClearAll')
        }
      }
    }).catch(() => {
      isShowScreenLoading.value = false
      screenLoadingTxt.value = ''
    })
    // toast.showLongToast(arg.item._key + '--' + arg.item.type)
  } else {
    // console.log('lsj-go-player', arg.item)
    if (props.detailPageName) {
      prevItemIndex = arg.item?.id//.position
      router.push({
        name: props.detailPageName, //'series_view',
        params: {
          mediaId: arg.item.metaId,
          playId: arg.item.playCount,//第几集
          playPosition: arg.item.currentPlayTime || 0//播放进度时间
        }
      });
    }
  }
}
const onScrollStateChanged = (ev) => {
  contentScrollY = ev.offsetY
}

const dEnableStatesOnFocusArr = ['selected']
const enableStatesOnFocusArr = ref<string[]>([])
let lastFocusedId = -1
let lastFocusedPosition = -1
const onItemFocuseFn = (arg) => {
  if (arg.hasFocus) {
    lastFocusedId = arg.item?.id
    lastFocusedPosition = arg.position
  } else {
    lastFocusedId = -1
    lastFocusedPosition = -1
  }
}
// 加载更多数据
let prePageNo = 0
const loadMoreFn = (pageNo: number) => {
  // console.log('lsj-loadmore', pageNo,prePageNo)
  if (prePageNo === pageNo) { return }
  prePageNo = pageNo
  if (pageState.value === pageStates.noMore) {
    return//没有更多数据了
  }
  if (pageState.value === pageStates.loading || pageState.value === pageStates.init) {
    return //正在加载数据
  }
  if (pageState.value === pageStates.empty) {
    return //空数据
  }
  if (isFirst) {
    return//首次加载
  }
  if (gridDataRec) {
    pageState.value = pageStates.loading
    // gridDataRec.push({ type: '1002' })
    api.getContentList(preCurrentMenu, preCurrentFilter, prePageNum).then(res => {
      // gridDataRec.pop()
      if (res?.data?.length) {
        // gridDataRec.pop()
        const { arr, dataHeight } = getContentList(res.data, props.pWidth, props.pConfig, isEdit.value)
        // @ts-ignore
        // gridViewRef.value?.insertItem(gridDataRec.length, arr.concat([{type:101}]))
        gridDataRec.push(...arr)//...arr.concat([{type:101}])
        contentDataHeight += dataHeight
        pageState.value = pageStates.ready
        contentLenth += arr.length
      } else {
        pageState.value = pageStates.noMore
        if (contentDataHeight >= props.pHeight) {
          gridDataRec.push(...[{ type: 1003, editMode: false }])
        }
        gridViewRef.value!.stopPage()
      }
      prePageNum++
    }).catch(err => {
      // gridDataRec.pop()
      pageState.value = pageStates.ready
    })
  }
}
// Native.callUIFunction(hContentRef.value, 'blockRootFocus', []);
// Native.callUIFunction(hContentRef.value, 'unBlockRootFocus', []);
// 首次加载数据
const getFirstContentListApi = (currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams) => {
  prePageNum = 1
  return api.getContentList(currentMenu, currentFilter, 1).then(res => {
    prePageNum++
    return { ...res, _apiId: currentMenu?.index + '-' + currentFilter?.index }
  }).catch(() => {
    return { _apiId: currentMenu?.index + '-' + currentFilter?.index, data: [], isNeedReload: false }
  })
}
let timeOutId: any = null
let lastApiId: string = ''
const setData = async (currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams, isReset = false) => {
  if (!isReset) {
    gridDataRec!.splice(0)
  }
  isFirst = true
  pageState.value = pageStates.init
  contentDataHeight = 0
  prePageNum = 0
  contentLenth = 0
  isShowScreenLoading.value = true
  isEdit.value = false
  prePageNo = 0
  contentScrollY = 0
  // @ts-ignore
  // gridViewRef.value?.restartPage()
  lastApiId = currentMenu?.index + '-' + currentFilter?.index
  clearTimeout(timeOutId)
  timeOutId = setTimeout(async () => {
    gridViewRef.value?.blockRootFocus()
    const res = await getFirstContentListApi(currentMenu, currentFilter)
    if (lastApiId == res._apiId) {
      if (res?.data?.length) {
        const { arr, dataHeight, rowsHeight } = getContentList(res.data, props.pWidth, props.pConfig)
        gridDataRec = gridViewRef.value!.init(arr)//arr.concat([{type:101}])
        pageState.value = pageStates.ready
        contentDataHeight = dataHeight
        contentLenth = arr.length
        initRowsHeight = rowsHeight
        if (isInit) {
          nextTick(() => {
            gridViewRef.value?.setItemFocused(0)
          })
          isRequestFocus.value = false
          isInit = false
        } else if (prevItemIndex != -1) {
          const pos = res.data.findIndex(item => item.id == prevItemIndex)
          nextTick(() => {
            gridViewRef.value?.scrollToFocused(pos == -1 ? 0 : pos)
            prevItemIndex = -1
          })
        }
      } else {
        pageState.value = pageStates.empty
        gridDataRec!.splice(0)
        // toast.showLongToast('暂无数据')
        if (isInit) {
          emits('emInitNoData')
          isInit = false
          isRequestFocus.value = false
        }
      }
      preCurrentMenu = currentMenu
      preCurrentFilter = currentFilter
      nextTick(() => {
        isShowScreenLoading.value = false
      })
      isReStartload = !!res?.isNeedReload
    }
    props.setDataCallBack((res.data?.length || 0) > 0)
    gridViewRef.value?.unBlockRootFocus()
    isFirst = false
  }, 300);
}

defineExpose({
  setData,
  clearData() {
    api.clearContent(preCurrentMenu, preCurrentFilter).catch(() => { })
    isEdit.value = false
    pageState.value = pageStates.empty
    gridDataRec!.splice(0)
  },
  changeEditState(boo: boolean) {
    if (isEdit.value !== boo) {
      if (boo) {
        rBlockFocusDirections.value = ['left', 'right', 'down']
        gvNextFocusName.value = { 'up': 'clear_btn_name' }

        enableStatesOnFocusArr.value = dEnableStatesOnFocusArr
      } else {
        rBlockFocusDirections.value = []
        gvNextFocusName.value = {up: 'h_tab_name'}

        enableStatesOnFocusArr.value = []
      }
      isEdit.value = boo
    }
    if (!boo && pageState.value === pageStates.empty) {
      emits('emInitNoData')
    }
  },
  scrollTo(index: number) {
    // gridViewRef.value?.scrollToFocused(index)//scrollToPosition
  },
  onBackPressed() {
    if (!isEdit.value && contentScrollY > 0) {
      gridViewRef.value?.scrollToFocused(0)
      contentScrollY = 0
      return false
    }
    gridViewRef.value?.unBlockRootFocus()
    return true
  },
  reset() {
    isInit = true
    rBlockFocusDirections.value = []
  },
  reStartload(currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams) {//从详情页面返回时，有时需要重载页面数据
    if (isReStartload) {
      setData(currentMenu, currentFilter, true)
    }
  },
  checkFocus() {
    if (gridDataRec.length > 0) {
      if (lastFocusedId === -1) {
        gridViewRef.value?.scrollToFocused(0)
        return true
      }
      if (lastFocusedId > -1) {
        return true
      }
    }
    return false
  }
})
</script>
<style scoped>
.h_content {
  /* width: 1570px; */
  /* height: 900px; */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}

.grid_view {
  /* width: 1570px;
    height: 900px; */
  background-color: transparent;
}

.content_type {
  width: 1500px;
  height: 50px;
  background-color: transparent;
}

.content_type_name {
  width: 1500px;
  height: 50px;
  background-color: transparent;
}

.screen-right-content-no-more {
  width: 1570px;
  height: 80px;
  font-size: 30px;
  color: rgba(255, 255, 255, 0.6);
  background-color: transparent;
}

.screen-right-content-more-loading {
  width: 1570px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
}

.screen-right-content-loading {
  width: 1570px;
  height: 880px;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}

.loading_txt {
  width: 200px;
  height: 30px;
  font-size: 20px;
  color: #ccc;
  background-color: transparent;
}
</style>