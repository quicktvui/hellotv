<template>
  <tv-list
    list="${itemList}" horizontal :clipChildren="false" :focusable="false"
    resetOnDetach :endHintEnabled="false" useDiff enablePlaceholder
    :onScrollEnable="false" :setSelectChildPosition="0"
    class="rtcs_list" name="rtcs_list_name" flexStyle="${style}"
    @item-focused="onItemFocused" :blockFocusDirections="['left', 'right']"
    ref="rtcsListRef" sid="RankSortListSid"
    @item-click="onItemClickFn"
  >
    <div :focusable="true" type="1" class="rtcs_list_poster" flexStyle="${style}" eventClick eventFocus>
      <img 
        :postDelay="300" :focusable="false" src="${numImg.url}" 
        flexStyle="${numImg.style}" class="rtcs_list_poster_num"
      />
      <img 
        :postDelay="300" :focusable="false" src="${image.src}" 
        flexStyle="${image.style}" class="rtcs_list_poster_img"
      />
      <div 
        class="rtcs_list_poster_cover" flexStyle="${coverStyle}" :focusable="false"
        duplicateParentState :enableBlackBorder="false"
      >
      </div>
    </div>
  </tv-list>
</template>
<script lang='ts' setup>
import { ref } from 'vue';
// @ts-ignore
import { rankingUi } from '../index.ts'
import { EventBus } from "@extscreen/es3-vue"
import {ESIListView} from "@extscreen/es3-component";
import { VirtualView } from "@quicktvui/quicktvui3";
import { useESRouter, useESRoute } from '@extscreen/es3-router';

const router = useESRouter()
const route = useESRoute()
const cRouteName = route.name
let toRouteName = cRouteName
const rtcsListRef = ref<ESIListView>()
let isLoseFocused = -1

router.afterEach((to, from, failure) => {
  toRouteName = to.name
})

const onItemFocused = (e) => {
  isLoseFocused = Number(e.hasFocus)
  if(e.hasFocus){
    rankingUi.changeData({
      itemIndex: e.position
    })
  }
}
const onItemClickFn = (e)=> {
  if(e.item._router){
    router.push({
        name: e.item._router.url, //'series_view',
        params: e.item._router.params?{...e.item._router.params}:undefined
    });
  }
}

EventBus.$on('DispatchKeyEvent', (keyEvent) => {
  if (keyEvent && keyEvent.action === 0) {
    // console.log('lsj--onKeyDown')
  } else if (keyEvent && keyEvent.action === 1) {
    if(isLoseFocused === 0 && toRouteName === cRouteName){
      isLoseFocused = -1
      rankingUi.changeData({ itemIndex: 0 })
      VirtualView.call('RankSortListSid', 'clearFocus', [])
      VirtualView.call('RankSortListSid', 'scrollToPosition', [0])
    }
  }
});
</script>
<style scoped>
.rtcs_list {
  /* width: 1920px;
  height: 350px; */
  background-color: transparent;
}
.rtcs_list_poster {
  position: relative;
  background-color: transparent;
}
.rtcs_list_poster_num {
  background-color: transparent;
}
.rtcs_list_poster_img {
  position: absolute;
  right: 0.01px;
  top: 0.01px;
  z-index: 2;
  background-color: transparent;
  border-radius: 16px;
}
.rtcs_list_poster_cover {
  position: absolute;
  right: -5px;
  top: -5px;
  z-index: 10;
  border-radius: 16px;
  background-color: transparent;
  focus-border-style: solid;
}
</style>