<template>
    <qt-view class="history" :skipRequestFocus="true"
        :class="['history_' + configs.layout, isShowFilter ? '' : 'history_no_filter', isNoMenu ? 'history_no_menu' : '']"
        ref="historyRootRef" :focusable="false" :gradientBackground="bgColor">
        <!-- :descendantFocusability="2" 2：锁定， 1：放开 :skipRequestFocus="true"-->
        <HistoryMenu ref="HistoryMenuRef" class="menu" :title="configs.title" :titleImg="configs.titleImg"
            :isFilter="isShowFilter" :layout="configs.layout" :focusedBg="configs.menuFocusedItemBg"
            :menuStyle="configs.menuStyle" :menuList="configs.menuList" @emChangeMenu="emChangeMenuFn"
            :bgColor="configs.menuBgColor" />
        <HTop ref="HTopRef" class="top" @emClear="emClearFn" @emEditStateChange="emEditStateChangeFn"
            :pWidth="contentWidth" :isLoaded="isLoaded" />
        <HistoryTab ref="HistoryTabRef" class="tab" @emSelectTab="emSelectTabFn" :pWidth="contentWidth" />
        <HistoryContent 
            ref="HistoryContentRef" class="content" :detailPageName="configs.detailPageName"
            :emptyTxt="configs.emptyTxt" :pConfig="configs" :setDataCallBack="setDataCallBackFn"
            @emContentClearAll="emContentClearAllFn" :pHeight="contentHeight" :pWidth="contentWidth"
            @emInitNoData="emInitNoDataFn"
        />
    </qt-view>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
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
const isNoMenu = ref(false)

const bgColor = computed(() => {
    if (configs.bgColor) {
        return (typeof configs.bgColor == 'object') ? configs.bgColor : { colors: [configs.bgColor, configs.bgColor] }
    }
    return { colors: ['#252930', '#252930'] }
})
let menuPosition = -1
let tabPosition = -1
const emInitNoDataFn = ()=>{
    if(tabPosition>=0){
        HistoryTabRef.value?.requestChildTabFocus()
    }else{
        HistoryMenuRef.value?.setItemFocused(menuPosition)
    }
}
const emClearFn = () => {
    HistoryContentRef.value?.clearData()//情况列表数据
}
let currentMenu: any = { index: 0, item: {} }
let currentFilter: any = { index: 0, item: {} }
const emChangeMenuFn = (index: number = 0, item: any = {}, isReset = false) => {
    currentMenu = { index, item }
    HistoryTabRef.value?.init(index, item, isReset).then(res => {//切换菜单分类时，更新筛选条件
        if (!res.isShow) {//如果没有筛选条件，则根据分类获取列表数据
            currentFilter = { index: 0, item: res.firstFilter||{} }
            isShowFilter.value = false
            contentHeight.value = dContentHeight + dTabFilterHeight - 10
            HistoryContentRef.value?.setData(currentMenu, currentFilter)
        } else {
            isShowFilter.value = true
            contentHeight.value = dContentHeight
        }
        isLoaded.value = false
    }).catch(() => {
        isShowFilter.value = false
    })
    menuPosition = index
    tabPosition = -1
}
const emSelectTabFn = (index: number, item: any) => {
    currentFilter = { index, item }
    //切换筛选条件时，根据菜单分类和筛选条件两个指标，获取列表数据
    isLoaded.value = false
    HistoryContentRef.value?.setData(currentMenu, currentFilter)
    HTopRef.value?.setEdit(false)
    tabPosition = index
}
const emEditStateChangeFn = (boo: boolean) => {
    HistoryContentRef.value?.changeEditState(boo)//切换是否时编辑状态
}
const setDataCallBackFn = (boo) => {
    isLoaded.value = !!boo
}

function onESCreate(params) {
    HistoryMenuRef.value?.initData().then(res => {
        if (res) {
            contentWidth.value = dContentWidth
        } else {
            contentWidth.value = dContentWidth + dMenuWidth
            emChangeMenuFn()
        }
        isNoMenu.value = !res
    })//初始化菜单数据
}
const emContentClearAllFn = () => {
    HTopRef.value?.setEdit(false)
    if (configs.clearAllIsReset) {
        HistoryContentRef.value?.reset()
        emChangeMenuFn(currentMenu.index, currentMenu.item, true)
    } else {
        emInitNoDataFn()
    }
}
defineExpose({
    onESCreate,
    onKeyDown(keyEvent) {
        HTopRef.value?.onKeyDown(keyEvent)
    },
    onBackPressed() {
        if (HistoryContentRef.value?.onBackPressed()) {
            if (!HTopRef.value?.onBackPressed()) {
                HistoryContentRef.value?.scrollTo(0)
            }
        }
    },
    onKeyUp() {
        HTopRef.value?.onKeyUp()
    },
    onESRestart() {
        isLoaded.value = false
        HistoryContentRef.value?.reStartload(currentMenu, currentFilter)
    }
})
</script>

<style scoped lang="less">
.history {
    width: 1920px;
    height: 1080px;
    position: relative;
    background-color: transparent;
    // background-color: #252930;
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

.history_no_filter {
    .tab {
        display: none;
    }

    .content {
        top: 100px;
    }
}

.history_no_filter.history_rightTop {
    .content {
        top: 100px;
    }
}

.history_no_menu {
    .top {
        left: 0;
    }

    .tab {
        left: 0;
    }

    .content {
        left: 0;
    }
}
</style>