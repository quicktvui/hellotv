<template>
  <qt-view class="history-confirm" :focusable="false">
    <qt-view class="history-confirm-box" :focusable="false">
      <qt-view class="history-confirm-box-top" :focusable="false">
        <qt-text class="history-confirm-box-top-text" :text="content.text" gravity="center" :focusable="false"></qt-text>
      </qt-view>
      <qt-view class="history-confirm-box-btn" :focusable="false">
        <qt-button
          :buttonStyle="btnStyle"
          :textStyle="btnTextStyle"
          style="margin-right: 44px"
          :autofocus="true"
          :text="content.btnL"
          @click="onClick('delete')"
        ></qt-button>
        <qt-button :buttonStyle="btnStyle" :textStyle="btnTextStyle" :text="content.btnR" @click="onClick('cancel')"></qt-button>
      </qt-view>
    </qt-view>
  </qt-view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useESToast, useESEventBus } from '@extscreen/es3-core'
import { useESRouter } from '@extscreen/es3-router'

const toast = useESToast()
const router = useESRouter()
const eventBus = useESEventBus()

const btnStyle = {
  width: '310px',
  height: '96px',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  focusBackgroundColor: '#FFFFFF',
  borderRadius: '50px'
}

const btnTextStyle = {
  color: '#FFFFFF',
  focusColor: '#000000',
  fontSize: '34px'
}

type Options = {
  text: string
  btnL: string
  btnR: string
  [prop: string]: any
}

const content = ref<Options>({
  text: '',
  btnL: '',
  btnR: ''
})

function onESCreate(params: Options) {
  content.value = params
}

let btnClickCounter = 0
function onClick(btn: string) {
  if (++btnClickCounter > 1) return
  switch (btn) {
    case 'delete':
      if (content.value.clearHistory) {
        eventBus.emit('clearPageData')
        router.back()

        // historyApi.deleteContent({ menuIndex: content.value.menuIndex, cid: '', userId: content.value.userId }).then((ok) => {
        //   if (ok) {
        //     eventBus.emit('deletePageData', '', content.value.menuIndex == 0, true)
        //     router.back()
        //   } else {
        //     toast.showToast('清空失败！！！')
        //   }
        //   btnClickCounter = 0
        // })
      } else {
        // historyApi
        //   .deleteContent({ menuIndex: content.value.menuIndex, cid: content.value.cid, userId: content.value.userId })
        //   .then((ok) => {
        //     if (ok) {
        //       eventBus.emit('deletePageData', content.value.cid, content.value.menuIndex == 0)
        //       router.back()
        //     } else {
        //       toast.showToast('删除失败！！！')
        //     }
        //     btnClickCounter = 0
        //   })
      }
      break
    case 'cancel':
      onBackPressed()
      break
  }
}

function onBackPressed() {
  btnClickCounter = 0
  if (!content.value.clearHistory) {
    if (content.value.menuIndex == 0) {
      eventBus.emit('setGridItemImgBorder', content.value.cid, false)
    } else {
      eventBus.emit('setGridItemDeleteCoverBtn', content.value.cid, false)
    }
  }
  router.back()
}

defineExpose({ onESCreate, onBackPressed })
</script>

<style scoped>
.history-confirm {
  width: 1920px;
  height: 1080px;
  background-color: rgba(0, 0, 0, 0.7);
  align-items: center;
  justify-content: center;
}

.history-confirm-box {
  width: 814px;
  height: 438px;
  background-color: #303030;
  border-radius: 12px;
}

.history-confirm-box-top {
  width: 814px;
  height: 258px;
  background-color: transparent;
  align-items: center;
  justify-content: center;
}

.history-confirm-box-top-text {
  width: 774px;
  height: 58px;
  background-color: transparent;
  color: #ffffff;
  font-size: 38px;
  font-weight: 500;
}

.history-confirm-box-btn {
  width: 814px;
  height: 96px;
  background-color: transparent;
  flex-direction: row;
  justify-content: center;
}
</style>
