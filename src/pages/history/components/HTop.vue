<template>
    <div class="h_top" :focusable="false" :width="pWidth">
        <div v-if="isEdit" class="top_edit" :focusable="false">
            <qt-text class="hc-top-txt2" text="按【返回键】退出" gravity="center" :focusable="false"></qt-text>
            <qt-button text="清空" size="mini" @click="clearContentFn" round class="hc-top-clear-btn" :focusScale="1"
                :focusable="true">
            </qt-button>
        </div>
        <qt-text v-else class="hc-top-txt" :focusable="false" gravity="centerVertical|end"
            text="按【菜单键】或者长按【ok键】管理记录"></qt-text>
    </div>
</template>
<script lang='ts' setup>
import { useESToast, ESKeyEvent } from '@extscreen/es3-core';
import { nextTick, ref } from 'vue';
import { useESRouter } from '@extscreen/es3-router';

const props = defineProps<{
    pWidth:number, isLoaded:boolean
}>()
const toast = useESToast()
const emits = defineEmits(['emClear', 'emEditStateChange'])
const isEdit = ref(false)
const clearContentFn = () => {
    emits('emClear')
}

let centerKeyDown = 0
const router = useESRouter()
const onBackPressed = () => {
    if (isEdit.value) {
        isEdit.value = false;
        centerKeyDown = 0
        emits('emEditStateChange', isEdit.value)
        return false
    }
    router.back()
    return true
}
const onKeyDown = (keyEvent: ESKeyEvent) => {
    if(!props.isLoaded){
        return//数据还没初始化
    }
    switch (keyEvent.keyCode) {
        case 82: //菜单键按下
            isEdit.value = true
            break
        case 23: //长按确认键
            centerKeyDown++
            if (centerKeyDown > 10) {
                isEdit.value = true
            }
            break;
    }
    if(isEdit.value){
        emits('emEditStateChange', isEdit.value)
    }
    return false
}

defineExpose({
    onKeyDown,
    onBackPressed,
    //抬起
    onKeyUp(keyEvent) {
        centerKeyDown = 0
    },
    setEdit(boo:boolean){
        isEdit.value = boo
    }
})
</script>
<style scoped>
.h_top {
    /* width: 1570px; */
    position: relative;
    background-color: transparent;
    height: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.hc-top-txt {
    position: absolute;
    right: 20px;
    top: 0;
    width: 1500px;
    height: 100px;
    color: #666;
    background-color: transparent;
}

.top_edit {
    position: absolute;
    right: 20px;
    top: 0;
    width: 1500px;
    height: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    background-color: transparent;
}

.hc-top-txt2 {
    width: 300px;
    height: 60px;
    color: #666;
    background-color: transparent;
}

.hc-top-clear-btn {
    margin-left: 34px;
    background-color: transparent;
}
</style>