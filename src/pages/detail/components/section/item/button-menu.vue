<template>
  <qt-view class="button-menu-root" :style="bmStyle">
    <qt-list-view
      class="menu-list"
      :style="bmlStyle"
      ref="listRef"
      horizontal
      padding="0,0,0,0"
      @item-click="onItemClick"
      :enableSelectOnFocus="false">
      <qt-view
        class="menu-list-item"
        :style="bmliStyle"
        flexStyle="${style}"
        :type="1"
        :focusable="true"
        :focusScale="ThemeConfig.placeHolderFocusScale"
        eventFocus eventClick>
        <div showOnState="focused" flexStyle="${style}"
          class="menu-list-item-bg"
          duplicateParentState
          gradientBackground="${gradientBackground}"/>
        <qt-view duplicateParentState class="menu-list-item-img" flexStyle="${iconStyle}">
          <img src="${focusIcon}" duplicateParentState showOnState="focused" flexStyle="${iconStyle}" :focusable="false"/>
          <img src="${icon}" duplicateParentState :showOnState="['normal','selected']" flexStyle="${iconStyle}" :focusable="false"/>
        </qt-view>
        <div duplicateParentState  class="menu-list-item-text-box"
          :focusable="false" :style="bmlitStyle" autoWidth>
          <qt-text
            class="menu-list-item-text"
            autoWidth
            text="${text}"
            :focusable="false"
            :showOnState="['normal','selected']"
            duplicateParentState/>
          <qt-text
            class="menu-list-item-text"
            autoWidth
            text="${text}"
            typeface="bold"
            showOnState="focused"
            :focusable="false"
            duplicateParentState/>
        </div>
      </qt-view>
    </qt-list-view>
  </qt-view>
</template>

<script setup lang='ts' name='ButtonMenu'>
import { ref } from 'vue'
import { QTIListView, QTListViewItem} from '@quicktvui/quicktvui3'
import { useESEventBus } from "@extscreen/es3-core"
import { IMedia } from '../../../adapter/interface'
import ThemeConfig from "../../../../../config/theme-config";
import ic_full_normal from '../../../../../assets/detail/ic_full_normal.png'
import ic_full_focused from '../../../../../assets/detail/ic_full_focused.png'
import ic_collect_normal from '../../../../../assets/detail/ic_collect_normal.png'
import ic_collect_focused from '../../../../../assets/detail/ic_collect_focused.png'
import ic_vip_normal from '../../../../../assets/detail/ic_vip_normal.png'
import ic_vip_focused from '../../../../../assets/detail/ic_vip_focused.png'
import config from '../config';
  const props = defineProps({
    isCollected: Boolean
  })
  const eventbus = useESEventBus()
  let bmStyle = config.buttonMenuSize == 'default' ?
    {height: '140px',marginTop: 50} : {height: '70px',marginTop: 20}
  let bmlStyle = config.buttonMenuSize == 'default' ? {height: '140px'} : {height: '70px'}
  let bmliStyle = config.buttonMenuSize == 'default' ? {} : {'flex-direction': 'row'}
  let bmlitStyle = config.buttonMenuSize == 'default' ? {marginTop: 15} : {marginLeft: 10,marginTop: -5}
  const listRef = ref<QTIListView>()
  let m: IMedia
  let isCollect = ref(false)
  let listData: QTListViewItem[] = []
  const init = (media: IMedia) => {
    isCollect.value = props.isCollected
    m = media
    listData = [
      {
        type: 1,
        text: '全屏',
        decoration: {right: 30},
        menuType: 'full',
        gradientBackground: {colors: ThemeConfig.btnGradientFocusColor, orientation: 6, cornerRadius: ThemeConfig.focusBorderCorner},
        icon: 'file://'+ic_full_normal,
        focusIcon: 'file://'+ic_full_focused,
        style: config.buttonMenuSize == 'default' ? {width: 140,height: 140,} : {width: 160,height: 70},
        iconStyle: config.buttonMenuSize == 'default' ? {width: 50,height: 50,} : {width: 30,height: 30}
      },
      {
        type: 1,
        menuType: 'collect',
        decoration: {right: 30},
        gradientBackground: {colors: ThemeConfig.btnGradientFocusColor, orientation: 6, cornerRadius: ThemeConfig.focusBorderCorner},
        text: isCollect.value ? '已收藏' : '收藏',
        icon: 'file://'+ic_collect_normal,
        focusIcon: 'file://'+ic_collect_focused,
        style: config.buttonMenuSize == 'default' ? {width: 140,height: 140,} : {width: 160,height: 70},
        iconStyle: config.buttonMenuSize == 'default' ? {width: 50,height: 50,} : {width: 30,height: 30}
      },
      {
        type: 1,
        text: '付费观看',
        menuType: 'vip',
        gradientBackground: {colors: ['#FFE398', '#EEB364'], orientation: 6, cornerRadius: ThemeConfig.focusBorderCorner},
        icon: 'file://'+ic_vip_normal,
        focusIcon: 'file://'+ic_vip_focused,
        style: config.buttonMenuSize == 'default' ? {width: 226,height: 140,} : {width: 226,height: 70},
        iconStyle: config.buttonMenuSize == 'default' ? {width: 50,height: 50,} : {width: 30,height: 30}
      },
    ]
    if(media.vipType == '0') listData = listData.splice(0, 2)
    listRef.value?.setListData(listData)

  }
  const onItemClick = (e) => {
    if(e.position == 0) eventbus.emit("onMenuFullButtonClick")
    if(e.position == 2) eventbus.emit("onMenuVIPButtonClick")
    if(e.position == 1) {
      isCollect.value = !isCollect.value
      let item: QTListViewItem = {
        type: 1,
        menuType: 'collect',
        text: isCollect.value ? '已收藏' : '收藏',
        decoration: {right: 30},
        gradientBackground: {colors: ThemeConfig.btnGradientFocusColor, orientation: 6, cornerRadius: ThemeConfig.focusBorderCorner},
        icon: 'file://'+ic_collect_normal,
        focusIcon: 'file://'+ic_collect_focused,
        style: config.buttonMenuSize == 'default' ? {width: 140,height: 140,} : {width: 160,height: 70},
        iconStyle: config.buttonMenuSize == 'default' ? {width: 50,height: 50,} : {width: 30,height: 30}
      }
      listRef.value?.updateItemRange(1,1,[item])
      eventbus.emit("onMenuFavouriteButtonClick", isCollect.value)
    }
  }
  defineExpose({
    init
  })
</script>

<style lang='scss' scoped>
.button-menu-root{
  width: 790px;
  background-color: transparent;
  margin-left: 20px;
  .menu-list{
    width: 790px;
    background-color: transparent;
    .menu-list-item{
      border-radius: 16px;
      background-color: $gl-theme-btn-bg-normal-color;
      align-items: center;
      justify-content: center;
      .menu-list-item-bg{
        position: absolute;
        background-color: transparent;
      }
      .menu-list-item-img{
        background-color: transparent;
        img{
          background-color: transparent;
          position: absolute;
          top: 0;
          left: 0;
        }
      }
      .menu-list-item-text-box{
        height: 34px;
        position: relative;
        background-color: transparent;
        .menu-list-item-text{
          height: 34px;
          font-size: 28px;
          color: $text-normal-color;
          focus-color: $text-focus-color;
          font-size: 28px;
          position: absolute;
        }
      }

    }
  }
}
</style>
