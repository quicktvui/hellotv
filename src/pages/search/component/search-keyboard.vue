<template>
  <qt-view class="search_keyboard" :style="{width:keyboardWidth+'px'}" @childFocus="childFocus"
           :gradientBackground="{colors:['#00FFFFFF', '#0DFFFFFF']}">

    <qt-view class="search_keyboard_input_root" :focusable="false">
      <qt-image :src="ic_search" class="search_keyboard_search_icon" :focusable="false" />
      <qt-text class="search_keyboard_input_text" :focusable="false"
               v-if="inputText && inputText.length > 0" :text="inputText" :fontSize="28" />
      <qt-text v-else :fontSize="28" :focusable="false"
               text='<font>输入片名的</font><font color="#ffffff">首字母</font>或<font color="#ffffff">全拼</font>搜索'
               class="search_keyboard_input_placeholder_text" />
    </qt-view>
    <qt-view class="search_keyboard_search_line" :focusable="false" />

    <!-- 清空，退格按钮-->
    <qt-view class="search_keyboard_input_option_btns" >
      <search-btn :next-focus-names="{ down: 'grid_view'}"
                  @click="clearBtnClick" search-btn-class="search_keyboard_option_btn"
                  :icon-width="24" :icon-height="30" :icon-normal="ic_search_input_clear"
                  :icon-focus="ic_search_input_clear_focus" search-txt-class="btn_text"
                  :font-size="30" text="清空" />

      <search-btn :next-focus-names="{ down: 'grid_view' }"
                  @click="deleteBtnClick" search-btn-class="search_keyboard_option_btn"
                  style="margin-left: 113px;" :icon-width="32" :icon-height="32"
                  :icon-normal="ic_search_input_delete" :icon-focus="ic_search_input_delete_focus"
                  search-txt-class="btn_text" :font-size="30" text="退格" />
    </qt-view>

    <!--键盘字母列表-->
    <qt-grid-view class="search_keyboard_list" ref="grid_view" name="grid_view"
                  :clipChildren="false" :autofocusPosition="14"
                  @item-click="keyboardItemClick" :spanCount="6">
      <qt-view :type="1" :focusable="true" :focusScale="1.1"
               class="search_keyboard_item"
               eventClick
               eventFocus
               :clipChildren="false">
        <qt-text :duplicateParentState="true" :ellipsizeMode="2" gravity="center" :fontSize="40" :focusable="false"
                class="search_keyboard_item_text" text="${text}" />
      </qt-view>
    </qt-grid-view>

  </qt-view>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/runtime-core"
import { ref, nextTick, watch, onMounted } from "vue"
import { QTIGridView, QTGridViewItem } from "@quicktvui/quicktvui3"
import SearchBtn from "./search-btn.vue"
import SearchConfig from "../build_data/SearchConfig"

export default defineComponent({
  name: "search_keyboard",
  components: {
    SearchBtn
  },
  emits: ["inputChange", "scroll-to-index"],
  setup(props, context) {
    const keyboardWidth = computed(() => SearchConfig.leftWidth)
    const search_keyboard = ref()
    let inputText = ref("")
    const ic_search = require("../../../assets/search/ic_search.png").default
    const ic_search_input_clear = require("../../../assets/search/ic_search_input_clear.png").default
    const ic_search_input_clear_focus = require("../../../assets/search/ic_search_input_clear_focus.png").default
    const ic_search_input_delete = require("../../../assets/search/ic_search_input_delete.png").default
    const ic_search_input_delete_focus = require("../../../assets/search/ic_search_input_delete_focus.png").default
    const grid_view = ref<QTIGridView>()
    let listDataRec: Array<QTGridViewItem> = []
    let keyboardItems: Array<QTGridViewItem> = [
      { text: "A", type: 1 }, { text: "B", type: 1 }, { text: "C", type: 1 }, { text: "D", type: 1 },
      { text: "E", type: 1 }, { text: "F", type: 1 }, { text: "G", type: 1 }, { text: "H", type: 1 },
      { text: "I", type: 1 }, { text: "J", type: 1 }, { text: "K", type: 1 }, { text: "L", type: 1 },
      { text: "M", type: 1 }, { text: "N", type: 1 }, { text: "O", type: 1 }, { text: "P", type: 1 },
      { text: "Q", type: 1 }, { text: "R", type: 1 }, { text: "S", type: 1 }, { text: "T", type: 1 },
      { text: "U", type: 1 }, { text: "V", type: 1 }, { text: "W", type: 1 }, { text: "X", type: 1 },
      { text: "Y", type: 1 }, { text: "Z", type: 1 }, { text: "1", type: 1 }, { text: "2", type: 1 },
      { text: "3", type: 1 }, { text: "4", type: 1 }, { text: "5", type: 1 }, { text: "6", type: 1 },
      { text: "7", type: 1 }, { text: "8", type: 1 }, { text: "9", type: 1 }, { text: "0", type: 1 }
    ]
    onMounted(()=>{
      nextTick(()=>{
        listDataRec = grid_view.value!.init(keyboardItems)
      })
    })
    const clearBtnClick = () => {
      if (inputText.value === "")return
      if (inputText.value && inputText.value.length > 0) {
        inputText.value = ""
      }
      context.emit("inputChange", "")
    }
    const childFocus = (e) => {
      if (e.child) {
        context.emit("scroll-to-index", 0, 100)
      }
    }
    const deleteBtnClick = () => {
      if (inputText.value === "")return
      let value = ""
      if (inputText.value && inputText.value.length > 0) {
        inputText.value = inputText.value.slice(0, inputText.value.length - 1)
        value = inputText.value
      }
      context.emit("inputChange", value)
    }
    const keyboardItemClick = (e) => {
      if (inputText.value.length < 10) {
        inputText.value += e.item.text
        context.emit("inputChange", inputText.value)
      }
    }
    const requestDefaultFocus = () => grid_view.value?.setItemFocused(14)

    return {
      search_keyboard,
      inputText,
      grid_view,
      childFocus,
      requestDefaultFocus,
      ic_search,
      ic_search_input_clear,
      ic_search_input_clear_focus,
      ic_search_input_delete,
      ic_search_input_delete_focus,
      clearBtnClick,
      deleteBtnClick,
      keyboardItemClick,
      keyboardWidth,
    }
  }
})
</script>

<style src="../css/search-keyboard.css"></style>
