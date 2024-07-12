<template>
<div :clipChildren="false" :focusable="false" class="rank_tab" :style="rtStyle">
  <qt-list-view 
    ref="rankTabListRef" :clipPadding="false" class="ran_tab_list"
    @item-focused="onTabChange" :horizontal="true" :focusable="false"
    :list-data="listData" :style="rtlStyle" :autofocusPosition="initPosition"
  >
    <qt-view :type="1" class="ran_tab_list_item" autoWidth :clipChildren="false" :focusable="true" :focusScale="1.08">
      <qt-text text="${text}" class="ran_tab_list_item_txt" :focusable="false" duplicateParentState autoWidth gravity="center"></qt-text>
    </qt-view>
  </qt-list-view>
</div>
</template>
<script lang='ts' setup>
import { qtRef, QTListViewItem } from '@quicktvui/quicktvui3';
import { StyleValue, computed, ref } from 'vue';
import rankApi from '../../api/ranking/index'
// @ts-ignore
import { transRankingTabList } from './index.ts'

const configs = rankApi.getConfig()
const listData = qtRef<QTListViewItem[]>()

const initPosition = ref(2)//默认焦点位置
const rtStyle = computed<StyleValue>(()=>{
  const space = (configs.pageSpace||0) - 35
  return { width: 1920 - (space*2) + 'px', marginLeft: space+'px'  }
})
const rtlStyle = computed(()=>{
  return { width: 1920 - ((configs.pageSpace||0)-27)*2 + 'px' }
})
const onTabChange = () => {

}

rankApi.getTabData().then(res=>{
  listData.value = transRankingTabList(res)
})
</script>
<style scoped>
.rank_tab {
  height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: transparent;
}
.ran_tab_list{
  height: 60px;
  background-color: transparent;
}
.ran_tab_list_item {
  height: 60px;
  padding-left: 25px;
  padding-right: 25px;
  border-radius: 30px;
  background-color: transparent;
  focus-background-color: #ffffff;
}
.ran_tab_list_item_txt{
  height: 60px;
  font-size: 30px;
  color: #BFBFBF;
  focus-color: #0E0E0E;
}
</style>