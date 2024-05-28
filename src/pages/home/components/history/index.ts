import {
  QTITab,QTWaterfallItem
} from '@quicktvui/quicktvui3'
import { Ref } from 'vue'
import api from '../../../../api/history/index'
// import { getSubTitle } from '../../../history/index'

const getSubTitle = (data: any) => {
  if (!data) return ''
  let subTitle = data.subTitle || ''
  try {
    if (!subTitle && data.playCount) {
      subTitle = data.playCount
      if (!isNaN(Number(data.playCount))) {
        subTitle = `观看至${data.playCount}集`
      }
      let progress = ''
      if (data.allTime && data.allTime > 0) {
        progress = (((data.currentPlayTime || 0) / (data.allTime || 1)) * 100).toFixed(0) + '%'
        if (Number(data.currentPlayTime) <= 0) {
          progress = '不足1%'
        }
        subTitle += ' ' + progress
      }

    }
  } catch (error) {

  }
  return subTitle
}
const getSubTitle2 = (data: any) => {
  if (!data) return ''
  let subTitle = ''
  try {
    let progress = ''
    if (data.allTime && data.allTime > 0) {
      if (Number(data.currentPlayTime) <= 0) {
        subTitle = '不足1%'
      }else{
        progress = (((data.currentPlayTime || 0) / (data.allTime || 1)) * 100).toFixed(0) + '%'
        subTitle += '观至' + progress
      }
    } else {
      subTitle = '不足1%'
    }
  } catch (error) {

  }
  return subTitle
}
const getTitle = (data: any) => {
  if (!data) return ''
  let assetLongTitle = data.assetLongTitle || ''
  try {
    if(data.playCount){
      if (!isNaN(Number(data.playCount))) {
        assetLongTitle += `(第${data.playCount}集)`
      }else{
        assetLongTitle += `(${data.playCount})`
      }
    }
  } catch (error) {

  }
  return assetLongTitle
}

const space = 19
const getMyHistoryBlock = (data:QTWaterfallItem,isLogin=false):QTWaterfallItem => {
  const showApiData01 = !!data.apiData01;
  const showApiData02 = !!data.apiData02;
  let apiData01Title = ''
  let apiData01SubTitle = ''
  let apiData02Title = ''
  let apiData02SubTitle = ''
  let num = 1
  if(showApiData01){ 
    num+=1
    apiData01Title = getTitle(data.apiData01)
    apiData01SubTitle = getSubTitle2(data.apiData01)
  }
  if(showApiData02){ 
    num+=1
    apiData02Title = getTitle(data.apiData02)
    apiData02SubTitle = getSubTitle2(data.apiData02)
  }
  const allTextStyle = {
    width: (data.style.width||0),
    paddingLeft: space, paddingRight: space,
    height: Math.max(Math.floor((data.style.height||0)/num),50)
  }
  const barStyle = {
    ...allTextStyle, height: showApiData01?allTextStyle.height:0
  }
  const barStyle2 = {
    ...allTextStyle, height: showApiData02?allTextStyle.height:0
  }
  const innerWidth = barStyle.width-space*2
  const innerHeight = barStyle.height-2;
  
  let allText = '历史记录'
  let allSubText = ''
  let showAllSubText = false
  if(isLogin){
    if(num === 1){
      allSubText = '无历史记录，快去观看视频吧~'
      showAllSubText = true
    }else{
      allText = '全部历史'
    }
  } else {
    if(num === 1){
      allSubText = '登录同步云端历史'
      showAllSubText = true
    }else{
      allText = '登录同步云端历史'
    }
  }
  return {
    ...data,
    barStyle,allTextStyle,barStyle2,
    barTitleStyle:{
      width: Math.floor(innerWidth * 0.7),
      height: innerHeight
    },
    barProgressStyle:{
      width: Math.floor(innerWidth * 0.3),
      height: innerHeight
    },
    barBorderBottomStyle:{
      width: barStyle.width,
      height: 1
    },
    allText,allSubText,
    showApiData01, showApiData02,
    apiData01Title, apiData01SubTitle,
    apiData02Title, apiData02SubTitle,
    showAllSubText,
    allSubTextSytle: showAllSubText?{ width: innerWidth, height: 50 }:{},
    allImgSytle: showAllSubText?{ width: 30, height: 30, marginRight: 10,marginTop: 2 }:{}
  }
}

class MyHistory {
  tabPageIndex?:number
  plateIndex = -1
  sectionIndex = -1
  isLoading = false

  async setData(tabRef:Ref<QTITab|undefined>, isLogin=true){
    if(this.isLoading) { return }
    if(this.tabPageIndex!=undefined&&(this.tabPageIndex>=0)){
      this.isLoading = true

      const cIndex = await tabRef.value?.getCurrentTabIndex().catch((err)=>{})
      if(cIndex === this.tabPageIndex){
        const _data = tabRef.value?.getPageItem(this.tabPageIndex, this.plateIndex, this.sectionIndex)
        console.log(_data, '--lsj-_data', this.tabPageIndex, this.plateIndex, this.sectionIndex)
        if(_data){
          const apiList = await api.getContentList({index:0,item:{id:'-'}},{index:0,item:{id:'-'}},1).catch(err=>{})
          if(apiList && apiList.data){
            // _data.apiData01 = apiList.data[0]
            // _data.apiData02 = apiList.data[1]
            // assetLongTitle: string//标题
            // subTitle?:string;
            // newData.apiList = apiList.data?.slice(0,2)
          }
          const newData = getMyHistoryBlock(_data, isLogin)
          tabRef.value?.updateChildNode(this.tabPageIndex, this.plateIndex, this.sectionIndex, newData)
          // tabRef.value?.updatePageItem(this.tabPageIndex, this.plateIndex, this.sectionIndex, newData)
          console.log(newData, '--lsj--data-init')
        }
      }
      
      this.isLoading = false
    }
  }
}
const myHistory = new MyHistory()
export default myHistory