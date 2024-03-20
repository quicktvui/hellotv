<template>
    <qt-view class="history-menu">
        <qt-button :text="title" ref="buttonRef"></qt-button>
        <qt-nav-bar ref="navBar" style="width: 280px;height: 1000px;" :item-gap="10" :horizontal="false"
            @tab-select="onTabSelect"></qt-nav-bar>
    </qt-view>
</template>
<script lang='ts' setup>
import { ref } from 'vue';
import {
    QTINavBar, QTNavBarItemType,
} from '@quicktvui/quicktvui3';

const menuTexts = ['观看历史', '我的收藏', '已购内容', '收藏专区']
const getMenuList = () => {
    return menuTexts.map(item => {
        return {
            type: QTNavBarItemType.QT_NAV_BAR_ITEM_TYPE_TEXT,
            text: item,
            titleSize: 20,
            decoration: {
                left: 40,
                right: 20,
            }
        }
    })
}

const title = ref('全部记录')
const buttonRef = ref()
const navBar = ref<QTINavBar>();

//导航切换时的回调，当前选中导航的info(e)
const onTabSelect = (arg: any) => {
    title.value = '全部记录' + arg.position
};

defineExpose({
    onTabSelect, navBar, buttonRef,
    initData() {
        navBar.value?.init({
            data: getMenuList(),
        });
    }
})
</script>
<style scoped>
.history-menu {
    width: 380px;
    padding: 50px 50px 50px 50px;
    /* background-color: #fff; */
    background-color: #353c47;
}
</style>