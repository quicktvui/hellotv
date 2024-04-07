<template>
    <div 
        class="h_content" ref="hContentRef" :focusable="false" :height="pHeight" :width="pWidth"
        :blockFocusDirections="rBlockFocusDirections"
    >
        <!-- :nextFocusName="{ up: 'h_tab_name' }"  -->
        <qt-grid-view 
            v-show="pageState !== pageStates.empty" class="grid_view" ref="gridViewRef" :height="pHeight" :width="pWidth"
            name="content_grid_name" @item-click="onItemClick" :clipChildren="false" :clipPadding="false"
            :spanCount="pConfig.contentColumn" :areaWidth="pWidth" :focusable="false" padding="0,0,0,20" :pageSize="20"
            :blockFocusDirections="['down']" :openPage="true" :preloadNo="1" :listenBoundEvent="true"
            :loadMore="loadMoreFn" @item-bind="onItemBind" :nextFocusName="gvNextFocusName"
            @scroll-state-changed="onScrollStateChanged"
        >
        <!-- @scroll-state-changed="onScrollStateChanged" -->
            <qt-view type="1001" class="content_type" :focusable="false">
                <text-view :focusable="false" :duplicateParentState="true" :fontSize="38" gravity="centerVertical"
                    class="content_type_name" text="${assetTitle}" />
            </qt-view>
            <!-- <HContentItem type="10001" /> qt-poster-->
            <!-- <HContentPoster :type="10001"></HContentPoster> -->
            <HContentPoster :type="10001" >
                <!-- :focusable="false" -->
                <qt-view showIf="${editMode==true}" class="history-item-cover" :focusable="false" :duplicateParentState="true" flexStyle="${image.style}">
                    <qt-view 
                        :duplicateParentState="true" class="history-delete-btn-focus" 
                        showOnState="focused" flexStyle="${delete.style}"
                        :focusable="false"
                        :gradientBackground="{ colors: ['#F5F5F5', '#F5F5F5'], cornerRadius: 99, orientation: 6 }">
                    </qt-view>
                    <qt-view 
                        :duplicateParentState="true" class="history-delete-btn-focus" 
                        :showOnState="['normal','selected']" flexStyle="${delete.style}"
                        :focusable="false"
                        :gradientBackground="{ colors: ['#1AFFFFFF', '#1AFFFFFF'], orientation: 6, cornerRadius: 100 }"
                    >
                    </qt-view>
                    <text-view class="history-delete-btn" gravity="center" fontSize="${delete.style.fontSize}" flexStyle="${delete.style}"
                        :ellipsizeMode="2" text="删除" :focusable="false" :duplicateParentState="true"/>
                </qt-view>
            </HContentPoster>
            <qt-text showIf="${editMode==false}" :type="1003" class="screen-right-content-no-more" gravity="center" :focusable="false" text="已经到底啦，按【返回键】回到顶部"></qt-text>
            <!--分页加载 Loading 1002  name="loading" type="1003" -->
            <template v-slot:loading>
                <qt-view class="screen-right-content-more-loading" :type="1002" name="loading" :focusable="false">
                    <!-- <qt-loading-view color="rgba(255,255,255,0.3)" style="height: 40px;width: 40px;" :focusable="false"/> -->
                </qt-view>
            </template>
            
        </qt-grid-view>
        <qt-view v-show="isShowScreenLoading" class="screen-right-content-loading" :clipChildren="false" :focusable="false">
            <qt-loading-view color="rgba(255,255,255,0.3)" style="height: 100px; width: 100px" :focusable="false"/>
            <qt-text v-show="screenLoadingTxt" class="loading_txt" :text="screenLoadingTxt" gravity="center" :focusable="false"></qt-text>
        </qt-view>
        <HistoryEmpty v-show="pageState === pageStates.empty" :msg="emptyTxt" :bigImg="pConfig.emptyImg" :focusable="false" />
    </div>
</template>
<script lang='ts' setup>
import { computed, nextTick, ref } from "vue";
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
// import { Native } from "@extscreen/es3-vue";
import { IcurrentItemParams } from "../../../api/history/baseApi";
import { Iconfig } from "../config";

const props = withDefaults(defineProps<{
    detailPageName?:string; emptyTxt?:string; pHeight?:number;
    pWidth?:number; pConfig:Iconfig, setDataCallBack:(boo:boolean)=>void
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
const isShowScreenLoading = ref(false)
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

const gvNextFocusName = ref({ up: 'h_tab_name' })

const emits = defineEmits(['emContentClearAll'])
const onItemBind = ()=>{}
const onItemClick = (arg) => {
    if (isEdit.value) {
        if(isShowScreenLoading.value) return //正在删除，防止重复点击
        isShowScreenLoading.value = true
        screenLoadingTxt.value = '正在删除...'
        api.deleteContent(preCurrentMenu, preCurrentFilter, {
            index: arg.position,
            item: arg.item
        }).then(res=>{
            isShowScreenLoading.value = false
            screenLoadingTxt.value = ''
            if(res){
                const index = gridDataRec.findIndex(item => {
                    return item._key === arg.item._key
                })
                gridDataRec.splice(index, 1)
                contentLenth--
                if(contentLenth<=0){
                    gridViewRef.value?.clearFocus()
                    gridDataRec!.splice(0)
                    isEdit.value = false
                    emits('emContentClearAll')
                }
            }
        }).catch(()=>{
            isShowScreenLoading.value = false
            screenLoadingTxt.value = ''
        })
        // toast.showLongToast(arg.item._key + '--' + arg.item.type)
    } else {
        // toast.showLongToast('go player'+arg.item.metaId)
        if(props.detailPageName){
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
const onScrollStateChanged = (ev)=>{
    contentScrollY = ev.offsetY
}

// 加载更多数据
const loadMoreFn = (pageNo: number) => {
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
                gridDataRec.pop()
                const { arr, dataHeight } = getContentList(res.data, props.pWidth, props.pConfig)
                // @ts-ignore
                // gridViewRef.value?.insertItem(gridDataRec.length, arr.concat([{type:101}]))
                gridDataRec.push(...arr.concat([{type:101}]))
                contentDataHeight = dataHeight
                pageState.value = pageStates.ready
                contentLenth += arr.length
            } else {
                pageState.value = pageStates.noMore
                if(contentDataHeight >= props.pHeight){
                    gridDataRec.push(...[{type: 1003,editMode:false}])
                }
                // gridViewRef.value!.stopPage()
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
const getFirstContentListApi = (currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams)=>{
  prePageNum = 1
  return api.getContentList(currentMenu, currentFilter, 1).then(res => {
    prePageNum++
    return { ...res, _apiId: currentMenu?.index+'-'+currentFilter?.index }
  }).catch(()=>{
    return { _apiId: currentMenu?.index+'-'+currentFilter?.index, data:[] }
  })
}
let timeOutId:any = null
const setData = async (currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams) => {
    isFirst = true
    pageState.value = pageStates.init
    gridDataRec!.splice(0)
    contentDataHeight = 0
    prePageNum = 0
    contentLenth = 0
    isShowScreenLoading.value = true

    // @ts-ignore
    gridViewRef.value?.restartPage()

    clearTimeout(timeOutId)
    timeOutId = setTimeout(async () => {
        gridViewRef.value?.blockRootFocus()
        const apiId = currentMenu?.index+'-'+currentFilter?.index
        const res = await getFirstContentListApi(currentMenu, currentFilter)
        if(apiId == res._apiId){
          if (res?.data?.length) {
              const { arr, dataHeight, rowsHeight } = getContentList(res.data, props.pWidth, props.pConfig)
              gridDataRec = gridViewRef.value!.init(arr.concat([{type:101}]))
              pageState.value = pageStates.ready
              contentDataHeight = dataHeight
              contentLenth = arr.length
              initRowsHeight = rowsHeight
          } else {
              pageState.value = pageStates.empty
              gridDataRec!.splice(0)
              // toast.showLongToast('暂无数据')
          }
          preCurrentMenu = currentMenu
          preCurrentFilter = currentFilter
          nextTick(()=>{
              isShowScreenLoading.value = false
          })
        }
        props.setDataCallBack((res.data?.length||0) > 0)
        gridViewRef.value?.unBlockRootFocus()
        isFirst = false
    }, 300);
}

defineExpose({
    setData,
    clearData() {
        isEdit.value = false
        gridDataRec!.splice(0)
        api.clearContent(preCurrentMenu, preCurrentFilter).catch(()=>{})
    },
    changeEditState(boo: boolean) {
        if (isEdit.value !== boo) {
            if(boo){
                rBlockFocusDirections.value = ['left', 'right', 'down']
                gvNextFocusName.value = { 'up': 'clear_btn_name' }
            }else{
                rBlockFocusDirections.value = []
                gvNextFocusName.value = { 'up': 'h_tab_name' }
            }
            isEdit.value = boo
            if (gridDataRec) {
                gridViewRef.value?.blockRootFocus()
                let firstPosterindex = -1
                let isFind = false
                gridDataRec.forEach((el) => {
                    if(!isFind){
                        firstPosterindex++
                    }
                    if(el.type == 10001){
                        isFind = true
                    }
                    if (el.type) {
                        el.editMode = boo
                    }
                })
                nextTick(()=>{
                    gridViewRef.value?.unBlockRootFocus()
                    gridViewRef.value?.setItemFocused(firstPosterindex)
                })
            }
        }
    },
    scrollTo(index:number){
        gridViewRef.value?.scrollToPosition(index)
    },
    onBackPressed(){
        if(!isEdit.value && contentScrollY > initRowsHeight){
            gridViewRef.value?.scrollToTop()
            contentScrollY = 0
            return false
        }
        return true
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

.history-item-cover {
    position: absolute;
    left: 0;
    top: 0;
    display: flex;
    border-radius: 8px;
    flex-direction: row;
    text-align: center;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
}

.history-delete-btn-focus {
    position: absolute;
    top: 0;
    background-color: transparent;
}

.history-delete-btn {
    color: red;
    /* width: 100px;
    height: 50px; */
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
.screen-right-content-loading{
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