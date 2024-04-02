<template>
    <div class="history_empty" :clipChildren="false">
        <div class="history_empty_content">
            <img v-if="bigImg" :style="{ width: imageWidth, height: imageHeight }" :src="bigImg">
            <img v-else :style="{ width: imageWidth, height: imageHeight }" :src="defaultBgImg">
            <span class="history_empty_txt" :style="{ fontSize: msgTextSize }">{{ msg }}</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import defaultBgImg from "../../../assets/history_empty_bg.png"
withDefaults(defineProps<{
    bigImg?: string, msg?: string,
    imageWidth?: string, imageHeight?: string, msgTextSize?: string
}>(), {
    imageWidth: '560px',
    imageHeight: '350px',
    msgTextSize: '30px',
    msg: '暂无数据～'
})
</script>

<style scoped>
.history_empty {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: transparent;
}

.history_empty_content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: transparent;
}

.history_empty_txt {
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
    margin-top: 26px;
    background-color: transparent;
}
</style>