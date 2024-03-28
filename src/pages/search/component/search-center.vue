<template>
    <qt-view class="search_center" :style="{ width: centerWidth + 'px' }" ref="search_center" @focus="onFocus"
        @childFocus="childFocus" :gradientBackground="{ colors: ['#ff252930', '#FF2F3541'] }">
        <!--    垂直竖线-->
        <qt-view class="search_center_view_line" />
        <!--顶部提示-->
        <qt-view class="search_center_view_top">
            <qt-text class="search_center_view_title" :text="title" gravity="left" :fontSize="40" />
            <search-btn v-if="title === '搜索历史'" @click="clearHistoryBtnClick"
                :nextFocusNames="{ down: 'search_center_view_list' }" searchBtnClass="search_center_clear_history_btn"
                :icon-width="22" :icon-height="27" :icon-normal="ic_search_input_clear"
                :icon-focus="ic_search_input_clear_focus" search-txt-class="btn_clear_text" :font-size="26" text="清空" />
        </qt-view>
        <!-- 搜索词条列表-->
        <qt-view class="search_center_view_list" :style="{ width: centerWidth + 'px' }" ref="search_center_view_list"
            :nextFocusName="{ right: 'content' }" :blockFocusDirections="['down']">
            <!-- 无词条提示-->
            <qt-view v-if="title === ''" class="empty_text_box" :focusable="false">
                <qt-text text="抱歉暂无相关内容" gravity="center" class="empty_text" :focusable="false" />
                <qt-text text="为您推荐右边热门影片～" gravity="center" class="empty_text" :focusable="false" />
            </qt-view>
            <!-- 词条列表-->
            <qt-list-view v-else class="list_view" :style="{ width: centerWidth + 'px' }" ref="listViewRef"
                makeChildVisibleType="normal" :makeChildVisibleClampBackward="168" :makeChildVisibleClampForward="168"
                @item-focused="onItemFocus" name="search_center_view_list" @load-more="loadMore">
                <qt-view :type="1" :focusable="true" :focusScale="1" class="search_center_item"
                    :style="{ width: centerWidth + 'px' }" eventClick eventFocus>
                    <qt-view :duplicateParentState="true" class="search_center_item_spot" :focusable="false" />
                    <qt-text :duplicateParentState="true" :ellipsizeMode="2" gravity="left|center" :fontSize="36"
                        :focusable="false" :lines="1" :select="true" class="search_center_item_text" text="${text}" />
                </qt-view>
            </qt-list-view>
        </qt-view>
    </qt-view>
</template>
<script lang="ts">
import { computed, defineComponent } from "@vue/runtime-core"
import { nextTick, ref, watch } from "vue"
import { QTIListView, QTListViewItem } from "@quicktvui/quicktvui3";
import { useGlobalApi } from "../../../api/UseApi";
import SearchBtn from "./search-btn.vue"
import SearchConfig from "../build_data/SearchConfig"

export default defineComponent({
    name: "search_center",
    components: { SearchBtn },
    emits: ['keyword-select', 'scroll-to-index', 'close-loading'],
    props: {
        searchLetter: {
            type: String,
            default: ""
        }
    },
    setup(props, context) {
        const centerWidth = computed(() => SearchConfig.centerWidth)
        let title = ref('热门搜索')
        let curTitleType = 1
        const search_center = ref()
        const listViewRef = ref<QTIListView>()
        const ic_search_input_clear = require('../../../assets/search/ic_search_input_clear.png').default
        const ic_search_input_clear_focus = require('../../../assets/search/ic_search_input_clear_focus.png').default

        let delayHandleFocusChange: any = -1
        let currentItemIndex: number = -1
        let listDataRec: QTListViewItem[] = [];
        const appApi = useGlobalApi()
        let pageNum = 1
        let isStopPage = false
        let curValue = ""

        watch(() => props.searchLetter, async (newVal, oldVal) => {
            initParams()
            await setListData(newVal ?? "", newVal ? 3 : 1)
            context.emit("close-loading")
        })
        const initParams = () => {
            pageNum = 1
            isStopPage = false
        }
        const initComponent = async () => {
            await setListData("", 1)
        }

        const loadMore = async (e) => {
            if (!isStopPage) {
                pageNum++
                await setListData(curValue, curTitleType)
            }

        }

        const setListData = async (value: string = "", titleType) => {
            curValue = value
            let searchCenter = await appApi.getHotSearch(pageNum, value)
            let list = searchCenter.list ?? []
            let isHistoryList = searchCenter.isHistoryList ?? false
            let searchValue = ""
            if (pageNum === 1) {
                if (list.length > 0) {
                    if (isHistoryList) {
                        setTitle(2)
                    } else {
                        setTitle(titleType)
                    }
                    searchValue = list[0].text
                } else {
                    title.value = ''
                    searchValue = ""
                }
            }
            if (list.length > 0) {
                await nextTick(() => {
                    if (listDataRec && listDataRec.length > 0) {
                        if (pageNum === 1) {
                            listDataRec.splice(0)
                        }
                        listDataRec.push(...list)
                    } else {
                        listDataRec = listViewRef.value!.init(list)
                    }
                    if (list.length < SearchConfig.screenCenterPageSize) {
                        isStopPage = true
                        listViewRef.value!.stopPage()
                    }
                })
                setTimeout(() => {
                    listViewRef.value?.setItemSelected(0, true)
                    context.emit('keyword-select', searchValue)
                }, 300)

            }
        }
        const setTitle = (type: number) => {
            curTitleType = type
            title.value = type == 1 ? '热门搜索' : type == 2 ? '搜索历史' : type == 3 ? '猜你想搜' : ''
        }
        const clearHistoryBtnClick = async () => {
            setTitle(1)
            initParams()
            await appApi.clearHistory()
            await setListData("", 1)
            //设置焦点
            setTimeout(() => {
                listViewRef.value?.setItemFocused(0)
            }, 300)
        }
        const onItemFocus = (e) => {
            if (e.isFocused) {
                if (currentItemIndex == e.position) return
                currentItemIndex = e.position
                context.emit('keyword-select', e.item.text)
            }
        }
        const onFocus = (e) => {
            if (delayHandleFocusChange) clearTimeout(delayHandleFocusChange)
            delayHandleFocusChange = setTimeout(() => {
                if (e.isFocused) context.emit('scroll-to-index', 1)
            }, 100)
        }
        const childFocus = (e) => {
            if (delayHandleFocusChange) clearTimeout(delayHandleFocusChange)
            delayHandleFocusChange = setTimeout(() => {
                if (e.child) {
                    context.emit('scroll-to-index', 1)
                }
            }, 100)
        }
        return {
            search_center, listViewRef, title, initComponent, onItemFocus, onFocus, childFocus, loadMore,
            clearHistoryBtnClick, ic_search_input_clear, ic_search_input_clear_focus, centerWidth
        }
    }
})
</script>

<style src="../css/search-center.css"></style>
