<template>
  <qt-view class='exit-dialog-root-css' :clipChildren='false'>
    <!--    头部信息-->
    <qt-view class='exit-dialog-content-top'
         :gradientBackground='{ colors: ["#142A38", "#402E3C"], orientation: 6, cornerRadii4: [ 42, 42, 0, 0 ] }'>
      <img class='exit-dialog-content-top-icon' :src='ic_exit_header' />
      <span class='exit-dialog-content-top-tip'>别走别走，这些精彩内容别错过～</span>
      <qt-view class='exit-dialog-content-top-corner'>
        <img class='img-corner' :src='ic_exit_corner' />
      </qt-view>
    </qt-view>
    <!-- 挽留内容-->
    <qt-view class='exit-dialog-content-bottom' :clipChildren='true'>

      <qt-list-view class='exit-dialog-list-view' ref='listRef'
                    :padding="'0,60,0,0'" :clipPadding='false' :clipChildren='false'
                    horizontal @itemClick='onItemClick'>
        <qt-view class='exit-dialog-list-item' :type='1' :clipPadding='false'
                 :focusScale='ThemeConfig.placeHolderFocusScale'
                 eventClick :focusable='true'>
          <qt-view class='exit-dialog-list-item-img' :duplicateParentState='true'
                   :enableFocusBorder='true'>
            <img class='exit-dialog-list-item-img' src='${image.normal}'
                 :postDelay='100' :focusable='false' />
          </qt-view>

          <qt-text class='exit-dialog-list-item-text' :fontSize='28' :maxLines='2'
                   :ellipsizeMode='2'
                   :focusable='false' text='${title}'
                   :duplicateParentState='true' />

        </qt-view>

      </qt-list-view>

    </qt-view>
    <!--按钮-->
    <qt-view class='exit-dialog-btn-root-css'>
      <qt-button name='exitDialogBtn' :marginRight='20'
                 :focusable='true' :autofocus='true'
                 :buttonStyle="{ width: '330', height: '90',backgroundColor: '#1C222B', focusBackgroundColor: '#FFFFFF', borderRadius: '300px'}"
                 :textStyle="{color: 'rgba(255,255,255,0.55)', focusColor: '#13161B', fontSize: '36px'}"
                 text='残忍退出'
                 @click='onClick("exitDialogBtn")'></qt-button>
      <qt-button name='lookBtn' :marginLeft='20'
                 :focusable='true'
                 :buttonStyle="{ width: '330', height: '90',backgroundColor: '#1C222B', focusBackgroundColor: '#FFFFFF', borderRadius: '300px'}"
                 :textStyle="{color: 'rgba(255,255,255,0.55)', focusColor: '#13161B', fontSize: '36px'}"
                 text='再逛逛'
                 @click='onClick("lookBtn")'></qt-button>
    </qt-view>
  </qt-view>

</template>

<script lang='ts' setup name='exit-dialog'>
import { ref } from 'vue'
import ic_exit_header from '../../../assets/home/ic_exit_header.png'
import ic_exit_corner from '../../../assets/home/ic_exit_corner.png'
import launch from '../../../tools/launch'
import { buildExitList } from '../adapter/exit/home-exit-adapter'
import { ExitListItem } from '../adapter/exit/home-exit-imp'
import homeManager from '../api'
import ThemeConfig from '../../../config/theme-config'

const listRef = ref()
const onESCreate = () => {
  homeManager.getHomeRetention().then((res: Array<ExitListItem>) => {
    const list = buildExitList(res)
    listRef.value?.init(list)
  })
}

const onClick = (name) => {
  switch (name) {
    case 'exitDialogBtn':
      launch.launchGo()
      break;
    case 'lookBtn':
      launch.launchBack()
      break;
  }
}
const onItemClick = (e)=>{
  const params = e.item.jumpParams
  launch.launch(params,true)
}
const onBackPressed = () => {
  launch.launchBack()
}

defineExpose({ onBackPressed, onESCreate })

</script>

<style lang='scss' src='../scss/exit-dialog.scss'>

</style>
