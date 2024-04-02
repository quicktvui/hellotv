<template>
    <qt-view 
        class="history" :class="['history_' + configs.layout, isShowFilter?'':'history_no_filter']" ref="historyRootRef" :focusable="false"
        :gradientBackground="{colors:['#2F3541', '#252930'], orientation: 0}"
    >
        <!-- :gradientBackground="{colors:['#2F3541', '#252930'], orientation: 0}" -->
        <!-- :descendantFocusability="2" 2：锁定， 1：放开-->
        <HistoryMenu 
            ref="HistoryMenuRef" class="menu" :title="configs.title" :titleImg="configs.titleImg"
            :isFilter="isShowFilter" :layout="configs.layout"
            :menuStyle="configs.menuStyle" :menuList="configs.menuList" @emChangeMenu="emChangeMenuFn"
        />
        <HTop ref="HTopRef" class="top" @emClear="emClearFn" @emEditStateChange="emEditStateChangeFn" :pWidth="contentWidth" :isLoaded="isLoaded"/>
        <HistoryTab ref="HistoryTabRef" class="tab" @emSelectTab="emSelectTabFn" :pWidth="contentWidth"/>
        <HistoryContent 
            ref="HistoryContentRef" class="content" :spanCount="configs.contentColumn"
            :detailPageName="configs.detailPageName" :emptyTxt="configs.emptyTxt"
            :pItemHeight="configs.contentItemHeight"
            @emContentClearAll="emContentClearAllFn" :pHeight="contentHeight" :pWidth="contentWidth"
        />
    </qt-view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import HistoryMenu from './components/HMenu.vue'
import HistoryContent from './components/HContent.vue'
import HistoryTab from './components/HTab.vue'
import HTop from './components/HTop.vue'
import { useESToast } from '@extscreen/es3-core';
import dConfig, { Iconfig } from './config'

// const props = defineProps<Iconfig>();
const configs: Iconfig = { ...dConfig }//hw_deepMergeObj({},dConfig)

const isLoaded = ref(false)
const historyRootRef = ref()
const HTopRef = ref()
const HistoryTabRef = ref()
const HistoryMenuRef = ref()
const HistoryContentRef = ref()
const toast = useESToast()
const isShowFilter = ref(true)
// const isShowMenu = ref(true)
const dMenuWidth = 350
const dContentHeight = 900
const contentHeight = ref(dContentHeight)
const dTabFilterHeight = 100
const dContentWidth = 1570
const contentWidth = ref(dContentWidth)

const emClearFn = () => {
    HistoryContentRef.value?.clearData()//情况列表数据
}
let currentMenu: any = { index: 0, item: {} }
let currentFilter: any = { index: 0, item: {} }
const emChangeMenuFn = (index: number = 0, item: any = {}) => {
    currentMenu = { index, item }
    HistoryTabRef.value?.init(index, item).then(res=>{//切换菜单分类时，更新筛选条件
        if(!res){//如果没有筛选条件，则根据分类获取列表数据
            currentFilter = { index: 0, item: {} }
            isShowFilter.value = false
            contentHeight.value = dContentHeight + dTabFilterHeight - 10
        } else {
            isShowFilter.value = true
            contentHeight.value = dContentHeight
        }
        isLoaded.value = false
        HistoryContentRef.value?.setData(currentMenu, currentFilter).then(res=>{
            isLoaded.value = !!res
        })
    })
}
const emSelectTabFn = (index: number, item: any) => {
    currentFilter = { index, item }
    //切换筛选条件时，根据菜单分类和筛选条件两个指标，获取列表数据
    isLoaded.value = false
    HistoryContentRef.value?.setData(currentMenu, currentFilter).then(res=>{
        isLoaded.value = !!res
    })
    HTopRef.value?.setEdit(false)
}
const emEditStateChangeFn = (boo: boolean) => {
    HistoryContentRef.value?.changeEditState(boo)//切换是否时编辑状态
}

function onESCreate(params) {
    HistoryMenuRef.value?.initData().then(res=>{
        if(res){
            contentWidth.value = dContentWidth
        } else {
            emChangeMenuFn()
            contentWidth.value = dContentWidth + dMenuWidth
        }
    })//初始化菜单数据
}
const emContentClearAllFn = ()=>{
    HTopRef.value?.setEdit(false)
    HistoryTabRef.value?.requestChildTabFocus()
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
    },
    onESRestart(){
        isLoaded.value = false
        HistoryContentRef.value?.setData(currentMenu, currentFilter).then(res=>{
            isLoaded.value = !!res
        })
    }
})
</script>

<style scoped lang="less">
.history {
    width: 1920px;
    height: 1080px;
    position: relative;
    background-color: transparent;
    // background-color: #2B303A;
}

.menu {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
    background-color: transparent;
}

.top {
    position: absolute;
    left: 350px;
    top: 0;
    z-index: 9;
    background-color: transparent;
}

.tab {
    position: absolute;
    left: 350px;
    top: 100px;
    z-index: 8;
    background-color: transparent;
}

.content {
    position: absolute;
    left: 350px;
    top: 200px;
    z-index: 1;
    background-color: transparent;
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
        left: 1575px;
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
        left: 1575px;
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
.history_no_filter{
    .tab{
        display: none;
    }
    .content{
        top: 100px;
    }
}
.history_no_filter.history_rightTop{
    .content{
        top: 100px;
    }
}
</style>