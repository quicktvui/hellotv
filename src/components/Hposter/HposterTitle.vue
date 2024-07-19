<template>
  <div :flexStyle="'${'+styleName+'}'" class="hc_title_box" :focusable="false" duplicateParentState>
    <text-view
      :focusable="false" duplicateParentState
      fontSize="${title.style.fontSize}"
      ellipsizeMode="${title.ellipsizeMode}" lines="${title.lines}"
      gravity="top" paddingRect="${title.paddingRect}"
      flexStyle="${title.style}"
      text="${title.text}" :color="'${title.'+titleColorName+'}'"
      showIf="${title.enable}"/>
    <text-view
      :focusable="false"
      fontSize="${subTitle.style.fontSize}"
      :ellipsizeMode="2" :lines="1"
      gravity="centerVertical" paddingRect="${subTitle.paddingRect}"
      flexStyle="${subTitle.style}"
      text="${subTitle.text}" :color="'${title.'+subTitleColorName+'}'"
      showIf="${subTitle.enable}"/>
  </div>
</template>
<script lang='ts' setup>
withDefaults(defineProps<{
  styleName?:string;
  titleColorName?:string;
  subTitleColorName?:string;
}>(),{
  styleName: 'titleStyle',//titleFocusStyle
  titleColorName: 'color',
  subTitleColorName: 'color',
})
</script>
<style scoped>
.hc_title_box {
  position: absolute;
}
</style>