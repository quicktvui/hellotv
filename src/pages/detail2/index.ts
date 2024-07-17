import type {
  QTWaterfallSection, QTWaterfallItem
} from "@quicktvui/quicktvui3";
import { QTWaterfallSectionType, QTWaterfallItemType } from "@quicktvui/quicktvui3";
import type { IselectionPoster, IselectionBaseSection, IselectionSection } from '../../api/details2/types'

export const D2SelectionsSectionTypes = {
  selection: 1
}

const sWaterfallWidth = 1920
const sWaterfallHeight = 470
const dPosterImgWidth = 307
const dPosterImgHeight = 175
const dPosterRight = 48
const dPosterTitleSize = 24
const dPosterSubTitleSize = 18

const dSectionSpace = 96
const dSectionTitleSize = 42
const dSectionTitleBottom = 30

export const getSelectionPoster = (sData:IselectionPoster) => {
  
  const posterRight = dPosterRight
  const imgWidth = sData._config?.imgWidth||dPosterImgWidth
  const imgHeight = sData._config?.imgHeight||dPosterImgHeight

  const titleSize = dPosterTitleSize
  const subTitleSize = dPosterSubTitleSize
  const titleW = imgWidth
  const titleH = sData.title ? titleSize*2 + 10 : 0
  const subTitleW = imgWidth
  const subTitleH = sData.subTitle ? subTitleSize*2 + 10 : 0

  const posterWidth = imgWidth
  const posterHeight = imgHeight + titleH + subTitleH
  return {
    _router: sData._router,
    _id: sData.id, type: sData._type||QTWaterfallItemType.QT_WATERFALL_ITEM_TYPE_POSTER,
    focus: { enable: true, scale: 1.1, border: true },
    decoration: {
      left: 0, top: 0,
      right: posterRight, bottom: 0
    },
    style: {
      width: posterWidth, height: posterHeight,
    },
    image: {
      src: sData.poster, enable: true,
      style: {
        width: imgWidth, height: imgHeight,
      }
    },
    title: {
      text: sData.title,
      enable: !!sData.title,
      style: {
        width: titleW, height: titleH,
        marginBottom: 0, marginTop: imgHeight,
        fontSize: titleSize
      }
    },
    subTitle: {
      text: sData.subTitle,
      enable: !!sData.subTitle,
      style: {
        width: subTitleW, height: subTitleH,
        fontSize: subTitleSize,
        marginTop: imgHeight+titleH,
      }
    },
    floatTitle: {
      text: '',
      enable: false,
      style: {},
    },
    shimmer: {
      enable: false,
    },
    ripple: {
      enable: false,
      style: {}
    },
    corner: {
      text: '',
      enable: false,
      style: {},
      background: {}
    },
    titleStyle: { },
    titleFocusStyle: { }
  }
}

export const selectionTypes = {
  selection: 1, more: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_LIST
}
export const ids = {
  selection: 'selection'
}
export const getSelectionSection = (data:IselectionSection):QTWaterfallSection => {
  const space = data._config?.space || dSectionSpace
  const titleSize = dSectionTitleSize
  const titleBottom = dSectionTitleBottom
  return {
    _id: ids.selection+data.id, type: selectionTypes.selection,
    title: data.title,
    titleStyle: {
      width: 1000,
      height: data.title?titleSize+10:0,
      fontSize: data.title?titleSize:0,
      marginBottom: data.title?titleBottom:0
    },
    decoration: { top: 1, left: space, right:1 },
    style: { width: sWaterfallWidth - space, height: -1, },
    itemList: [],
    tabList: data.tabList
  }
}
export const getSelectionMoreSection = (data:IselectionBaseSection):QTWaterfallSection => {
  const space = data._config?.space || dSectionSpace
  const titleSize = dSectionTitleSize
  const titleBottom = dSectionTitleBottom
  return {
    _id: ids.selection+data.id, type: selectionTypes.more,
    title: data.title,
    titleStyle: {
      width: 1000,
      height: data.title?titleSize+10:0,
      fontSize: data.title?titleSize:0,
      marginBottom: data.title?titleBottom:0
    },
    decoration: { top: 30, left: space, right: 1 },
    style: { width: sWaterfallWidth - space, height: 330, },
    itemList: data.itemList
  }
}

export type TposterType = ReturnType<typeof getSelectionPoster>;