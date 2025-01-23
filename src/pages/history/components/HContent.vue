<template>
  <div class="h_content" ref="hContentRef" :focusable="false" :height="pHeight" :width="pWidth"
    :blockFocusDirections="rBlockFocusDirections" :clipChildren="false" >
    <!-- :nextFocusName="{ up: 'h_tab_name' }" :disablePlaceholder="true" ['down']-->
    <qt-grid-view v-show="pageState !== pageStates.empty" class="grid_view" ref="gridViewRef" :height="pHeight"
      :width="pWidth" name="content_grid_name" @item-click="onItemClick" :clipChildren="false" :clipPadding="false"
      :spanCount="pConfig.contentColumn" :areaWidth="pWidth" :focusable="false" padding="30,0,40,20" :pageSize="0"
      :blockFocusDirections="rBlockFocusDirections" :openPage="true" :preloadNo="1" :listenBoundEvent="true" :loadMore="loadMoreFn"
      @item-bind="onItemBind" @scroll-state-changed="onScrollStateChanged" :enableSelectOnFocus="false"
      :enablePlaceholder="true" :requestFocus="isRequestFocus"
      @item-focused="onItemFocuseFn" :selected="false"
      :enableStatesOnFocus="enableStatesOnFocusArr"
      :nextFocusName="gvNextFocusName"
    >
      <!-- @scroll-state-changed="onScrollStateChanged" -->
      <qt-view type="1001" class="content_type" :focusable="false">
        <text-view :focusable="false" :duplicateParentState="true" :fontSize="38" gravity="centerVertical"
          class="content_type_name" text="${assetTitle}" />
      </qt-view>
      <HContentPoster :type="10001" :clipChildren="false" />
      <qt-text showIf="${editMode==false}" :type="1003" class="history-right-content-no-more" gravity="center"
        :focusable="false" text="已经到底啦，按【返回键】回到顶部" :style="{width:pWidth+'px'}"></qt-text>
      <!--分页加载 Loading 1002  name="loading" type="1003" -->
      <template v-slot:loading>
        <qt-view class="history-right-content-more-loading" :type="1002" name="loading" :focusable="false" disablePlaceholder :style="{width:pWidth+'px'}">
          <!-- <qt-loading-view color="rgba(255,255,255,0.3)" style="height: 40px;width: 40px;" :focusable="false" /> -->
        </qt-view>
      </template>

    </qt-grid-view>
    <qt-view v-if="isShowScreenLoading" class="history-right-content-loading" :clipChildren="false" :focusable="false" :style="loadingStyle">
      <qt-loading-view color="rgba(255,255,255,0.3)" style="height: 100px; width: 100px" :focusable="false" />
      <qt-text v-show="screenLoadingTxt" class="loading_txt" :text="screenLoadingTxt" gravity="center"
        :focusable="false"></qt-text>
    </qt-view>
    <HistoryEmpty v-show="pageState === pageStates.empty" :msg="emptyTxt" :bigImg="pConfig.emptyImg"
      :focusable="false" />
  </div>
</template>
<script lang='ts' setup>
import { StyleValue, computed, nextTick, ref } from "vue";
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
const isEnableSelectOnFocus = ref(true)
const gvNextFocusName = ref<any>({left: 'h_menu_list_name'})//up: 'h_tab_name',

const emits = defineEmits(['emContentClearAll', 'emInitNoData'])
const onItemBind = () => { }
let isLockRouter = false
router.afterEach((to,from)=>{
  if(to.name==='history'&&isLockRouter){
    isLockRouter = false
  }
})
const onItemClick = (arg) => {
  if (isEdit.value) {
    if (isShowScreenLoading.value) return //正在删除，防止重复点击
    isShowScreenLoading.value = true
    screenLoadingTxt.value = '正在删除...'
    api.deleteContent(preCurrentMenu, preCurrentFilter, {
      index: arg.index,
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
    if (props.detailPageName && !isLockRouter) {
      isLockRouter = true
      prevItemIndex = arg.item?.id
      router.push({
        name: props.detailPageName, //'series_view',
        params: {
          pid: arg.item?.customProp.packageid,
          keyId: arg.item?.customProp.classkeyid,
          classId: arg.item?.customProp.classid
        }
      })
    }
  }
}
const onScrollStateChanged = (ev) => {
  contentScrollY = ev.offsetY
}

const dEnableStatesOnFocusArr = []
const editEnableStatesOnFocusArr = ['selected']
const enableStatesOnFocusArr = ref<string[]>(dEnableStatesOnFocusArr)
let lastFocusedId = -1
let lastFocusedPosition = -1
const onItemFocuseFn = (arg) => {
  if (arg.hasFocus) {
    lastFocusedId = arg.item?.id
    lastFocusedPosition = arg.index
  } else {
    lastFocusedId = -1
    lastFocusedPosition = -1
  }
}
// 加载更多数据
let prePageNo = 0
const loadMoreFn = (pageNo: number) => {
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
    // enableStatesOnFocusArr.value = editEnableStatesOnFocusArr//dEnableStatesOnFocusArr

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
          prevItemIndex = -1
        } else if (prevItemIndex != -1) {
          prevItemIndex = -1
          const pos = res.data.findIndex(item => item.id == prevItemIndex)
          nextTick(() => {
            gridViewRef.value?.scrollToFocused(pos == -1 ? 0 : pos)
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

    // enableStatesOnFocusArr.value = dEnableStatesOnFocusArr
  }, 300);
}

const loadingStyle = computed<StyleValue>(()=>{
  return {width:props.pWidth+'px' }
})
defineExpose({
  setData,
  async clearData() {
    isShowScreenLoading.value = true
    await api.clearContent(preCurrentMenu, preCurrentFilter).catch(() => { })
    isEdit.value = false
    pageState.value = pageStates.empty
    gridDataRec!.splice(0)
    isShowScreenLoading.value = false
    enableStatesOnFocusArr.value = dEnableStatesOnFocusArr
    emits('emContentClearAll')
  },
  changeEditState(boo: boolean) {
    isEnableSelectOnFocus.value = boo
    if (isEdit.value !== boo) {
      if (boo) {
        rBlockFocusDirections.value = ['left', 'right', 'down']
        gvNextFocusName.value = {left: 'h_menu_list_name_no'}//up: 'clear_btn_name'
        enableStatesOnFocusArr.value = editEnableStatesOnFocusArr
        // @ts-ignore
        // gridViewRef.value?.tv_list?.setItemCustomState(lastFocusedPosition, 'selected', true)
      } else {
        rBlockFocusDirections.value = []
        gvNextFocusName.value = {left: 'h_menu_list_name'}//up: 'h_tab_name'
        enableStatesOnFocusArr.value = dEnableStatesOnFocusArr
        // @ts-ignore
        // gridViewRef.value?.tv_list?.setItemCustomState(lastFocusedPosition, 'selected', false)
        // lastFocusedPosition
      }
      isEdit.value = boo
      if(gridDataRec && gridDataRec.length){
        gridDataRec[gridDataRec.length-1].editMode = boo
      }
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
    if (isReStartload && api.checkIsChangedData(currentMenu)) {
      setData(currentMenu, currentFilter, true)
    } else {
      prevItemIndex = -1
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
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}

.grid_view {
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

.history-right-content-no-more {
  height: 80px;
  font-size: 30px;
  color: rgba(255, 255, 255, 0.6);
  background-color: transparent;
}

.history-right-content-more-loading {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
}

.history-right-content-loading {
  height: 980px;
  position: absolute;
  left: 0.01px;
  top: 0.01px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  z-index: 999;
}

.loading_txt {
  width: 200px;
  height: 30px;
  font-size: 20px;
  color: #ccc;
  background-color: transparent;
}
</style>
