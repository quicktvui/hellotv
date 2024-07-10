<template>
<div class="ranking_page" :gradientBackground="configs.gradientBg" :clipChildren="false">

  <!-- <RankTab v-if="!loading" />
  <RankTabContent />
  <div class="rank_loading_box" v-show="loading">
    <qt-loading-view color="rgba(255,255,255,0.3)" style="height: 100px; width: 100px" :focusable="false" />
  </div> -->
  <qt-tabs
    ref="tabRef"
    @onTabPageLoadData="onTabPageLoadData"
    class="ranking_tabs"
    tabNavBarClass="rank_tab_bar"
    tabPageClass="rank_tab_waterfall"
  >
    <template v-slot:tab-item>
      <RankTabItem :type="1"/>
    </template>
    <template v-slot:waterfall-section>
      <RankTabContent />
    </template>
  </qt-tabs>
</div>
</template>
<script lang='ts' setup>
import { StyleValue, computed, ref } from 'vue';
import RankTabItem from './RankTabItem.vue'
import RankTab from './RankTab.vue'
import RankTabContent from './RankTabContent/index.vue'
import rankApi from '../../api/ranking/index'
import { IrankingConfig } from '../../api/ranking/types'
import {
  QTITab, QTTabPageData, QTWaterfall, QTWaterfallSection, QTWaterfallSectionType, QTTabItem, QTTab
} from "@quicktvui/quicktvui3";
// @ts-ignore
import { transRankingTabList, pageHeight, pageWidth, transRankingSections } from './index.ts'

const tabRef = ref()
const loading = ref(true)
const configs = ref<Partial<IrankingConfig>>({})

const onTabPageLoadData = (pageIndex: number, pageNo: number, useDiff: boolean) => {
  // console.log(pageIndex, pageNo, useDiff, '--lsj')
  rankApi.getContentData(pageIndex).then(res=>{
    console.log('lsj-getContentData')
    tabRef.value?.setPageData(pageIndex, {
      useDiff: useDiff,
      data: transRankingSections(res, rankApi.getConfig()).sections
    })
  })
}

defineExpose({
  onESCreate(params){
    rankApi.initPageData(params).then(()=>{
      loading.value = false

      configs.value = rankApi.getConfig()

      rankApi.getTabData().then(res=>{
        const tab: QTTab = {
          defaultFocusIndex: 2,
          defaultIndex: 0,
          itemList: transRankingTabList(res, rankApi.getConfig())
        }
        tabRef.value?.initTab(tab)
        let waterfallData: QTWaterfall = {
          width: pageWidth,
          height: pageHeight - (configs.value.topHeight||0 + 60)
        }
        tabRef.value?.initPage(waterfallData)
      })
      
    })
  }
})
</script>
<style>
.rank_tab_bar {
  width: 1920px;
  height: 60px;
  margin-top: 70px;
  position: absolute;
  z-index: 20;
  background-color: transparent;
}
.rank_tab_waterfall {
  width: 1920px;
  height: 1080px;
  position: absolute;
  z-index: 10;
  background-color: transparent;
}
</style>
<style scoped>
.ranking_page {
  width: 1920px;
  height: 1080px;
  background-color: transparent;
  /* #0E0E0E */
}
.ranking_page_top {
  background-color: transparent;
}

.ranking_tabs {
  width: 1920px;
  height: 1080px;
  background-color: transparent;
}
.rank_loading_box {
  position: absolute;
  left: 0.01px;
  top: 0.01px;
  width: 1920px;
  height: 1080px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  z-index: 10;
  background-color: transparent;
}
</style>