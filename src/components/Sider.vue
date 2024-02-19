<template>
  <qt-list-view :style="style" class="side-bar-list" ref="sideBarListRef" @item-focused="onTabChange"
    :endHintEnabled="false" :clipChildren="false" :blockFocusDirections="['down', 'left']" name="sider" :defaultFocus="1"
    nextFocusRightSID="nextFocusRightSID-tag-1" :nextFocusName="{ right: 'grid-view' }">
    <qt-view class="side-bar-list-item" :type="1">
      <qt-button class="text-button-class" text="label"
        :text-style="{ fontSize: '36px', marginLeft: '40px', color: 'rgba(255, 255, 255, 0.5)', 'focus-color': 'black', 'select-color': 'white' }"
        :focusable="false" :focusScale="1.1" :enable-flex-style="true"></qt-button>
    </qt-view>

    <qt-view class="side-bar-list-item" :type="2">
      <qt-button class="text-button-class" text="label"
        :text-style="{ fontSize: '36px', marginLeft: '40px', color: 'rgba(255, 255, 255, 0.5)', 'focus-color': 'black', 'select-color': 'white' }"
        :focusable="true" :focusScale="1.1" :enable-flex-style="true"></qt-button>
    </qt-view>

    <qt-view class="side-bar-list-item" :type="3">
      <qt-button class="text-button-class" text="label"
        :text-style="{ fontSize: '36px', marginLeft: '40px', color: 'rgba(255, 255, 255, 0.5)', 'focus-color': 'black', 'select-color': 'white' }"
        :focusable="true" :focusScale="1.1" :enable-flex-style="true"></qt-button>
    </qt-view>
  </qt-list-view>
</template>
<script lang="ts" setup>
import { QTIListView } from '@quicktvui/quicktvui3';
import { isProxy, ref, toRaw, inject, computed } from 'vue';
import { ProListPageProps } from './ProListPage.vue';
const hasSider = inject<ProListPageProps["hasSider"]>("hasSider");

const hasHeader = inject<ProListPageProps["hasHeader"]>("hasHeader");

const sideBarListRef = ref<QTIListView>();

const emit = defineEmits(["onTabChange"]);

const style = computed(() => ({
  width: hasSider ? 340 : 0,
  height: hasHeader ? 1080 - 100 : 1080
}));

const onTabChange = (e) => {
  emit("onTabChange", e)
};

const initialize = (datasource: any[]) => {
  const data = isProxy(datasource) ? toRaw(datasource) : datasource;
  const combineData = data.map(item => ({ type: 3, openPage: false, ...item }));
  combineData.unshift({ type: 2, label: "自定义菜单", value: "自定义菜单", openPage: false });
  combineData.unshift({ type: 1, label: "自定义标题", value: "自定义标题", openPage: false });
  sideBarListRef.value?.init(combineData)
}

defineExpose({ initialize })
</script>

<style scoped>
.side-bar-list {
  background-color: transparent;
}

.side-bar-list .side-bar-list-item {
  width: 340px;
  height: 108px;
  background-color: transparent;
}

.side-bar-list .side-bar-list-item .text-button-class {
  width: 340px;
  height: 108px;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  background-color: transparent;
}

</style>
