<template>
  <qt-view class="search-content">
    <qt-tabs
      ref="tabRef"
      tabNavBarClass="search-content-tabs"
      tabPageClass="search-content-tab-page"
      :autoHandleBackKey="true"
      :tabContentSwitchDelay="300"
      :tabContentResumeDelay="200"
      :contentNextFocus="{ left: 'keyboardGrid' }"
      @onTabPageLoadData="onTabPageLoadData"
      @onTabPageItemClick="onTabPageItemClick"
    >
      <!-- Tab -->
      <template v-slot:tab-item>
        <qt-view class="search-content-tab-item" :type="1" :focusable="true" eventFocus>
          <qt-text
            class="search-content-tab-item-text"
            text="${text}"
            autoWidth
            gravity="center"
            :focusable="false"
            :duplicateParentState="true"
          ></qt-text>
        </qt-view>
      </template>
      <!-- Content -->
      <template v-slot:waterfall-item>
        <!-- 横图 -->
        <search-content-item-h :type="ContentType.HORIZONTAL" />
        <!-- 竖图 -->
        <search-content-item-v :type="ContentType.VERTICAL" />
      </template>
    </qt-tabs>
  </qt-view>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { QTITab, QTTabPageState, QTWaterfallItem } from '@quicktvui/quicktvui3'
import { buildTab, buildTabContents } from '../adapter/index'
import { ContentType } from '../adapter/interface'
import { Tab } from '../api/interface'
import searchContentItemH from './search-content-item-h.vue'
import searchContentItemV from './search-content-item-v.vue'
import searchManager from '../api/index'
import launch from '../../../tools/launch'
import config from '../config'

const props = defineProps({
  keyword: {
    type: String,
    default: ''
  }
})
const emits = defineEmits(['setLoading'])
const tabRef = ref<QTITab>()
// 关键词
let rawKeyword: string = ''
let tabList: Tab[] = []

watch(
  () => props.keyword,
  () => {
    rawKeyword = props.keyword
    // 设置loading状态
    emits('setLoading', true)
    // 初始化组件
    init(rawKeyword)
  }
)

async function init(keyword: string) {
  tabList = await searchManager.getTabs(keyword)
  // 初始化组件
  tabRef.value?.initTab(buildTab(tabList))
  tabRef.value?.initPage({ width: 1920, height: 1080 })
}

let timer: any = -1
async function onTabPageLoadData(pageIndex: number, pageNo: number) {
  if (tabList && pageIndex >= 0 && pageIndex < tabList.length) {
    const tabItem = tabList[pageIndex]
    const contents = await searchManager.getTabContents(rawKeyword, tabItem.id.toString(), ++pageNo, config.gridContentsLimit)
    // 构建数据
    const tabData = buildTabContents(contents, pageNo)

    // 数据更新
    if (pageNo === 1) {
      tabRef.value?.setPageData(pageIndex, tabData)
    } else {
      tabRef.value?.addPageData(pageIndex, tabData, 0)
    }

    // 停止分页
    if (tabData.stopping) {
      tabRef.value?.setPageState(pageIndex, QTTabPageState.QT_TAB_PAGE_STATE_COMPLETE)
    }
  }

  // 延迟关闭上层loading
  clearTimeout(timer)
  timer = setTimeout(() => emits('setLoading', false), 100)
}

function onTabPageItemClick(pageIndex: number, sectionIndex: number, itemIndex: number, item: QTWaterfallItem) {
  launch.launchDetail(item.id)
}
</script>

<style lang="scss" src="../scss/search-content.scss"></style>
