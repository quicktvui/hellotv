<template>
    <div 
        class="h_tab" v-show="isShow" :focusable="false" name="h_tab_name" 
        :width="pWidth"
    >
        <!-- :requestFocus="true" -->
        <qt-nav-bar 
            ref="contentNavBar" class="hc-navbar" :item-gap="10" :width="pWidth"
            @tab-select="onTabSelect" :requestFocus="true"
            :nextFocusName="{ down: 'content_grid_name' }"></qt-nav-bar>
    </div>
</template>
<script lang='ts' setup>
import { computed, nextTick, ref } from 'vue';
import {
    QTINavBar
} from '@quicktvui/quicktvui3';
// @ts-ignore
import { getFilterList } from '../index.ts'
import { useESToast } from '@extscreen/es3-core';
// @ts-ignore
import api from 'src/api/history/index.ts'
import { Native } from "@extscreen/es3-vue";

const props = defineProps<{
    pWidth:number
}>()
const toast = useESToast()
const contentNavBar = ref();

const emits = defineEmits(['emSelectTab'])

const isShow = ref(true)
let filterList:any[] = []
let tabPosition = -1
let timeoutId:any = null
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
        if (tabList && tabList.data?.length) {
            isShow.value = true
            contentNavBar.value?.init({
                data: getFilterList(tabList.data),
            });
            filterList = tabList.data
            if(isReset){
                nextTick(()=>{
                    contentNavBar.value.navList?.setItemFocused(0)
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
        return isShow.value
    },
    requestChildTabFocus(index) { // 针对上方tab的焦点重新获焦
        // Native.callUIFunction(contentNavBar.value, "requestFocus", [])
        // Native.callUIFunction(contentNavBar.value, "requestFocusDirectly", [])
        contentNavBar.value.navList?.setItemFocused(tabPosition)
    }
})
</script>
<style scoped>
.h_tab {
    /* width: 1570px; */
    height: 100px;
    background-color: transparent;
}

.hc-navbar {
    /* width: 1540px; */
    height: 100px;
    margin-left: 30px;
    background-color: transparent;
}
</style>