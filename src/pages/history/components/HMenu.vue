<template>
    <div class="h_menu" :focusable="false" :clipChildren="false" :nextFocusName="{
        right: 'h_tab_name'
    }" :blockFocusDirections="['left', 'down']">
        <qt-view class="h_menu_inner" :focusable="false" :clipChildren="false" :clipPadding="false" overflow="visible">
            <qt-text v-if="title" :text="title" class="menu-title" gravity="centerVertical"
                :focusable="false"></qt-text>
            <qt-image v-else-if="titleImg" :src="titleImg" class="menu-title-image" :focusable="false" />
            <qt-list-view 
                class="menu_list" ref="listRef" sid="h_menu_list_name" name='h_menu_list_name'
                :clipChildren="false" :clipPadding="false" @item-focused="onTabSelect"
                :requestFocus="true"
            >
                <!-- 纯文字标题-->
                <ListText type="1" :custemStyle="menuStyle" />
                <!-- 图片标题-->
                <ListStateImg type="2" />
                <!-- 带 Icon 文字标题-->
                <ListIconText type="3" :custemStyle="menuStyle" />
            </qt-list-view>
        </qt-view>
    </div>
</template>
<script lang='ts' setup>
import { ref } from 'vue';
import {
    QTIListView
} from '@quicktvui/quicktvui3';
import ListText from '../../../components/htListStateItem/Text.vue'
import ListIconText from '../../../components/htListStateItem/IconText.vue'
import ListStateImg from '../../../components/htListStateItem/StateImg.vue'
import { IHistoryMenuEntity } from 'src/api/history/modelEntity';
// @ts-ignore
import { getMenuList } from '../index.ts';
// @ts-ignore
import api from 'src/api/history/index.ts'

const props = defineProps<{
    menuStyle?: {
        normal: { color: string }
        focused: { color: string }
        selected: { color: string }
    }
    title?: string;
    titleImg?: string;
    menuList?: IHistoryMenuEntity[]
}>()

const listRef = ref<QTIListView>();

//导航切换时的回调，当前选中导航的info(e)
const emits = defineEmits(['emChangeMenu'])
let menuApiList: any[] = []
let mPosition = -1
const onTabSelect = (arg: any) => {
    if (mPosition !== arg.position) {
        emits('emChangeMenu', arg.position, menuApiList[arg.position])
    }
    mPosition = arg.position
};

defineExpose({
    async initData() {
        let list = await api.getMenuList()
        if (list.data?.length) {
            menuApiList = list.data
        } else if (props.menuList) {
            menuApiList = props.menuList
        }
        listRef.value?.init(getMenuList(menuApiList));
    }
})
// id:tag.id,
// typeName:tag.showType,
// isShowScreen:false,
// tagName:tag.tagName,
// showName:tag.showName,
// normalImg:tag.normalImage,
// selectedImg:tag.selectImage,
// focusedImg:tag.focusImage
</script>
<style scoped>
.h_menu {
    width: 350px;
    height: 1080;
    background-color: transparent;
}

.h_menu_inner {
    width: 340px;
    height: 1080;
    position: absolute;
    background-color: #434a50;
}

.menu-title {
    height: 100px;
    font-size: 50px;
    margin-left: 50px;
}

.menu-title-image {
    width: 320px;
    height: 60px;
    margin: 10px;
}

.menu_list {
    width: 340px;
    height: 900px;
}
</style>