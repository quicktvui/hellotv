import {
  QTITab,QTWaterfallItem,QTWaterfallSectionType
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
const getTitleSpan = (data: any) => {
  if (!data) return {text:'',spanAttr:[]}
  // <font color="#909398" size='12'>title</font>
  let assetLongTitle = data.assetLongTitle || ''
  let playCount = ''
  if(data.playCount){
    if (!isNaN(Number(data.playCount))) {
      playCount = ` 第${data.playCount}集`
    }else{
      playCount = ` ${data.playCount}`
    }
  }
  const title = assetLongTitle+"  "+playCount
  const startPos = title.indexOf(playCount)
  let posterLength = assetLongTitle ? assetLongTitle.length : 0;
  let titleLength = title ? title.length : 0;
  let titleStyle0 = {text:title,
    spanAttr:[
      { type:"size", value:[30,0, posterLength]},
      { type:"size", value:[20,startPos,titleLength]},
      {type:"color",value:["#ffffff",0,posterLength]},
      {type:"color",value:["#909398",startPos,titleLength]}
    ]}
  return titleStyle0
}
const getTitle = (data: any) => {
  if (!data) return ''
  // <font color="#92949A">title</font>
  let assetLongTitle = data.assetLongTitle || ''
  try {
    if(data.playCount){
      if (!isNaN(Number(data.playCount))) {
        assetLongTitle += ` 第${data.playCount}集`
      }else{
        assetLongTitle += ` ${data.playCount}`
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
  let apiData01TitleSpan:any = {text:'', spanAttr:[]}
  let apiData01SubTitle = ''
  let apiData02Title = ''
  let apiData02TitleSpan:any = {text:'', spanAttr:[]}
  let apiData02SubTitle = ''
  let num = 1
  if(showApiData01){ 
    num+=1
    apiData01Title = getTitle(data.apiData01)
    apiData01TitleSpan = getTitleSpan(data.apiData01)
    apiData01SubTitle = getSubTitle2(data.apiData01)
  }
  if(showApiData02){ 
    num+=1
    apiData02Title = getTitle(data.apiData02)
    apiData02TitleSpan = getTitleSpan(data.apiData02)
    apiData02SubTitle = getSubTitle2(data.apiData02)
  }
  const allTextStyle = {
    width: (data.style.width||0),
    paddingLeft: space, paddingRight: space,
    height: Math.max(Math.floor((data.style.height||0)/num),50)
  }
  const barStyle = {
    ...allTextStyle, height: showApiData01?Math.min(allTextStyle.height,80):0
  }
  const barStyle2 = {
    ...allTextStyle, height: showApiData02?Math.min(allTextStyle.height,80):0
  }
  const innerWidth = barStyle.width-space*2
  const innerHeight = barStyle.height-2;
  
  let allText = '历史记录'
  let allSubText = ''
  let showAllSubText = false

  const floatHeight = 50
  const floatTitleBoxStyleHeight = floatHeight*2
  const barImgStyle = data.image.style||{}
  const floatTitleBoxStyle = {
    width: allTextStyle.width, paddingLeft: space,
    height: floatTitleBoxStyleHeight,
    marginTop: (data.style.height||0)-floatTitleBoxStyleHeight
  }
  const floatTitleStyle = {width: innerWidth,height:floatHeight}
  const floatSubTitleStyle = {width: innerWidth,height:floatHeight}
  
  if(isLogin){
    if(num === 1){
      allSubText = '无历史记录，快去观看视频吧~'
      showAllSubText = true
      barImgStyle.height = 0
    }else{
      allText = '全部历史'
    }
  } else {
    barImgStyle.height = 0
    if(num === 1){
      allSubText = '登录同步云端历史'
      showAllSubText = true
    }else{
      allText = '登录同步云端历史'
    }
  }
  
  return {
    ...data,
    myHisGradientBackground: { colors: ['#FF3A4578', '#FF1B2143'], cornerRadii4: [20, 20, 20, 20], orientation: 6 },
    barImg: data.apiData01?.assetLongCoverH,
    barStyle,allTextStyle,barStyle2, isShowBarImg: isLogin&&showApiData01,
    barImgStyle,floatTitleBoxStyle, floatTitleStyle, floatSubTitleStyle, isLogin,
    floatTitleText: data.apiData01?.assetLongTitle || '', floatSubTitleText: getSubTitle(data.apiData01),
    floatTitleBackground: { colors: ['#e5000000', '#00000000'], cornerRadii4: [0, 0, 20, 20], orientation: 4 },
    barImgEmptyTitleStyle: {
      width: innerWidth, paddingLeft: space,
      height: data.style.height,
    },
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
    apiData01Title, apiData01SubTitle, apiData01TitleSpan, apiData02TitleSpan,
    apiData02Title, apiData02SubTitle,
    showAllSubText,
    allSubTextSytle: showAllSubText?{ width: innerWidth, height: 50 }:{},
    allImgSytle: showAllSubText?{ width: 30, height: 30, marginRight: 10,marginTop: 2 }:{},
    allImgRowSytle: !showAllSubText?{ width: 25, height: 22,marginTop: 2 }:{},
    hisAllTitleBoxStyle: {
      width: innerWidth
    }
  }
}

class MyHistory {
  tabPageIndex?:number
  plateIndex = -1
  sectionIndex = -1
  isLoading = false
  myHistoryApiData01Name = 'myHistoryApiData01Name'
  myHistoryApiData02Name = 'myHistoryApiData02Name'
  myHistoryApiAllName = 'myHistoryApiAllName'

  checkName(name=''){
    return name === this.myHistoryApiData01Name||name === this.myHistoryApiData02Name||name === this.myHistoryApiAllName 
  }
  getRouter(name = ''){
    if(name === this.myHistoryApiData01Name){}
    if(name === this.myHistoryApiData02Name){}
    if(name === this.myHistoryApiAllName){}
    return {
      redirectType: '1',
      innerArgs: JSON.stringify({url: 'history', params: {}})
    }
  }
  async setData(tabRef:Ref<QTITab|undefined>, isLogin=true){
    if(this.isLoading) { return }
    if(this.tabPageIndex!=undefined&&(this.tabPageIndex>=0)){
      this.isLoading = true

      const cIndex = await tabRef.value?.getCurrentTabIndex().catch((err)=>{})
      if(cIndex === this.tabPageIndex){
        const _data = tabRef.value?.getPageItem(this.tabPageIndex, this.plateIndex, this.sectionIndex)
        if(_data){
          const apiList = await api.getContentList({index:0,item:{id:'-'}},{index:0,item:{id:'-'}},1).catch(err=>{})
          if(apiList && apiList.data){
            _data.apiData01 = apiList.data[0]
            _data.apiData02 = apiList.data[1]
            // assetLongTitle: string//标题
            // subTitle?:string;
            // newData.apiList = apiList.data?.slice(0,2)
          }
          const newData = getMyHistoryBlock(_data, isLogin)
          newData.myHistoryApiData01Name = this.myHistoryApiData01Name
          newData.myHistoryApiData02Name = this.myHistoryApiData02Name
          newData.myHistoryApiAllName = this.myHistoryApiAllName
          // tabRef.value?.updateChildNode(this.tabPageIndex, this.plateIndex, this.sectionIndex, newData)
          tabRef.value?.updatePageItem(this.tabPageIndex, this.plateIndex, this.sectionIndex, newData)

          const sectionData = tabRef.value?.getPageSection(this.tabPageIndex, this.plateIndex)
          if(sectionData?.type === QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_LIST){
            // 一行滚动板块需要更新整个板块
            const sectionData = tabRef.value?.getPageSection(this.tabPageIndex, this.plateIndex)
            if(sectionData){
              tabRef.value?.updatePageSection(this.tabPageIndex, this.plateIndex, sectionData)
            }
          }
          // console.log(newData, '--lsj--data-init',this.tabPageIndex, this.plateIndex, this.sectionIndex)
        }
      }
      
      this.isLoading = false
    }
  }
}
const myHistory = new MyHistory()
export default myHistory