<template>
  <div class="player-placeholder-root"
    ref="placeholder"
    @click="onClick"
    @focus="onFocus"
    name="placeholder"
    :autofocus='autofocus'
    :focusable="true"
    :blockFocusDirections="['left']"
    :enableFocusBorder="true">
    <qt-view class="player-placeholder-mask" :focusable="false"></qt-view>
    <qt-image class="player-placeholder-img"
      v-if="isShowPlayerPlaceholderImg"
      :duplicateParentState="true"
      :focusable="false"
      :enableFocusBorder="false"
      :src="playerPplaceholderUrl"/>
  </div>
</template>

<script setup lang='ts' name='PlayerPlaceholder'>
import { ref } from 'vue'
import { ESFocusable, useESFocus } from "@extscreen/es3-core"
import { IMedia } from '../../../adapter/interface'
  const emits = defineEmits(['onPlaceholderClick', 'onPlaceholderFocus'])
  const focus = useESFocus()
  const placeholder = ref<ESFocusable>()
  let autofocus = ref<boolean>(false)
  let isFree = ref<boolean>(true)
  let isShowPlayerPlaceholderImg = ref<boolean>(true)
  let playerPplaceholderUrl = ref<string>("")

  const showPlayerPlaceholderImg = (value: boolean) => {
    isShowPlayerPlaceholderImg.value = value
  }
  const init = (media: IMedia) => {
    playerPplaceholderUrl.value = media.cover
  }
  const requestFocus = () => {
    if(placeholder.value) focus.requestFocusDirectly(placeholder.value!)
  }
  const setAutofocus = (enable:boolean) => autofocus.value = enable
  const onClick = () => emits('onPlaceholderClick')
  const onFocus = (e) => emits('onPlaceholderFocus', e.isFocused)

  defineExpose({
    init,requestFocus,setAutofocus,
    showPlayerPlaceholderImg
  })
</script>

<style lang='scss' scoped>
.player-placeholder-root{
  width: 894px;
  height: 504px;
  margin-left: 78px;
  margin-top: -2px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  focus-border-color:$theme-focus-border-color;
  focus-border-width: 3;
  focus-border-radius: $theme-img-border;
  .player-placeholder-mask {
    width: 890px;
    height: 500px;
    position: absolute;
    left: 2px;
    top: 2px;
    background-color: rgba(255,255,255,0.1);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .player-placeholder-img {
    width: 890px;
    height: 500px;
    background-color: transparent;
  }
}
</style>
