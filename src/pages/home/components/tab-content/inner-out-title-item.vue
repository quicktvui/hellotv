<template>
  <item-frame class='inner-out-title-root-css'
              layout="${layout}"
              flexStyle="${style}"
              :focusable="true"
              :clipChildren="false"
              name="innerItem"
              itemShowShimmer='${shimmer.enable}'
              shimmerSize='${shimmer.size}'
              eventClick
              eventFocus>
    <img class="inner-out-title-img"
         :postDelay="100"
         :duplicateParentState="true"
         :focusable="false"
         :enableFocusBorder="true"
         flexStyle="${image.style}"
         src="${image.normal}"/>
    <qt-text class='inner-out-title-text'
             flexStyle="${title.style}"
             enablePostTask
             :postDelay="100"
             :duplicateParentState="true"
             :focusable="false"
             :textSize="28"
             :paddingRect="[12,16,0,0]"
             :ellipsizeMode="4"
             :lines="1"
             gravity="left"
             gradientBackground="${title.background}"
             text="${title.text}"
    />
    <qt-text showIf="${corner.enable==true}" class='item-corner'
             gradientBackground="${corner.background}"
             autoWidth
             typeface="bold"
             gravity="center"
             :focusable="false"
             :postDelay="100"
             :textSize="20"
             :ellipsizeMode="2"
             :lines="1"
             text="${corner.text}"
    />

  </item-frame>

</template>

<script lang='ts' setup name='inner-out-title-item'>

defineExpose({})


</script>

<style lang='scss' src='../../scss/inner-out-title-item.scss'>

</style>
