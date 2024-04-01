<template>
    <div 
        v-show="isShow" class="h_menu" :class="'h_menu_'+layout" :focusable="false" :clipChildren="false" 
        :nextFocusName="nextFocusName" :blockFocusDirections="blockFocusDirections"
    >
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
                <ListText type="1" :custemStyle="menuStyle" :focusedBg="menuItemFocusedBg" />
                <!-- 图片标题-->
                <ListStateImg type="2" />
                <!-- 带 Icon 文字标题-->
                <ListIconText type="3" :custemStyle="menuStyle" :focusedBg="menuItemFocusedBg" />
            </qt-list-view>
        </qt-view>
    </div>
</template>
<script lang='ts' setup>
import { computed, ref } from 'vue';
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
// @ts-ignore
import { layouts } from '../config.ts'

const props = defineProps<{
    menuStyle?: {
        normal: { color: string }
        focused: { color: string }
        selected: { color: string }
    }
    title?: string;
    titleImg?: string;
    menuList?: IHistoryMenuEntity[]
    layout:string
    isFilter:boolean
}>()

const listRef = ref<QTIListView>();
const isShow = ref(true)

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

const nextFocusName = computed(()=>{
    if(props.isFilter){
        return { right: 'h_tab_name' }
    }
    return { right: 'content_grid_name' }
})
const blockFocusDirections = computed(()=>{
    if(props.layout == layouts.rt || props.layout == layouts.rb){
        return ['left', 'down']
    }
    return ['right', 'down']
})
const menuItemFocusedBg = computed(()=>{
    if(props.layout == layouts.rt || props.layout == layouts.rb){
        return { colors: ['#F5F5F5', '#F5F5F5'], cornerRadii4: [8, 0, 0, 8], orientation: 6 }
    }
    return { colors: ['#F5F5F5', '#F5F5F5'], cornerRadii4: [0, 8, 8, 0], orientation: 6 }
})

defineExpose({
    async initData() {
        let list = await api.getMenuList()
        if (list.data?.length) {
            menuApiList = list.data
            isShow.value = list.data.length>1
        } else if (props.menuList) {
            menuApiList = props.menuList
            isShow.value = props.menuList.length>1
        }else{
            isShow.value = false
        }
        listRef.value?.init(getMenuList(menuApiList));
        return isShow.value
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
    display: flex;
    flex-direction: column;
    background-color: transparent;
}
.h_menu_rightTop,.h_menu_rightBootom{
    justify-content: flex-end;
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