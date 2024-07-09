<template>
<div class="ranking_page" :gradientBackground="configs.gradientBg">
  <RankTab v-if="!loading" />
  <RankTabContent />
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
}
</style>