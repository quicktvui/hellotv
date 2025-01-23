<template>
  <div class='qt-test'>
    <qt-ul class="qt-ul" ref="qtulRef" name="qt-ul" :items="myData" :spanCount="6">
      <template #default="{item}">
        <div class="qt-ul-item" v-if="item.type == 5" :focusable="true" :enableFocusBorder="true"
          @focus="e => onFocus(e)">
          <img :src="item ? item.img : ''" class="tv_item_img" />
          <p class="tv_item_title">{{item ?item.text :''}}</p>
        </div>
        <div class="tv item_2" v-else :focusable="true" :enableFocusBorder="true"></div>
      </template>
    </qt-ul>
  </div>

</template>

<script lang='ts' setup>
import { ref,nextTick, onMounted } from 'vue'
  const img = ref<String>('https://img1.baidu.com/it/u=1726075624,1307327070&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=667');
  let myData  = ref<any[]>([])
  let arr:Array<any> = []
  let arrNew:Array<any> = []
  for (let i = 0; i < 10; i++) {
    arr.push({
      id: 'id'+i, name: 'name'+Math.random(),
      itemSize: 260, type: 5,
      img: img,
      tag: i % 2 == 0 ? '' : 'VIP',
      text: `pos:${i}`,
      // decoration : {
      //   top:20,
      //   right:20
      // }
    })
  }
  onMounted(() => {
    myData.value = arr
    setTimeout(() => {
      for (let i = 10; i < 15; i++) {
        arrNew.push({
          id: 'id'+i, name: 'name'+Math.random(),
          itemSize: 260, type: 5,
          img: img,
          tag: i % 2 == 0 ? '' : 'VIP',
          text: `pos:${i}`,
          // decoration : {
          //   top:20,
          //   right:20
          // }
        })
      }
      myData.value = myData.value.concat(arrNew)
    },5000)
  })
  const onFocus = (e) => {
  }
  
</script>


<!--<style lang='scss' scoped src='../config/test.scss'>-->
<!--</style>-->

<style lang='scss' scoped src='../config/test.scss'>
</style>
