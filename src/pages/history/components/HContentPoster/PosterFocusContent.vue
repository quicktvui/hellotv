<template>
<div :focusable="false" :duplicateParentState="true" class="focus_content_box" flexStyle="${style}">
    <div class="focus_content_box_bg" showIf="${editMode==false}" flexStyle="${style}" :focusable="false"></div>
    <div class="focus_content_box_content" showIf="${editMode==false}" flexStyle="${style}" :focusable="false" :duplicateParentState="true">
        <!--封面-->
        <img class="qt-ui-poster-img-css" :duplicateParentState="true" :postDelay="300" :focusable="false" flexStyle="${image.style}" src="${image.src}" />
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
            :postDelay="200" gravity="centerVertical|left" flexStyle="${title.style}" text="${title.text}"
            showIf="${title.enable}" paddingRect="${titleRect}"/>
        <!-- 副标题 -->
        <text-view class="poster_subtitle" :focusable="false" fontSize="${subTitle.style.fontSize}" :ellipsizeMode="2" :lines="1"
            autoHeight gravity="centerVertical|left" flexStyle="${subTitle.style}" :duplicateParentState="true"
            text="${subTitle.text}" visibility="${subTitle}" style="color: #666;" paddingRect="${subTitleRect}"
        />
    </div>
    <div class="focus_content_box_content_edit" showIf="${editMode==true}" flexStyle="${style}" :focusable="false" :duplicateParentState="true">
        <!--封面-->
        <img class="qt-ui-poster-img-css_edit" :duplicateParentState="true" :postDelay="300" :focusable="false" flexStyle="${image.style}" src="${image.src}" />
        <!--  浮动标题 -->
        <div flexStyle="${image.style}" class="float_title_box_edit" :focusable="false" :duplicateParentState="true">
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
            :duplicateParentState="true" :focusable="false" textSize="${title.style.fontSize}" :ellipsizeMode="2" :lines="1"
            :postDelay="200" gravity="centerVertical|left" flexStyle="${title.style}" text="${title.text}"
            showIf="${title.enable}" paddingRect="${titleRect}"/>
        <!-- 副标题 -->
        <text-view class="poster_subtitle" :focusable="false" fontSize="${subTitle.style.fontSize}" :ellipsizeMode="2" :lines="1"
            autoHeight gravity="centerVertical|left" flexStyle="${subTitle.style}" :duplicateParentState="true"
            text="${subTitle.text}" visibility="${subTitle}" style="color: #666;" paddingRect="${subTitleRect}"
        />
    </div>
</div>
</template>
<script lang='ts' setup>
</script>
<style scoped lang="less">
.focus_content_box{
    position: absolute;
    left: 0;
    top: 0;
    background-color: transparent;
    z-index: 20;
}
.focus_content_box_bg {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    background-color: #fff;
    border-radius: 8px;
}
.focus_content_box_content{
    position: absolute;
    left: 0;
    top: 0;
    z-index: 2;
    background-color: transparent;
}
.focus_content_box_content_edit{
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
    background-color: transparent;
}
.qt-ui-poster-img-css {
    background-color: rgba(255, 255, 255, 0.1);
    z-index: 1;
    border-color: white;
    border-style: solid;
    border-width: 8px;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}
.qt-ui-poster-img-css_edit{
    border-radius: 8px;
}
.float_title_box{
    position: absolute;
    left: -4px;
    top: 4px;
    background-color: transparent;
    z-index: 10;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    border-width: 8px;
}
.float_title_box_edit{
    position: absolute;
    left: 0;
    top: 0;
    background-color: transparent;
    z-index: 10;
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
.poster_title{
    color: #000;
}
</style>