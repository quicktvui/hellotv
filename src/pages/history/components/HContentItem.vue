<template>
<qt-view class="h_poster" autoWidth autoHeight>
    <qt-view class="poster_img_box" autoWidth autoHeight>
        <img class="poster_img" src="${image.src}"/>
        <text-view class="poster_float" text="${floatTitle.text}"></text-view>
    </qt-view>
    <text-view class="poster_title" text="${title.text}"></text-view>
    <text-view class="poster_sub" text="${subTitle.text}"></text-view>
</qt-view>
</template>
<script lang='ts' setup>
</script>
<style scoped>
.h_poster{
    display: flex;
    flex-direction: column;
}
.poster_img{
    width: 320px;
    height: 260px;
    position: relative;
}
.poster_float{
    position: absolute;
    left: 0;
    bottom: 0;
    width: 320px;
    height: 64px;
    font-size: 26px;
}
.poster_title{
    width: 320px;
    height: 60px;
    font-size: 30px;
}
.poster_sub{
    width: 320px;
    height: 60px;
    font-size: 30px;
}
</style>