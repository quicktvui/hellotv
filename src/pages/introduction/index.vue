<template>
  <qt-view class="introduction-root">
    <qt-column class="introduction">
      <img class="introduction-bg" :src="introductionBg" :focusable="false"/>
      <!-- 标题 -->
      <qt-text
        class="title"
        :duplicateParentState="true"
        :focusable="false"
        :fontSize="60"
        :ellipsizeMode="2"
        enablePostTask
        postDelay="200"
        :lines="1"
        typeFace="bold"
        gravity="left|top"
        :text="title"/>
      <!-- 底部介绍 -->
      <qt-column
        class="introduction-box"
        :clipChildren="false"
        :focusScale="1.03">
        <!-- 第一行 -->
        <qt-row :duplicateParentState="true">
          <div class="item-vip"
            v-if="!isFree"
            :gradientBackground="{ colors: ['#A06419', '#CDA048'], orientation: 6, cornerRadii4: [4, 4, 4, 4] }">
            <qt-text
              class="item-vip-text"
              :duplicateParentState="true"
              :focusable="false"
              :textSize="24"
              :ellipsizeMode="2"
              enablePostTask
              postDelay="200"
              :lines="1"
              gravity="center"
              text="影视VIP"/>
          </div>
          <div class="item-score" v-if="score">
            <text-view
              class="item-score-text"
              :duplicateParentState="true"
              :focusable="false"
              :textSize="24"
              :ellipsizeMode="2"
              enablePostTask
              postDelay="200"
              :lines="1"
              gravity="center"
              :text="score"/>
          </div>
        </qt-row>
        <!-- 第二行 -->
        <qt-text
          class="item-tag-text"
          :duplicateParentState="true"
          :focusable="false"
          :fontSize="24"
          :ellipsizeMode="2"
          enablePostTask
          postDelay="200"
          :lines="1"
          gravity="left|center"
          :text="tag"/>
        <!-- 第三行 -->
        <qt-text v-if="actors"
          class="item-actors-text"
          :duplicateParentState="true"
          :focusable="false"
          :textSize="24"
          :ellipsizeMode="2"
          enablePostTask
          postDelay="200"
          :lines="1"
          gravity="left|center"
          :text="actors"/>
        <!-- 第四行 -->
        <qt-text
          class="item-desc-text"
          :duplicateParentState="true"
          :focusable="false"
          :fontSize="24"
          :ellipsizeMode="2"
          enablePostTask
          postDelay="200"
          :lines='10'
          :lineHeight="42"
          gravity="left"
          :text="description"/>
      </qt-column>
    </qt-column>
  </qt-view>
</template>
    
<script setup lang='ts' name='introduction'>
import { ref } from 'vue'
import { IMedia } from '../detail/adapter/interface'
import introductionBg from "../../assets/detail/ic_introduction_bg.png"
  let title = ref<string>('')
  let score = ref<string>('')
  let tag = ref<string>('')
  let actors = ref<string>('')
  let description = ref<string>('')
  let isFree = ref<boolean>(true)
  let media: IMedia
  
  const onESCreate = (params: IMedia) => {
    if (!params) return
    media = params
    isFree.value = media.vipType == '0' ? true : false
    title.value = media.title
    score.value = media.score
    tag.value = media.tags
    actors.value = media.actors
    description.value = media.description
  }
  defineExpose({
    onESCreate
  })
</script>
<style lang='scss' scoped>
.introduction-root {
  width: 1920px;
  height: 1080px;
  background-color: transparent;
  .introduction{
    width: 935px;
    height: 1080px;
    background-color: #0E0E0E;
    position: absolute;
    right: 0px;
    .introduction-bg{
      width: 1012px;
      height: 1080px;
      background-color: transparent;
      position: absolute;
      right: 20px;
    }
    .title {
      width: 768px;
      height: 90px;
      background-color: transparent;
      margin-top: 112px;
      margin-left: 100px;
      color: white;
    }
    .introduction-box {
      width: 768px;
      height: 800px;
      margin-left: 100px;
      margin-top: 10px;
      padding-bottom: 10px;
      background-color: transparent;
      .item-vip {
        margin-right: 20px;
        border-color: #F7B500;
        align-items: center;
        display: flex;
        height: 36px;
        width: 100px;
        flex-direction: row;
        justify-content: center
      }
      .item-vip-text {
        font-size: 24px;
        color: #FFFFFF;
        margin-left: 12px;
        margin-right: 12px;
        height: 36px;
        width: 100px;
      }
      .item-score {
        border-radius: 4px;
        margin-right: 20px;
        border-color: #ffffff;
        border-width: 1px;
        align-items: center;
        display: flex;
        width: 60px;
        height: 32px;
        flex-direction: row;
        justify-content: center;
        background-color: rgba(255,255,255,0.06);
      }
      .item-score-text {
        top: -1px;
        font-size: 24px;
        color: #ffffff;
        width: 60px;
        height: 32px;
      }
      .item-tag-text {
        color: rgba(255, 255, 255, 0.6);
        height: 34px;
        width: 668px;
        margin-top: 15px;
        margin-bottom: 8px;
      }
      .item-actors-text {
        height: 28px;
        width: 814px;
        color: rgba(255, 255, 255, 0.6);
      }
      .item-desc-text {
        color: rgba(255, 255, 255, 0.6);
        width: 768px;
        height: 700px;
      } 
    }
  }
} 
</style>
      