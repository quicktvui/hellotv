<template>
  <qt-view class="introduction-detail-root-css">
    <qt-column class="introduction-detail-css">
      <img class="introduction-detail-bg-css"
           :focusable="false"
           :enableFocusBorder="false"
           :src="introductionBg"/>
      <span class="introduction-detail-title-css">{{ title }}</span>
      <span class="introduction-detail-intro-css">{{ introduction }}</span>
    </qt-column>
  </qt-view>
</template>

<script lang="ts">

import {defineComponent} from "@vue/runtime-core";
import {IMedia} from "../../api/media/IMedia";
import {ref} from "vue";
import introductionBg from '../../assets/ic_introduction_bg.png'

export default defineComponent({
  name: "introduction",
  setup(props, context) {

    let media: IMedia

    const title = ref<string>('')
    const score = ref<string>('')
    const subtitle = ref<string>('')
    const actors = ref<string>('')
    const introduction = ref<string>('')

    const onESCreate = (params) => {
      media = params
      if (!media) {
        return
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
    }
    return {
      introductionBg,
      title,
      score,
      subtitle,
      actors,
      introduction,
      onESCreate
    }
  },
});

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
  width: 828px;
  height: 65px;
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
  margin-top: 168px;
}


</style>
