<template>
  <qt-view class="short_video_section" ref="short_video_section"  name="short_video_section" :clipChildren="false" 
    :type="1009"
    @item-bind="onItemBind"
    @item-unbind="onItemRecycled"
    @item-attached="onSectionAttached">

    <div class="list_section_root" :focusable="false"
      flexStyle="${style}"
      :blockFocusDirections="[]"
      :clipChildren="true"
      :useAdvancedFocusSearch="true"
      :bringFocusChildToFront="true">

      <!-- 一行滚动板块 -->
      <tv-list list="${itemList}" :clipChildren="false" :focusable="false"
        class="list_section" :skipRequestFocus="true"
        :resetOnDetach="true" :useDiff="false"
        name="list_section"
        flexStyle="${style}"
        sid="shortVideo111"
        :endHintEnabled="false"
        @loadMore="loadMore"
        @item-focused="onItemFocused"
        :enablePlaceholder="false"
        :pauseTaskOnHide="true"
        :blockFocusDirections="[]"
        autofocusPosition="${autofocusPosition}">

        <!-- list item -->
        <qt-view :type="10090" name="list_section_item" ref="list_section_item" class="list_section_item" :focusable="true" 
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
      </tv-list>
    </div>
  </qt-view>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/runtime-core"
import { ref, watch } from "vue"
import {} from "@quicktvui/quicktvui3"
import { useESLog, useESToast } from "@extscreen/es3-core"
import { useGlobalApi } from "../../../api/UseApi"

export default defineComponent({
  name: "short_video_section",
  props: {
    isStopPage: {
      type: Boolean,
      default: false
    },
  },
  emits: ["load-more"],
  setup(props, context) {
    const appApi = useGlobalApi()
    const log = useESLog()
    const toast = useESToast()
    const search_result = ref()
    let pageNo = ref(1)
   
    const onItemRecycled = (e) => {}
    const loadMore = () => {
      if(props.isStopPage) return
      pageNo.value = pageNo.value + 1
      context.emit("load-more", pageNo.value)
    }
    const onSectionAttached = (e) => {}
    const onItemBind = (e) => {}
    const onItemFocused = (e) => {
      // toast.showShortToast(e.position+'')
    }
   
    return {
      search_result,
      onItemRecycled,onSectionAttached,onItemBind,onItemFocused,loadMore,
    }
  }
})
</script>
<style src="../css/short_video_section.css"></style>
