<template>
  <qt-view class="bg-player-list-item" :style="$props.style" :type="2" :focusable="true" eventClick eventFocus>
    <qt-view
      class="bg-player-list-item-img-bg"
      gradientBackground="${gradientBackground}"
      :showOnState="'normal'"
      :focusable="false"
      :duplicateParentState="true"
    ></qt-view>
    <qt-image class="bg-player-list-item-img" :style="$props.imgStyle" src="${cover}" :focusable="false"></qt-image>
    <qt-image
      style="width: 50px; height: 50px; background-color: transparent; position: absolute; top: 100px; right: 10px"
      :src="icPlay"
      :showOnState="['selected', 'focused']"
      :focusable="false"
    ></qt-image>
  </qt-view>
</template>

<script setup lang="ts">
import icPlay from '../../../../assets/home/ic_play.png'

defineProps({
  style: {
    type: Object,
    default: () => ({})
  },
  imgStyle: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style lang="scss" src='../../scss/bg-player.scss'></style>
