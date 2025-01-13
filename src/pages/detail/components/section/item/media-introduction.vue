<template>
  <qt-column class="media-introduction-root">
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
      :enableFocusBorder="true"
      :clipChildren="false"
      :focusable="true"
      @click="onClick"
      @focus="onFocus"
      :style="{ 'focus-border-color': isFree ? '#FFFFFF' : '#FFD97C' }"
      :focusScale="ThemeConfig.placeHolderFocusScale">

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
        :lines='3'
        :lineHeight="42"
        gravity="left|center"
        :text="description"/>
    </qt-column>
  </qt-column>
</template>
  
<script setup lang='ts' name='media-introduction'>
import { ref } from 'vue'
import { useESRouter } from '@extscreen/es3-router'
import { IMedia } from '../../../adapter/interface'
import ThemeConfig from "../../../../../config/theme-config";
  const emits = defineEmits(['onIntroductionFocus'])
  const router = useESRouter()
  let title = ref<string>('')
  let score = ref<string>('')
  let tag = ref<string>('')
  let actors = ref<string>('')
  let description = ref<string>('')
  let isFree = ref<boolean>(true)
  let m: IMedia

  const init = (media: IMedia) => {
    m = media
    isFree.value = media.vipType == '0' ? true : false
    title.value = media.title
    score.value = media.score
    tag.value = media.tags
    actors.value = media.actors
    description.value = media.description
  }
  const onClick = () => {
    router.push({
      name: 'introduction',
      params: m
    })
  }
  const onFocus = (e) => emits('onIntroductionFocus', e.isFocused) 
  defineExpose({
    init
  })
</script>
  
<style lang='scss' scoped>
.media-introduction-root {
  width: 810px;
  height: 320px;
  background-color: transparent;
  margin-top: -15px;
  .title {
    width: 790px;
    height: 72px;
    margin-left: 20px;
    color: #FFFFFF;
  }
  .introduction-box {
    width: 810px;
    height: 250px;
    padding-left: 20px;
    padding-top: 15px;
    margin-top: 15px;
    padding-bottom: 10px;
    border-radius: 8px;
    focus-border-radius: 8px;
    background-color: transparent;
    focus-background-color: rgba(255, 255, 255, 0.1);
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
      focus-color: white;
      height: 34px;
      width: 668px;
      margin-top: 15px;
      margin-bottom: 8px;
    }
    .item-actors-text {
      height: 28px;
      width: 814px;
      color: rgba(255, 255, 255, 0.6);
      focus-color: white;
      margin-top: 5px;
    }
    .item-desc-text {
      color: rgba(255, 255, 255, 0.6);
      focus-color: white;
      width: 790px;
      height: 118px;
      margin-top: 5px;
    } 
  }
}




</style>
    