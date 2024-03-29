<template>
    <div class="h_top" :focusable="false">
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
        return
    }
    router.back()
}
const onKeyDown = (keyEvent: ESKeyEvent) => {
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
    width: 1570px;
    /* background-color: pink; */
    height: 100px;
    display: flex;
    flex-direction: row;
    align-items: center;
}

.hc-top-txt {
    width: 1500px;
    height: 50px;
    color: #666;
}

.top_edit {
    width: 1500px;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
}

.hc-top-txt2 {
    width: 300px;
    height: 60px;
    color: #666;
}

.hc-top-clear-btn {
    margin-left: 34px;
}
</style>