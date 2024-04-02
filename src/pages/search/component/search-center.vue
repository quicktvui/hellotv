<template>
  <qt-view class="search_center" :style="{width:centerWidth+'px'}" ref="search_center"
           @childFocus="childFocus"
           :gradientBackground="{ colors: ['#ff252930','#FF2F3541'] }">
    <!-- 垂直竖线-->
    <qt-view class="search_center_view_line" />
    <!--顶部提示-->
    <qt-view class="search_center_view_top">
      <qt-text class="search_center_view_title" :text="title" gravity="left" :fontSize="40" />
      <search-btn v-if="title === '搜索历史'" @click="clearHistoryBtnClick"
                  :nextFocusNames="{ down: 'search_center_view_list' }"
                  searchBtnClass="search_center_clear_history_btn"
                  :icon-width="22" :icon-height="27"
                  :icon-normal="ic_search_input_clear"
                  :icon-focus="ic_search_input_clear_focus"
                  search-txt-class="btn_clear_text"
                  :font-size="26"
                  text="清空" />
    </qt-view>
    <!-- 搜索词条列表-->
    <qt-view class="search_center_view_list" name="search_center_view_list"
             :style="{width:centerWidth+'px'}" ref="search_center_view_list"
             :blockFocusDirections="['down']" :focusable="false">
      <!-- 无词条提示-->
      <qt-view v-if="title === ''" class="empty_text_box" :focusable="false">
        <qt-text text="抱歉暂无相关内容" gravity="center" class="empty_text" :focusable="false" />
        <qt-text text="为您推荐右边热门影片～" gravity="center" class="empty_text" :focusable="false" />
      </qt-view>
      <!-- 词条列表-->
      <qt-list-view v-else class="list_view" :style="{width:centerWidth+'px'}" ref="listViewRef"
                    makeChildVisibleType="normal" :makeChildVisibleClampBackward="168"
                    :makeChildVisibleClampForward="168"
                    @item-focused="onItemFocus" @load-more="loadMore"
                    :nextFocusRightSID="targetSid">
        <qt-view :type="1" :focusable="true" :focusScale="1" class="search_center_item"
                 :style="{width:centerWidth+'px'}"
                 eventClick eventFocus>
          <qt-view :duplicateParentState="true" class="search_center_item_spot"
                   :focusable="false" />
          <qt-text :duplicateParentState="true" :ellipsizeMode="2" gravity="left|center"
                   :fontSize="36"
                   :focusable="false" :lines="1" :select="true" class="search_center_item_text"
                   text="${text}" />
        </qt-view>
      </qt-list-view>
    </qt-view>
  </qt-view>
</template>
<script lang="ts">
import { computed, defineComponent } from "@vue/runtime-core"
import { nextTick, onMounted, ref, watch } from "vue"
import { QTIListView, QTListViewItem } from "@quicktvui/quicktvui3"
import { useGlobalApi } from "../../../api/UseApi"
import { SearchCenter } from "../build_data/impl/SearchCenter"
import SearchBtn from "./search-btn.vue"
import SearchConfig from "../build_data/SearchConfig"

export default defineComponent({
  name: "search_center",
  components: { SearchBtn },
  emits: ["keyword-select", "scroll-to-index", "close-loading"],
  props: {
    searchLetter: {
      type: String,
      default: ""
    },
    resultItemSid: {
      type: String,
      default: ""
    },
    defaultItemSid: {
      type: String,
      default: ""
    }
  },
  setup(props, context) {
    const appApi = useGlobalApi()
    const centerWidth = computed(() => SearchConfig.centerWidth)
    const ic_search_input_clear = require("../../../assets/search/ic_search_input_clear.png").default
    const ic_search_input_clear_focus = require("../../../assets/search/ic_search_input_clear_focus.png").default

    const listViewRef = ref<QTIListView>()
    let title = ref("热门搜索")
    let targetSid = ref()

    let curTitleType = 1
    let currentItemIndex: number = -1
    let listDataRec: QTListViewItem[] = []
    let pageNum = 1
    let isStopPage = false
    let curValue = ""
    let curKeyWorkValue = ""
    let focusItemTimer: any = -1

    watch(() => props.searchLetter, async (newVal, oldVal) => {
      initParams()
      await setListData(newVal ?? "", newVal ? 3 : 1)
      setListSelect(false)
      context.emit("close-loading")
    })
    watch(() => props.resultItemSid, (newVal, oldVal) => {
      targetSid.value = newVal
    })
    watch(() => props.defaultItemSid, (newVal, oldVal) => {
      targetSid.value = newVal
    })

    onMounted(() => {
      nextTick(async () => {
        await setListData("", 1)
        setListSelect(true)
      })
    })

    const initParams = () => {
      pageNum = 1
      isStopPage = false
    }

    const setListSelect = (isShowResultLoading) => {
      setTimeout(() => {
        listViewRef.value?.setItemSelected(0, true)
        context.emit("keyword-select", curValue, isShowResultLoading)
      }, 300)
    }

    const loadMore = async (e) => {
      if (!isStopPage) {
        pageNum++
        await setListData(curKeyWorkValue, curTitleType)
      }
    }

    const setListData = async (value: string = "", titleType) => {
      curKeyWorkValue = value
      let searchCenter:SearchCenter = await appApi.getHotSearch(pageNum, value)
      let list = searchCenter.list ?? []
      let isHistoryList = searchCenter.isHistoryList ?? false
      if (pageNum === 1) {
        if (list.length > 0) {
          if (isHistoryList) {
            setTitle(2)
          } else {
            setTitle(titleType)
          }
          curValue = list[0].text
        } else {
          title.value = ""
          curValue = ""
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
      }
    }

    const setTitle = (type: number) => {
      curTitleType = type
      title.value = type == 1 ? "热门搜索" : type == 2 ? "搜索历史" : type == 3 ? "猜你想搜" : ""
    }
    const clearHistoryBtnClick = async () => {
      initParams()
      await appApi.clearHistory()
      await setListData("", 1)
      //设置焦点
      setTimeout(() => {
        listViewRef.value?.setItemFocused(0)
        context.emit("keyword-select", curValue, true)
      }, 300)
    }
    const onItemFocus = (e) => {
      if (currentItemIndex == e.position) return
      focusItemTimer && clearTimeout(focusItemTimer)
      if (e.isFocused) {
        focusItemTimer = setTimeout(() => {
          currentItemIndex = e.position
          context.emit("keyword-select", e.item.text, true)
        }, 400)
      }
    }
    const childFocus = (e) => {
      if (e.child) {
        context.emit("scroll-to-index", 1, 100)
        targetSid.value = props.defaultItemSid
      }
    }
    return {
      listViewRef, title, onItemFocus, childFocus, loadMore,
      clearHistoryBtnClick, ic_search_input_clear, ic_search_input_clear_focus, centerWidth,
      targetSid
    }
  }
})
</script>

<style src="../css/search-center.css"></style>
