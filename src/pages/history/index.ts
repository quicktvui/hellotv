import {
  QTINavBar,
  QTNavBarItemType,
  QTIListView, QTListViewItem, QTPoster, QTGridViewItem
} from '@quicktvui/quicktvui3';
import { IHistoryContentEntity, IHistoryFilterEntity, IHistoryMenuEntity } from '../../api/history/modelEntity';
import configs, { Iconfig, pageWidth } from './config';

export const getMenuList = (menuList: IHistoryMenuEntity[] = []) => {
  return menuList.map((item, index) => {
    return {
      type: item.type, //(index % 3) + 1,
      showName: item.name,
      normalImg: item.img, //'https://img1.baidu.com/it/u=2666955302,2339578501&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=750',
      selectedImg: item.selectedImg, //'http://extcdn.hsrc.tv/data_center/files/2023/11/02/2ba8e63e-c29f-48f8-9955-02229c78ec85.jpg',
      focusedImg: item.focusedImg, //'http://extcdn.hsrc.tv/data_center/files/2024/01/15/bccb38a7-5f1a-4228-9901-91f77a96bbe7.jpg?imageMogr2/interlace/0|imageMogr2/gravity/center/crop/336x198'
      iStyle:{ width: configs.menuWidth-10, height: 106 },
      txtStyle:{ width: 280, height: 106 },
      imgStyle:{ width: 280, height: 86 }
    }
  })
}

export const getFilterList = (data: IHistoryFilterEntity[] = []) => {
  return data.map(item => {
    return {
      type: QTNavBarItemType.QT_NAV_BAR_ITEM_TYPE_TEXT,
      text: item.name,
      titleSize: 20,
      decoration: {
        left: 40,
        right: 20,
      }
    }
  })
}

export const getContentCategoryConfig = (aConfig, data: IHistoryContentEntity): QTPoster => {
  const { width, height, left } = aConfig
  return {
    _key: data.id,
    type: 1001, // data.type ||
    assetTitle: data.h_modeName,//'今天',//i < 10 ? '今天' : (i < 20 ? '一周内' : '更早'),
    decoration: {
      left,
      bottom: 20
    },
    style: {
      width,
      height,
    }
  }
}
const dContentWidth = pageWidth - configs.menuWidth
const dLeft = 20
const dItemTop = 20
const dWidth = 330
const dHeight = 186
const dBottomNum = 10

const dFloatTitleFontSize = 24

const dTitleFontSize = 30
const dTitleHeight = 60
const dTitleMarginTop = 60
const dTitlePaddingLeft = 10

const dDeleteWidth = 176
const dDeleteHeight = 68
const dDeleteSize = 36
const dTitleReactTop = 10
const dTitleReactBottom = 3

const dSubTitleFontSize = 24
const dSubTitleHeight = 50
const dPadding = 0.1
const borderRadius = 16

const getSubTitle = (data: IHistoryContentEntity) => {
  if (!data) return ''
  let subTitle = data.subTitle || ''
  try {
    if (!subTitle && data.playCount) {
      subTitle = data.playCount
      if (!isNaN(Number(data.playCount))) {
        subTitle = `看至第${data.playCount}集`
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
const getContentItemConfig = (aConfig, data: IHistoryContentEntity): QTPoster => {
  const { width, height, left, ratio } = aConfig
  let subTitle = getSubTitle(data)
  let subTitleHeight = 0//aConfig.subTitleHeight||Math.ceil(dSubTitleHeight * ratio)
  let titleReactBottom = 0
  if (subTitle) {
    subTitleHeight = aConfig.subTitleHeight||Math.ceil(dSubTitleHeight * ratio)
    titleReactBottom = dTitleReactBottom
  }
  const styleWidth = width + dPadding * 2
  const mTitleHeight = subTitle?aConfig.titleHeight:aConfig.titleHeight
  const titleBoxHeight = mTitleHeight + dTitleReactTop + titleReactBottom + (subTitle?subTitleHeight:0)
  return {
    _key: data.id,
    id: data.id,
    metaId: data.metaId,
    playCount: data.playCount,
    currentPlayTime: data.currentPlayTime,
    metaType: data.assetType,
    customProp: data.customProp,
    editMode: false,
    type: 10001,
    decoration: {
      left,
      top: dItemTop,
      right: left,
      bottom: dBottomNum
    },
    focus: {
      scale: 1.006,//1.06
      enable: true
    },
    delete: {
      style: {
        width: aConfig.deleteWidth,
        height: aConfig.deleteHeight,
        fontSize: aConfig.deleteSize,
      }
    },
    titleRect: [aConfig.titlePaddingLeft, 0, aConfig.titlePaddingLeft, 0],
    title: {
      text: data.assetLongTitle,
      enable: true,
      style: {
        width, height: mTitleHeight, fontSize: aConfig.titleSize,
        marginTop: dTitleReactTop, marginBottom: titleReactBottom,
      }
    },
    subTitleRect: [aConfig.titlePaddingLeft, 0, aConfig.titlePaddingLeft, 0],
    subTitle: {
      text: subTitle,//`观看至1集 不足1%`,
      enable: !!subTitle,
      style: {
        width,
        height: subTitle?subTitleHeight:0,
        fontSize: aConfig.subTitleSize,
      }
    },
    floatTitle: {
      text: data.description1 || '',
      enable: !!data.description1,
      style: {
        width,
        height: aConfig.titleHeight,
        paddingLeft: aConfig.titlePaddingLeft,
        fontSize: aConfig.floatTitleSize,
      },
      background: { colors: ['#e5000000', '#00000000'], cornerRadii4: [0, 0, 16, 16], orientation: 4 }
    },
    shimmer: {
      enable: true,
    },
    ripple: {
      enable: true,
      style: {
        right: 0,
        bottom: 0,
        marginRight: -12,
      }
    },
    image: {
      src: data.assetLongCoverH,
      enable: true,
      style: {
        width,
        height,
        marginLeft: dPadding,
        marginTop: dPadding
      }
    },
    style: {
      width: styleWidth,
      height: height + titleBoxHeight + dPadding
    },
    focusStyleBg: {
      width: styleWidth, height: height + titleBoxHeight-borderRadius+5,
    },
    focusStyleBgBorder: {
      width: styleWidth+2, height: height + titleBoxHeight-borderRadius+7
    },
    focusTitle: {
      text: data.assetLongTitle,
      enable: true,
      style: {
        width, height: mTitleHeight
      }
    },
    titleStyle:{
      width: styleWidth, height: titleBoxHeight,
      marginTop: height+dPadding+1
    },
    titleFocusStyle:{
      width: styleWidth, height: titleBoxHeight,
      marginTop: height-borderRadius+dPadding+1
    }
  }
}


export function getTodayTime() {
  return new Date(new Date().toLocaleDateString()).getTime();
}
export function getLastSevenDayTime() {
  const start = new Date(new Date().toLocaleDateString());
  start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
  return start.getTime();
}
const dateTypes = { today: getTodayTime(), sevenDay: getLastSevenDayTime(), todayNum: 0, sevenDayNum: 0, moreNum: 0 }
const getDateType = (timeStr: string = '') => {
  if (!timeStr) return
  if ((Number(new Date(timeStr))) >= (Number(dateTypes.today))) {
    if (dateTypes.todayNum > 0) return ''
    dateTypes.todayNum++
    return '今天'
  } else if ((Number(new Date(timeStr))) >= (Number(dateTypes.sevenDay))) {
    if (dateTypes.sevenDayNum > 0) return ''
    dateTypes.sevenDayNum++
    return '近一周'
  } else {
    if (dateTypes.moreNum > 0 || dateTypes.todayNum == 0 || dateTypes.sevenDayNum == 0) return ''
    dateTypes.moreNum++
    return '更早'
  }
}
export const getContentList = (dataList: IHistoryContentEntity[] = [], contentWidth: number = dContentWidth, options: Iconfig, isEdit = false) => {
  const left = options.contentSpace && options.contentSpace > 0 ? options.contentSpace : dLeft
  const width = Math.floor((contentWidth - (30+40)) / options.contentColumn) - (left * 2);
  const ratio = width / dWidth

  const height = options.contentItemHeight || Math.min(Math.floor(dHeight * ratio), 350)

  const titleHeight = options.contentTitleHeight || Math.ceil(dTitleHeight * ratio)
  // const rows = Math.ceil(dataList.length / options.contentColumn)
  let titleSize = options.contentTitleSize || Math.ceil(dTitleFontSize * ratio)
  let floatTitleSize = Math.ceil(dFloatTitleFontSize * ratio)
  let subTitleSize = options.contentSubTitleSize || Math.ceil(dSubTitleFontSize * ratio)
  let titleMarginTop = Math.ceil(dTitleMarginTop * ratio)
  let titlePaddingLeft = Math.ceil(dTitlePaddingLeft * ratio)
  const deleteHeight = Math.ceil(dDeleteHeight * ratio)
  const deleteWidth = Math.ceil(dDeleteWidth * ratio)
  const deleteSize = Math.ceil(dDeleteSize * ratio)

  const configOption = {
    width, height, left, titleSize, floatTitleSize, subTitleSize, titleHeight, titleMarginTop, titlePaddingLeft,
    deleteHeight, deleteWidth, deleteSize, ratio, subTitleHeight:options.contentSubTitleHeight
  }

  dateTypes.moreNum = 0;
  dateTypes.todayNum = 0
  dateTypes.sevenDayNum = 0
  const isDateType = !!dataList[0]?.playTime
  const arr: Array<QTGridViewItem> = []

  // const drowsHeight = height + titleHeight + dBottomNum + dItemTop + dPadding*2
  let drowsHeight = 0
  let dataHeight = 0//rows * rowsHeight
  let rowsHeight = 0

  for (let i = 0; i < dataList.length; i++) {
    const dataItem = dataList[i]
    if (isDateType) {
      const typeName = getDateType(dataItem.playTime)
      if (typeName) {
        arr.push(getContentCategoryConfig(configOption, { ...dataItem, h_modeName: typeName }))
      }
    }
    const isCategory = !!dataItem.h_modeName//i % 10 === 0;
    let poster: QTPoster|null = null
    if (isCategory) {
      poster = getContentCategoryConfig(configOption, dataItem)
    } else {
      poster = getContentItemConfig(configOption, dataItem)
    }
    poster.editMode = isEdit
    arr.push(poster)

    if(!drowsHeight&&poster){
      drowsHeight = (poster.decoration?.top||0) + (poster.decoration?.bottom||0) + (poster.style.height||0)
    }

    if(i === 0 || (i % options.contentColumn == 1)){
      rowsHeight = drowsHeight
    }
    if(poster.subTitle?.style?.height && rowsHeight == drowsHeight){
      rowsHeight += poster.subTitle.style.height
    }
    if (i % options.contentColumn == 0) {// || i == dataList.length - 1
      dataHeight += rowsHeight
    }
  }
  return { arr, dataHeight, rowsHeight }
}

// 对象深度合并
export const hw_deepMergeObj = (...objects) => {
  const result = {};
  for (const obj of objects) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          // 如果值是对象，则递归合并
          result[key] = hw_deepMergeObj(result[key] || {}, obj[key]);
        } else {
          // 如果值不是对象，直接赋值
          result[key] = obj[key];
        }
      }
    }
  }
  return result;
}

