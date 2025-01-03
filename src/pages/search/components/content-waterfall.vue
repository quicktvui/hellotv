<template>
  <qt-view class="search-content">
    <qt-tabs ref="tabRef" tabPageClass="search-content-tab-page" :clipChildren="false" @onTabPageLoadData="onTabPageLoadData">
      <!-- Content -->
      <template v-slot:waterfall-item>
        <!-- 横图 -->
        <qt-view class="search-content-item-h" :type="1" :focusable="true" layout="${layout}">
          <qt-image class="search-content-item-img-h" src="${cover}" :focusable="false"></qt-image>
          <qt-text
            class="search-content-item-text"
            autoWidth
            text="${title}"
            gravity="center"
            :focusable="false"
            :duplicateParentState="true"
          ></qt-text>
        </qt-view>
        <!-- 竖图 -->
        <qt-view class="search-content-item-v" :type="2" :focusable="true" layout="${layout}">
          <qt-image class="search-content-item-img-v" src="${cover}" :focusable="false"></qt-image>
          <qt-text
            class="search-content-item-text"
            autoWidth
            text="${title}"
            gravity="center"
            :focusable="false"
            :duplicateParentState="true"
          ></qt-text>
        </qt-view>
      </template>
    </qt-tabs>
  </qt-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useESToast } from '@extscreen/es3-core'
import { QTITab, QTTabPageState } from '@quicktvui/quicktvui3'
import { buildTab, buildContents } from '../adapter/index'
import searchManager from '../../../api/search/index'

const toast = useESToast()
const tabRef = ref<QTITab>()
const rawKeyword = ref<string>()

function init(keyword: string) {
  rawKeyword.value = keyword
  searchManager.getContents(keyword).then(() => {
    tabRef.value?.initTab(buildTab())
    tabRef.value?.initPage({ width: 1920, height: 1080 })
  })
}

function onTabPageLoadData(pageIndex: number, pageNo: number, useDiff: boolean) {
  searchManager.getContents(rawKeyword.value).then((contents) => {
    tabRef.value?.setPageData(pageIndex, { data: buildContents(contents) })
  })

  tabRef.value?.setPageState(pageIndex, QTTabPageState.QT_TAB_PAGE_STATE_COMPLETE)
}

defineExpose({ init })
</script>

<style lang="scss">
.search-content {
  width: 1920px;
  height: 1080px;
  background-color: transparent;
}

.search-content-tips {
  width: 1920px;
  height: 50px;
  background-color: transparent;
  margin-top: 75px;
  margin-left: 80px;
  color: white;
  font-size: 40px;
}

.search-content-tab {
  width: 1920px;
  height: 60px;
  background-color: transparent;
  margin-top: 85px;
}

.search-content-tab-page {
  width: 1920px;
  height: 1080px;
  background-color: transparent;
  margin-top: 40px;
}

.search-content-tab-item {
  height: 60px;
  background-color: transparent;
  border-radius: 30px;
  focus-background-color: $gl-theme-btn-bg-focus-color;
}

.search-content-tab-item-text {
  height: 60px;
  background-color: transparent;
  margin-left: 18px;
  margin-right: 18px;
  color: $text-normal-color;
  font-size: 36px;
  focus-color: $text-focus-color;
  select-color: $text-select-color;
}

.search-content-item-h {
  width: 410px;
  height: 276px;
  background-color: transparent;
  border-radius: 16px;
}

.search-content-item-img-h {
  width: 410px;
  height: 230px;
  background-color: transparent;
}

.search-content-item-v {
  width: 260px;
  height: 414px;
  background-color: transparent;
  border-radius: 16px;
}

.search-content-item-img-v {
  width: 260px;
  height: 368px;
  background-color: transparent;
}

.search-content-item-text {
  height: 40px;
  background-color: transparent;
  margin-top: 11px;
  color: $text-normal-color;
  font-size: 30px;
  focus-color: white;
}
</style>
