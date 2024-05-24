import {
  QTITab
} from '@quicktvui/quicktvui3'
import { Ref } from 'vue'

class MyHistory {
  tabPageIndex?:number
  plateIndex = -1
  sectionIndex = -1

  setData(tabRef:Ref<QTITab|undefined>){
    if(this.tabPageIndex){
      tabRef.value?.getCurrentTabIndex().then(cIndex=>{
        if(cIndex === this.tabPageIndex){
          const _data = tabRef.value?.getPageItem(this.tabPageIndex, this.plateIndex, this.sectionIndex)
          if(_data){
            // _data._his_txt = Math.random()+'--his'
            // tabRef.value?.updatePageItem(this.tabPageIndex, this.plateIndex, this.sectionIndex,_data)
            console.log(_data, '--lsj--data-init')
          }
        }
      })
    }
  }
}
const myHistory = new MyHistory()
export default myHistory