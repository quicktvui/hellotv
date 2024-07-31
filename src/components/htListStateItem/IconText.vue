<template>
    <qt-view class="list_item" eventFocus :focusable="true"
        :clipChildren="false" :sateBackgroundPadding="[10, 10]" :focusScale="1.06" flexStyle="${iStyle}">
        <qt-view class="list_item_bg" :duplicateParentState="true" showOnState="focused" :focusable="false"
            :gradientBackground="focusedBg" flexStyle="${iStyle}"/>

        <qt-view class="list_item_icon_box" :duplicateParentState="true" showOnState="normal" flexStyle="${txtStyle}">
            <img src="../../assets/ic_screen_normal.png" :focusable="false"/>
            <qt-text 
                class="list_item_icon_txt" autoWidth :style="custemStyle.normal" gravity="center"
                :focusable="false" text="${showName}" :ellipsizeMode="3" :lines="1"
            />
        </qt-view>
        <qt-view class="list_item_icon_box" :duplicateParentState="true" showOnState="focused" flexStyle="${txtStyle}">
            <img src="../../assets/ic_screen_select.png" :focusable="false"/>
            <qt-text 
                class="list_item_icon_txt" autoWidth :style="custemStyle.focused" gravity="center"
                :focusable="false" text="${showName}" :ellipsizeMode="3" :lines="1"
            />
        </qt-view>
        <qt-view class="list_item_icon_box" :duplicateParentState="true" showOnState="selected" flexStyle="${txtStyle}">
            <img src="../../assets/ic_screen_select.png" :focusable="false"/>
            <qt-text 
                class="list_item_icon_txt" autoWidth :style="custemStyle.selected" gravity="center"
                :focusable="false" text="${showName}" :ellipsizeMode="3" :lines="1"
            />
        </qt-view>
    </qt-view>
</template>
<script lang='ts' setup>
const props = withDefaults(defineProps<{
    custemStyle?: {
        normal: { color:string }
        focused: { color:string }
        selected: { color:string }
    },
    focusedBg?:any
}>(),{
    custemStyle: ()=>{
        return {
            normal: { color: 'rgba(255, 255, 255, 0.5)' },
            focused: { color: '#000' },
            selected: { color: '#fff' },
        }
    },
    focusedBg: ()=>{
        return { colors: ['#F5F5F5', '#F5F5F5'], cornerRadii4: [0, 8, 8, 0], orientation: 6 }
    }
})
</script>
<style scoped>
.list_item{
    position: relative;
    background-color: transparent;
    /* justify-content: center; */
    align-items: center;
    flex-direction: row;
}
.list_item_bg{
    position: absolute;
    background-color: transparent;
}

.list_item_icon_box{
    position: absolute;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-direction: row;
    background-color: transparent;
}
.list_item_icon_box img{
    width: 34px;
    height: 34px;
    margin-right: 12px;
    background-color: transparent;
}
.list_item_icon_txt{
    width: auto;
    height: 106px;
    font-size: 36px;
    background-color: transparent;
}
</style>