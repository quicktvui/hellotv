<template>
  <qt-view class="history-confirm" :focusable="false">
    <qt-view class="history-confirm-box" :focusable="false">
      <qt-text class="history-confirm-box-top-text" :text="content.text" gravity="center" :focusable="false"></qt-text>
      <qt-view class="history-confirm-box-btn" :focusable="false">
        <qt-button
          :buttonStyle="btnStyle"
          :textStyle="btnTextStyle"
          style="margin-right: 40px"
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
  width: '260px',
  height: '80px',
  backgroundColor: 'rgba(255, 255, 255, 0.1)',
  focusBackgroundColor: '#FFFFFF',
  borderRadius: '40px'
}
const btnTextStyle = {
  color: 'rgba(202, 203, 204, 1)',
  focusColor: 'rgba(0, 0, 0, 1)',
  fontSize: '36px'
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
  background-color: rgba(0, 0, 0, 0.8);
  align-items: center;
  justify-content: center;
}

.history-confirm-box {
  width: 1000px;
  height: 575px;
  background-color: rgba(28, 34, 43, 1);
  border-radius: 8px;
}

.history-confirm-box-top-text {
  width: 1000px;
  height: 50px;
  background-color: transparent;
  margin-top: 175px;
  color: white;
  font-size: 40px;
}

.history-confirm-box-btn {
  width: 1000px;
  height: 80px;
  background-color: transparent;
  margin-top: 190px;
  flex-direction: row;
  justify-content: center;
}
</style>
