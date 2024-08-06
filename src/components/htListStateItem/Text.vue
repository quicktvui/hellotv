<template>
    <qt-view class="list_item" eventFocus :focusable="true" :clipChildren="false"
        :sateBackgroundPadding="[10, 10]" :focusScale="1.06" flexStyle="${iStyle}">
        <div class="list_text_bg" :duplicateParentState="true" showOnState="focused" :focusable="false"
            :gradientBackground="focusedBg" flexStyle="${iStyle}"></div>
        <qt-text 
            class="list_text" :style="custemStyle.normal" gravity="centerVertical|end"
            showOnState="normal" :focusable="false"
            :duplicateParentState="true" text="${showName}" flexStyle="${txtStyle}"/>
        <qt-text
            class="list_text" :style="custemStyle.focused" gravity="centerVertical|end"
            showOnState="focused" :focusable="false"
            :duplicateParentState="true" text="${showName}" flexStyle="${txtStyle}"/>
        <qt-text
            class="list_text" :style="custemStyle.selected" gravity="centerVertical|end"
            showOnState="selected" :focusable="false"
            :duplicateParentState="true" text="${showName}" flexStyle="${txtStyle}"/>
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
.list_text_bg{
    position: absolute;
    background-color: transparent;
}
.list_text{
    position: absolute;
    font-size: 36px;
    background-color: transparent;
}
</style>