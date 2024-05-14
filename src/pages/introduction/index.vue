<template>
  <qt-view class="introduction-detail-root-css">
    <qt-column class="introduction-detail-css">
      <img class="introduction-detail-bg-css"
           :focusable="false"
           :enableFocusBorder="false"
           :src="introductionBg" />
      <text-view
        class="introduction-detail-title-css"
        :duplicateParentState="true"
        :focusable="false"
        :textSize="60"
        :ellipsizeMode="2"
        enablePostTask
        postDelay="200"
        typeface="bold"
        :lines="2"
        :text="title" />

      <!-- 第一行 -->
      <qt-row :duplicateParentState="true" class="introduction-detail-subtitle-root-css">
        <div class="introduction-detail-vip-css"
             v-if="!isMediaTypeFree"
             :gradientBackground="{ colors: ['#A06419', '#CDA048'], orientation: 6, cornerRadii4: [4, 4, 4, 4] }">
          <text-view
            class="introduction-detail-vip-text-css"
            :duplicateParentState="true"
            :focusable="false"
            :textSize="24"
            :ellipsizeMode="2"
            enablePostTask
            postDelay="200"
            :lines="1"
            gravity="center"
            text="影视VIP" />
        </div>

        <div class="introduction-detail-score-css" v-if="score">
          <text-view
            class="introduction-detail-score-text-css"
            :duplicateParentState="true"
            :focusable="false"
            :textSize="24"
            :ellipsizeMode="2"
            enablePostTask
            postDelay="200"
            :lines="1"
            gravity="center"
            :text="score" />
        </div>

        <text-view
          class="introduction-detail-brief-text-css"
          :duplicateParentState="true"
          :focusable="false"
          :textSize="24"
          :ellipsizeMode="2"
          enablePostTask
          postDelay="200"
          :lines="1"
          gravity="left|center"
          :text="subtitle" />
      </qt-row>

      <!-- 第二行 -->
      <text-view v-if="actors"
                 class="introduction-detail-actor-text-css"
                 :duplicateParentState="true"
                 :focusable="false"
                 :textSize="24"
                 :ellipsizeMode="2"
                 enablePostTask
                 postDelay="200"
                 :lines="2"
                 gravity="left|center"
                 :text="actors" />

      <span class="introduction-detail-intro-css">{{ introduction }}</span>
    </qt-column>
  </qt-view>
</template>

<script lang="ts">

import { defineComponent } from "@vue/runtime-core"
import { IMedia } from "../../api/media/IMedia"
import { ref } from "vue"
import introductionBg from "../../assets/ic_introduction_bg.png"
import { ESLogLevel, useESLog } from "@extscreen/es3-core"
import { IMediaAuthType } from "../../api/media/IMediaAuthType"

const TAG = "Introduction"

export default defineComponent({
  name: "introduction",
  setup(props, context) {

    let media: IMedia

    const log = useESLog()
    const title = ref<string>("")
    const score = ref<string>("")
    const subtitle = ref<string>("")
    const actors = ref<string>("")
    const introduction = ref<string>("")
    const isMediaTypeFree = ref<boolean>(true)

    const onESCreate = (params) => {
      media = params
      if (!media) {
        return
      }
      if (log.isLoggable(ESLogLevel.DEBUG)) {
        log.e(TAG, "-------onESCreate----简介---->>>>>", media)
      }
      if (media.title != null) {
        title.value = media.title
      }
      score.value = media.score
      if (media.subtitle != null) {
        subtitle.value = media.subtitle
      }
      actors.value = media.actors
      introduction.value = media.introduction

      isMediaTypeFree.value = Number(media.authType) == IMediaAuthType.MEDIA_AUTH_TYPE_FREE

    }
    return {
      introductionBg,
      title,
      score,
      subtitle,
      actors,
      introduction,
      onESCreate,
      isMediaTypeFree
    }
  }
})

</script>

<style scoped>
.introduction-detail-root-css {
  width: 1920px;
  height: 1080px;
  background-color: transparent;
}

.introduction-detail-bg-css {
  width: 1012px;
  height: 1080px;
  position: absolute;
}

.introduction-detail-css {
  width: 1012px;
  height: 1080px;
  position: absolute;
  right: 0;
  background-color: transparent;
}

.introduction-detail-title-css {
  width: 768px;
  height: 150px;
  font-size: 60px;
  font-weight: 400;
  color: white;
  margin-left: 184px;
  margin-top: 112px;
}

.introduction-detail-intro-css {
  margin-left: 184px;
  width: 768px;
  height: 700px;
  font-size: 26px;
  font-weight: 400;
  color: white;
  line-height: 38px;
  margin-top: 20px;
}


.introduction-detail-vip-css {
  margin-right: 20px;
  border-color: #F7B500;
  align-items: center;
  display: flex;
  height: 36px;
  width: 100px;
  flex-direction: row;
  justify-content: center
}

.introduction-detail-vip-text-css {
  font-size: 24px;
  color: #FFFFFF;
  margin-left: 12px;
  margin-right: 12px;
  height: 36px;
  width: 100px;
}

.introduction-detail-score-css {
  border-radius: 4px;
  margin-right: 20px;
  border-color: #F7B500;
  border-width: 1.5px;
  align-items: center;
  display: flex;
  width: 60px;
  height: 32px;
  flex-direction: row;
  justify-content: center
}

.introduction-detail-score-text-css {
  top: -1px;
  font-size: 24px;
  color: #F7B500;
  width: 60px;
  height: 32px;
}

.introduction-detail-brief-text-css {
  color: rgba(255, 255, 255, 0.6);
  focus-color: white;
  height: 28px;
  width: 668px;
}

.introduction-detail-subtitle-root-css {
  margin-left: 184px;
  width: 768px;
  margin-top: 40px;
}

.introduction-detail-actor-text-css {
  margin-left: 184px;
  height: 64px;
  width: 768px;
  color: white;
  focus-color: white;
  margin-bottom: 20px;
  margin-top: 50px;
}
</style>
