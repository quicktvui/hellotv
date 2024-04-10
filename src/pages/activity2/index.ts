import {
  QTPoster, QTWaterfallItem,
	QTWaterfallSection,
	QTWaterfallSectionType,
} from '@quicktvui/quicktvui3';
import { IActivityConfig, IActivityTopBtnConfig, topModes } from '../../api/activity2/types'
import { config } from '../../api/activity2/config'

export const getBgColor = (bColor?:string|object)=>{
  if(!bColor) return false
  return (typeof bColor === 'string') ? {colors:[bColor,bColor],cornerRadius:0} : bColor
}
export const dConfig = {
  bgColor: getBgColor(config.bgColor) || {colors:['#2F3541','#252930'],cornerRadius:0},
  bgImg: config.bgImg, //|| 'https://up.deskcity.org/pic_source/28/73/cd/2873cd9dc91fa720a498b043aebd4509.jpg',
  top: {
    mode: 'left-right',
    title: '页面标题',//海底冒险小剧场季卡
    titleStyle: {
      color: '#ffffff', fontSize: '50px'
    },
    btnListWidth: 330
  },
  banner: {
    // img: 'https://up.deskcity.org/pic_source/28/73/cd/2873cd9dc91fa720a498b043aebd4509.jpg',
    // style: { height: '600px' }
  },
  block: {
    title: '板块标题',
    pStyle:{ marginBottom: '100px' },
    pTitleStyle: { fontSize: '36px', color: '#ffffff' }
  }
}

let dImgURL = 'https://img1.baidu.com/it/u=2666955302,2339578501&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750';
const dSpace = 35//poster间距
const dBlackSpace = 90//板块间距
const dBlackItemWidth = 260
const dBlackItemHeight = 320
const dPosterTitleHeight = 50
const dPosterSubTitleHeight = 30
const dPosterBottom = 20
const dPosterHeight = dBlackItemHeight +dPosterTitleHeight+dPosterSubTitleHeight
const dBlockTitleBottom = 30
const dBlockTitleFontSize = 36
const dBlockTitleDecorationTop = 50
export const dBlockWidth = 1920
export const dBlockHeight = 960

interface Ioptions { //Partial
  space?:number
  posterBottom?:number
  blackItemWidth?:number
  posterHeight?:number
  blackItemHeight?:number
  posterTitleHeight?:number
  posterSubTitleHeight?:number
  columns?:number
}
export interface IBlockItemData {
  id:string
  img?:string
  title?:string
  subTitle?:string
  floatTitle?:string
  corner?:string
  score?:string
  focusTitle?:string
  _router?: {
    name:string
    params?: object
  }
  [k:string]:any
}
export const getPosterItemList =(data: IBlockItemData, options:Ioptions = {}):QTWaterfallItem =>{
  let { 
    space = dSpace, 
    posterBottom = dPosterBottom, 
    blackItemWidth = dBlackItemWidth, 
    posterHeight = dPosterHeight, 
    blackItemHeight = dBlackItemHeight, 
    posterTitleHeight = dPosterTitleHeight, 
    posterSubTitleHeight = dPosterSubTitleHeight
  } = options
  if(!data.title){
    posterHeight -= posterTitleHeight
  }
  if(!data.subTitle){
    posterHeight -= posterSubTitleHeight
  }

  return {
    _id: data._sectionItemId,
    _router: data._router,
    focus: {
      enable: true,
      scale: 1.002,
      border: false,
    },
    type: 1,//10001
    decoration: {
      left: 0,
      right: space,
      bottom: posterBottom,
    },
    style: {
      width: blackItemWidth,
      height: posterHeight,
    },
    image: {
      src: dImgURL,
      enable: true,
      style: {
        width: blackItemWidth,
        height: blackItemHeight,
      },
    },
    corner: {
      text: data.corner,
      enable: !!data.corner,
      style: {
        width: blackItemWidth,
      },
      background: { colors: ['#FE3824', '#F0051E'], cornerRadii4: [0, 8, 0, 8], orientation: 2, },
    },
    score: {
      text: data.score,
      enable: !!data.score,
      style: {
        width: blackItemWidth,
        height: 30,
      },
    },
    title: {
      text: data.title,
      enable: !!data.title,
      style: {
        width: blackItemWidth,
        height: posterTitleHeight
      },
    },
    // subTitle: {
    //   text: '副标题',
    //   enable: true,
    //   style: {
    //     width: blackItemWidth,
    //     height: posterSubTitleHeight
    //   },
    // },
    floatTitle: {
      text: data.floatTitle,
      enable: !!data.floatTitle,
      style: {
        width: blackItemWidth,
      },
    },
    titleStyle: {
      width: blackItemWidth,
      marginTop: blackItemHeight - 60,
    },
    focusTitle: {
      text: data.focusTitle||data.title,
      enable: !!(data.focusTitle||data.title)
    },
    titleFocusStyle: {
      width: blackItemWidth,
      marginTop: blackItemHeight - 100
    }
  };
}
interface IBlockData {
  id:string;
  title?: string;
  list: IBlockItemData[]
}
interface IblockOptions extends Ioptions {
  decorationLeft?:number
  blockTitleFontSize?:number
  blockTitleBottom?:number
  blockTitleDecorationTop?:number
}

export interface IacTivity2GetFlexBlockRes {
  section:QTWaterfallSection
  blockHeight:number
}
export const getFlexBlock = (data:IBlockData, options:IblockOptions = {}, sectionType:number = QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_FLEX):IacTivity2GetFlexBlockRes => {
  let { 
    blackItemWidth = dBlackItemWidth, columns = 0, space = dSpace, blackItemHeight = dBlackItemHeight,
    posterTitleHeight = dPosterTitleHeight, posterSubTitleHeight = dPosterSubTitleHeight,
    blockTitleBottom = dBlockTitleBottom, blockTitleFontSize = dBlockTitleFontSize,
    blockTitleDecorationTop = dBlockTitleDecorationTop
  } = options
  const leftSpace = options.decorationLeft || dBlackSpace
  const rightSpace = dBlackSpace - space
  const contentWidth = dBlockWidth - leftSpace - rightSpace - (space * columns)
  if(columns){
    blackItemWidth = Math.floor(contentWidth / columns)
  }
  if(!data.title){
    blockTitleBottom = 0
    blockTitleFontSize = 0
  }
  // const ratio = Math.ceil(dBlackItemWidth / dBlackItemWidth)
  const posterHeight = blackItemHeight + posterTitleHeight + posterSubTitleHeight
  const blockHeight = posterHeight * data.list.length + blockTitleBottom + blockTitleFontSize + blockTitleDecorationTop

  const section = {
    _id: data.id,
    type: sectionType,//QT_WATERFALL_SECTION_TYPE_FLEX
    title: data.title||'',
    titleStyle: {
      // marginTop: 10,
      marginBottom: blockTitleBottom,
      fontSize: blockTitleFontSize,
    },
    //3.构造section中item列表数据
    itemList: data.list.map((item,index)=>{
      return getPosterItemList({ ...item, _sectionItemId: data.id+item.id+index}, {
        ...options,
        blackItemWidth,
        posterHeight
      })
    }),
    style: {
      width: dBlockWidth - leftSpace - rightSpace,
      height: -1,
    },
    decoration: {
      left: leftSpace,
      right: rightSpace,
      top: blockTitleDecorationTop
    }
  }
  return { section, blockHeight }
}
export const endSection: QTWaterfallSection = {
  _id: 'end-100',
  type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_END,
  title: '已经到底啦，按【返回键】回到顶部',
  titleStyle: {
    width: 1920,
    height: 200,
    marginLeft: 90,
    marginTop: 40,
    marginBottom: 40,
    fontSize: 50
  },
  itemList: [],
  style: {
    width: 1920,
    height: 200,
  },
}
export const emptySection: QTWaterfallSection = {
  _id: 'empty-100',
  type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_END,
  // title: 'end',
  titleStyle: {},
  itemList: [],
  style: { width: 1920, height: 200, },
}
export const getBlockList = (arr:IacTivity2GetFlexBlockRes[] = []) => {
  // 一年级数英同步课堂下册 剑桥英语 一年级语文强化课程
  let waterfallHeight = 0
  let sectionList: Array<QTWaterfallSection> = arr.map(item=>{
    waterfallHeight += item.blockHeight
    return item.section
  })
  if(waterfallHeight < dBlockHeight){
    sectionList.push(emptySection)
  }else{
    sectionList.push(endSection)
  }
  return { sectionList, waterfallHeight }
}

export const getActivityTopBtn = (options:IActivityTopBtnConfig) => {
  return { 
    type: options.type || 2, //1 带图标，2不带图标
    decoration:{ left: 20 }, text: options.text,
    background: {colors: options.background || ['#30000000','#30000000'],cornerRadius:25}, 
    focusedBackground: {colors: options.focusedBackground || ['#ffffff','#ffffff'],cornerRadius:25},
    icon: options.icon, focusIcon: options.focusIcon, 
    textColor: options.textColor || '#ffffff', textFocusColor: options.textFocusColor || '#333333'
  }
}