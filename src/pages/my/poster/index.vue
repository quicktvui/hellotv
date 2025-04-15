<template>
  <item-frame
    class="qt-ui-poster-root-css"
    :type="101"
    layout="${layout}"
    flexStyle="${style}"
    :focusable="true"
    :clipChildren="false"
    name="innerItem"
    itemShowShimmer="${shimmer.enable}"
    shimmerSize="${shimmer.size}"
    eventClick
    eventFocus
  >
    <img
      class="my-poster-img-css"
      :duplicateParentState="true"
      :postDelay="300"
      :focusable="false"
      :enableFocusBorder="true"
      flexStyle="${image.style}"
      src="${image.src}"
    />
    <div class="poster-title" flexStyle="${titleBoxStyle}" :duplicateParentState="true" :focusable="false">
      <text-view
        :duplicateParentState="true"
        :focusable="false"
        textSize="${title.style.fontSize}"
        :ellipsizeMode="4"
        :lines="1"
        :postDelay="200"
        gravity="center|left"
        flexStyle="${title.style}"
        text="${title.text}"
        showIf="${title.enable}"
        :paddingRect="[5, 0, 0, 0]"
        class="poster-title-text"
      />
      <text-view
        class="poster-subtitle"
        :focusable="false"
        fontSize="${subTitle.style.fontSize}"
        :ellipsizeMode="2"
        :lines="1"
        gravity="centerVertical|left"
        flexStyle="${subTitle.style}"
        :duplicateParentState="true"
        text="${subTitle.text}"
        visibility="${subTitle}"
        :paddingRect="[5, 0, 0, 0]"
      />
    </div>
  </item-frame>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'my-poster',
  setup() {
    return {}
  }
})
</script>

<style scoped>
.qt-ui-poster-root-css {
  position: relative;
  background-color: transparent;
  overflow: hidden;
}
.my-poster-img-css {
  background-color: transparent;
  z-index: 1;
  border-radius: 9px;
}
.poster-title {
  position: absolute;
  left: 0;
  top: 0;
  background-color: transparent;
  z-index: 1;
}
.poster-title-text {
  color: rgba(255, 255, 255, 0.55);
  focus-color: #ffffff;
  background-color: transparent;
}
.poster-subtitle {
  color: rgba(255, 255, 255, 0.55);
  background-color: transparent;
}
</style>
