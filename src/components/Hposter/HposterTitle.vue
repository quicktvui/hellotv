<template>
  <div flexStyle="${titleInnerStyle}" :focusable="false">
    <text-view
      :focusable="false"
      fontSize="${title.style.fontSize}"
      ellipsizeMode="${title.ellipsizeMode}" lines="${title.lines}"
      gravity="top" paddingRect="${title.paddingRect}"
      flexStyle="${title.style}"
      text="${title.text}" :textColor="'${title.'+colorName+'}'"
      showIf="${title.enable}"/>
    <text-view
      :focusable="false"
      fontSize="${subTitle.style.fontSize}"
      :ellipsizeMode="2" :lines="1"
      gravity="centerVertical" paddingRect="${subTitle.paddingRect}"
      flexStyle="${subTitle.style}"
      text="${subTitle.text}" :textColor="'${subTitle.'+colorName+'}'"
      showIf="${subTitle.enable}"/>
  </div>
</template>
<script lang='ts' setup>
withDefaults(defineProps<{
  colorName?:string;
}>(),{
  colorName: 'color',
})
</script>
<style scoped>
/* #FF5E90 */
</style>