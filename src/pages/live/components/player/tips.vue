<template>
  <qt-view class="player-tips" :gradientBackground="{ colors: ['#FF2C2C2C', '#FF0F1518'], orientation: 0, cornerRadius: 30 }">
    <!-- 角标 -->
    <qt-image v-show="playInfo.isVip" class="player-tips-corner" :src="icCornerVipTips"></qt-image>
    <qt-view class="player-tips-left">
      <qt-text
        class="player-tips-text"
        style="width: 270px; height: 120px; color: #ffffff; font-size: 100px"
        :text="playInfo.channelId"
        typeface="bold"
        gravity="center"
      ></qt-text>
      <qt-text class="player-tips-text" style="width: 270px; font-size: 26px" :text="playInfo.channelName" gravity="center"></qt-text>
    </qt-view>
    <qt-view class="player-tips-right">
      <qt-view class="player-tips-right-box" style="margin-bottom: 8px">
        <qt-text
          class="player-tips-text"
          style="height: 48px; color: #ffffff; font-size: 38px"
          :text="playInfo.program"
          gravity="center|start"
        ></qt-text>
        <qt-text class="player-tips-text" style="font-size: 28px" text="14:13" gravity="center|end"></qt-text>
      </qt-view>
      <qt-view class="player-tips-right-box">
        <qt-text class="player-tips-text" :text="playInfo.nextProgram" gravity="center|start"></qt-text>
        <qt-text class="player-tips-text" text="16:30" gravity="center|end"></qt-text>
      </qt-view>
      <qt-view class="player-tips-line"></qt-view>
      <qt-view style="flex-direction: row; justify-content: space-between">
        <tipsIconText :icon="icOk" :text="'正在播放的节目'" :textStyle="{ width: '154px' }" />
        <tipsIconText :icon="icChange" :text="'上下换台'" :textStyle="{ width: '88px' }" />
        <tipsIconText :icon="icArrowLeft" :text="'频道导航'" :textStyle="{ width: '88px' }" />
      </qt-view>
    </qt-view>
  </qt-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import tipsIconText from './tips-icon-text.vue'
import icCornerVipTips from '../../../../assets/live/ic-corner-vip-tips.png'
import icOk from '../../../../assets/live/ic-ok.png'
import icChange from '../../../../assets/live/ic-change.png'
import icArrowLeft from '../../../../assets/live/ic-arrow-left.png'

type PlayInfo = {
  channelId: string
  channelName: string
  isVip: boolean
  program: string
  nextProgram: string
}

const playInfo = ref<PlayInfo>({
  channelId: '',
  channelName: '',
  isVip: false,
  program: '',
  nextProgram: ''
})

function setPlayInfo(obj: PlayInfo) {
  playInfo.value = obj
}

defineExpose({ setPlayInfo })
</script>

<style scoped src="../../css/player.css"></style>
