<template>
  <qt-view class="button-menu-root" :style="bmStyle">
    <qt-list-view
      class="menu-list"
      :style="bmlStyle"
      ref="listRef"
      horizontal
      padding="0,0,0,0"
      :enableSelectOnFocus="false">
      <qt-view   
        class="menu-list-item" 
        :style="bmliStyle" 
        flexStyle="${style}" 
        :type="1" 
        :focusable="true" 
        eventFocus eventClick>
        <qt-view duplicateParentState class="menu-list-item-img" flexStyle="${iconStyle}">
          <img src="${focusIcon}" duplicateParentState showOnState="focused" flexStyle="${iconStyle}" :focusable="false"/>
          <img src="${icon}" duplicateParentState :showOnState="['normal','selected']" flexStyle="${iconStyle}" :focusable="false"/>
        </qt-view>
        <qt-text
          class="menu-list-item-text"
          autoWidth
          text="${text}"
          :style="bmlitStyle"
          :focusable="false"
          duplicateParentState
        />
      </qt-view>
    </qt-list-view> 
  </qt-view>
</template>
  
<script setup lang='ts' name='ButtonMenu'>
import { ref } from 'vue'
import { useESRouter } from '@extscreen/es3-router'
import { qtRef, QTIListView, QTListViewItem} from '@quicktvui/quicktvui3'
import { IMedia } from '../../../adapter/interface'
import ic_full_normal from '../../../../../assets/detail/ic_full_normal.png'
import ic_full_focused from '../../../../../assets/detail/ic_full_focused.png'
import ic_full_vip_focused from '../../../../../assets/detail/ic_full_vip_focused.png'
import ic_fav_normal from '../../../../../assets/detail/ic_fav_normal.png'
import ic_fav_collected from '../../../../../assets/detail/ic_fav_collected.png'
import ic_fav_focused from '../../../../../assets/detail/ic_fav_focused.png'
import ic_fav_vip_focused from '../../../../../assets/detail/ic_fav_vip_focused.png'
import ic_vip_normal from '../../../../../assets/detail/ic_vip_normal.png'
import ic_vip_focused from '../../../../../assets/detail/ic_vip_focused.png'
import config from '../config';
  const emits = defineEmits(['onIntroductionFocus'])
  const router = useESRouter()
  let bmStyle = config.buttonMenuSize == 'default' ?  
    {height: '140px',marginTop: 45} : {height: '70px',marginTop: 20}
  let bmlStyle = config.buttonMenuSize == 'default' ? {height: '140px'} : {height: '70px'}
  let bmliStyle = config.buttonMenuSize == 'default' ? {} : {'flex-direction': 'row'}
  let bmlitStyle = config.buttonMenuSize == 'default' ? {marginTop: 15} : {marginLeft: 10,marginTop: -5}
  const listRef = ref<QTIListView>()
  let m: IMedia
  let isCollected = ref(false)
  let listData: QTListViewItem[] = []
  const init = (media: IMedia) => {
    m = media 
    listData = [
      {
        type: 1,
        text: '全屏',
        decoration: {right: 30},
        icon: 'file://'+ic_full_normal,
        focusIcon: media.vipType == '0' ? 'file://'+ic_full_focused : 'file://'+ic_full_vip_focused,
        style: config.buttonMenuSize == 'default' ? {width: 140,height: 140,} : {width: 160,height: 70},
        iconStyle: config.buttonMenuSize == 'default' ? {width: 46,height: 46,} : {width: 30,height: 30}
      },
      {
        type: 1,
        text: '付费观看',
        decoration: {right: 30},
        icon: 'file://'+ic_vip_normal,
        focusIcon: 'file://'+ic_vip_focused,
        style: config.buttonMenuSize == 'default' ? {width: 200,height: 140,} : {width: 200,height: 70},
        iconStyle: config.buttonMenuSize == 'default' ? {width: 46,height: 46,} : {width: 30,height: 30}
      },
      {
        type: 1,
        text: isCollected.value ? '已收藏' : '收藏',
        icon: !isCollected.value ? 'file://'+ic_fav_normal : 'file://'+ic_fav_collected,
        focusIcon: media.vipType == '0' ? isCollected.value ? 'file://'+ic_fav_collected : 'file://'+ic_fav_focused : 'file://'+ic_fav_vip_focused,
        style: config.buttonMenuSize == 'default' ? {width: 140,height: 140,} : {width: 160,height: 70},
        iconStyle: config.buttonMenuSize == 'default' ? {width: 46,height: 46,} : {width: 30,height: 30}
      }
    ]
    listRef.value?.setListData(listData)
    
  }
  const onClick = () => {
  }
  const onFocus = (e) => emits('onIntroductionFocus', e.isFocused) 
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
      background-color: rgba(255,255,255,0.1);
      focus-background-color: rgba(255,255,255,1);
      align-items: center;
      justify-content: center;
      .menu-list-item-img{
        background-color: transparent;
        img{
          background-color: transparent;
          position: absolute;
          top: 0;
          left: 0;
        }
      }
      .menu-list-item-text{
        height: 34px;
        font-size: 28px;
        color: rgba(255, 255, 255, 0.5);
        focus-color: black;
        font-size: 28px;
      }
    }
  }
}
</style>
    