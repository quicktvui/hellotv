<template>
  <div class="screen-root-css" ref='screen_root'>
    <!-- 顶部按钮 -->
    <top-btns-view v-if="isShowTopView" :logo-right="true">
      <template #btnItem>
        <img-text-btn-view ref="top_search_btn" name="top_search_btn"
          style="width: 145px;height: 60px;margin-left: 10px;margin-right: 10px"
          text="搜索" icon="ic_top_search.png" focus-icon="ic_top_search.png"
          :focusable="true" :icon-left="true"
          :nextFocusName="{ down: 'screen_left_tags' }" @click="onClick"/>
      </template>
    </top-btns-view>

    <scroll-view name="screenScroll" ref="contentScrollRef" class="screen-scroll"
      :focusable="false" :horizontal="true" :onScrollEnable="true" makeChildVisibleType="none">
      <qt-view class="screen-content" :focusable="false" :clipChildren="true">
        <!-- 左侧扩展 -->
        <qt-list-view ref="leftExpandRef" class="screen-content-left-expand" :style="{ width: leftRootWidth + 'px', height: leftRootHeight + 'px', top: ( 1080 - leftRootHeight ) + 'px' }"
          :focusable="false" :enableFocusBorder="true" :listenHasFocusChange="true" :triggerTask="leftExpandTriggerTask"
          :autofocusPosition="leftExpandPos" nextFocusRightSID="screen_left_tags"
          @item-focused="leftExpandFocus">
          <tags-text-item :type="1" />
        </qt-list-view>

        <!-- 左侧列表 -->
        <div v-if="isShowLeftList" class="screen-left-root-css" :style="{ width: leftRootWidth + 'px', height: leftRootHeight + 'px', top: ( 1080 - leftRootHeight ) + 'px' }">
          <!-- 背景 -->
          <div class="screen-left-bg" :style="{width:(leftRootWidth-20)+'px',height:leftRootHeight+'px'}"
            :gradientBackground="{colors:['#0CFFFFFF','#00FFFFFF'], orientation: 4}"/>
          <!-- 标题 -->
          <qt-text v-if="title" class="screen-left-title" :style="{width:(leftRootWidth-20)+'px'}"
            :fontSize="50" gravity="center" :lines="1" :focusable="false" :select="true" :ellipsizeMode="3" :paddingRect="[12,0,12,0]" :text="title" />
          <img class="screen-left-title-img" :style="{width:(leftRootWidth-40)+'px'}" v-else :src="title_img"/>
          <!-- 筛选列表 -->
          <qt-list-view ref="leftTags" name='screen_left_tags' sid="screen_left_tags"
            class="screen-left-tags-root-css" :style="{width:leftRootWidth+'px',height:(leftRootHeight - 60)+'px'}"
            :padding="'0,0,0,20'" :autofocusPosition="defaultTagPosition" :singleSelectPosition="defaultTagSelectPos"
            :clipChildren="false" :clipPadding="false"
            :blockFocusDirections="['left','down']"
            @item-focused="leftTagsItemFocus"
          >
            <!-- 文字标题 -->
            <tags-text-item :type="1"/>
            <!-- 图片标题 -->
            <tags-img-item :type="2"/>
            <!-- Icon&文字标题 -->
            <tags-text-icon-item :type="3"/>
          </qt-list-view>
        </div>
        
        <!-- 右侧结果 -->
        <tags-content ref="tags_content" class="screen-right-root-css"
          :style="{ width: rightContentWidth + 'px', height: rightContentHeight + 'px', top: ( 1080 - rightContentHeight ) + 'px' }"
          :clipChildren="false" :clipPadding="false"
          :blockFocusDirections="isShowLeftList?[]:['left','right']"
          @unBlockFocus='unBlockRootFocus'/>
      </qt-view>
    </scroll-view>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "@vue/runtime-core"
import {ESLogLevel, useESLog} from "@extscreen/es3-core";
import ImgTextBtnView from "../../components/img-text-btn-view.vue";
import {useESRouter} from "@extscreen/es3-router";
import TopBtnsView from "../../components/top-btns-view.vue";
import {nextTick, ref} from "vue";
import FilterConfig from "./build_data/FilterConfig"
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
    const contentScrollRef = ref()
    const leftExpandRef = ref()
    const leftExpandPos = ref(0)
    const isShowLeftList = computed(()=>{return FilterConfig.isShowLeftList})
    const isShowTopView = computed(()=>{return FilterConfig.isShowTopView})
    const leftRootWidth = computed(()=>{return FilterConfig.leftListWidth})
    const leftRootHeight = computed(()=>{return FilterConfig.isShowTopView ? FilterConfig.leftListHeight:1060})
    const rightContentHeight = computed(()=>{return FilterConfig.isShowTopView ? FilterConfig.rightContentHeight:1060})
    const rightContentWidth = computed(()=>{return FilterConfig.isShowLeftList ? FilterConfig.rightContentWidth:1856})
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
    let defaultTagSelectPos = ref(0)
    //局部变量
    let leftTagSwitchTimer:any = -1
    let curTagPosition:number = -1 //左侧列表当前 tag位置
    let curLeftExpandPos: number = 0
    //筛选接口参数
    let screenId:string = ""  //筛选分类 ID
    let defaultSelectTag:string = "" //默认选中左侧筛选 tag
    let defaultFiltersStr:string = "" //默认选中筛选标签 tags
    let defaultFilters:Array<string> = []
    let defaultFastTag:string = "" //默认选中的快速标签
    let curType:number = -1 // 3： 快速标签类型；非 3：普通类型
    let showLeftExpand = false

    let leftExpandTriggerTask = [
      {
        event: "onFocusAcquired",
        target: "screenScroll",
        function: "scrollToWithOptions",
        params: [
          { x: -leftRootWidth.value, y: 0, duration: 300 }
        ]
      },
      {
        event: "onFocusLost",
        target: "screenScroll",
        function: "scrollToWithOptions",
        params: [
          { x: leftRootWidth.value, y: 0, duration: 300 }
        ]
      }
    ]

    /**
     * 入口
     * @param params 参数
     */
    function onESCreate(params) {
      screenId = params.screenId
      if (isShowLeftList.value){
        defaultSelectTag = params.defaultSelectTag
      }
      //Test
      screenId = "1764924767380697089"
      //Test
      // defaultSelectTag = "早教"
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
      
      // 设置默认坐标
      setTimeout(() => {
        contentScrollRef.value.scrollTo(leftRootWidth.value, 0, 0)
        nextTick(() => {
          const leftExpandData = getLeftExpandData()
          showLeftExpand = leftExpandData.length ? true : false
          leftExpandRef.value?.init(leftExpandData)
          getTagsData(screenId)
        })
      }, 300)
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

    function getLeftExpandData() {
      return [
        { type: 1, id: '1764924767380697089', showName: '番剧' },
        { type: 1, id: '1768109206728179713', showName: '电影' },
        { type: 1, id: '1755198210693124098', showName: '纪录片' },
        { type: 1, id: '1764924767380697089', showName: '国创' },
        { type: 1, id: '1768109206728179713', showName: '电视剧' },
        { type: 1, id: '1755198210693124098', showName: '综艺' }
      ]
    }

    function leftExpandFocus(e) {
      if (e.isFocused && e.position !== curLeftExpandPos) {
        curLeftExpandPos = e.position
        getTagsData(e.item.id)
      }
    }

    /**
     * 获取左侧列表数据
     */
    function getTagsData(id: string){
      globalApi.getScreenLeftTags(id).then(res=>{
        if (res){
          if (isShowLeftList.value){
            const showType = res?.entryTag?.showType
            if (showType === '2' || showType === 2){//图片标题
              title_img.value = res?.entryTag?.normalImage
            }else{//文字标题
              title.value = res?.entryTag?.showName
            }
          }
          //设置根筛选条件---接口要求，根据具体接口处理
          setRootTag(res?.entryTag?.tagName)
          const tags:Array<QTListViewItem> = buildTagsData(res,defaultSelectTag,defaultFilters,defaultFastTag)
          nextTick(()=>{
            if (isShowLeftList.value){
              //设置左侧列表数据
              leftTags.value!.init(tags)
              //初始化筛选条件
              tags_content.value.init()
              //设置默认选中tag
              if (!showLeftExpand) {
                defaultTagPosition.value = getDefaultTagSelectIndex()
              } else {
                defaultTagPosition.value = -1
                tags_content!.value.getScreenByTags(1,curType,"",0,false,false)
              }
            }else{
              //初始化筛选条件
              tags_content.value.init()
              curType = 3
              curTagPosition = 0
              tags_content!.value.getScreenByTags(1,curType,"",0,false,false)
            }
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
      screen_root,
      isShowLeftList,
      isShowTopView,
      leftRootWidth,
      leftRootHeight,
      rightContentHeight,
      rightContentWidth,
      contentScrollRef,
      leftExpandTriggerTask,
      leftExpandRef,
      leftExpandPos,
      leftExpandFocus,
      defaultTagSelectPos
    }
  }
})
</script>

<style src="./css/screen.css"></style>
