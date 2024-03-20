<template>
    <qt-view class="history-content">
        <qt-view class="hc-top">
            <text-view gravity="end" class="hc-top-txt" text="按【菜单键】或者长按【ok键】管理记录"></text-view>
        </qt-view>
        <qt-nav-bar ref="contentNavBar" class="hc-navbar" style="width: 1100px;height: 100px;" :item-gap="10"
            @tab-select="onTabSelect"></qt-nav-bar>
        <qt-view class="qt-grid-view">
            <qt-grid-view class="grid_view" ref="gridViewRef" :clipChildren="false" :clipPadding="false" :spanCount="4"
                :areaWidth="1480" :padding="'0,0,10,16'" :blockFocusDirections="['left', 'right']">
                <template v-slot:header>
                    <qt-view type="1003" name="type0" ref="type0" class="type0" :focusable="false">
                        <text-view  :focusable="false" :duplicateParentState="true" :fontSize="38"
                            gravity="centerVertical" class="tit0" text="${assetTitle}" />
                    </qt-view>
                </template>
                <qt-poster />
            </qt-grid-view>
        </qt-view>
    </qt-view>
</template>
<script lang='ts' setup>
import {
    QTINavBar,
    QTNavBarItemType,
    QTIListView, QTListViewItem, QTPoster, QTGridViewItem
} from '@quicktvui/quicktvui3';
import { ref } from 'vue';
// @ts-ignore
import { getContentList, getMenuList } from './index.ts'

const contentNavBar = ref<QTINavBar>();

//导航切换时的回调，当前选中导航的info(e)
const onTabSelect = (arg: any) => {
    gridViewRef.value!.init(getContentList( (arg.position+1) * 10 ))
};

// 内容----
const gridViewRef = ref<QTIListView>();

defineExpose({
    contentNavBar, gridViewRef,
    initData() {
        contentNavBar.value?.init({
            data: getMenuList(),
        });

        // gridViewRef.value!.init(getContentList(30))
    }
})
</script>
<style scoped>
.hc-top {
    height: 80px;
    padding-top: 30px;
}

.hc-top-txt {
    width: 1400px;
    height: 80px;
    color: #666;
}

.qt-grid-view {
    width: 1480px;
    height: 850px;
    flex-direction: column;
    /* background-color: #fff; */
}

.qt-grid-view .grid_view {
    width: 1480px;
    height: 850px;
}
.type0{
    background-color: transparent;
    width: 1000px;
    height: 50px;
}
.tit0{
    width: 1000px;
    height: 50px;
}
</style>