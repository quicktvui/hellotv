<template>
  <qt-view class="bg-player-cell-list-item" flexStyle="${itemStyle}" name='${name}'
           :focusable="true" eventClick eventFocus>
    <qt-image class="bg-player-cell-list-item-img" flexStyle="${itemStyle}"
              :style="$props.imgStyle"
              src="${cover}" :focusable="false"></qt-image>
    <qt-view
      class="bg-player-cell-list-item-img-bg"
      flexStyle='${itemStyle}'
      gradientBackground="${gradientBackground}"
      :showOnState="['normal','selected']"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-view>

    <qt-view
      style="background-color: transparent; position: absolute; z-index: 1000"
      flexStyle='${markStyle}'
      :showOnState="['focused', 'selected']"
      :focusable="false"
      :duplicateParentState="true"
    >
      <play-mark style="width: 33px; height: 24px;" :markColor="'#FF0000'" :gap="3" :focusable="false" />
    </qt-view>
  </qt-view>
</template>

<script setup lang="ts">
import icPlay from '../../../../assets/home/ic_play.png'

defineProps({
  imgStyle: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style lang="scss" src='../../scss/bg-player-cell-list-item.scss'></style>
