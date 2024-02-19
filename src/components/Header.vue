<template>
  <qt-view class="header" ref="headerRef">
    <div class="left-box">
      <ImgTextBtnView :icon-left="true" text="搜索" :focusable="true"
        style="width: 145px;height: 60px;margin-left: 10px;margin-right: 10px" name="top_search_btn1" ref="top_search_btn"
        icon="ic_top_search.png" focus-icon="ic_top_search_focus.png" @click="onClick('search')" />

      <!-- <ImgTextBtnView :icon-left="true" text="首页" :focusable="true" style="width: 145px;height: 60px;margin-right: 10px"
        name="top_search_btn1" ref="top_search_btn" icon="ic_top_search.png" focus-icon="ic_top_search_focus.png"
        @click="onClick('home')" /> -->
    </div>
  </qt-view>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { QTIView } from '@quicktvui/quicktvui3';
import { useESRouter } from '@extscreen/es3-router';
import ImgTextBtnView from "../components/img-text-btn-view.vue"

const headerRef = ref<QTIView>();

const router = useESRouter()

const onClick = (target: string) => {
  const option = { name: target }
  switch (target) {
    case 'home':
      router.replace(option)
      break
    case 'search':
      router.push(option)
  }
}

</script>

<style scoped>
.header {
  width: 1920px;
  height: 100px;
  background-color: transparent;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-style: solid;
  border-color: #000;
  border-bottom-width: 1px;
}

.header .left-box,
.header .right-box {
  display: flex;
  flex-direction: row;
}

.header .left-box {
  /* width: 430px; */
  width: 340px;
  justify-content: space-between;
  margin-left: 20px;
}

.header .right-box {
  width: 350px;
  justify-content: space-between;
  margin-right: 20px;
}

.header .left-box .qt-image {
  width: 80px;
  height: 80px;
}

.text-button-class {
  text-align: center;
}
</style>
