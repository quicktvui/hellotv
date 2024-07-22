<template>
  <tv-item class="short_video_section" ref="short_video_section"  name="short_video_section"
    :clipChildren="false" :focusable="false"
    :type="1009"
    @item-bind="onItemBind"
    @item-unbind="onItemRecycled"
    @item-focused="onItemFocused">

    <div class="list_section_root" :focusable="false"
      flexStyle="${style}"
      :blockFocusDirections="['left','right']"
      :clipChildren="true"
      :useAdvancedFocusSearch="true"
      :bringFocusChildToFront="true">
      <!-- :singleSelectPosition="singleSelectPosition"
      :focusMemory="true" :skipRequestFocus="false" :enableSelectOnFocus="false" -->
      <qt-list-view class="tab_list_section" name="tab_list_section" ref="tab_list_section" :focusable="false" :useDiff="false"
        list="${tabList}" 
        :setSelectChildPosition="0"
        horizontal
        :clipChildren="false" 
        flexStyle="${tabListStyle}"
        sid="${tabListSID}"
        @item-focused="onTabItemFocused"
        :pauseTaskOnHide="true"
        :blockFocusDirections="['left','right']"
        :enablePlaceholder="false"
        :enableKeepFocus="true"
        :enableSelectOnFocus="true"
        autofocusPosition="${autofocusTabPosition}">

        <!-- tab list item -->
        <qt-view class="tab_list_section_item" name='${name}' :type="10091" :clipChildren="false" :focusable="true" eventFocus eventClick>
          <qt-text autoWidth gravity="center" :lines="1" :fontSize="30" :focusable="false" 
            class="tab_list_section_item_text" :duplicateParentState="true" text="${title}" />
        </qt-view>

        <slot name="tab-list-section-item"/>

      </qt-list-view>

      <!-- 一行滚动板块 横向 -->
      <qt-list-view v-if="$props.isHorizontal" class="list_section" name="list_section" horizontal :focusable="false" :useDiff="false"
        list="${itemList}" 
        :clipChildren="false" 
        :skipRequestFocus="false"
        :resetOnDetach="true" 
        flexStyle="${listStyle}"
        sid="${listSID}"
        :endHintEnabled="false"
        @loadMore="loadMore"
        @item-focused="onListItemFocused"
        :enablePlaceholder="false"
        :pauseTaskOnHide="true"
        :blockFocusDirections="['left','right']"
        autofocusPosition="${autofocusListPosition}">

        <!-- list item -->
        <qt-view name='${name}' ref="list_section_item" class="content-item-h" flexStyle="${style}"
          :type="10090" :focusable="true" eventFocus eventClick>
          <!-- 海报图 -->
          <qt-image class="content-item-h-img" src="${poster}" :focusable="false"/>
          <!-- 主标题 -->
          <qt-view class="content-item-h-title" autoHeight :focusable="false" duplicateParentState>
            <qt-text class="content-item-h-title-text" autoHeight text="${title}" :maxLines="2" :ellipsizeMode="2" :focusable="false" duplicateParentState></qt-text>
          </qt-view>
          <!-- 副标题 -->
          <qt-text class="content-item-h-title-sub" text="更新至第6话" :focusable="false"></qt-text>
          <!-- 推荐语 -->
          <qt-text class="content-item-h-title-sub" text="奇境入梦，我在其中" :focusable="false"></qt-text>
        </qt-view>

        <slot name="list-section-item"/>
        
      </qt-list-view>

      <!-- 一行滚动板块 纵向 -->
      <qt-list-view v-else class="list_section" name="list_section" :focusable="false" :useDiff="false"
        list="${itemList}" 
        :clipChildren="false" 
        :skipRequestFocus="false"
        :resetOnDetach="true" 
        flexStyle="${listStyle}"
        sid="${listSID}"
        :endHintEnabled="false"
        @loadMore="loadMore"
        @item-focused="onListItemFocused"
        :enablePlaceholder="false"
        :pauseTaskOnHide="true"
        :blockFocusDirections="['left','right']"
        autofocusPosition="${autofocusListPosition}">

        <!-- list item -->
        <qt-view :type="10090" name='${name}' ref="list_section_item" class="list_section_item" :focusable="true" 
          :clipChildren="false" eventClick eventFocus :enableFocusBorder="true" flexStyle="${style}">

          <img src="${poster}" class="lsi_img" :focusable="false" :postDelay="300"/>

          <qt-view class="lsi_r" :duplicateParentState="true">
            <qt-view class="lsi_r_t" :duplicateParentState="true">
              <qt-text :focusable="false" :ellipsizeMode="2" :showOnState="['normal']" :fontSize="24" gravity="left|top" :lines="2" :maxLines="2"
                :duplicateParentState="true"  class="lsi_r_t_text"  text="${title}" :paddingRect="[12,12,12,0]"/>
              <qt-text :focusable="false" :ellipsizeMode="2" :showOnState="['selected','focused']" :fontSize="24" gravity="left|top" :lines="2" :maxLines="2"
                :duplicateParentState="true"  class="lsi_r_t_text"  text="${title}" :paddingRect="[37,12,12,0]"/>
              <qt-view class="play_Mark" :focusable="false" :showOnState="['selected','focused']" :duplicateParentState="true">
                <play-mark :style="{width:'20px',height:'20px'}" :markColor="'#E25D8A'" :gap="-1" style="margin-left: 12px;" :focusable="false"/>
              </qt-view>  
            </qt-view>
            <qt-text :focusable="false" :ellipsizeMode="2" :fontSize="18" gravity="left|center" :lines="2" :maxLines="1"
              :duplicateParentState="true"  class="lsi_r_b_text"  text="派大星过大年" :paddingRect="[12,0,0,0]"/>
            
          </qt-view>

        </qt-view>
        <slot name="list-section-item"/>
        
      </qt-list-view>
    </div>
  </tv-item>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/runtime-core"
import { ref, watch } from "vue"
import {QTIListView} from "@quicktvui/quicktvui3"
import { useESLog, useESToast } from "@extscreen/es3-core"
import { useGlobalApi } from "../../../api/UseApi"

export default defineComponent({
  name: "short_video_section",
  props: {
    isStopPage: {
      type: Boolean,
      default: false
    },
    isHorizontal: {
      type: Boolean,
      default: false
    }
  },
  emits: ["load-more"],
  setup(props, context) {
    const appApi = useGlobalApi()
    const log = useESLog()
    const toast = useESToast()
    const short_video_section = ref()
    let pageNo = ref(1)
    let singleSelectPosition = ref(0)
    let currentSectionIndex = ref(0)
    let currentTabIndex = ref(-1)
    let tab_list_section = ref<QTIListView>()
    const onItemRecycled = (e) => {}
    const loadMore = (e) => {
      pageNo.value = pageNo.value + 1
      context.emit("load-more", pageNo.value, currentSectionIndex.value, currentTabIndex.value)
    }
    const onItemBind = (e) => {
      if(e.item){
        e.item.tabList.length < 1 ?  currentTabIndex.value = -1 : currentTabIndex.value = 0
        if(e.item.itemList.length < 1){
          context.emit("load-more", pageNo.value, currentSectionIndex.value, currentTabIndex.value)
        }
      }
    }
    const onItemFocused = (e) => {
      if(e.hasFocus) currentSectionIndex.value = e.parentPosition
    }
    const onTabItemFocused = (e) => {
      if(e.hasFocus && currentTabIndex.value != e.position){
        currentTabIndex.value = e.position
        pageNo.value = 1
        singleSelectPosition.value = e.position
      }
    }
    const onListItemFocused = (e) => {
      if(e.hasFocus){
      }
    }
    return {
      short_video_section,singleSelectPosition,tab_list_section,
      onTabItemFocused,onListItemFocused,
      onItemRecycled,onItemBind,onItemFocused,loadMore,
    }
  }
})
</script>

<style src="../css/short_video_section.css"></style>
