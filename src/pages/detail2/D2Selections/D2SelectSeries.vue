<template>
  <select-series ref="quick_select_series2" :clipChildren="false" :scrollParam="scrollParams" :groupParam="groupParams"
    :commonParam="commonParams" :display="true" @load-data="onLoadData" @item-click="onItemClick"
    :style="{ width: 1920, height: 130 }">
    <div class="item-container">
      <text-view style="width: 160px;height: 60px;color: white;" :fontSize="28" gravity="center"
        :showOnState="['normal', 'focused']" text="${title}" />
      <text-view style="width: 160px;height: 60px;color: red;position: absolute" :fontSize="28" gravity="center"
        showOnSelected text="${title}" />
    </div>
  </select-series>
</template>
<script lang='ts' setup>
const onItemClick = () => { }
const onLoadData = () => { }
const scrollParams = {
  scrollType: 1,
  pageDisplayCount: 10,
  paddingForPageLeft: 0,
  paddingForPageRight: 0,
}
const groupParams = {
  groupSize: 10,
  groupUp: true,
  groupMarginLeft: 200,
  textColor: {
    normal: "#FFFFFF",
    focused: "#FFFFFF",
    selected: "#40b883",
  },
  focusBackground: {
    color: ['#40b883', '#40b883'],
    //   orientation: 'LEFT_RIGHT',
    //   cornerRadius: [40, 40, 40, 40],
    //   padding: [34, 6]
  },
  mark: {
    color: '#00FFFFFF'
  }
}
const commonParams = {
  contentWidth: 1740,
  itemGap: 15.6,
  // contentHeight: 80
}
</script>
<style scoped></style>