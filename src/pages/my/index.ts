import {
  QTPoster, QTWaterfallItem,
  QTWaterfallSection,
  QTWaterfallSectionType, QTITab
} from '@quicktvui/quicktvui3';
import { Ref } from 'vue'
import myApi from '../../api/my/index';

export const activity_redirectTypes = {
  innerRouter: 1,//跳转到当前app内部页面
  innerApp: 0//跳转到内部其他app
}

const dcornerGradientBg = { colors: ['#FFE398', '#EEB364'], cornerRadii4: [0, 8, 0, 8], orientation: 2, }

export const posterTypes = {
  poster: 1, card: 2, info: 3, user: 4
}
export interface IBlockItemData {
  id: string
  img?: string//图片
  title?: string//标题
  subTitle?: string;//副标题，有副标题时取副标题，无副标题时取播放进度 playCount+currentPlayTime/allTime
  floatTitle?: string;//浮动标题
  corner?: string;//角标
  cornerGradientBg?: typeof dcornerGradientBg;//角标背景色
  score?: string;//评分
  cornerNum?:number;

  currentPlayTime?: number//当前播放时间-毫秒
  allTime?: number//视频总时间-毫秒
  playCount?: string//播放到第几集
  playTime?: string //播放时间(时间戳或2024-03-28 20:43:42格式字符串)

  gradientBb?: typeof dcornerGradientBg;//背景色-渐变色
  _router?: { //当前app内部路由地址
    url: string; params?: object,
    isReplace?:boolean//是否替换当前页 
  }
  _action?: string; // 内部其他app地址
  _redirectType?: number;//跳转类型，取值见activity_redirectTypes
  _layout?: { x?: number; y?: number; width?: number; height?: number };
  [k: string]: any
}
interface Ioptions { //Partial
  posterWidth?: number;
  posterHeight?: number;
  imgWidth?: number;
  imgHeight?: number;
  posterBottom?: number;
  space?: number;
  posterType?: number;
  posterTitleHeight?: number;
  posterSubTitleHeight?: number;
  titleFontSize?: number,
  subTitleFontSize?: number;
  iconWidth?: number;
  iconHeight?: number
}
interface IblockOptions {
  blockTitleFontSize?: number;
  columns?: number;
  space?: number;
  posterBottom?: number;
  posterType?: number;
}
interface IBlockData {
  id: string;
  title?: string;
  list: IBlockItemData[];
  options?: IblockOptions
}

const dWidth = 408
const dHeight = 228
const whRatio = dHeight / dWidth
const dPosterBottom = 30
const dPosterTitleHeight = 30
const dPosterSubTitleHeight = 25
const dTitleFontSize = 30
const dFloatTitleFontSize = 24
const dSubTitleFontSize = 24
const dSpace = 36
const dBlockTitleFontSize = 44
const dPadding = 1
const dColumns = 4
const dIconWidth = 80
const dIconHeight = 80
const dPosterType = posterTypes.poster
export const dPageWidth = 1920
export const dPageheight = 1080
export const dPageMarginSpace = 90 // 页面两端间距
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
export const getPosterConfig = (data: IBlockItemData, options: IblockOptions={}): QTPoster => {
  const space = options.space || dSpace
  const contentWidth = dPageWidth - dPageMarginSpace - (dPageMarginSpace - space)

  const subTitle = getSubTitle(data)
  const columns = options?.columns || dColumns

  let posterWidth = data._layout?.width || 0
  let posterHeight = data._layout?.height || 0
  if (!posterWidth) {
    posterWidth = Math.floor(contentWidth / columns) - space
  }
  if (!posterHeight) {
    posterHeight = posterWidth * whRatio
  }
  const imgWidth = posterWidth - (dPadding * 2)
  const imgHeight = posterHeight
  posterHeight += dPadding * 2

  const ratio = imgWidth / dWidth
  const titleFontSize = data._titleFontSize || (dTitleFontSize  * ratio)
  const subTitleFontSize = data._subTitleFontSize || (dSubTitleFontSize * ratio)
  const posterTitleHeight = titleFontSize + 20
  const posterSubTitleHeight = subTitleFontSize + 20
  const iconWidth = dIconWidth * ratio;
  const iconHeight = dIconHeight * ratio
  const posterType = options.posterType || data.posterType || dPosterType
  if (posterType === posterTypes.poster) {
    if (data.title) {
      posterHeight += posterTitleHeight
    }
    if (subTitle) {
      posterHeight += posterSubTitleHeight
    }
  }

  const titleboxHeight = (data.title ? posterTitleHeight : 0) + (subTitle ? posterSubTitleHeight : 0)
  const cornerNum = data.cornerNum&&data.cornerNum>0?(data.cornerNum>99?99+'+':data.cornerNum+''):'0'
  return {
    _id: data._sectionItemId || data.id,
    _router: data._router,
    _action: data._action,
    _redirectType: data._redirectType || activity_redirectTypes.innerRouter,
    cornerNum, _isShowCornerNum: cornerNum !== '0',
    _isCornerNum: data.cornerNum ? true : false,
    focus: { enable: true, scale: 1.001, border: false, },
    type: posterType || posterTypes.poster,//10001
    editMode: false,
    decoration: {
      left: 0,
      right: space,
      bottom: options?.posterBottom || dPosterBottom,
    },
    style: {
      width: posterWidth,
      height: posterHeight,
    },
    innerStyle: {
      width: imgWidth,
      height: posterHeight - (dPadding * 2),
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
      text: data.corner || '',
      enable: !!data.corner,
      style: {
        width: imgWidth,
      },
      background: data.cornerGradientBg || dcornerGradientBg,
    },
    score: {
      text: data.score || '',
      enable: !!data.score,
      style: {
        width: imgWidth,
        height: 30
      },
    },
    title: {
      text: data.title || '',
      enable: !!data.title,
      style: {
        width: imgWidth,
        height: data.title ? posterTitleHeight : 0,
        fontSize: titleFontSize
      }
    },
    focusTitle: {
      text: data._focusTitle || data.title || '',
      enable: !!(data._focusTitle || data.title)
    },
    titleBoxStyle: {
      width: posterWidth,
      height: titleboxHeight,
      marginTop: imgHeight
    },
    titleFocuseBoxStyle: {
      width: posterWidth,
      height: titleboxHeight,
      marginTop: imgHeight - 20
    },
    bgStyle: {
      width: posterWidth,
      height: posterHeight - 20,
    },
    titleEllipsizeMode: 3,
    titleLines: 1,
    subTitle: {
      text: subTitle || '',
      enable: !!subTitle,
      style: {
        width: imgWidth,
        height: subTitle ? posterSubTitleHeight : 0,
        fontSize: subTitleFontSize
      },
    },
    floatTitle: {
      text: data.floatTitle || '',
      enable: !!data.floatTitle,
      style: {
        width: imgWidth,
      },
    },
    infoStyle: {
      width: imgWidth * (data._infoWidthRatio || 0.6)
    },
    icon: {
      style: {
        width: iconWidth, height: iconHeight
      }
    }
  }
}
export interface ImySectionRes {
  section: QTWaterfallSection;
  options?: IblockOptions
}
export const getMysection = (data: IBlockData, sectionType: number = QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_FLEX): ImySectionRes => {
  const space = data.options?.space || dSpace
  const contentWidth = dPageWidth - dPageMarginSpace - (dPageMarginSpace - space)
  const itemList = data.list.map((item, index) => {
    return getPosterConfig({ ...item, _sectionItemId: data.id + item.id + index }, data.options)
  })
  const blockTitleFontSize = data.options?.blockTitleFontSize || dBlockTitleFontSize
  const section: QTWaterfallSection = {
    _id: data.id,
    type: sectionType,//QT_WATERFALL_SECTION_TYPE_FLEX
    title: data.title || '',
    titleStyle: {
      marginTop: 0,
      marginBottom: data.title ? 20 : 1,
      fontSize: blockTitleFontSize,
      height: data.title ? blockTitleFontSize : 1,
      width: 1000,
    },
    //3.构造section中item列表数据
    itemList,
    style: {
      width: contentWidth,
      height: -1,
    },
    decoration: {
      left: dPageMarginSpace,
      // right: dPageMarginSpace-space,
      top: 15,
      bottom: 5
    }
  }
  return { section, options: data.options }
}

import recordIcon from '../../assets/my/record.png'
export const transHistorySection = (isLogin = false, historyRes: ImySectionRes) => {
  historyRes.section.itemList = historyRes.section.itemList.slice(0, 3)
  historyRes.section.itemList.push(getPosterConfig({
    id: historyRes.section._id || '' + historyRes.section.itemList.length,
    _router: { url: 'history' },
    _redirectType: activity_redirectTypes.innerRouter,
    img: recordIcon,
    title: isLogin ? '全部记录' : '登陆同步云端历史',
    _layout: { width: 401, height: 228 }
  }, {
    space: historyRes.options?.space,
    posterType: posterTypes.info
  }))
  return historyRes.section
}
export const transMoreSectin = (isLogin = false, sections: ImySectionRes[]) => {
  return sections.map(item => {
    return item.section
  })
}

import dAvatar from '../../assets/ic_header_login_normal.png'
export const transOrderSection = (isLogin = false, orederRes: ImySectionRes) => {
  orederRes.section.itemList.unshift(getPosterConfig({
    id: orederRes.section._id || '' + orederRes.section.itemList.length,
    img: dAvatar, title: '登录同步云端记录', subTitle: '登陆',
    _layout: { width: 556, height: 230 },
    _router: { url: 'home', isReplace: true },
  }, {
    posterType: posterTypes.user,
    space: orederRes.options?.space
  }))

  return orederRes.section
}

class MyDataManager {
  tabPageIndex?:number

  async getData(){
    const orderRes = await myApi.getOrderInfo()
    const historyRes = await myApi.getHistorys()
    const moreRes = await myApi.getMoreList()
    return [
      transOrderSection(false, orderRes),
      transHistorySection(false, historyRes),
      ...transMoreSectin(false, moreRes)
    ]
  }
  setData(tabRef:Ref<QTITab|undefined>){
    if(this.tabPageIndex){
      tabRef.value?.getCurrentTabIndex().then(cIndex=>{
        if(cIndex === this.tabPageIndex){
          // tabRef.value?.updatePageData(this.tabPageIndex, {})
          console.log(this.tabPageIndex, '--lsj--MyDataManager-setData')
        }
      })
    }
  }
}
const myDataManager = new MyDataManager()
export default myDataManager