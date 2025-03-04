<template>
  <div class='history-item-root-css' 
    eventClick eventFocus 
    :focusable="false"
    :enablePlaceholder="true"
    :clipChildren="false" 
    flexStyle='${style}' 
    layout='${layout}'>
    <tv-list list="${historyList}" 
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
        <img :src="bg_history_item" class="bg-history-item" :focusable="false">
        <qt-text class='history-item-null-text' text='历史记录' :fontSize='36' />
        <qt-text class='history-item-null-text-tip' text='${text}' :fontSIze='28'/>
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
        <img :src="ic_arrow_normal" :focusable="false" 
          class="history-login-item-icon" duplicateParentState>
      </qt-view>
      <!-- line -->
      <div :type="4004" class="history-item-line" :focusable="false" 
        flexStyle="${style}" :clipChildren="false">
      </div>
    </tv-list>
  </div>
</template>

<script lang='ts' setup name='history-text-item'>
import ThemeConfig from "../../../../config/theme-config";
import bg_history_item from '../../../../assets/home/bg_history_item.png'
import ic_arrow_normal from '../../../../assets/home/ic_arrow_normal.png'

defineExpose({})

</script>

<style lang='scss' src='../../scss/history-item.scss'>

</style>
