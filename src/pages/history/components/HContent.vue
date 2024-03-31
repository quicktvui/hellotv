<template>
    <div class="h_content" ref="hContentRef" :focusable="false">
        <qt-grid-view v-show="pageState !== pageStates.empty" class="grid_view" ref="gridViewRef"
            name="content_grid_name" @item-click="onItemClick" :clipChildren="false" :clipPadding="false"
            :spanCount="columns" :areaWidth="1570" :focusable="true" padding="0,0,0,20" :pageSize="20"
            :blockFocusDirections="['right', 'down']" :openPage="true" :preloadNo="1" :listenBoundEvent="true"
            :loadMore="loadMoreFn" @item-bind="onItemBind">
            <!-- @scroll-state-changed="onScrollStateChanged" -->
            <qt-view type="1001" class="content_type" :focusable="false">
                <text-view :focusable="false" :duplicateParentState="true" :fontSize="38" gravity="centerVertical"
                    class="content_type_name" text="${assetTitle}" />
            </qt-view>
            <!-- <HContentItem type="10001" /> -->
            <qt-poster :type="10001">
                <text-view class="history-subtitle" :focusable="false" :fontSize="24" :ellipsizeMode="2" :lines="1"
                    autoHeight gravity="left|top" :paddingRect="[16, 0, 0, 16]" flexStyle="${subTitle.style}"
                    text="${subTitle.text}" visibility="${subTitle}" />
            </qt-poster>
            <qt-poster :type="10007" :focusable="false">
                <text-view class="history-subtitle" :focusable="false" :fontSize="24" :ellipsizeMode="2" :lines="1"
                    autoHeight gravity="left|top" :paddingRect="[16, 0, 0, 16]" flexStyle="${subTitle.style}"
                    text="${subTitle.text}" visibility="${subTitle}" />
                <qt-view class="history-item-cover" :focusable="true" flexStyle="${style}">
                    <qt-view :duplicateParentState="true" class="history-delete-btn-focus" showOnState="focused"
                        :gradientBackground="{ colors: ['#F5F5F5', '#F5F5F5'], cornerRadius: 99, orientation: 6 }">
                    </qt-view>
                    <qt-view :duplicateParentState="true" class="history-delete-btn-focus" showOnState="normal"
                        :gradientBackground="{ colors: ['#1AFFFFFF', '#1AFFFFFF'], orientation: 6, cornerRadius: 100 }">
                    </qt-view>
                    <qt-view :duplicateParentState="true" class="history-delete-btn-focus" showOnState="selected"
                        :gradientBackground="{ colors: ['#1AFFFFFF', '#1AFFFFFF'], orientation: 6, cornerRadius: 100 }">
                    </qt-view>
                    <text-view class="history-delete-btn" gravity="center" :fontSize="36" :ellipsizeMode="2" text="删除"
                        :focusable="false" />
                </qt-view>
            </qt-poster>
            <p class="screen-right-content-no-more" type="1003" :focusable="false">已经到底啦，按【返回键】回到顶部</p>
            <!--分页加载 Loading 1002  name="loading" type="1003" -->
            <template v-slot:loading>
                <qt-view class="screen-right-content-more-loading" type="1002" name="loading" :focusable="false">
                    <!-- <qt-loading-view color="rgba(255,255,255,0.3)" style="height: 40px;width: 40px;" :focusable="false"/> -->
                </qt-view>
            </template>

        </qt-grid-view>
        <qt-view v-show="isShowScreenLoading" class="screen-right-content-loading" :clipChildren="false"
            :focusable="false">
            <qt-loading-view color="rgba(255,255,255,0.3)" style="height: 100px; width: 100px" :focusable="false" />
        </qt-view>
        <HistoryEmpty v-show="pageState === pageStates.empty" :msg="emptyTxt" :focusable="false" />
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
// import HContentItem from './HContentItem.vue'
import { Native } from "@extscreen/es3-vue";
import { IcurrentItemParams } from "src/api/history/baseApi";

const props = withDefaults(defineProps<{
    spanCount: number, detailPageName?: string, emptyTxt?: string, pHeight?: number, pItemHeight?: number
}>(), {
    spanCount: 3, pHeight: 880, pItemHeight: 0
})
const columns = computed(() => {
    return props.spanCount && props.spanCount > 0 ? props.spanCount : 4
})
const isEdit = ref(false)
const pageStates = { init: -1, empty: 0, loading: 1, ready: 2, noMore: 3 }
const pageState = ref(pageStates.init)

const router = useESRouter()
const gridViewRef = ref<QTIListView>();
const hContentRef = ref()
const toast = useESToast()
const isShowScreenLoading = ref(false)
let gridDataRec: any[] = []
let preCurrentMenu: any = null
let preCurrentFilter: any = null
let isFirst = true
let timeoutId: any = null
let contentDataHeight = 0
let prePageNum = 0

const onItemBind = () => { }
const onItemClick = (arg) => {
    if (isEdit.value) {
        const index = gridDataRec.findIndex(item => {
            return item._key === arg.item._key
        })
        gridDataRec.splice(index, 1)
        api.deleteContent(preCurrentMenu, preCurrentFilter, arg.item.metaId)
            .then(r => r && loadMoreFn(1))
        // toast.showLongToast(arg.item._key + '--' + arg.item.type)
    } else {
        // toast.showLongToast('go player'+arg.item.metaId)
        if (props.detailPageName) {
            router.push({
                name: props.detailPageName, //'series_view',
                params: {
                    mediaId: arg.item.metaId,
                    playId: arg.item.playId,
                    playPosition: arg.item.playPosition || 0
                }
            });
        }
    }
}
// const onScrollStateChanged = (ev)=>{
//     contentScrollY = ev.offsetY
//     if(contentScrollY>0){
//         if (pageState.value === pageStates.noMore && !isSetNomore) {
//             isSetNomore = true
//             gridDataRec.push(...[{type: 1003}])
//         }
//     }
// }

// 加载更多数据
const loadMoreFn = (pageNo: number) => {
    if (prePageNum == pageNo) {
        return//同一页数据
    }
    prePageNum = pageNo
    // console.log(preCurrentMenu, preCurrentFilter, pageNo, '---loadMoreFn-lsj----', isFirst)
    if (pageState.value === pageStates.noMore) {
        return//没有更多数据了
    }
    if (pageState.value === pageStates.loading) {
        return //正在加载数据
    }
    if (pageState.value === pageStates.empty) {
        return //空数据
    }
    if (isFirst) {
        isFirst = false
    } else if (gridDataRec) {
        pageState.value = pageStates.loading
        // gridDataRec.push({ type: '1002' })
        api.getContentList(preCurrentMenu, preCurrentFilter, pageNo + 1).then(res => {
            // console.log(preCurrentMenu, preCurrentFilter, pageNo, '---loadMoreFn-lsj----', isFirst, res)
            // gridDataRec.pop()
            if (res?.data?.length) {
                gridDataRec.pop()
                const { arr, dataHeight } = getContentList(res.data, columns.value, props.pItemHeight)
                // @ts-ignore
                // gridViewRef.value?.insertItem(gridDataRec.length, arr.concat([{type:101}]))
                gridDataRec.push(...arr.concat([{ type: 101 }]))
                contentDataHeight = dataHeight
                pageState.value = pageStates.ready
            } else {
                pageState.value = pageStates.noMore
                if (contentDataHeight >= props.pHeight) {
                    gridDataRec.push(...[{ type: 1003 }])
                }
                // gridViewRef.value!.stopPage()
                // setTimeout(()=>{
                //     gridDataRec.push({type: 1002})
                // }, 500)
            }
        }).catch(err => {
            // gridDataRec.pop()
            pageState.value = pageStates.ready
        })
    }
}

type Tcallback = () => Promise<any>
const blockFocusAsync = (callback: Tcallback) => {
    // Native.callUIFunction(hContentRef.value, 'blockRootFocus', []);
    gridViewRef.value?.blockRootFocus()
    callback().finally(() => {
        nextTick(() => {
            gridViewRef.value?.unBlockRootFocus()
            // Native.callUIFunction(hContentRef.value, 'unBlockRootFocus', []);
        })
    })
}
// 首次加载数据
const getFirstContentListApi = (currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams) => {
    return api.getContentList(currentMenu, currentFilter, 1).then(res => {
        return { ...res, _apiId: currentMenu?.index + '-' + currentFilter?.index }
    })
}
const setData = async (currentMenu: IcurrentItemParams, currentFilter: IcurrentItemParams) => {
    // blockFocusAsync(async ()=>{})
    isFirst = true
    pageState.value = pageStates.init
    gridDataRec!.splice(0)
    contentDataHeight = 0
    prePageNum = 0

    const apiId = currentMenu?.index + '-' + currentFilter?.index
    isShowScreenLoading.value = true
    const res = await getFirstContentListApi(currentMenu, currentFilter)
    if (apiId == res._apiId) {
        if (res?.data?.length) {
            const { arr, dataHeight } = getContentList(res.data, columns.value, props.pItemHeight)
            gridDataRec = gridViewRef.value!.init(arr.concat([{ type: 101 }]))
            pageState.value = pageStates.ready
            contentDataHeight = dataHeight
        } else {
            pageState.value = pageStates.empty
            gridDataRec!.splice(0)
            // toast.showLongToast('暂无数据')
        }
        preCurrentMenu = currentMenu
        preCurrentFilter = currentFilter
        isFirst = false
        nextTick(() => {
            isShowScreenLoading.value = false
        })
    }
}
defineExpose({
    setData,
    clearData() {
        gridDataRec!.splice(0)
        api.clearContent(preCurrentMenu, preCurrentFilter)
    },
    changeEditState(boo: boolean) {
        if (isEdit.value !== boo) {
            isEdit.value = boo
            if (gridDataRec) {
                blockFocusAsync(async () => {
                    gridDataRec.forEach((el) => {
                        if (el.type) {
                            el.editMode = boo
                        }
                        if (el.type === 10001 || el.type === 10007) {
                            el.type = boo ? 10007 : 10001
                        }
                    })
                    clearTimeout(timeoutId)
                    timeoutId = setTimeout(() => {
                        gridViewRef.value!.setItemFocused(0)
                    }, 500);
                })
            }
        }
    }
})
</script>
<style scoped>
.h_content {
    width: 1570px;
    height: 900px;
    display: flex;
    justify-content: center;
    align-items: center;
    /* background-color: black; */
}

.grid_view {
    width: 1570px;
    height: 900px;
}

.content_type {
    width: 1500px;
    height: 50px;
    background-color: transparent;
}

.content_type_name {
    width: 1500px;
    height: 50px;
}

.history-subtitle {
    color: #666;
}

.history-item-cover {
    position: absolute;
    left: 0;
    top: 0;
    /* width: 340px; */
    /* height: 200px; */
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
    width: 176px;
    height: 68px;
    background-color: transparent;
}

.history-delete-btn {
    color: red;
    width: 100px;
    height: 50px;
}

.screen-right-content-no-more {
    width: 1570px;
    height: 80px;
    line-height: 80px;
    font-size: 30px;
    color: rgba(255, 255, 255, 0.6);
    text-align: center;
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
    justify-content: center;
    align-items: center;
    background-color: transparent;
}
</style>