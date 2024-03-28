<template>
  <div class="screen-root-css" ref='screen_root'>
<!--    顶部按钮-->
    <top-btns-view :logo-right="true">
      <template #btnItem>
        <img-text-btn-view
          :icon-left="true"
          text="搜索"
          :focusable="true"
          style="width: 145px;height: 60px;margin-left: 10px;margin-right: 10px"
          name="top_search_btn"
          ref="top_search_btn"
          icon="ic_top_search.png"
          focus-icon="ic_top_search_focus.png"
          :nextFocusName="{ down: 'screen_left_tags' }"
          @click="onClick"/>
      </template>
    </top-btns-view>

    <!-- 右侧结果-->
    <tags-content  class="screen-right-root-css" ref="tags_content" :clipChildren="false" :clipPadding="false" @unBlockFocus='unBlockRootFocus'/>

    <!-- 左侧列表-->
    <div class="screen-left-root-css">
      <!-- 背景-->
      <div class="screen-left-bg" :gradientBackground="{colors:['#0CFFFFFF','#00FFFFFF'], orientation: 4}"/>
      <!-- 标题-->
      <qt-text class="screen-left-title" v-if="title" :fontSize="50" gravity="center" :lines="1" :focusable="false" :select="true" :ellipsizeMode="3" :paddingRect="[12,0,12,0]" :text="title" />
      <img class="screen-left-title-img" v-else :src="title_img"/>
      <!-- 筛选列表-->
      <qt-list-view class="screen-left-tags-root-css" :padding="'0,0,0,20'" sid="screen_left_tags"
                    name='screen_left_tags' :autofocusPosition="defaultTagPosition"
                    ref="leftTags" :clipChildren="false" :clipPadding="false"
                    @item-focused="leftTagsItemFocus" :blockFocusDirections="['left','down']">
        <!-- 纯文字标题-->
        <tags-text-item :type="1"/>
        <!-- 图片标题-->
        <tags-img-item :type="2"/>
        <!-- 带 Icon 文字标题-->
        <tags-text-icon-item :type="3"/>

      </qt-list-view>
    </div>
  </div>

</template>

<script lang="ts">
import {defineComponent} from "@vue/runtime-core";
import {ESLogLevel, useESLog} from "@extscreen/es3-core";
import ImgTextBtnView from "../../components/img-text-btn-view.vue";
import {useESRouter} from "@extscreen/es3-router";
import TopBtnsView from "../../components/top-btns-view.vue";
import {nextTick, ref} from "vue";
import TagsTextItem from "./components/tags-text-item.vue";
import {useGlobalApi} from "../../api/UseApi";
import {
  buildTagsData,
  getDefaultTagSelectIndex,
  getRootTag,
  setRootTag
} from "./build_data/useTagsData";
import {QTIListView} from "@quicktvui/quicktvui3";
import {QTListViewItem} from "@quicktvui/quicktvui3/dist/src/list-view/core/QTListViewItem";
import TagsTextIconItem from "./components/tags-text-icon-item.vue";
import TagsContent from "./components/tags-content.vue";
import TagsImgItem from "./components/tags-img-item.vue";
import { Native } from '@extscreen/es3-vue'

export default defineComponent({
  name: "index",
  components: {TagsImgItem, TagsContent, TagsTextIconItem, TagsTextItem, TopBtnsView, ImgTextBtnView},
  setup(props, context) {
    const log = useESLog()
    //跳转
    const router = useESRouter()
    //接口
    const globalApi = useGlobalApi()
    //组件
    const leftTags = ref<QTIListView>()
    const screen_root = ref()
    const tags_content = ref()
    //全局变量
    let title = ref("")
    let title_img = ref("")
    let defaultTagPosition = ref(0)
    //局部变量
    let leftTagSwitchTimer:any = -1
    let curTagPosition:number = -1 //左侧列表当前 tag位置
    //筛选接口参数
    let screenId:string = ""  //筛选分类 ID
    let defaultSelectTag:string = "" //默认选中左侧筛选 tag
    let defaultFiltersStr:string = "" //默认选中筛选标签 tags
    let defaultFilters:Array<string> = []
    let defaultFastTag:string = "" //默认选中的快速标签
    let curType:number = -1 // 3： 快速标签类型；非 3：普通类型

    /**
     * 入口
     * @param params 参数
     */
    function onESCreate(params) {
      screenId = params.screenId
      defaultSelectTag = params.defaultSelectTag
      //Test
      screenId = "1764924767380697089"
      //Test
      // defaultSelectTag = "科普"
      if (!defaultSelectTag){
        defaultFiltersStr = params.defaultFilters
        //Test
        // defaultFiltersStr = "少儿,2021,方块熊"
        // defaultFiltersStr = "少儿"
        if (defaultFiltersStr){
          defaultFiltersStr.split(",").forEach(filter=>{
            defaultFilters.push(filter)
          })
        }else{
          defaultFastTag = params.defaultFastTag
          //Test
          // defaultFastTag = "早教"
        }
      }

      getTagsData()
    }

    /**
     * 锁定焦点
     */
    function blockRootFocus(){
      Native.callUIFunction(screen_root.value,"blockRootFocus",[])
    }

    /**
     * 解锁焦点
     */
    function unBlockRootFocus(){
      Native.callUIFunction(screen_root.value,"unBlockRootFocus",[])
    }

    function onClick(e){
      router.push({
        name: 'search',
        params: {}
      });
    }

    /**
     * 获取左侧列表数据
     */
    function getTagsData(){
      globalApi.getScreenLeftTags(screenId).then(res=>{
        if (res){
          const showType = res?.entryTag?.showType
          if (showType === '2' || showType === 2){//图片标题
            title_img.value = res?.entryTag?.normalImage
          }else{//文字标题
            title.value = res?.entryTag?.showName
          }
          //设置根筛选条件---接口要求，根据具体接口处理
          setRootTag(res?.entryTag?.tagName)
          const tags:Array<QTListViewItem> = buildTagsData(res,defaultSelectTag,defaultFilters,defaultFastTag)
          nextTick(()=>{
            //设置左侧列表数据
            leftTags.value!.init(tags)
            //初始化筛选条件
            tags_content.value.init()
            //设置默认选中tag
            defaultTagPosition.value = getDefaultTagSelectIndex()
          })
        }
      })
    }

    function leftTagsItemFocus(e){
      if (e.isFocused){
        if (log.isLoggable(ESLogLevel.DEBUG)) {
          log.d("leftTagsItemFocus--", e)
        }
        if (curTagPosition !== e.position) {
          tags_content.value.loading = true
          tags_content.value.empty = false
        }
        leftTagSwitchTimer && clearTimeout(leftTagSwitchTimer)
        leftTagSwitchTimer = setTimeout(()=>{
          const name = e.name
          switch(name){
            case "screen-left-item-tag":
              const position = e.position
              if (curTagPosition === position) {
                tags_content.value.loading = false
                return
              }
              curTagPosition = position
              const item = e.item
              const type = item.type
              curType = type
              let tagName = getRootTag()+","+item.tagName
              if(type === 3){
                tagName= ""
              }
              tags_content!.value.getScreenByTags(1,type,tagName,position,false,false)
              break;
          }
        },300)
      }
    }

    function onBackPressed(){
      if (tags_content.value.screenItemContentFocus && tags_content.value.scrollY > 100){
        blockRootFocus()
        if (curType === 3){
          tags_content.value.clearContentFocus()
        }
        tags_content.value.onScrollToTop()
        return
      }
      router.back()
    }


    return {
      onESCreate,
      onBackPressed,
      onClick,
      leftTagsItemFocus,
      unBlockRootFocus,

      title,
      title_img,
      leftTags,
      defaultTagPosition,

      tags_content,
      screen_root
    }
  }
})
</script>

<style src="./css/screen.css">

</style>
