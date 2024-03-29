<template>
    <qt-view class="history" :class="['history_' + configs.layout]" ref="historyRootRef">
        <HistoryMenu ref="HistoryMenuRef" class="menu" :title="configs.title" :titleImg="configs.titleImg"
            :menuStyle="configs.menuStyle" :menuList="configs.menuList" @emChangeMenu="emChangeMenuFn" />
        <HTop ref="HTopRef" class="top" @emClear="emClearFn" @emEditStateChange="emEditStateChangeFn" />
        <HistoryTab ref="HistoryTabRef" class="tab" @emSelectTab="emSelectTabFn" />
        <HistoryContent 
            ref="HistoryContentRef" class="content" :spanCount="configs.contentColumn"
            :detailPageName="configs.detailPageName" :emptyTxt="configs.emptyTxt"
        />

        <!-- <qt-row v-if="layout === layouts.lt">
            <HistoryMenu ref="HistoryMenuRef" />
            <qt-column>
                <HTop ref="HTopRef" />
                <HistoryTab ref="HistoryTabRef" />
                <HistoryContent ref="HistoryContentRef" />
            </qt-column>
        </qt-row>
        <qt-row v-if="layout === layouts.rt">
            <qt-column>
                <HTop ref="HTopRef" />
                <HistoryTab ref="HistoryTabRef" />
                <HistoryContent ref="HistoryContentRef" />
            </qt-column>
            <HistoryMenu ref="HistoryMenuRef" />
        </qt-row>
        <qt-row v-if="layout === layouts.lb">
            <HistoryMenu ref="HistoryMenuRef" />
            <qt-column>
                <HTop ref="HTopRef" />
                <HistoryContent ref="HistoryContentRef" />
                <HistoryTab ref="HistoryTabRef" />
            </qt-column>
        </qt-row>
        <qt-row v-if="layout === layouts.rb">
            <qt-column>
                <HTop ref="HTopRef" />
                <HistoryContent ref="HistoryContentRef" />
                <HistoryTab ref="HistoryTabRef" />
            </qt-column>
            <HistoryMenu ref="HistoryMenuRef" />
        </qt-row> -->
    </qt-view>
</template>

<script lang="ts" setup>
import { computed, nextTick, provide, ref } from 'vue';
import HistoryMenu from './components/HMenu.vue'
import HistoryContent from './components/HContent.vue'
import HistoryTab from './components/HTab.vue'
import HTop from './components/HTop.vue'
import { useESToast } from '@extscreen/es3-core';
import { Native } from "@extscreen/es3-vue";
import dConfig, { Iconfig } from './config'

// const props = defineProps<Iconfig>();
const configs: Iconfig = { ...dConfig }//hw_deepMergeObj({},dConfig)

const historyRootRef = ref()
const HTopRef = ref()
const HistoryTabRef = ref()
const HistoryMenuRef = ref()
const HistoryContentRef = ref()
const toast = useESToast()

type Tcallback = () => Promise<any>
const blockFocusAsync = (callback: Tcallback) => {
    Native.callUIFunction(historyRootRef.value, 'blockRootFocus', []);//锁住焦点
    callback().finally(() => {
        nextTick(() => {
            Native.callUIFunction(historyRootRef.value, 'unBlockRootFocus', []);//解开焦点
        })
    })
}
provide('blockFocusAsync', blockFocusAsync)

const emClearFn = () => {
    HistoryContentRef.value.clearData()//情况列表数据
}
let currentMenu: any = null
let currentFilter: any = null
const emChangeMenuFn = (index: number, item: any) => {
    currentMenu = { index, item }
    HistoryTabRef.value.init(index, item).then(res=>{//切换菜单分类时，更新筛选条件
        if(!res){//如果没有筛选条件，则根据分类获取列表数据
            currentFilter = null
            HistoryContentRef.value.setData(currentMenu, currentFilter)
        }
    })
}
const emSelectTabFn = (index: number, item: any) => {
    currentFilter = { index, item }
    //切换筛选条件时，根据菜单分类和筛选条件两个指标，获取列表数据
    HistoryContentRef.value.setData(currentMenu, currentFilter)
    HTopRef.value.setEdit(false)
}
const emEditStateChangeFn = (boo: boolean) => {
    HistoryContentRef.value.changeEditState(boo)//切换是否时编辑状态
}

function onESCreate(params) {
    HistoryMenuRef.value.initData()//初始化菜单数据
}
defineExpose({
    onESCreate,
    onKeyDown(keyEvent) {
        HTopRef.value?.onKeyDown(keyEvent)
    },
    onBackPressed() {
        HTopRef.value?.onBackPressed()
    },
    onKeyUp() {
        HTopRef.value?.onKeyUp()
    }
})
</script>

<style scoped lang="less">
.history {
    width: 1920px;
    height: 1080px;
    position: relative;
    background-color: #252930;
}

.menu {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
}

.top {
    position: absolute;
    left: 350px;
    top: 0;
    z-index: 9;
}

.tab {
    position: absolute;
    left: 350px;
    top: 100px;
    z-index: 8;
}

.content {
    position: absolute;
    left: 350px;
    top: 200px;
    z-index: 1;
}

.history_leftBootom {
    .top {
        left: 350px;
        top: 0;
    }

    .tab {
        left: 350px;
        top: 980px;
    }

    .content {
        left: 350px;
        top: 100px;
    }
}

.history_rightTop {
    .menu {
        left: 1570px;
        top: 0;
    }

    .top {
        left: 0;
        top: 0;
    }

    .tab {
        left: 0;
        top: 100px;
    }

    .content {
        left: 0;
        top: 200px;
    }
}

.history_rightBootom {
    .menu {
        left: 1570px;
        top: 0;
    }

    .top {
        left: 0;
        top: 0;
    }

    .tab {
        left: 0;
        top: 980px;
    }

    .content {
        left: 0;
        top: 100px;
    }
}
</style>../../api/history/baseApi