<template>
    <qt-view class="screen-right-qt-view-root-css">
        <scroll-view class="screen-right-scroll-root-css" ref="screen_right_scroll_content"
            name="screen_right_scroll_content" :focusable="false" :onScrollEnable="true" :clipChildren="false"
            makeChildVisibleType="none" :clipPadding="false">
            <qt-view class="screen-right-qt-view-css" v-show="!loading" :useAdvancedFocusSearch="true"
                :focusable="false" :clipChildren="false" :clipPadding="false">

                <!-- 筛选条件-->
                <qt-view style='width: 1800px; min-height: 1px; background-color: transparent;'>
                    <qt-list-view ref="screen_right_filters" name="screen_right_filters" :autofocusPosition="0"
                        class="screen-right-filter-root" :style="{ height: filterHeight }" v-if="filterVisible"
                        :triggerTask="switchData(hideSelectTask)" :enableSelectOnFocus="false">
                        <qt-list-view ref="screen_right_filter_line" name="screen_right_filter_line"
                            class="screen-right-filter-line" nextFocusLeftSID="screen_left_tags"
                            flexStyle="${filterLineStyle}" :type="1" list="${list}" :endHintEnabled="false" horizontal
                            :clipChildren="false" :useDiff="true" :enableSelectOnFocus="false"
                            singleSelectPosition="${defaultSelectPosition}" :focusMemory="false"
                            @item-click="onFilterClick" @item-focused="onFilterFocused"
                            :blockFocusDirections="['right']" :padding="'0,0,12,0'">
                            <!-- 普通筛选条件-->
                            <tags-filter-item :type="11" />
                            <!-- 快速筛选头部提示-->
                            <tags-filter-fast-item-left-tip :type="12" />
                            <!-- 快速筛选-->
                            <tags-filter-fast-item :type="13" />

                        </qt-list-view>
                        <!-- 横线-->
                        <tags-filter-fast-line :type="2" :focusable="false" />

                    </qt-list-view>
                </qt-view>

                <!-- 筛选结果-->
                <qt-grid-view class="screen-right-content" v-show='!filterClickLoading'
                    :descendantFocusability="(loading || filterClickLoading) ? 2 : 1"
                    :triggerTask="switchData(filterTriggerTask)" ref="screen_right_content" name="screen_right_content"
                    :blockFocusDirections="['right', 'down']" :spanCount="6" :openPage="true" :preloadNo="4"
                    :focusable="false" :nextFocusName='{ down: "screen_right_content" }'
                    nextFocusLeftSID="screen_left_tags" :listenBoundEvent="true" :useDiff="true"
                    :listenHasFocusChange="true" :clipChildren="false" :clipPadding="false"
                    :loadMore="loadMoreScreenContent" @scroll-state-changed="onScrollStateChanged"
                    @item-focused="onItemFocused" @item-click="onItemClick" :padding="'30,10,0,20'">
                    <tags-content-item :type="1" />
                    <!-- 底部提示-->
                    <template #footer>
                        <p class="screen-right-content-no-more" :focusable="false" :type="1003">已经到底啦，按【返回键】回到顶部</p>
                    </template>
                    <template #loading>
                        <!--分页加载 Loading-->
                        <qt-view class="screen-right-content-more-loading" :type="1002" :focusable="false">
                            <qt-loading-view color="rgba(255,255,255,0.3)" style="height: 40px;width:40px;"
                                :focusable="false" />
                        </qt-view>
                    </template>

                </qt-grid-view>

            </qt-view>
        </scroll-view>
        <!-- tag切换loading-->
        <qt-view v-if="loading" class="screen-right-content-loading" :clipChildren="false" :focusable='false'>
            <qt-loading-view color="rgba(255,255,255,0.3)" style="height: 100px; width: 100px" :focusable='false' />
        </qt-view>
        <qt-view v-if="!loading && filterClickLoading" class="screen-right-filter-click-loading"
            :style="{ top: filterHeight, height: 960 - filterHeight, backgroundColor: 'transparent' }"
            :clipChildren="false" :focusable='false'>
            <qt-loading-view color="rgba(255,255,255,0.3)" style="height: 100px; width: 100px" :focusable='false' />
        </qt-view>
        <!-- 空结果-->
        <qt-view v-if="empty" class="screen-right-content-empty">
            <img style="width: 560px;height: 350px;" :src="emptyImg" />
            <span :style="{ fontSize: 30, color: 'rgba(255, 255, 255, 0.5)', marginTop: '26px' }">暂无数据</span>
        </qt-view>
        <!-- tag筛选记录-->
        <qt-view class="screen-right-selected-tags" ref="screen_right_selected_tags" name="screen_right_selected_tags"
            :visible="false">
            <!-- 当前选中tags-->
            <qt-list-view class="screen-right-record-list" ref="screen_record_list" horizontal :focusable="false">
                <tags-filter-record :type="14" :focusable="false" />
            </qt-list-view>

        </qt-view>
    </qt-view>


</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ESLogLevel, useESLog, useESToast } from '@extscreen/es3-core'
import { useGlobalApi } from "../../../api/UseApi";
import { IScreenDataTags } from '../../../api/filter/IScreenDataSource'
import {
    buildScreenContent, clearAllFilterCondition, clearFastFilterCondition,
    getCurRecordFilter,
    getAllFilterList,
    getCurScreenCondition,
    getFilterConditionData,
    getFilterHeight,
    getFilterLength,
    getOffsetY,
    getScrollHeight, isAllFilterListHasData, isFastFilterListHasData,
    isTagContentEnd,
    updateAllFilterCondition,
    updateFastFilterCondition
} from "../build_data/useTagsData";
import {
    QTGridView,
    QTGridViewItem,
    QTIListView,
    QTIView,
    QTIViewVisibility
} from "@quicktvui/quicktvui3";
import TagsContentItem from "./tags-content-item.vue";
import { nextTick, ref, toRaw } from "vue";
import { QTListViewItem } from "@quicktvui/quicktvui3/dist/src/list-view/core/QTListViewItem";
import TagsFilterItem from "./tags-filter-item.vue";
import TagsFilterFastLine from "./tags-filter-fast-line.vue";
import TagsFilterFastItemLeftTip from "./tags-filter-fast-item-left-tip.vue";
import TagsFilterFastItem from "./tags-filter-fast-item.vue";
import TagsFilterRecord from "./tags-filter-record.vue";
import { ESIScrollView } from "@extscreen/es3-component";
import { useLaunch } from '../../../tools/launch/useApi'

export default defineComponent({
    name: "tags-content",
    components: {
        TagsFilterRecord,
        TagsFilterFastItem,
        TagsFilterFastItemLeftTip,
        TagsFilterFastLine,
        TagsFilterItem,
        TagsContentItem
    },
    emits: ['unBlockFocus'],
    setup(props, context) {
        //工具变量
        const log = useESLog()
        const globalApi = useGlobalApi()
        const launch = useLaunch()
        const toast = useESToast()
        //组件变量
        const screen_right_content = ref<QTGridView>()
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
        let focusList: Array<number> = []
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
        let filterTriggerTask = ref<any>([])
        let hideSelectTask = ref<any>([])

        function init() {
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
                    params: [{ x: 0, y: getScrollHeight() * -1, duration: 300 }],
                },
            ]
        }

        function setFilterHeight() {
            //单个列表的高度+间距
            filterHeight.value = getFilterHeight()
        }

        function onScrollStateChanged(e) {
            scrollY.value = e.offsetY
        }

        function onItemFocused(e) {
            screenItemContentFocus.value = e.isFocused
            if (e.isFocused) {
                const focusValue = focusList[0]
                if (focusValue !== 3) {
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
                filterClickLoading.value = true
                const parentPosition = e.parentPosition
                const itemPosition = e.position
                if (parentPosition === curFilterParentPosition && itemPosition === curFilterItemPosition) {
                    return
                }
                curFilterParentPosition = parentPosition
                curFilterItemPosition = itemPosition
                //更新当前值
                screenRightFiltersData[parentPosition].defaultSelectPosition = itemPosition

                if (screenRightFiltersData[parentPosition].isFastList) {
                    //更新快速标签原始数据值
                    updateFastFilterCondition(itemPosition)
                    //清除普通标签
                    clearAllFilterCondition(0)
                    //更新普通标签
                    if (isAllFilterListHasData()) {
                        const filterData = JSON.parse(JSON.stringify(screenRightFiltersData))
                        filterData.forEach((item, index) => {
                            if (!item.isFastList) {
                                screenRightFiltersData[index].defaultSelectPosition = 0
                            }
                        })
                    }
                } else {
                    //更新普通标签原始数据
                    updateAllFilterCondition(parentPosition, itemPosition)
                    //清除快速标签
                    clearFastFilterCondition()
                    //更新快速标签
                    if (isFastFilterListHasData()) {
                        screenRightFiltersData[screenRightFiltersData.length - 1].defaultSelectPosition = -1
                    }
                }
                getScreenByTags(1, curType, "", curTagPosition, false, true)
            }

        }

        function onFilterFocused(e) {
            if (e.isFocused) {
                focusList = []
            }
        }

        function clearContentFocus() {
            screen_right_content.value?.clearFocus()
        }

        function onScrollToTop() {
            const delay = curType === 3 ? 400 : 200
            if (curType === 3) {
                screen_right_content.value?.scrollToSelected(0, false)
                const y = getScrollHeight() * -1
                screen_right_scroll_content.value?.scrollToWithOptions(0, y, 300)
            } else {
                screen_right_content.value?.scrollToTop()
            }

            setTimeout(() => {
                context.emit("unBlockFocus")
                if (curType === 3) {
                    screen_right_filters.value?.setItemFocused(0)
                } else {
                    screen_right_content.value?.setItemFocused(0)
                }

            }, delay)
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
                if (isClick) {
                    setFilterTriggerTask()
                    setRecordTip()
                }
                if (!isLoadMore && !isClick) {
                    setRecordTip()
                    setFilterHeight()
                    setFilterTriggerTask()
                    filterVisible.value = true
                }
                let filterList: Array<QTListViewItem> = []
                if (!isLoadMore && !isClick) {
                    filterList = getFilterConditionData()
                }
                nextTick(() => {
                    if (!isLoadMore && !isClick) {
                        screenRightFiltersData = screen_right_filters.value!.init(filterList)
                    }
                    setTimeout(() => {
                        setScreenResultData(curPageNum, curType, getAllFilterList(), isClick)
                        loading.value = false
                    }, 300)
                })
            }
            else {
                if (!isLoadMore && !isClick) {
                    if (focusList.length > 0 && focusList[0] === 3) {
                        focusList = []
                        screen_right_selected_tags.value?.setVisibility(QTIViewVisibility.INVISIBLE)
                        const y = getScrollHeight() * -1
                        screen_right_scroll_content.value?.scrollToWithOptions(0, y, 300)
                    }
                }
                filterTriggerTask.value = []
                curTags = tagNames
                filterVisible.value = false

                setScreenResultData(curPageNum, curType, getAllFilterList(), isClick)
            }
        }

        function setFilterTriggerTask() {
            const length = getFilterLength()
            const y = getScrollHeight()
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
                    params: [{ x: 0, y: y, duration: 300 }],
                }] : []
        }

        function setRecordTip() {
            const recordList: Array<QTListViewItem> = getCurRecordFilter()
            screen_record_list.value?.init(recordList)
            screen_record_list.value!.stopPage()
        }

        function setScreenResultData(pageNum: number, type: number, tags: any, isClick: boolean) {
            let where = ''
            tags.forEach((item, index) => {
                let dsp = item.defaultSelectPosition
                if (!dsp) {
                    return
                }

                switch (index) {
                    case 0:
                        where += `&t=${item.list[dsp].filterTagName}`
                        break
                    case 1:
                        where += `&year=${item.list[dsp].filterTagName}`
                        break
                    case 2:
                        where += `&isend=${item.list[dsp].filterTagName}`
                        break
                    case 3:
                        where += `&h=${item.list[dsp].filterTagName}`
                        break
                    case 4:
                        where += `&from=${item.list[dsp].filterTagName}`
                        break
                }
            })

            globalApi.getScreenContentByTags(curPageNum, where).then((res: Array<any>) => {
                const screenContentList: Array<QTGridViewItem> = buildScreenContent(res, curPageNum)
                if (screenContentList && screenContentList.length > 0) {
                    if (curPageNum === 1) {
                        screenRightContentData = screen_right_content.value!.init(screenContentList)
                        //设置 gridview滚动到顶部并设置 selected
                        if (screenRightContentData && screenRightContentData.length > 0) {
                            screen_right_content.value?.scrollToSelected(0, true)
                        }
                        if (type !== 3) {
                            loading.value = false
                        } else {
                            const delay = isClick ? 300 : 0
                            setTimeout(() => {
                                filterClickLoading.value = false
                            }, delay)
                        }
                    } else {
                        if (screenRightContentData && screenRightContentData.length > 0) {
                            screenRightContentData.push(...screenContentList)
                        }
                    }
                    if (isTagContentEnd()) {
                        screen_right_content.value!.stopPage()
                    }
                } else {
                    if (curPageNum === 1) {//首次无数据,且已经添加过数据
                        if (screenRightContentData && screenRightContentData.length > 0) {
                            screenRightContentData!.splice(0)
                        }
                        if (type !== 3) {
                            loading.value = false
                            empty.value = true
                        } else {
                            filterClickLoading.value = false
                            toast.showToast("没有更多内容啦！")
                        }
                    } else {
                        if (screenRightContentData && screenRightContentData.length > 0) {
                            screen_right_content.value!.stopPage()
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
        }
    }
})
</script>

<style src="../css/tags-right-content.css"></style>
