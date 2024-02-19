<template>
  <qt-view class="search_center" ref="search_center" @focus="onFocus" @childFocus="childFocus">
    <qt-view class="search_center_view_bg" :gradientBackground="{ colors: ['#00FFFFFF', '#0DFFFFFF'] }" />
    <qt-view class="search_center_view_line" />

    <qt-view class="search_center_view_top">
      <qt-text class="search_center_view_title" :text="title" gravity="center" :fontSize="40" />
      <qt-view v-if="title == '搜索历史'" :focusable="true" :focusScale="1.1" @click="clearHistoryBtnClick"
        :nextFocusName="{ down: 'search_center_view_list' }"   class="search_center_clear_history_btn">
        <qt-view style="width: 22px;height: 27px;" :duplicateParentState="true">
          <qt-image class="clear_icon_image" :src="ic_search_input_clear" :showOnState="['normal', 'selected']" :duplicateParentState="true"/>
          <qt-image class="clear_icon_image" :src="ic_search_input_clear_focus" showOnState="focused" :duplicateParentState="true"/>
        </qt-view>
        <qt-text :duplicateParentState="true" class="btn_text" text="清空" gravity="center" />
      </qt-view>
    </qt-view>

    <qt-view class="search_center_view_list" ref="search_center_view_list" name="search_center_view_list"
      :nextFocusName="{ right: 'content' }" :blockFocusDirections="['down']">
      <qt-view v-if="title == ''" class="empty_text_box">
        <qt-text text="抱歉暂无相关内容" gravity="center" class="empty_text" />
        <qt-text text="为您推荐右边热门影片～" gravity="center" class="empty_text" />
      </qt-view>

      <qt-list-view class="list_view" ref="listViewRef" :clipChildren="false" :clipPadding="false"
        @item-focused="onItemFocus" v-else name="search_center_view_list">
        <qt-view :type="1" :focusable="true" :focusScale="1" class="search_center_item" eventClick eventFocus :clipChildren="false">
          <qt-view :duplicateParentState="true" class="search_center_item_spot" />
          <qt-view class="search_center_item_text" :duplicateParentState="true" :focusable="false">
            <qt-text :duplicateParentState="true" :ellipsizeMode="2" gravity="left|center" :fontSize="36"
              :focusable="false" :lines="1" :select="true" class="search_center_item_text_normal"
              text="${text}" showOnState="normal" />
            <qt-text :duplicateParentState="true" :ellipsizeMode="2" gravity="left|center" :fontSize="36"
              :focusable="false" :lines="1" :select="true" class="search_center_item_text_select"
              text="${text}" showOnState="selected" />
            <qt-text :duplicateParentState="true" :ellipsizeMode="2" gravity="left|center" :fontSize="36"
              :focusable="false" :lines="1" :select="true" class="search_center_item_text_focus"
              text="${text}" showOnState="focused" />
          </qt-view>
        </qt-view>
      </qt-list-view>
    </qt-view>
 </qt-view>
</template>
<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { ref, watch } from "vue";
import { QTIListView, QTListViewItem } from "@quicktvui/quicktvui3";
import { useESToast } from "@extscreen/es3-core";
import {useGlobalApi} from "../../../api/UseApi";

export default defineComponent({
  name: "search_center",
  components: {},
  emits: ['keyword-select', 'scroll-to-index'],
  props: {
    searchLetter: {
      type: String,
      default: ""
    }
  },
  setup(props, context) {
    let title = ref('热门搜索')
    const search_center = ref()
    const ic_search_input_clear = require('../../../assets/search/ic_search_input_clear.png').default
    const ic_search_input_clear_focus = require('../../../assets/search/ic_search_input_clear_focus.png').default
    let delayHandleFocusChange: any = -1
    let currentItemIndex = ref(-1)
    const listViewRef = ref<QTIListView>()
    let listDataRec: Array<QTListViewItem> = [];
    const toast = useESToast()
    const appApi = useGlobalApi()

    watch(() => props.searchLetter, async(newVal, oldVal) => {
      if (newVal) {
        let list = await appApi.getHotSearch(newVal)
        if(list.length > 0) title.value = '猜你想搜'
        else title.value = ''
        listDataRec.splice(0)
        setTimeout(() => {
          listViewRef.value!.init(list)
          context.emit('keyword-select', list[0].text)
        },200)
      }
    })
    const initComponent = async () => {
      title.value = '热门搜索'
      let list = await appApi.getHotSearch('')
      listDataRec = listViewRef.value!.init(list)
      context.emit('keyword-select', list[0].text)
    }
    const setTitle = (type: number) => {
      title.value = type == 1 ? '热门搜索' : type == 2 ? '搜索历史' : type == 3 ? '猜你想搜' : ''

    }
    const clearHistoryBtnClick = () => {
      setTitle(1)
      //if (title.value) listDataRec = listViewRef.value!.init(list)
    }
    const onItemFocus = (e) => {
      if (e.isFocused) {
        if (currentItemIndex.value == e.position) return
        currentItemIndex.value = e.position
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
      search_center, listViewRef, title, initComponent, onItemFocus, onFocus, childFocus,
      clearHistoryBtnClick, ic_search_input_clear, ic_search_input_clear_focus
    }
  }
})
</script>

<style src="../css/search-center.css"></style>
