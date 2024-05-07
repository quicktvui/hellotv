<template>
    <item-frame :type="type" layout="${layout}" flexStyle="${style}" focusScale="${focus.scale}" :focusable="true"
        eventClick eventFocus name="history_poster_name" class="qt-ui-poster-root-css" itemShowShimmer="${shimmer.enable}"
        hideShadow="${shadow.enable}" shimmerSize="${size}">
        
        <!-- <PosterContent :focusable="false" :duplicateParentState="true" :showOnState="['normal', 'selected']"/>
        <PosterFocusContent showOnState="focused" :focusable="false" :duplicateParentState="true"/> -->
        
        <div :focusable="false" duplicateParentState="${editMode==false}" class="content_box" flexStyle="${style}" :enableBlackBorder="false">
            <img class="qt-ui-poster-img-css" :duplicateParentState="true" :postDelay="300" :focusable="false"
                enableFocusBorder="${focus.border}" flexStyle="${image.style}" src="${image.src}" />
            <div showIf="${floatTitle.enable}" flexStyle="${image.style}" class="float_title_box" :focusable="false" :duplicateParentState="true">
                <div flexStyle="${floatTitle.style}" class="qt-ui-poster-float-title-css" gradientBackground="${floatTitle.background}"
                    :duplicateParentState="true" :focusable="false">
                    <text-view :duplicateParentState="true" :focusable="false" textSize="${floatTitle.style.fontSize}" :ellipsizeMode="2"
                        enablePostTask :postDelay="200" :lines="1" gravity="centerVertical|left" style=""
                        flexStyle="${floatTitle.style}" text="${floatTitle.text}" />
                </div>
            </div>
            <div class="poster_title_box" flexStyle="${style}" :duplicateParentState="true" :focusable="false">
                <div class="poster_title_box_img_cover" flexStyle="${imgCover.style}" :duplicateParentState="true" :focusable="false"></div>
                <text-view 
                    class="poster_title"
                    :duplicateParentState="true" :focusable="false" textSize="${title.style.fontSize}" :ellipsizeMode="2" :lines="1"
                    :postDelay="200" gravity="centerVertical|left" flexStyle="${title.style}" text="${title.text}"
                    showIf="${title.enable}" paddingRect="${titleRect}"/>
                <text-view class="poster_subtitle" :focusable="false" fontSize="${subTitle.style.fontSize}" :ellipsizeMode="2" :lines="1"
                    autoHeight gravity="centerVertical|left" flexStyle="${subTitle.style}" :duplicateParentState="true"
                    text="${subTitle.text}" visibility="${subTitle}" style="color: #666;" paddingRect="${subTitleRect}"
                />
            </div>
        </div>
        
        
        <div
            flexStyle="${ripple.style}" class="qt-ui-poster-ripple-view-root-css" showOnState="focused"
            :focusable="false" :clipChildren="false">
            <ripple-view class="qt-ui-ripple-view-css" :delayLoad="800" :focusable="false" :duplicateParentState="true"
                :color="'#FF4E46'" showIf="${editMode==false}" isShowRipple="${editMode==false}" rippleVisible="invisible" />
            <img 
                src="${ripple.src}" class="qt-ui-ripple-img-css" :focusable="false" :duplicateParentState="true"
                :delayLoad="800" showIf="${ripple.src}"
            />
        </div>

        <div showIf="${editMode==true}" class="history-item-cover" :focusable="false" :duplicateParentState="true" flexStyle="${image.style}">
            <div class="history-delete-btn_box" flexStyle="${delete.style}" :duplicateParentState="true" :focusable="false">
                <qt-text class="history-delete-btn" gravity="center" fontSize="${delete.style.fontSize}" flexStyle="${delete.style}"
                :ellipsizeMode="2" text="删除" :focusable="false" :duplicateParentState="true"/>
            </div>
        </div>
        <!-- :gradientBackground="{ colors: ['#F5F5F5', '#F5F5F5'], cornerRadius: 99, orientation: 6 }" -->
        <!-- :gradientBackground="{ colors: ['#1AFFFFFF', '#1AFFFFFF'], orientation: 6, cornerRadius: 100 }" -->
        <slot />
    </item-frame>
</template>

<script lang="ts">
import PosterContent from './PosterContent.vue'
import PosterFocusContent from './PosterFocusContent.vue'
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
    name: "history-poster",
    components: { PosterContent,PosterFocusContent },
    props: {
        requestFirstFocus: {
            type: Boolean,
            default: false
        },
        loadDelay: {
            type: Number,
            default: 500
        },
        type: {
            type: Number,
            default: 10001
        },
        templateKeyMap: {
            type: Object,
            default: () => null
        },
    },
    setup(props, context) {
        return { }
    },
});

</script>

<style scoped>
.qt-ui-poster-root-css {
    position: relative;
    background-color: transparent;
    overflow: hidden;
}

.qt-ui-ripple-img-css {
    width: 60px;
    height: 60px;
    background-color: transparent;
    position: absolute;
    z-index: 1001;
    right: 20px;
    bottom: 20px;
}

.qt-ui-ripple-view-css {
    width: 100px;
    height: 100px;
    z-index: 1000;
    background-color: transparent;
    position: absolute;
}

.qt-ui-poster-ripple-view-root-css {
    width: 100px;
    height: 100px;
    right: 0;
    bottom: 0;
    margin-right: -12px;
    z-index: 1000;
    background-color: transparent;
    position: absolute;
}
/* ------- */
.content_box{
    position: relative;
    border-radius: 8px;
    background-color: transparent;
    padding-left: 5px;
    padding-top: 5px;
    padding-right: 5px;
    padding-bottom: 0px;
    focus-background-color: #ffffff;
    /* focus-border-style: solid;
    focus-border-color: #ffffff;
    focus-border-width: 8px;
    focus-border-radius: 8px; */
}
.qt-ui-poster-img-css {
    background-color: rgba(255, 255, 255, 0.1);
    z-index: 1;
    border-radius: 8px;
}
.float_title_box{
    position: absolute;
    left: 5px;
    top: 5px;
    background-color: transparent;
    z-index: 2;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
}
.qt-ui-poster-float-title-css {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: transparent;
    /* focus-border-style: solid;
    focus-border-color: transparent;
    focus-border-width: 10px;
    focus-border-radius: 8px; */
}
.poster_title{
    focus-color: #000000;
    background-color: transparent;
}
.poster_title_box_img_cover{
    focus-background-color: #ffffff;
}
.poster_title_box{
    position: absolute;
    left: 0.1px;
    top: 0.1px;
    z-index: 5;
    border-radius: 8px;
    background-color: transparent;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding-left: 5px;
    padding-top: 5px;
    padding-right: 5px;
    padding-bottom: 15px;
}

.history-item-cover {
  position: absolute;
  left: 5px;
  top: 5px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  text-align: center;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
}
.history-delete-btn-focus {
  position: absolute;
  top: 0;
  background-color: transparent;
}
.history-delete-btn_box{
    border-radius: 100px;
    background-color: rgba(255,255,255,0.1);
    focus-background-color: #ffffff;
}
.history-delete-btn {
  color: red;
  /* width: 100px;
    height: 50px; */
  background-color: transparent;
}
</style>