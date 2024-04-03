<template>
    <item-frame :type="type" layout="${layout}" flexStyle="${style}" focusScale="${focus.scale}" :focusable="true"
        eventClick eventFocus name="history_poster_name" class="qt-ui-poster-root-css" itemShowShimmer="${shimmer.enable}"
        hideShadow="${shadow.enable}" shimmerSize="${size}">
        
        <PosterContent :focusable="false" :duplicateParentState="true" :showOnState="['normal', 'selected']"/>
        <PosterFocusContent showOnState="focused" :focusable="false" :duplicateParentState="true"/>
            
        <div
            flexStyle="${ripple.style}" class="qt-ui-poster-ripple-view-root-css" showOnState="focused"
            :focusable="false" :clipChildren="false">
            <ripple-view class="qt-ui-ripple-view-css" :delayLoad="800" :focusable="false" :duplicateParentState="true"
                :color="'#FF4E46'" isShowRipple="${editMode==false}" rippleVisible="invisible" />
            <img 
                src="${ripple.src}" class="qt-ui-ripple-img-css" :focusable="false" :duplicateParentState="true"
                showIf="${editMode==false}" :delayLoad="800" 
            />
        </div>
        <slot />
    </item-frame>
</template>

<script lang="ts">
import PosterContent from './PosterContent.vue'
import PosterFocusContent from './PosterFocusContent.vue'
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
    name: "history-poster",
    components: {
        PosterContent,
        PosterFocusContent,
    },
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
</style>