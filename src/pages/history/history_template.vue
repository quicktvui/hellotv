<template>
    <qt-view class="history" :skipRequestFocus="true"
        ref="historyRootRef" :focusable="false" :gradientBackground="bgColor">
        <!-- :descendantFocusability="2" 2：锁定， 1：放开 :skipRequestFocus="true"-->
        <HistoryMenu ref="HistoryMenuRef" class="menu" :title="configs.title" :titleImg="configs.titleImg"
            :isFilter="isShowFilter" :layout="configs.layout" :focusedBg="configs.menuFocusedItemBg"
            :menuStyle="configs.menuStyle" :menuList="configs.menuList" @emChangeMenu="emChangeMenuFn"
            :bgColor="configs.menuBgColor" :style="menuStyle"/>
        <HTop ref="HTopRef" class="top" @emClear="emClearFn" @emEditStateChange="emEditStateChangeFn"
            :pWidth="contentWidth" :isLoaded="isLoaded" :style="topStyle"/>
        <HistoryTab ref="HistoryTabRef" class="tab" @emSelectTab="emSelectTabFn" :pWidth="contentWidth" :style="tabStyle"/>
        <HistoryContent 
            ref="HistoryContentRef" class="content" :detailPageName="configs.detailPageName"
            :emptyTxt="configs.emptyTxt" :pConfig="configs" :setDataCallBack="setDataCallBackFn"
            @emContentClearAll="emContentClearAllFn" :pHeight="contentHeight" :pWidth="contentWidth"
            @emInitNoData="emInitNoDataFn" :style="contentStyle"
        />
    </qt-view>
</template>

<script lang="ts" setup>
import { StyleValue, computed, nextTick, ref } from 'vue';
import HistoryMenu from './components/HMenu.vue'
import HistoryContent from './components/HContent.vue'
import HistoryTab from './components/HTab.vue'
import HTop from './components/HTop.vue'
import { useESToast } from '@extscreen/es3-core';
import dConfig, { Iconfig, layouts, pageWidth } from './config'

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
const dContentHeight = 900
const contentHeight = ref(dContentHeight)
const dTabFilterHeight = 100
const dContentWidth = pageWidth-configs.menuWidth
const contentWidth = ref(dContentWidth)
const isNoMenu = ref(false)

const bgColor = computed(() => {
    if (configs.bgColor) {
        return (typeof configs.bgColor == 'object') ? configs.bgColor : { colors: [configs.bgColor, configs.bgColor] }
    }
    return { colors: ['#252930', '#252930'] }
})

const checkFocusFn = ()=>{
    nextTick(()=>{
        if(!HistoryContentRef.value?.checkFocus()){
            if(!HistoryTabRef.value?.checkFocus()){
                HistoryMenuRef.value?.checkFocus()
            }
        }
    })
}
let menuPosition = -1
let tabPosition = -1
const emInitNoDataFn = ()=>{
    if(tabPosition>=0){
        HistoryTabRef.value?.requestChildTabFocus()
    }else{
        HistoryMenuRef.value?.setItemFocused(menuPosition)
    }
}
const emClearFn = async () => {
    HistoryContentRef.value?.clearData()//情况列表数据
    if (configs.clearAllIsReset) {
        HistoryContentRef.value?.reset()
        emChangeMenuFn(currentMenu.index, currentMenu.item, true)
    }
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
    HistoryMenuRef.value?.initData(Number(params.focusMenuIndex||0)).then(res => {
        if (res) {
            contentWidth.value = dContentWidth
        } else {
            contentWidth.value = pageWidth
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
const menuStyle = computed<StyleValue>(()=>{
    let res:StyleValue = { left: 0, top: 0}
    if(dConfig.layout === layouts.rt){
        res = {left: dContentWidth+'px', top: 0}
    }
    if(dConfig.layout === layouts.rb){
        res = {left: dContentWidth+'px',top: 0}
    }
    return res
})
const topStyle = computed<StyleValue>(()=>{
    let res:StyleValue = { left: configs.menuWidth+'px', top: 0}
    if(dConfig.layout === layouts.lb){
        res = {left: configs.menuWidth+'px', top: 0}
    }
    if(dConfig.layout === layouts.rt){
        res = {left: 0, top: 0}
    }
    if(dConfig.layout === layouts.rb){
        res = { left: 0, top: 0}
    }
    if(isNoMenu.value){
        res.left = 0
    }
    return res
})
const tabStyle = computed<StyleValue>(()=>{
    let res:StyleValue = {left: configs.menuWidth+'px', top: '100px'}
    if(dConfig.layout === layouts.lb){
        res = {left: configs.menuWidth+'px', top: '980px'}
    }
    if(dConfig.layout === layouts.rt){
        res = {left: 0,top: '100px'}
    }
    if(dConfig.layout === layouts.rb){
        res = { left: 0,top: '980px' }
    }
    if(!isShowFilter.value){
        return  res.display = 'none'
    }
    if(isNoMenu.value){
        res.left = 0
    }
    return res
})
const contentStyle = computed<StyleValue>(()=>{
    let res:StyleValue = {left: configs.menuWidth+'px', top: '200px'}
    if(dConfig.layout === layouts.lb){
        res = {left: configs.menuWidth+'px',top: '100px'}
    }
    if(dConfig.layout === layouts.rt){
        res = {left: '0px', top: '200px'}
    }
    if(dConfig.layout === layouts.rb){
        res = { left: '0px', top: '100px' }
    }
    if(!isShowFilter.value){
        res.top = '100px'
    }
    if(isNoMenu.value){
        res.left = 0
    }
    return res
})
defineExpose({
    onESCreate,
    onKeyDown(keyEvent) {
        HTopRef.value?.onKeyDown(keyEvent)
    },
    onBackPressed() {
        if (HistoryContentRef.value?.onBackPressed()) {
            if (!HTopRef.value?.onBackPressed()) {
                // HistoryContentRef.value?.scrollTo(0)
                checkFocusFn()
            }
        }
    },
    onKeyUp() {
        HistoryTabRef.value?.onKeyUp()
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
    z-index: 10;
    background-color: transparent;
}

.top {
    position: absolute;
    z-index: 9;
    background-color: transparent;
}

.tab {
    position: absolute;
    z-index: 8;
    background-color: transparent;
}

.content {
    position: absolute;
    z-index: 1;
    background-color: transparent;
}
</style>