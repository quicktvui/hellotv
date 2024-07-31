<template>
    <item-frame :type="type" layout="${layout}" flexStyle="${style}" focusScale="${focus.scale}" :focusable="true"
        eventClick eventFocus name="history_poster_name" class="qt-ui-poster-root-css" itemShowShimmer="${shimmer.enable}"
        hideShadow="${shadow.enable}" shimmerSize="${size}">
        
        <div :focusable="false" duplicateParentState class="content_box" flexStyle="${style}" :enableBlackBorder="false">
            <div :focusable="false" :duplicateParentState="true" class="content_box_bg" flexStyle="${focusStyleBg}" :enableBlackBorder="false"></div>
            <div :focusable="false" :duplicateParentState="true" class="content_box_info" flexStyle="${style}" :enableBlackBorder="false">
                <img 
                    class="qt-ui-poster-img-css" :postDelay="300" 
                    :focusable="false" :enableFocusBorder="false" 
                    flexStyle="${image.style}" src="${image.src}" 
                />
                <div showIf="${floatTitle.enable}" flexStyle="${image.style}" class="float_title_box" :focusable="false" :duplicateParentState="true">
                    <div flexStyle="${floatTitle.style}" class="qt-ui-poster-float-title-css" gradientBackground="${floatTitle.background}"
                        :duplicateParentState="true" :focusable="false">
                        <text-view :duplicateParentState="true" :focusable="false" textSize="${floatTitle.style.fontSize}" :ellipsizeMode="2"
                            enablePostTask :postDelay="200" :lines="1" gravity="centerVertical|left" style=""
                            flexStyle="${floatTitle.style}" text="${floatTitle.text}" />
                    </div>
                </div>
                <PosterTitle :showOnState="['focused','selected']" flexName="titleFocusStyle" />
                <PosterTitle showOnState="normal" />
            </div>
            <div :focusable="false" :duplicateParentState="true" class="content_box_cover" flexStyle="${focusStyleBgBorder}" enableBlackBorder></div>
        </div>
        
        <div
            flexStyle="${ripple.style}" class="qt-ui-poster-ripple-view-root-css" showOnState="focused&!selected"
            :focusable="false" :clipChildren="false" duplicateParentState>
            <ripple-view class="qt-ui-ripple-view-css" :delayLoad="800" :focusable="false" duplicateParentState
                :color="'#FF4E46'" :isShowRipple="true" rippleVisible="invisible" />
            <img 
                src="${ripple.src}" class="qt-ui-ripple-img-css" :focusable="false" :duplicateParentState="true"
                :delayLoad="800" showIf="${ripple.src}"
            />
        </div>
<!-- focused&selected -->
        <div showOnState="selected" class="history-item-cover" :focusable="false" :duplicateParentState="true" flexStyle="${focusStyleBgBorder}" :enableBlackBorder="false">
            <div class="history-delete-btn_box" flexStyle="${delete.style}" :duplicateParentState="true" :focusable="false">
                <qt-text 
                    class="history-delete-btn" gravity="center" fontSize="${delete.style.fontSize}"
                    flexStyle="${delete.style}" text="删除" :focusable="false" :duplicateParentState="true"
                    typeface="bold"
                />
            </div>
        </div>
    </item-frame>
</template>

<script lang="ts">
import PosterTitle from './PosterTitle.vue'
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
    name: "history-poster",
    components: {PosterTitle},
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
    border-radius: 16px;
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
    right: 0.01px;
    bottom: 0.01px;
    margin-right: -12px;
    z-index: 1000;
    background-color: transparent;
    position: absolute;
}
/* ------- */
.content_box{
    position: relative;
    border-radius: 16px;
    background-color: transparent;
}
.content_box_bg{
    border-radius: 16px;
    background-color: transparent;
    focus-background-color: #ffffff;
    select-border-color: transparent;
}
.content_box_info{
    position: absolute;
    left: 0.01px;
    top: 0.01px;
    z-index: 1;
    border-radius: 16px;
    background-color: transparent;
}
.qt-ui-poster-img-css {
    background-color: rgba(255, 255, 255, 0.1);
    z-index: 1;
    border-radius: 16px;
}
.float_title_box{
    position: absolute;
    left: 0.01px;
    top: 0.01px;
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
}

.history-item-cover {
  position: absolute;
  left: -1px;
  top: -1px;
  border-radius: 16px;
  display: flex;
  flex-direction: row;
  text-align: center;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  /* focus-border-style: solid;
  focus-border-color: rgba(0, 0, 0, 0.5); */
}
.history-delete-btn-focus {
  position: absolute;
  top: 0.01px;
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
.content_box_cover{
    position: absolute;
    left: -1px;
    top: -1px;
    z-index: 3;
    border-radius: 16px;
    background-color: transparent;
    focus-border-style: solid;
    focus-border-color: #ffffff;
    select-border-color: transparent;
}
</style>