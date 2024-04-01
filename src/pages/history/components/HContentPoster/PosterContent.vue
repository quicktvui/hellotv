<template>
    <div :focusable="false" :duplicateParentState="true" class="content_box" flexStyle="${style}">
        <!--封面-->
        <img class="qt-ui-poster-img-css" :duplicateParentState="true" :postDelay="300" :focusable="false"
            enableFocusBorder="${focus.border}" flexStyle="${image.style}" src="${image.src}" />
        <!--  浮动标题 -->
        <div flexStyle="${image.style}" class="float_title_box" :focusable="false" :duplicateParentState="true">
            <div flexStyle="${floatTitle.style}" class="qt-ui-poster-float-title-css"
                gradientBackground="${floatTitle.background}"
                :duplicateParentState="true" :focusable="false" showIf="${floatTitle.enable}">
                <text-view :duplicateParentState="true" :focusable="false" textSize="${floatTitle.style.fontSize}" :ellipsizeMode="2"
                    enablePostTask :postDelay="200" :lines="1" gravity="centerVertical|left" style=""
                    flexStyle="${floatTitle.style}" text="${floatTitle.text}" />
            </div>
        </div>
        <!--  主标题-->
        <text-view 
            class="poster_title"
            :duplicateParentState="true" :focusable="false" textSize="${title.style.fontSize}" :ellipsizeMode="2" :lines="1"
            :postDelay="200" gravity="centerVertical|left"
            style="z-index: 999;" flexStyle="${title.style}" text="${title.text}"
            showIf="${title.enable}" paddingRect="${titleRect}"/>
        <!-- 副标题 -->
        <text-view class="poster_subtitle" :focusable="false" fontSize="${subTitle.style.fontSize}" :ellipsizeMode="2" :lines="1"
            autoHeight gravity="centerVertical|left" flexStyle="${subTitle.style}" :duplicateParentState="true"
            text="${subTitle.text}" visibility="${subTitle}" style="color: #666;" paddingRect="${subTitleRect}"
        />
    </div>
</template>
<script lang='ts' setup>
</script>
<style scoped>
.content_box{
    position: absolute;
    left: 0;
    top: 0;
    z-index: 10;
    border-radius: 8px;
}
.qt-ui-poster-img-css {
    background-color: rgba(255, 255, 255, 0.1);
    z-index: 1;
    border-radius: 8px;
}
.float_title_box{
    position: absolute;
    left: 0px;
    top: 0px;
    background-color: transparent;
    z-index: 999;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
}
.qt-ui-poster-float-title-css {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: transparent;
}
</style>