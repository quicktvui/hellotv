<template>
    <div class="h_tab" v-show="isShow" :focusable="false" name="h_tab_name"
        :nextFocusName="{ down: 'content_grid_name' }">
        <qt-nav-bar ref="contentNavBar" class="hc-navbar" :requestFocus="true" :item-gap="10"
            @tab-select="onTabSelect"></qt-nav-bar>
    </div>
</template>
<script lang='ts' setup>
import { computed, ref } from 'vue';
import {
    QTINavBar
} from '@quicktvui/quicktvui3';
// @ts-ignore
import { getFilterList } from '../index.ts'
import { useESToast } from '@extscreen/es3-core';
// @ts-ignore
import api from 'src/api/history/index.ts'
import { Native } from "@extscreen/es3-vue";

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
    async init(index:number = 0, category:any) {
        let tabList = await api.getFilterTabList(index, category)
        if (tabList.data?.length) {
            contentNavBar.value?.init({
                data: getFilterList(tabList.data),
            });
            isShow.value = true
            filterList = tabList.data
        } else {
            isShow.value = false
            filterList = []
            tabPosition = -1
            contentNavBar.value?.init({ data: [] });
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
    width: 1570px;
    height: 100px;
}

.hc-navbar {
    width: 1540px;
    height: 100px;
    margin-left: 30px;
}
</style>