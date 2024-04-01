<template>
    <qt-view class="list_item" eventFocus :focusable="true" :clipChildren="false"
        :sateBackgroundPadding="[10, 10]" :focusScale="1.06">
        <div class="list_text_bg" :duplicateParentState="true" showOnState="focused" :focusable="false"
            :gradientBackground="focusedBg"></div>
        <qt-text 
            class="list_text" :style="custemStyle.normal" gravity="center"
            showOnState="normal" :focusable="false"
            :duplicateParentState="true" text="${showName}" />
        <qt-text
            class="list_text" :style="custemStyle.focused" gravity="center"
            showOnState="focused" :focusable="false"
            :duplicateParentState="true" text="${showName}" />
        <qt-text
            class="list_text" :style="custemStyle.selected" gravity="center"
            showOnState="selected" :focusable="false"
            :duplicateParentState="true" text="${showName}" />
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
    width: 340px;
    height: 106px;
    background-color: transparent;
    justify-content: center;
    align-items: center;
    flex-direction: row;
}
.list_text_bg{
    position: absolute;
    width: 340px;
    height: 106px;
    background-color: transparent;
}
.list_text_box{
    width: 340px;
    height: 106px;
    background-color: transparent;
}
.list_text{
    position: absolute;
    width: 340px;
    height: 106px;
    font-size: 36px;
    background-color: transparent;
}
</style>