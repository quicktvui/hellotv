<template>
    <qt-view class="tvbox-network-error-main">
        <img class="tvbox-network-error-bg" :src="bgError">
        <img class="tvbox-network-error-img" :src="icNetworkError">
        <p class="tvbox-network-error-text">网络断开了，请检查网络连接状态</p>
    </qt-view>
</template>

<script setup lang="ts">
import bgError from '../assets/live/bg-error.png'
import icNetworkError from '../assets/live/ic-network-error.png'
</script>

<style scoped>
.tvbox-network-error-main {
    width: 1920px;
    height: 1080px;
    background-color: transparent;
    align-items: center;
    justify-content: center;
}

.tvbox-network-error-bg {
    width: 1920px;
    height: 1080px;
    background-color: transparent;
    position: absolute;
}

.tvbox-network-error-img {
    width: 480px;
    height: 320px;
}

.tvbox-network-error-text {
    color: white;
    font-size: 32px;
}
</style>
