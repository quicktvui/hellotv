<template>
  <div class="poster_title_box" :flexStyle="'${'+flexName+'}'" :duplicateParentState="true" :focusable="false">
      <text-view 
          class="poster_title" duplicateParentState :focusable="false"
          textSize="${title.style.fontSize}" :ellipsizeMode="4" :lines="1"
          :postDelay="200" gravity="top|left" flexStyle="${title.style}" text="${title.text}"
          showIf="${title.enable}" paddingRect="${titleRect}" typeface="bold"
      />
      <text-view class="poster_subtitle" :focusable="false" fontSize="${subTitle.style.fontSize}" :ellipsizeMode="2" :lines="1"
          autoHeight gravity="centerVertical|left" flexStyle="${subTitle.style}" :duplicateParentState="true"
          text="${subTitle.text}" visibility="${subTitle}" paddingRect="${subTitleRect}"
      />
  </div>
</template>
<script lang='ts' setup>
interface Iprops {
  flexName?: string
}
const props = withDefaults(defineProps<Iprops>(),{
  flexName: 'titleStyle'
})
</script>
<style scoped>
.poster_title_box{
    position: absolute;
    left: 0.01px;
    top: 0.01px;
    z-index: 5;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    background-color: transparent;
    focus-background-color: #ffffff;
}
.poster_title{
    background-color: transparent;
    /* z-index: 1; */
    focus-color: #0186D0;
}
.poster_subtitle{
    background-color: transparent;
    color: #ffffff;
    focus-color: #0186D0;
}
</style>