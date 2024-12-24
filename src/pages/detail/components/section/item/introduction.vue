<template>
  <qt-column class="media-introduction-root-css">
    <qt-column class="media-introduction-css">
      <!-- 标题 -->
      <qt-text
        class="media-introduction-title-text-css"
        :duplicateParentState="true"
        :focusable="false"
        :textSize="60"
        :ellipsizeMode="2"
        enablePostTask
        postDelay="200"
        :lines="1"
        gravity="left"
        :text="title"/>

      <!-- 底部介绍 -->
      <qt-column
        class="media-introduction-detail-root-css"
        :enableFocusBorder="true"
        :clipChildren="false"
        :focusable="true"
        @click="onClick"
        @focus="onFocus"
        :style="{ 'focus-border-color': isMediaTypeFree ? '#FFFFFF' : '#FFD97C' }"
        :focusScale="1.05">

        <!-- 第一行 -->
        <qt-row :duplicateParentState="true">
          <div class="media-introduction-detail-vip-css"
            v-if="!isMediaTypeFree"
            :gradientBackground="{ colors: ['#A06419', '#CDA048'], orientation: 6, cornerRadii4: [4, 4, 4, 4] }">
            <qt-text
              class="media-introduction-detail-vip-text-css"
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

          <div class="media-introduction-detail-score-css" v-if="score">
            <text-view
              class="media-introduction-detail-score-text-css"
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

          <qt-text
            class="media-introduction-detail-brief-text-css"
            :duplicateParentState="true"
            :focusable="false"
            :textSize="24"
            :ellipsizeMode="2"
            enablePostTask
            postDelay="200"
            :lines="1"
            gravity="left|center"
            :text="tag"/>
        </qt-row>

        <!-- 第二行 -->
        <qt-text v-if="actors"
          class="media-introduction-detail-actor-text-css"
          :duplicateParentState="true"
          :focusable="false"
          :textSize="24"
          :ellipsizeMode="2"
          enablePostTask
          postDelay="200"
          :lines="1"
          gravity="left|center"
          :text="actors"/>

        <!-- 第三行 -->
        <qt-text
          :style="{ height: introductionHeight }"
          class="media-introduction-detail-text-css"
          :duplicateParentState="true"
          :focusable="false"
          :textSize="24"
          :ellipsizeMode="2"
          enablePostTask
          postDelay="200"
          :lines='introductionLine'
          gravity="left|center"
          :text="introduction"/>
      </qt-column>
    </qt-column>
  </qt-column>
</template>
  
<script setup lang='ts' name='Introduction'>
import { ref, watch } from 'vue'
import { ESKeyEvent } from '@extscreen/es3-core'
import { useESRouter } from '@extscreen/es3-router'
import { QTIViewVisibility, QTIWaterfall, QTWaterfallItem } from '@quicktvui/quicktvui3'
import { IDetailInfo, IEpisodeAuthType } from '../../../build-data/interface/index'
  const emits = defineEmits(['onIntroductionFocus'])
  const router = useESRouter()
  const title = ref<string>('')
  const score = ref<string>('')
  const tag = ref<string>('')
  const actors = ref<string>('')
  const showActors = ref<boolean>(false)
  const introduction = ref<string>('')
  const isMediaTypeFree = ref<boolean>(true)
  const introductionHeight = ref<number>(28)
  const introductionLine = ref<number>(2)

  const mediaAuthorization: Ref<IMediaAuthorization> =
    inject(mediaAuthorizationKey, {} as any)

  watch(
    () => [mediaAuthorization?.value] as const,
    ([auth], [oldAuth]) => {
      if (mediaAuthorization?.value.type == IEpisodeAuthType.MEDIA_AUTH_TYPE_FREE) {
        isMediaTypeFree.value = true
      } else {
        isMediaTypeFree.value = false
      }
    },
    { flush: 'post' }
  )

  let dInfo: IDetailInfo

  const initMedia = (detailInfo: IDetailInfo) => {
    dInfo = detailInfo
    if (detailInfo.title != null) {
      title.value = detailInfo.title
    }
    score.value = detailInfo.score
    if (detailInfo.tag != null) {
        tag.value = detailInfo.tag
    }
    actors.value = detailInfo.actors
    introduction.value = detailInfo.introduction
    if (actors.value != '') {
      showActors.value = true
      introductionHeight.value = 65
      introductionLine.value = 2
    } else {
      showActors.value = false
      introductionHeight.value = 95
      introductionLine.value = 3
    }
  }

  const onClick = () => {
    router.push({
      name: 'introduction',
      params: dInfo
    })
  }

  const onFocus = (e) => emits('onIntroductionFocus', e.isFocused) 

</script>
  
<style lang='scss' scoped>
  
</style>
    