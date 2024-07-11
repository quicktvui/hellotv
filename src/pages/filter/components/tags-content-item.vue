<template>
  <qt-view class="screen-right-content-item-root-css"
           :style="{width:contentItemWidth+'px',height:contentItemHeight+'px'}"
           name="screen_content_item"
           :focusable="true"
           :focusScale="1.06"
           :enableFocusBorder="true"
           eventClick
           eventFocus >
    <!-- 图片 -->
    <img class="screen-right-content-item-img"
         :style="{width:contentItemWidth+'px',height:contentItemImgHeight+'px'}"
         src="${poster}" :focusable="false"/>
    <!-- 角标 -->
    <img class="screen-right-content-item-corner" :postDelay="300" flexStyle="${corner.style}" src="${corner.src}" :focusable="false"/>
    <!-- 评分 -->
    <qt-view class="screen-right-content-item-score-root" :focusable="false"
             :style="{width:contentItemWidth+'px'}"
             :gradientBackground="{colors:['#00000000', '#E5000000'], cornerRadii4: [0, 0, 18, 18]}">
      <qt-text class="screen-right-item-score" :fontSize="24" :paddingRect="[15,0,0,6]" text="${score}" :focusable="false"/>
    </qt-view>
    <!-- 标题 -->
   <qt-view class="screen-right-content-item-text-root"
            :style="{width:contentItemWidth+'px',top:contentItemImgHeight+'px'}"
            :duplicateParentState="true" :focusable="false">
     <qt-text class="screen-right-content-item-text-normal" :fontSize="30" :showOnState="['normal','selected']"
              :style="{width:contentItemWidth+'px'}"
              :ellipsizeMode="2" :lines="1" :duplicateParentState="true"
              :paddingRect="[12,6,12,0]" text="${title}"
              :focusable="false" :select="true"/>
     <qt-text class="screen-right-content-item-text-focus" :fontSize="30" showOnState='focused'
              :style="{ width: contentItemWidth + 'px', focusColor: tabContentFocusColor }"
              :ellipsizeMode="3" :lines="1" :duplicateParentState="true"
              :paddingRect="[12,6,12,0]" text="${title}"
              :focusable="false" :select="true"/>
   </qt-view>

  </qt-view>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/runtime-core"
import ThemeConfig from "../../../build/ThemeConfig";
import FilterConfig from "../build_data/FilterConfig"

export default defineComponent({
  name: "tags-content-item",
  setup(props, context) {
    const tabContentFocusColor = ThemeConfig.tabContentFocusColor
    const contentItemWidth = computed(()=>{return FilterConfig.contentItemWidth})
    const contentItemHeight = computed(()=>{return FilterConfig.contentItemHeight})
    const contentItemImgHeight = computed(()=>{return FilterConfig.contentItemImgHeight})
    return {
      tabContentFocusColor,
      contentItemWidth,
      contentItemHeight,
      contentItemImgHeight
    }
  }
})
</script>

<style src="../css/tag-right-content-item.css"></style>
