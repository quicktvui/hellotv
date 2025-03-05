<template>
  <div class='history-item-root-css' 
    eventClick eventFocus 
    :focusable="false"
    :enablePlaceholder="true"
    :clipChildren="false" 
    flexStyle='${style}' 
    layout='${layout}'>
    <qt-list-view list="${historyList}" 
      :clipChildren="false" 
      :focusable="false"  
      class="h-list" 
      :skipRequestFocus="true" 
      :resetOnDetach="true" 
      :endHintEnabled="false" 
      flexStyle="${style}" >
      <!-- 无历史 item-->
      <qt-view :type="4001" class='no-history-item' flexStyle='${style}'
        eventClick eventFocus :focusable="true" :enableFocusBorder="true"
        :focusScale="ThemeConfig.placeHolderFocusScale" :clipChildren="false" >
        <img :src="bg_history_item" :focusable="false">
        <qt-text class='no-history-item-title' text='历史记录' :fontSize='36' />
        <qt-text class='no-history-item-text' text='${text}' :fontSIze='28'/>
      </qt-view>
      <!-- 历史 item -->
      <qt-view :type="4002" name="history-item" class="history-item" 
        :focusable="true" flexStyle="${style}"
        :clipChildren="false" eventClick eventFocus :enableFocusBorder="true" 
        :focusScale="ThemeConfig.placeHolderFocusScale">
        <div duplicateParentState class="history-item-text-box" :focusable="false" >
          <qt-text :focusable="false" text="${text}" :lines="1" :maxLines="1"
            :ellipsizeMode="2" :fontSize="30" gravity="start|center"
            :showOnState="['normal','selected']"
            class="history-item-text" duplicateParentState/>
          <qt-text :focusable="false" text="${text}" :lines="1" :maxLines="1"
            :ellipsizeMode="2" :fontSize="30" gravity="start|center"
            typeface="bold" showOnState="focused" style="color:#13161B;"
            class="history-item-text" duplicateParentState/>
        </div>
        <qt-text :focusable="false" text="${progress}" :lines="1" :maxLines="1"
          :ellipsizeMode="2" :fontSize="24" gravity="end|center" 
          class="history-item-progress" duplicateParentState/>
      </qt-view>
      <!-- 历史 login-item -->
      <qt-view :type="4003" name="history-login-item" class="history-login-item" 
        :focusable="true" flexStyle="${style}"
        :clipChildren="false" eventClick eventFocus :enableFocusBorder="true" 
        :focusScale="ThemeConfig.placeHolderFocusScale">
        <div duplicateParentState class="history-login-item-text-box" :focusable="false" >
          <qt-text :focusable="false" text="${text}" :lines="1" :maxLines="1"
            :ellipsizeMode="2" :fontSize="30" gravity="start|center"
            :showOnState="['normal','selected']"
            class="history-login-item-text" duplicateParentState/>
          <qt-text :focusable="false" text="${text}" :lines="1" :maxLines="1"
            :ellipsizeMode="2" :fontSize="30" gravity="start|center"
            typeface="bold" showOnState="focused" style="color:#13161B;"
            class="history-login-item-text" duplicateParentState/>
        </div>
        <div duplicateParentState class="history-login-item-icon">
          <img :src="ic_arrow_normal" :focusable="false" :showOnState="['normal','selected']" 
             duplicateParentState>
          <img :src="ic_arrow_focused" :focusable="false" showOnState="focused" 
             duplicateParentState>
        </div>
      </qt-view>
      <!-- line -->
      <div :type="4004" class="history-item-line" :focusable="false" 
        flexStyle="${style}" :clipChildren="false">
      </div>
    </qt-list-view>
  </div>
</template>

<script lang='ts' setup name='history-text-item'>
import ThemeConfig from "../../../../config/theme-config";
import bg_history_item from '../../../../assets/home/bg_history_item.png'
import ic_arrow_normal from '../../../../assets/home/ic_arrow_normal.png'
import ic_arrow_focused from '../../../../assets/home/ic_arrow_focused.png'

defineExpose({})

</script>

<style lang='scss' scoped>
.history-item-root-css{
  background-color: rgba(255,255,255,0.06);
  border-radius: $theme-img-border;
  .h-list{
    background-color: transparent;
    .no-history-item{
      background-color: rgba(255,255,255,0.06);
      border-radius: $theme-img-border;
      .img{
        position: absolute;
        left: 269px;
        top: 116px;
        width: 139px;
        height: 115px;
        border-bottom-right-radius: $theme-img-border;
      }
      .no-history-item-title{
        margin-top: 26px;
        margin-left: 36px;
        color: white;
        width: 144px;
        height: 45px;
        background-color: transparent;
      }
      .no-history-item-text{
        width: 230px;
        height: 36px;
        color: rgba(255,255,255,0.5);
        margin-top: 14px;
        margin-left: 36px;
        background-color: transparent;
      }
    }
    .history-item{
      flex-direction: row;
      background-color: transparent;
      padding-left: 20px;
      padding-right: 20px;  
      focus-background-color: #fff;
      .history-item-text-box{
        width: 280px;
        height: 76px;
        background-color: transparent;
      }
      .history-item-text{
        position: absolute;
        width: 280px;
        height: 76px;
        color: #fff;
      }
      .history-item-progress{
        width: 70px;
        margin-left: 23px;
        background-color: transparent;
        color: rgba(255,255,255,0.55);
        focus-color:#13161B;
      }
    }
    .history-login-item{
      flex-direction: row;
      background-color: transparent;
      padding-left: 20px;
      padding-right: 20px;  
      focus-background-color: #fff;
      align-items: center;
      .history-login-item-text-box{
        width: 280px;
        height: 76px;
        background-color: transparent;
      }
      .history-login-item-text{
        position: absolute;
        width: 280px;
        height: 76px;
        color: #fff;
      }
      .history-login-item-icon{
        width: 13px;
        height: 22px;
        background-color: transparent;
        margin-left: 75px;
        img{
          width: 13px;
          height: 22px;
          position: absolute;
        }
      }
    }
    .history-item-line{
      background-color: rgba(255,255,255,0.1);
    }
  }
}
</style>
