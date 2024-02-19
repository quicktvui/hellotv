<template>
  <scroll-view ref="content_scroll_view" name="content_scroll_view" :focusable="false" :onScrollEnable="true"
    :clipChildren="false" makeChildVisibleType="none" :style="{ ...style, marginLeft: 70 }">
    <qt-view class="content-wrap" :useAdvancedFocusSearch="true" :focusable="false" :style="{ width: style.width }"
      :clipChildren="false">
      <qt-list-view ref="listViewRef" :style="{ width: style.width, height: 60 * 5 }" v-if="renderFilter"
        :enableSelectOnFocus="false" :clipChildren="false">
        <qt-list-view class="filter-list" :endHintEnabled="false" horizontal :clipChildren="false" :useDiff="true"
          singleSelectPosition="${selection}" :focusMemory="false" @item-click="onFilterChange"
          :style="{ width: style.width }" :type="1008611" list="${list}" :enableSelectOnFocus="false">
          <qt-button class="text-button-class" text="value" :type="10087" :clipChildren="false"
            :text-style="{ fontSize: '30px', color: 'rgba(255, 255, 255, 0.5)', 'focus-color': 'black', 'select-color': 'white' }"
            :focusable="true" :focusScale="1.03" :enable-flex-style="true"></qt-button>
        </qt-list-view>
      </qt-list-view>

      <qt-grid-view v-if="render" class="grid-view" ref="gridViewRef" :clipChildren="false" :clipPadding="false"
        @item-click="onListItemClick" @item-bind="onListItemBind" :areaWidth="style.width" :enablePlaceholder="true"
        :style="{ width: style.width, height: 1080, marginLeft: 30 }" name="grid-view" :blockFocusDirections="['right']"
        :spanCount="5" :openPage="true" :preloadNo="0" :loadMore="onPagination" :listenBoundEvent="true" :useDiff="true"
        :triggerTask="triggerTask" :listenHasFocusChange="true">

        <qt-poster />

        <template #footer>
          <p class="load-complete" :style="{ width: style.width }" :type="1003">没有更多了~</p>
        </template>

        <qt-view class="loading" :type="1002" :focusable="false" :style="{ width: style.width }">
          <qt-loading-view color="#409eff" style="height: 30px;width: 30px;" />
        </qt-view>
      </qt-grid-view>

      <div v-if="loading"
        :style="{ ...style, position: 'absolute', left: 0, top: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }">
        <qt-loading-view color="#409eff" style="height: 150px; width: 150px" />
      </div>

      <div v-if="empty"
        :style="{ ...style, position: 'absolute', left: 0, top: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }">
        <p class="load-complete" :style="{ width: style.width }">暂无数据</p>
      </div>
    </qt-view>
  </scroll-view>
</template>

<script lang="ts">
import { defineComponent, toRaw } from 'vue';
import { QTGridView, QTListViewItem, QTIListView } from '@quicktvui/quicktvui3';
import { computed, inject, ref } from 'vue';
import { ProListPageProps } from './ProListPage.vue';
export default defineComponent({
  setup(props, { emit }) {

    const gridViewRef = ref<QTGridView>();

    const loading = ref<boolean>(false);

    const loadMoreVisible = ref<boolean>(false);

    const hasSider = inject<ProListPageProps["hasSider"]>("hasSider");

    const hasHeader = inject<ProListPageProps["hasHeader"]>("hasHeader");

    const content_scroll_view = ref()

    const listViewRef = ref<QTIListView>();

    const style = computed(() => ({
      width: (hasSider ? 1920 - 340 : 1920) - 70 - 66,
      height: hasHeader ? 1080 - 100 : 1080
    }));


    const triggerTask = computed(() => [
      {
        event: 'onFocusLost',
        target: 'content_scroll_view',
        function: 'scrollToWithOptions',
        params: [{
          x: 0,
          // y: -300,
          y: renderFilter.value ? - 5 * 60 + (hasHeader ? 100 : 0) + 40 : 0,
          duration: 300,
        }],
      },
      {
        event: 'onFocusAcquired',
        target: 'content_scroll_view',
        function: 'scrollToWithOptions',
        params: [{
          x: 0,
          // y: 300,
          y: renderFilter.value ? 5 * 60 + (hasHeader ? 100 : 0) + 40 : 0,
          duration: 300,
        }],
      },
    ])

    const render = ref<boolean>(false);

    const renderFilter = ref<boolean>(false);

    const empty = ref<boolean>(false);

    const onListItemClick = (...rest) => {
      emit('onListItemClick', ...rest)
    }

    const onFilterChange = (...rest) => {
      emit('onFilterChange', ...rest)
    }

    const onListItemBind = (...rest) => {
      emit('onListItemBind', ...rest)
    }

    const onPagination = (...rest) => {
      console.log('###tag content', ...rest)
      emit('onPagination', ...rest)
    }

    const setFilterRef = (el, item) => {
      console.log("???#el", el, item)
      el?.init(toRaw(item))
    }

    return {
      content_scroll_view, gridViewRef, style, render, loading, loadMoreVisible, listViewRef, renderFilter, empty,
      onFilterChange,
      onListItemClick,
      onListItemBind, onPagination, setFilterRef, triggerTask
    }
  },
})
</script>
<!-- <script lang="ts" setup>
import { QTGridView, QTListViewItem } from '@quicktvui/quicktvui3';
import { computed, inject, ref } from 'vue';
import { ProListPageProps } from './ProListPage.vue';

const gridViewRef = ref<QTGridView>();

const loading = ref<boolean>(false);

const loadMoreVisible = ref<boolean>(false);

const hasSider = inject<ProListPageProps["hasSider"]>("hasSider");

const hasHeader = inject<ProListPageProps["hasHeader"]>("hasHeader");

const emit = defineEmits(['onListItemClick', 'onListItemBind', 'onPagination', 'onFilterChange']);

const style = computed(() => ({
  width: hasSider ? 1920 - 340 : 1920,
  height: hasHeader ? 1080 - 100 : 1080
}));

const render = ref<boolean>(false);

const onListItemClick = (...rest) => {
  emit('onListItemClick', ...rest)
}

const onListItemBind = (...rest) => {
  emit('onListItemBind', ...rest)
}

const onPagination = (...rest) => {
  console.log('content', ...rest)
  emit('onPagination', ...rest)
}

const onFilterChange = (...rest) => {
  emit('onFilterChange', ...rest)
}

defineExpose({ gridViewRef, style, render, loading, loadMoreVisible });

</script> -->

<style scoped>
.grid-view {
  /* width: 1920px; */
  /* height: 1080px; */
  background-color: transparent;
}

.content-wrap {
  /* width: 1920px; */
  height: 1380px;
  display: flex;
  flex-direction: column;
  /* background-color: cornflowerblue; */
}

.filter-list {
  height: 60px;
  line-height: 60px;
  background-color: transparent;
}

.filter-list .text-button-class {
  width: auto;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 10px;
  padding-bottom: 10px;
  height: 60px;
  background-color: transparent;
  color: aliceblue;
  border-radius: 40px;
}

.debug {
  width: 200px;
  height: 50px;
  font-size: 36px;
  color: wheat;
}

.load-complete {
  font-size: 24px;
  text-align: center;
  height: 80px;
  line-height: 80px;
  color: #fff;
}

.loading {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.no-data {
  width: 1580px;
}
</style>
