<template>
  <qt-view class="search_keyboard" :clipChildren="false" @focus="onFocus" @childFocus="childFocus">
    <qt-view class="search_keyboard_view_bg" :gradientBackground="{colors:['#00FFFFFF', '#0DFFFFFF']}" />

    <qt-view class="search_keyboard_input_root" :clipChildren="false">
      <qt-image :src="ic_search" class="search_keyboard_search_icon"/>
      <qt-text class="search_keyboard_input_text" v-if="inputText && inputText.length > 0" :text="inputText"/>
      <qt-text v-else  :focusable="false" text='<font>输入片名的</font><font color="#ffffff">首字母</font>或<font color="#ffffff">全拼</font>搜索' class="search_keyboard_input_placeholder_text"/>
    </qt-view>
    <qt-view class="search_keyboard_search_line" />
    
    <!-- 清空，退格按钮-->
    <qt-view class="search_keyboard_input_option_btns" :clipChildren="false">
      <qt-view :focusable="true" :focusScale="1.1" @click="clearBtnClick" class="search_keyboard_option_btn">
        <qt-view :duplicateParentState="true" style="width: 24px; height: 30px">
          <qt-image class="clear_btn_icon" :showOnState="['normal','selected']" :src="ic_search_input_clear" :duplicateParentState="true"/>
          <qt-image  class="clear_btn_icon" showOnState="focused" :src="ic_search_input_clear_focus" :duplicateParentState="true"/>
        </qt-view>
        <qt-text :duplicateParentState="true" class="btn_text" text="清空" gravity="center" :fontSize="30"/>
      </qt-view>
      <qt-view :focusable="true" :focusScale="1.1" @click="deleteBtnClick" class="search_keyboard_option_btn" style="margin-left: 113px;">
        <qt-view :duplicateParentState="true" style="width: 32px; height: 32px">
          <qt-image class="delete_btn_icon" :showOnState="['normal','selected']" :src="ic_search_input_delete" :duplicateParentState="true"/>
          <qt-image  class="delete_btn_icon" showOnState="focused" :src="ic_search_input_delete_focus" :duplicateParentState="true"/>
        </qt-view>
        <qt-text :duplicateParentState="true" class="btn_text" text="退格" gravity="center" :fontSize="30"/>
      </qt-view>
    </qt-view>

    <!--键盘字母列表-->
    <qt-grid-view class="search_keyboard_list" ref="grid_view" :clipChildren="false"
      @item-click="keyboardItemClick" :spanCount="6" :defaultFocus="14">
      <qt-view :type="1" :focusable="true" :focusScale="1.1" class="search_keyboard_item" eventClick eventFocus :clipChildren="false">
        <qt-text :duplicateParentState="true" :ellipsizeMode="2" gravity="center" :fontSize="40"
          class="search_keyboard_item_text" text="${text}"/>
      </qt-view>
    </qt-grid-view>

  </qt-view>
</template>

<script lang="ts">
import {defineComponent} from "@vue/runtime-core";
import {ref,nextTick} from "vue";
import {QTGridView, QTGridViewItem} from "@quicktvui/quicktvui3";

export default defineComponent({
  name: "search_keyboard",
  components: {
  },
  emits:['inputChange','scroll-to-index'],
  props:{
    height:{
      type:String,
      default: "80px"
    }
  },
  setup(props, context) {
    const search_keyboard = ref()
    let inputText = ref('')
    const ic_search = require('../../../assets/search/ic_search.png').default
    const ic_search_input_clear = require('../../../assets/search/ic_search_input_clear.png').default
    const ic_search_input_clear_focus = require('../../../assets/search/ic_search_input_clear_focus.png').default
    const ic_search_input_delete = require('../../../assets/search/ic_search_input_delete.png').default
    const ic_search_input_delete_focus = require('../../../assets/search/ic_search_input_delete_focus.png').default
    let delayHandleFocusChange:any = -1
    let clickTimer:any = -1
    const grid_view = ref<QTGridView>()
    let listDataRec: Array<QTGridViewItem> = [];
    let keyboardItems:Array<QTGridViewItem> = [
      {text:'A',type:1},{text:'B',type:1},{text:'C',type:1},{text:'D',type:1},{text:'E',type:1},{text:'F',type:1},
      {text:'G',type:1},{text:'H',type:1},{text:'I',type:1},{text:'J',type:1},{text:'K',type:1},{text:'L',type:1},
      {text:'M',type:1},{text:'N',type:1},{text:'O',type:1},{text:'P',type:1},{text:'Q',type:1},{text:'R',type:1},
      {text:'S',type:1},{text:'T',type:1},{text:'U',type:1},{text:'V',type:1},{text:'W',type:1},{text:'X',type:1},
      {text:'Y',type:1},{text:'Z',type:1},{text:'1',type:1},{text:'2',type:1},{text:'3',type:1},{text:'4',type:1},
      {text:'5',type:1},{text:'6',type:1},{text:'7',type:1},{text:'8',type:1},{text:'9',type:1},{text:'0',type:1}
    ]
    const initComponent = () => {
      listDataRec = grid_view.value!.init(keyboardItems)
    }
    const clearBtnClick = () => {
      if (inputText.value && inputText.value.length > 0) {
        inputText.value = "";
        context.emit('inputChange',inputText.value)
      }
    }
    const onFocus = (e) => {
      if (delayHandleFocusChange) clearTimeout(delayHandleFocusChange)
        delayHandleFocusChange = setTimeout(() => {
        if (e.isFocused) {
          context.emit('scroll-to-index', 0)
        }
      }, 100)
    }
    const childFocus = (e) => {
      if (delayHandleFocusChange) clearTimeout(delayHandleFocusChange)
        delayHandleFocusChange = setTimeout(() => {
        if (e.child) {
          context.emit('scroll-to-index', 0)
        }
      }, 100)
    }
    const deleteBtnClick = () => {
      if (inputText.value && inputText.value.length > 0) {
        // this.dealResult()
        inputText.value = inputText.value.slice(0, inputText.value.length - 1);
        if(inputText.value == '' || inputText.value.length == 0 || !inputText.value){
          // clearTimeout(this.$parent.$children[2].delaySearchByKeyword)
          // clearTimeout(this.$parent.$children[2].closeLoadingTimer)
          // this.$parent.$children[2].isLoading = false
          // this.$parent.$children[2].dealFocus()
          // this.$parent.$children[2].descendantFocusability = 1
        }
        context.emit('inputChange',inputText.value)
      }
    }
    const keyboardItemClick = (e) => {
      if (inputText.value.length < 10) {
        inputText.value += e.item.text;
        if (clickTimer) clearTimeout(clickTimer)
        clickTimer = setTimeout(()=>{
          context.emit('inputChange',inputText.value)
        },500)
      }
    }
    const requestDefaultFocus = () => grid_view.value?.setItemFocused(14)

    return {
      search_keyboard,inputText,initComponent,grid_view,onFocus,childFocus,requestDefaultFocus,
      ic_search,ic_search_input_clear,ic_search_input_clear_focus,ic_search_input_delete,ic_search_input_delete_focus,
      clearBtnClick,deleteBtnClick,keyboardItemClick
    }
  }
})
</script>

<style scoped src="../css/search-keyboard.css"></style>
