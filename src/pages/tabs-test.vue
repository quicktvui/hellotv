<template>
  <div class='tab-test'>
    <!-- <el-tabs class="tabs" name="tabs" :tab-position="tabPosition" @tab-focus="tabFocus" active-name="tab1">
      <tab-pane v-for="(item, index) in tabHeaderData" :key="index"
        :label="`tab${item}`" :name="`tab${item}`" :class="`tab tab${item}`">
      </tab-pane>
    </el-tabs> -->
    <ul class="tabs-header tabs-header-top" horizontal :focusable="false">
      <li v-for="(item, index) in tabHeaderData" class="tabs-header-item" :focusable="true"
        @focus="(e) => onLiFocus(e, item, index)">
        <span style="height: 60px;" :focusable="false" class="tabs-header-item-text">{{`tab${item}`}}</span>
      </li>
    </ul>
    <qt-ul
      class="qt-ul"
      ref="qtulRef"
      name="qt-ul"
      :data="cData"
      :padding="'90,130,90,30'"
      :clipChildren="false"
      :spanCount="spanCount">
      <template #default="{item}">
        <div class="qt-ul-item" v-if="item.type == 1" :focusable="true" :enableFocusBorder="true"
          @focus="e => onFocus(e)" :style="item.style">
          <img :src="item ? item.img : ''" class="tv_item_img" 
            :style="{ width: `${item.style.width}px` }"/>
          <p class="tv_item_title">
            {{item ? `tab${currentTabIndex}-${item.text}` :''}}
          </p>
        </div>
        <qt-ul class="qt-ul-list-section" :type="2" v-else
          :data="item.list" :style="item.style"
          :padding="'90,10,0,30'"
          :clipChildren="false">
          <template #default="{sItem}">
            <div class="qt-ul-item" :type="22" :focusable="true" :enableFocusBorder="true"
              @focus="e => onFocus(e)" :style="sItem.style">
              <img :src="sItem ? sItem.img : ''" class="tv_item_img" 
                :style="{ width: `${sItem.style.width}px` }"/>
              <p class="tv_item_title">
                {{sItem ? `tab${currentTabIndex}-${sItem.text}` :''}}
              </p>
            </div>
          </template>
        </qt-ul>
      </template>
    </qt-ul>
  </div>
</template>

<script lang='ts' setup>
import { ref,nextTick, onMounted, reactive } from 'vue'
  const img = ref<string>('https://img1.baidu.com/it/u=1726075624,1307327070&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=667');
  // let tabPosition = ref('top')
  // const tabFocus = (e) => {
  //   cData.value = arr
  // }
  let currentTabIndex = ref(0)
  let spanCount = ref(0)
  let tabHeaderData = ref([
    0,1,2,3,4,5,6,7,8,9
  ])
  
  let cData  = ref<any[]>([])
  let arr:Array<any> = []
  
  const buildData0 = () => {
    arr = []
    for (let i = 0; i < 24; i++) {
      arr.push({
        id: 'id'+i, name: 'name'+Math.random(),
        itemSize: 300, type: 1,
        img: img,
        tag: i % 2 == 0 ? '' : 'VIP',
        style: {
          width: 300,
          height: 250
        },
        text: `pos:${i}`,
        decoration : {
          top: 20,
          bottom:20,
        }
      })
    }
    arr[0].itemSize = 780
    arr[0].style = {
      width: 780,
      height: 250
    }
    arr[1].itemSize = 780
    arr[1].style = {
      width: 780,
      height: 250
    }
    // arr[1].itemSize = 780
    // arr[8].itemSize = 780
    // arr[9].itemSize = 780
  }
  const buildData1 = () => {
    arr = []
    for (let i = 0; i < 24; i++) {
      arr.push({
        id: 'id'+i, name: 'name'+Math.random(),
        itemSize: 300, type: 1,
        img: img,
        tag: i % 2 == 0 ? '' : 'VIP',
        style: {
          width: 300,
          height: 250
        },
        text: `pos:${i}`,
        decoration : {
          bottom:20,
        }
      })
    }
  }
  const buildData2 = () => {
    arr = []
    arr.push(
      {
        type: 2,
        id: 'id'+ 22, name: 'name'+Math.random(),
        itemSize: 1920,
        style: {
          width: 1920,
          height: 300
        },
        list: []
      }
    )
    for (let i = 0; i < 12; i++) {
      arr[0].list.push({
        id: 'id'+i, name: 'name'+Math.random(),
        itemSize: 300, type: 22,
        img: img,
        tag: i % 2 == 0 ? '' : 'VIP',
        style: {
          width: 300,
          height: 250
        },
        text: `pos:${i}`,
        decoration : {
          bottom:20,
        }
      })
    }
    for (let i = 0; i < 24; i++) {
      arr.push({
        id: 'id'+i, name: 'name'+Math.random(),
        itemSize: 300, type: 1,
        img: img,
        tag: i % 2 == 0 ? '' : 'VIP',
        style: {
          width: 300,
          height: 250
        },
        text: `pos:${i}`,
        decoration : {
          bottom:20,
        }
      })
    }
    console.log(arr,'3434344444')
  }
  onMounted(() => {
    buildData0()
    cData.value = arr
  })
  const onFocus = (e) => {
  }
  const onLiFocus = (e, item, index) => {
    if(index != currentTabIndex.value && e.isFocused){
      currentTabIndex.value = index
      if(currentTabIndex.value % 3 == 0){
        buildData0()
      }else if(currentTabIndex.value % 3 == 1){
        buildData1()
      }else if(currentTabIndex.value % 3 == 2){
        buildData2()
      }
      cData.value = arr
    }
  }

</script>



<style lang='scss'>
.tabs{
  width: 1920px;
  height: 80px;
  background-color: red;
  
}
.tab-test{
  .tabs-header-top{
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    width: 1830px;
    height: 60px;
    background-color: rgba(0,0,0,0.5);
    flex-direction: row;
    margin-left: 90px;
    margin-top: 30px;
    z-index: 2222;
  }
  .tabs-header-bottom{
    width: 1920px;
    height: 60px;
    background-color: transparent;
    flex-direction: row;
  }
  .tabs-header-item{
    height: 60px;
    padding-left: 16px;
    padding-right: 16px;
    text-align: center;
    line-height: 60px;
    background-color: yellow;
    margin-right: 50px;
  }
  .tabs-header-item-text{
    color: #333;
    font-size: 42;
  }
  .tabs-content{
    width: 1920px;
    height: 1080px;
    background-color: aqua;
    padding-top: 120px;
  }
  .tabs-content-item{
    width: 1920px;
    height: 1080px;
    padding-top: 120px;
    background-color: burlywood;
  }
  .qt-ul{
    width: 1920px;
    height: 1080px;
    position: absolute;
    padding-top: 30px;
    background-color: red;
  }
  .qt-ul-item {
    position: relative;
    // width: 300px;
    // height: 250px;
    border-radius: 20px;
    background-color: pink;
    focus-background-color: blue;
  }
  .tv_item_img {
    // width: 300px;
    height: 200px;
    background-color: red;
  }
  .tv_item_title{
    // width: 300px;
    height: 50px;
    line-height: 50px;
    font-size: 30px;
    color: #000000;
    background-color: transparent;
  }
  .tv_item_tag{
    position: absolute;
    right: 0;
    top: 0;
    width: 60px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    background-color: gold;
    color: #000000;
    font-size: 22px;
    background-color: transparent;
  }
  .qt-ul-list-section{
    background-color: aqua;
  }



  .tab{
    width: 1920px;
    height: 1080px;
    p{
    font-size: 30px; 
    text-align: center;
    }
  }
  .tab1{
    background-color: red;
  }
  .tab2{
    background-color: blue;
  }
}

</style>
