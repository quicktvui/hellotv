<template>
    <div class="history_page" :focusable="false">
        <div class="btn" :class="{'btn_ac': focusedNum===0}" :focusable="true" :requestFocus="true" @focus="focus1Fn">
            <div class="btn_txt btn_txt1" showOnState="normal" :focusable="false" :duplicateParentState="true"><span>normal</span></div>
            <div class="btn_txt btn_txt2" showOnState="focused" :focusable="false" :duplicateParentState="true"><span>focused</span></div>
            <div class="btn_txt btn_txt3" showOnState="selected" :focusable="false" :duplicateParentState="true"><span>selected</span></div>
        </div>
        <div class="btn" :class="{'btn_ac': focusedNum===1}" :focusable="true" @focus="focus2Fn" :selected="true">
            <div class="btn_txt btn_txt1" showOnState="normal" :focusable="false" :duplicateParentState="true"><span>normal</span></div>
            <div class="btn_txt btn_txt2" showOnState="focused" :focusable="false" :duplicateParentState="true"><span>focused</span></div>
            <div class="btn_txt btn_txt3" showOnState="selected" :focusable="false" :duplicateParentState="true"><span>selected</span></div>
        </div>
    </div>
</template>
<script lang='ts' setup>
import { ref } from 'vue';
const txt = ref('----子元素文本------')

const focusedNum = ref(-1)
const focus1Fn = (ev)=>{
    if(ev.isFocused){
        focusedNum.value = 0
    }
}
const focus2Fn = (ev)=>{
    if(ev.isFocused){
        focusedNum.value = 1
    }
}
</script>
<style scoped>
.history_page {
    width: 1920px;
    height: 1080px;
    background-color: #252930;
}

.btn{
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 20px 20px;
    margin-bottom: 10px;
    background-color: orange;
}
.btn_ac{
    background-color: #fff;
}
.btn_txt {
    width: 200px;
    height: 100px;
    font-size: 50px;
}
.btn_txt1{
    background-color: #fff;
}
.btn_txt2{
    background-color: pink;
}
.btn_txt3{
    background-color: black;
}
.history_page span{
    font-size: 50px;
    color: red;
}
</style>