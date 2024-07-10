<template>
<div class="ranking_page" :gradientBackground="configs.gradientBg">
  <RankTab v-if="!loading" />
  <RankTabContent />
  <div class="rank_loading_box" v-show="loading">
    <qt-loading-view color="rgba(255,255,255,0.3)" style="height: 100px; width: 100px" :focusable="false" />
  </div>
</div>
</template>
<script lang='ts' setup>
import { computed, ref } from 'vue';
import RankTab from './RankTab.vue'
import RankTabContent from './RankTabContent/index.vue'
import rankApi from '../../api/ranking/index'
import { IrankingConfig } from '../../api/ranking/types'

const loading = ref(true)
const configs = ref<Partial<IrankingConfig>>({})

defineExpose({
  onESCreate(params){
    rankApi.initPageData(params).then(()=>{
      loading.value = false

      configs.value = rankApi.getConfig()
    })
  }
})
</script>
<style scoped>
.ranking_page {
  width: 1920px;
  height: 1080px;
  padding-top: 65px;
  background-color: transparent;
  /* #0E0E0E */
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