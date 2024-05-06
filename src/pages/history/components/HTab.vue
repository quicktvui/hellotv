<template>
    <div 
        class="h_tab" v-show="isShow" :focusable="false" :width="pWidth"
    >
        <!-- :requestFocus="true" content_grid_name-->
        <qt-nav-bar 
            ref="contentNavBar" class="hc-navbar" :item-gap="10" :width="pWidth"
            @tab-select="onTabSelect" name="h_tab_name" :requestFocus="true"
            :nextFocusName="{ down: 'history_poster_name' }"></qt-nav-bar>
    </div>
</template>
<script lang='ts' setup>
import { computed, nextTick, ref } from 'vue';
// import { } from '@quicktvui/quicktvui3';
// @ts-ignore
import { getFilterList } from '../index.ts'
import { useESToast } from '@extscreen/es3-core';
// @ts-ignore
import api from '../../../api/history/index.ts'
// import { Native } from "@extscreen/es3-vue";

const props = defineProps<{
    pWidth:number
}>()
const toast = useESToast()
const contentNavBar = ref();

const emits = defineEmits(['emSelectTab'])

const isShow = ref(true)
let filterList:any[] = []
let tabPosition = -1

const onTabSelect = (arg: any) => {
    if(!isShow.value) return
    if (tabPosition !== arg.position) {
        emits('emSelectTab', arg.position, filterList[arg.position])
    }
    tabPosition = arg.position
};

defineExpose({
    async init(index:number = 0, category:any, isReset = false) {
        tabPosition = -1
        let tabList = await api.getFilterTabList(index, category).catch(()=>{
            return null
        })
        if (tabList && tabList.data?.length && !tabList.isHide) {
            isShow.value = true
            contentNavBar.value?.init({
                data: getFilterList(tabList.data),
            });
            filterList = tabList.data
            if(isReset){
                nextTick(()=>{
                    contentNavBar.value?.navList.value?.setItemFocused(0)//(当内容区被清空时,如果configs.clearAllIsReset=true,会走这里)
                })
            }
        } else {
            filterList = []
            contentNavBar.value?.init({ data: [] });
            isShow.value = false
        }
        if(isShow.value && filterList.length){
            onTabSelect({ position: 0 })
        }
        return {isShow:isShow.value,firstFilter:tabList?.data?.[0]}
    },
    requestChildTabFocus(index) { // 针对上方tab的焦点重新获焦(当内容区被清空时，如果configs.clearAllIsReset=true，会调此方法)
        // Native.callUIFunction(contentNavBar.value, "requestFocus", [])
        // Native.callUIFunction(contentNavBar.value, "requestFocusDirectly", [])
        nextTick(()=>{
            contentNavBar.value?.navList?.setItemFocused(tabPosition)
        })
    },
    onKeyUp(){}
})
</script>
<style scoped>
.h_tab {
    /* width: 1570px; */
    height: 90px;
    background-color: transparent;
}

.hc-navbar {
    /* width: 1540px; */
    height: 90px;
    margin-left: 30px;
    background-color: transparent;
}
</style>