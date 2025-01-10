<template>
  <qt-view class="media-info">
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
    <!-- tag -->
    <qt-text
      class="tag"
      :duplicateParentState="true"
      :focusable="false"
      :fontSize="28"
      :ellipsizeMode="2"
      enablePostTask
      postDelay="200"
      :lines="1"
      gravity="left|center"
      :text="tag"/>
    <!-- button-menu-list -->
    <qt-list-view
      class="menu-list"
      ref="listRef"
      horizontal
      padding="0,0,0,0"
      @item-click="onItemClick"
      :enableSelectOnFocus="false">
      <qt-view
        class="menu-list-item"
        :type="1"
        :focusable="true"
        flexStyle="${style}"
        :focusScale="ThemeConfig.placeHolderFocusScale"
        eventFocus eventClick>
        <div showOnState="focused" class="menu-list-item-bg" duplicateParentState
          gradientBackground="${gradientBackground}" flexStyle="${style}"/>
        <qt-view duplicateParentState class="menu-list-item-img">
          <img src="${focusIcon}" duplicateParentState showOnState="focused" :focusable="false"/>
          <img src="${icon}" duplicateParentState :showOnState="['normal','selected']" :focusable="false"/>
        </qt-view>
        <div duplicateParentState  class="menu-list-item-text-box" 
          :focusable="false" autoWidth>
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
  
<script setup lang='ts' name='media-info'>
import { ref } from 'vue'
import { useESRouter } from '@extscreen/es3-router'
import { QTIListView, QTListViewItem} from '@quicktvui/quicktvui3'
import ThemeConfig from "../../../config/theme-config";
import { toast } from '@extscreen/es3-core';
import { IMedia } from "../adapter/interface";
import ic_full_normal from '../../../assets/detail-full-screen/ic_full_normal.png'
import ic_full_focused from '../../../assets/detail-full-screen/ic_full_focused.png'
import ic_fav_normal from '../../../assets/detail-full-screen/ic_collect_normal.png'
import ic_fav_collected from '../../../assets/detail-full-screen/ic_collect_focused.png'
import ic_fav_focused from '../../../assets/detail-full-screen/ic_collect_focused.png'
import ic_vip_normal from '../../../assets/detail-full-screen/ic_vip_normal.png'
import ic_vip_focused from '../../../assets/detail-full-screen/ic_vip_focused.png'
import ic_info_normal from '../../../assets/detail-full-screen/ic_info_normal.png'
import ic_info_focused from '../../../assets/detail-full-screen/ic_info_focused.png'
  const props = defineProps({
    isCollected: Boolean
  })
  const router = useESRouter()
  let title = ref<string>('')
  let tag = ref<string>('')
  const listRef = ref<QTIListView>()
  let isCollect = ref(false)
  let listData: QTListViewItem[] = []
  let m: IMedia
  const init = (media: IMedia) => {
    m = media
    title.value = media.title
    tag.value = media.tags
    listData = [
      {
        type: 1,
        text: '全屏',
        decoration: {left: 80,right: 30},
        menuType: 'full',
        gradientBackground: {colors: ThemeConfig.btnGradientFocusColor, orientation: 6, cornerRadius: ThemeConfig.focusBorderCorner},
        icon: 'file://'+ic_full_normal,
        focusIcon: 'file://'+ic_full_focused,
        style: {width: 140,height: 140},
      },
      {
        type: 1,
        menuType: 'collect',
        decoration: {right: 30},
        gradientBackground: {colors: ThemeConfig.btnGradientFocusColor, orientation: 6, cornerRadius: ThemeConfig.focusBorderCorner},
        text: isCollect.value ? '已收藏' : '收藏',
        icon: !isCollect.value ? 'file://'+ic_fav_normal : 'file://'+ic_fav_collected,
        focusIcon: isCollect.value ? 'file://'+ic_fav_collected : 'file://'+ic_fav_focused,
        style: {width: 140,height: 140},
      },
      {
        type: 1,
        text: '付费观看',
        menuType: 'vip',
        decoration: {right: 30},
        gradientBackground: {colors: ['#FFE398', '#EEB364'], orientation: 6, cornerRadius: ThemeConfig.focusBorderCorner},
        icon: 'file://'+ic_vip_normal,
        focusIcon: 'file://'+ic_vip_focused,
        style: {width: 226,height: 140},
      },
      {
        type: 1,
        text: '视频详情',
        menuType: 'info',
        gradientBackground: {colors: ThemeConfig.btnGradientFocusColor, orientation: 6, cornerRadius: ThemeConfig.focusBorderCorner},
        icon: 'file://'+ic_info_normal,
        focusIcon: 'file://'+ic_info_focused,
        style: {width: 140,height: 140},
      }
    ]
    // if(media.vipType == '0') listData = listData.splice(0, 2)
    listRef.value?.setListData(listData)
  }
  const onItemClick = () => {}
  defineExpose({
    init
  })
</script>
  
<style lang='scss' scoped>
.media-info {
  width: 1920px;
  height: 293px;
  background-color: transparent;
  margin-top: -2px;
  .title {
    width: 1760px;
    height: 72px;
    margin-left: 80px;
    color: #FFFFFF;
    background-color: transparent;
  }
  .tag{
    width: 1760px;
    height: 36px;
    margin-left: 80px;
    margin-top: 25px;
    color: #FFFFFF;
  }
  .menu-list{
    width: 1920px;
    height: 140px;
    background-color: transparent;
    margin-top: 20px;
    .menu-list-item{
      border-radius: 16px;
      background-color: rgba(0,0,0,0.35);
      // focus-background-color: rgba(255,255,255,1);
      align-items: center;
      justify-content: center;
      .menu-list-item-bg{
        position: absolute;
        background-color: transparent;
      }
      .menu-list-item-img{
        width: 50px;
        height: 50px;
        background-color: transparent;
        img{
          width: 50px;
          height: 50px;
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
          color: rgba(255, 255, 255, 0.55);
          focus-color: #13161B;
          font-size: 28px;
          position: absolute;
        }
      }
      
    }
  }
}
</style>
    