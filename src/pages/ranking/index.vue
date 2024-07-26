<template>
<div class="ranking_page" :gradientBackground="configs.gradientBg" :clipChildren="false">
  <bg-player 
    class="bg_player" ref="bgPlayerRef" :clipChildren="false" 
    :defaultBgParentOpacity="1"
    :border-radius="8"
    :showBgColor="false"
  />
  <qt-tabs
    ref="tabRef" sid="rankingTabsSid"
    class="ranking_tabs"
    tabNavBarClass="rank_tab_bar"
    tabPageClass="rank_tab_waterfall"
    @onTabPageLoadData="onTabPageLoadData"
    @onTabPageChanged="onTabPageChanged"
    enablePlaceholder
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
import bgPlayer, { CoveredPlayerType } from "../../components/bg-player.vue"
// import RankTab from './RankTab.vue'
import RankTabContent from './RankTabContent/index.vue'
import rankApi from '../../api/ranking/index'
import { IrankingConfig } from '../../api/ranking/types'
import type {
  QTITab, QTWaterfall, QTTab
} from "@quicktvui/quicktvui3";
// @ts-ignore
import { transRankingTabList, pageHeight, pageWidth, rankingUi } from './index.ts'
// import { useESRouter } from '@extscreen/es3-router';

const bgPlayerRef = ref()
const tabRef = ref<QTITab>()
const loading = ref(true)
const configs = ref<Partial<IrankingConfig>>({});
const initShowIndex = ref(0)

const onTabPageLoadData = (pageIndex: number, pageNo: number, useDiff: boolean) => {
  if(pageNo > 0) return//没有分页数据
  if(tabRef.value){
    rankingUi.setData(tabRef.value, pageIndex)
  }
}

let isInited = false
const onTabPageChanged = (pageIndex: number, data: any) => {
  if(isInited){
    rankingUi.changeData({ pageIndex, sectionIndex:0, itemIndex:0 }, bgPlayerRef.value)
  }else{
    if(pageIndex===initShowIndex.value){
      isInited = true
      rankingUi.changeData({ pageIndex, sectionIndex:0, itemIndex:0 }, bgPlayerRef.value)
    }
  }
}

defineExpose({
  onESCreate(params){
    rankApi.initPageData(params).then(()=>{
      loading.value = false

      configs.value = rankApi.getConfig()

      rankApi.getTabData().then(res=>{
        const tab: QTTab = {
          defaultFocusIndex: initShowIndex.value,
          defaultIndex: initShowIndex.value,
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
  },
  onESStop(){
    rankingUi.stop()
  },
  onESRestart(){
    rankingUi.reStart()
  },
  onESDestroy(){
    rankingUi.clear()
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
  background-color: #0E0E0E;
  /* #0E0E0E */
}
.bg_player {
  position: absolute;
  background-color: transparent;
}
.ranking_page_top {
  background-color: transparent;
}

.ranking_tabs {
  position: absolute;
  z-index: 10;
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