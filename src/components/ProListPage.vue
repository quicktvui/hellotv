<template>
  <div class="pro-list-page" :clipChildren="false">
    <slot name="header"></slot>

    <div class="main" :clipChildren="false">
      <slot name="sider"></slot>
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, defineComponent, watch, computed, isProxy, toRaw, toRefs, nextTick, provide } from 'vue';
import { QTINavBar, QTNavBar, QTNavBarItemType, QTNavBarItem, QTIListView, QTListViewItem, QTGridViewItem, QTPoster, QTGridView } from "@quicktvui/quicktvui3";

export interface ProListPageProps {
  hasSider?: boolean;
  hasHeader?: boolean;
}
const props = defineProps<ProListPageProps>();

// use it to calculate dynamic width and height in Content component and Sider component
provide("hasSider", props.hasSider);
provide("hasHeader", props.hasHeader);
</script>

<style scoped>
.pro-list-page {
  width: 1920px;
  height: 1080px;
  display: flex;
  flex-direction: column;
  background-color: transparent;
}


.pro-list-page>.main {
  width: 1920px;
  height: 1080px;
  display: flex;
  flex-direction: row;
}
</style>
