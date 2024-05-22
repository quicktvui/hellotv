import {
  QTPoster, QTWaterfallItem,
	QTWaterfallSection,
	QTWaterfallSectionType,
} from '@quicktvui/quicktvui3';
export const activity_redirectTypes = {
  innerRouter: 1,//跳转到当前app内部页面
  innerApp: 0//跳转到内部其他app
}

const dcornerGradientBg = { colors: ['#FFE398', '#EEB364'], cornerRadii4: [0, 8, 0, 8], orientation: 2, }

export const posterTypes = {
  poster: 1, card: 2, info: 3
}
export interface IBlockItemData {
  id:string
  img?:string//图片
  title?:string//标题
  subTitle?:string;//副标题，有副标题时取副标题，无副标题时取播放进度 playCount+currentPlayTime/allTime
  floatTitle?:string;//浮动标题
  corner?:string;//角标
  cornerGradientBg?: typeof dcornerGradientBg;//角标背景色
  score?:string;//评分
  
  currentPlayTime?: number//当前播放时间-毫秒
  allTime?: number//视频总时间-毫秒
  playCount?: string//播放到第几集
  playTime?: string //播放时间(时间戳或2024-03-28 20:43:42格式字符串)
  
  gradientBb?:typeof dcornerGradientBg;//背景色-渐变色
  _router?: { url:string; params?: object }//当前app内部路由地址
  _action?: string; // 内部其他app地址
  _redirectType?: number;//跳转类型，取值见activity_redirectTypes
  _layout?: {x?:number; y?:number; width?:number; height?:number};
  [k:string]:any
}
interface Ioptions { //Partial
  posterWidth?:number;
  posterHeight?:number;
  imgWidth?:number;
  imgHeight?:number;
  posterBottom?:number;
  space?:number;
  posterType?:number;
  posterTitleHeight?:number;
  posterSubTitleHeight?:number;
  titleFontSize?:number,
  subTitleFontSize?:number;
  infoWidth?:number;
}
interface IblockOptions {
  blockTitleFontSize?:number;
  columns?:number;
  space?:number;
  posterBottom?:number;
  posterType?:number;
}
interface IBlockData {
  id:string;
  title?: string;
  list: IBlockItemData[];
  options?: IblockOptions
}

const dWidth = 408
const dHeight = 228
const whRatio = dHeight/dWidth
const dPosterBottom = 30
const dPosterTitleHeight = 30
const dPosterSubTitleHeight = 25
const dTitleFontSize = 30
const dFloatTitleFontSize = 24
const dSubTitleFontSize = 24
const dSpace = 30
const dBlockTitleFontSize = 44
const dPadding = 1
const dColumns = 4
export const dPageWidth = 1920
export const dPageMarginSpace = 100
const getSubTitle = (data: IBlockItemData) => {
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
export const getPosterConfig = (data: IBlockItemData, options:Ioptions): QTPoster => {
  const { 
    posterWidth=0, posterHeight=0, imgWidth=0, imgHeight=0,
    posterBottom = dPosterBottom,space = dSpace,
    posterTitleHeight = dPosterTitleHeight,
    posterSubTitleHeight = dPosterSubTitleHeight,
    titleFontSize = dTitleFontSize,
    subTitleFontSize = dSubTitleFontSize
  } = options
  const titleboxHeight = (data.title?posterTitleHeight:0) + (data.subTitle?posterSubTitleHeight:0)
  return {
    _id: data._sectionItemId||data.id,
    _router: data._router,
    _action: data._action,
    _redirectType: data._redirectType,
    focus: { enable: true, scale: 1.001, border: false, },
    type: options.posterType||posterTypes.poster,//10001
    editMode: false,
    decoration: {
      left: 0,
      right: space,
      bottom: posterBottom,
    },
    style:{
      width: posterWidth,
      height: posterHeight,
    },
    innerStyle: {
      width: imgWidth,
      height: posterHeight-(dPadding*2),
      marginLeft: dPadding,
      marginTop: dPadding
    },
    image: {
      src: data.img,
      enable: !!data.img,
      style: {
        width: imgWidth,
        height: imgHeight
      },
    },
    corner: {
      text: data.corner||'',
      enable: !!data.corner,
      style: {
        width: imgWidth,
      },
      background: data.cornerGradientBg||dcornerGradientBg,
    },
    score: {
      text: data.score||'',
      enable: !!data.score,
      style: {
        width: imgWidth,
        height: 30
      },
    },
    title: {
      text: data.title||'',
      enable: !!data.title,
      style: {
        width: imgWidth,
        height: data.title?posterTitleHeight:0,
        fontSize: titleFontSize
      }
    },
    focusTitle: {
      text: data._focusTitle||data.title||'',
      enable: !!(data._focusTitle||data.title)
    },
    titleBoxStyle: {
      width: posterWidth,
      height: titleboxHeight,
      marginTop: imgHeight
    },
    titleFocuseBoxStyle:{
      width: posterWidth,
      height: titleboxHeight,
      marginTop: imgHeight - 20
    },
    bgStyle:{
      width: posterWidth,
      height: posterHeight - 20,
    },
    titleEllipsizeMode: 3,
    titleLines: 1,
    subTitle: {
      text: data.subTitle||'',
      enable: !!data.subTitle,
      style: {
        width: imgWidth,
        height: data.subTitle?posterSubTitleHeight:0,
        fontSize: subTitleFontSize
      },
    },
    floatTitle: {
      text: data.floatTitle||'',
      enable: !!data.floatTitle,
      style: {
        width: imgWidth,
      },
    },
    infoStyle: {
      width: options.infoWidth || imgWidth * 0.6
    }
  }
}
export interface ImySectionRes {
  section:QTWaterfallSection
}
export const getMysection = (data:IBlockData, sectionType:number = QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_FLEX):ImySectionRes => {
  const space = data.options?.space || dSpace
  const contentWidth = dPageWidth - dPageMarginSpace - (dPageMarginSpace-space)
  const itemList = data.list.map((item,index)=>{
    const subTitle = getSubTitle(item)
    const columns = data.options?.columns || dColumns

    let posterWidth = item._layout?.width||0
    let posterHeight = item._layout?.height||0
    if(!posterWidth){
      posterWidth = Math.floor(contentWidth / columns)
    }
    posterWidth -= space
    if(!posterHeight){
      posterHeight = posterWidth * whRatio
    }
    const imgWidth = posterWidth - (dPadding*2)
    const imgHeight = posterHeight
    posterHeight += dPadding*2
    
    const ratio = imgWidth / dWidth
    const titleFontSize = (item._titleFontSize||dTitleFontSize) * ratio
    const subTitleFontSize = (item._subTitleFontSize||dSubTitleFontSize) * ratio
    const posterTitleHeight = titleFontSize + 20
    const posterSubTitleHeight = subTitleFontSize + 20
    

    if(item.title){
      posterHeight += posterTitleHeight
    }
    if(subTitle){
      posterHeight += posterSubTitleHeight
    }

    return getPosterConfig({...item, subTitle, _sectionItemId: data.id+item.id+index}, {
      posterWidth, posterHeight,
      imgWidth, imgHeight,
      posterBottom: data.options?.posterBottom||dPosterBottom,
      space, posterType: data.options?.posterType||item.posterType,
      posterTitleHeight, posterSubTitleHeight,
      titleFontSize,subTitleFontSize
    })
  })
  const blockTitleFontSize = data.options?.blockTitleFontSize||dBlockTitleFontSize
  const section:QTWaterfallSection = {
    _id: data.id,
    type: sectionType,//QT_WATERFALL_SECTION_TYPE_FLEX
    title: data.title||'',
    titleStyle: {
      marginTop: 0,
      marginBottom: data.title ? 20 : 1,
      fontSize: blockTitleFontSize,
      height: data.title?blockTitleFontSize:1,
      width: 1000,
    },
    //3.构造section中item列表数据
    itemList,
    style: {
      width: contentWidth,
      // height: blockHeight,
    },
    decoration: {
      left: dPageMarginSpace,
      // right: dPageMarginSpace-space,
      top: 0
    }
  }
  return { section }
}

import recordIcon from '../../assets/record.png'
export const transHistorySection = (isLogin=false, historySection:QTWaterfallSection) => {
  historySection.itemList = historySection.itemList.slice(0,3)
  const historyListItem = historySection.itemList[0];
  const posterTitleHeight = historyListItem.title.style.height||0;
  const posterSubTitleHeight = historyListItem.subTitle.style.height||0;
  const posterHeight = historyListItem.style.height || 0
  historySection.itemList.push(getPosterConfig({
    id: historyListItem._id||'' + 1,
    _router: { url: 'history' },
    _redirectType: activity_redirectTypes.innerRouter,
    img: recordIcon,
    title: isLogin?'全部记录':'登陆同步云端历史'
  },{
    posterWidth: historyListItem.style.width,
    posterHeight: posterHeight - posterTitleHeight - posterSubTitleHeight,
    imgWidth: historyListItem.image.style.width,
    imgHeight:historyListItem.image.style.height,
    posterBottom: historyListItem.decoration?.bottom,
    space: historyListItem.decoration?.right,
    posterType: posterTypes.info,
    posterTitleHeight,posterSubTitleHeight,
    titleFontSize:historyListItem.title.style.fontSize,
    subTitleFontSize:historyListItem.subTitle.style.fontSize,
  }))
  return historySection
}