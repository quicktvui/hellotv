import { QTTab, QTWaterfallSection, QTWaterfallSectionType } from '@quicktvui/quicktvui3'
import { Suggestions, Contents, Recommends } from '../../../api/search/interface'
import { Keyword } from './interface'

export const buildKeywords = function (rawData: Suggestions): Keyword[] {
  const keywords: Keyword[] = []

  // 热门搜索
  if (rawData.hotKeywords.length > 0) {
    keywords.push({ type: 1, text: '热门搜索', decoration: { bottom: 12 } })
    rawData.hotKeywords.forEach((item) => {
      keywords.push({ type: 2, text: item.keyword })
    })
  }

  // 猜你想搜
  if (rawData.guessKeywords.length > 0) {
    keywords.push({ type: 1, text: '猜你想搜', decoration: { bottom: 12 } })
    rawData.guessKeywords.forEach((item) => {
      keywords.push({ type: 2, text: item.keyword })
    })
  }

  return keywords
}

export const buildTab = function (): QTTab {
  return {
    defaultIndex: 0,
    defaultFocusIndex: -1,
    itemList: [
      { type: 1, text: '全部', titleSize: 36, decoration: { left: 62 } }
      // { type: 1, text: '电视剧', titleSize: 36 },
      // { type: 1, text: '综艺', titleSize: 36 },
      // { type: 1, text: '动漫', titleSize: 36 },
      // { type: 1, text: '纪录片', titleSize: 36 }
    ]
  }
}

export const buildContents = function (rawData: Contents): QTWaterfallSection[] {
  const contents: QTWaterfallSection[] = []

  // 常规板块
  if (rawData.items.length > 0) {
    contents.push({
      _id: 't1',
      type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_FLEX,
      style: { width: 1920 },
      decoration: { left: 80, top: 40 },
      title: '绘本',
      titleStyle: { height: 50, fontSize: 40 },
      itemList: rawData.items.map((item, index) => ({
        _id: `t1-${index}`,
        type: 1,
        style: { width: 410, height: 276 },
        decoration: { top: 40, right: 40 },
        title: item.title,
        cover: item.cover
      }))
    })
  }

  // 相关推荐
  contents.push({
    _id: 't2',
    type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_FLEX,
    style: { width: 1920 },
    decoration: { left: 80, top: 40, bottom: 40 },
    title: '大家都在搜',
    titleStyle: { height: 50, fontSize: 40 },
    itemList: rawData.recommends!.map((item, index) => ({
      _id: `t2-${index}`,
      type: 2,
      style: { width: 260, height: 414 },
      decoration: { top: 40, right: 40 },
      title: item.title,
      cover: item.cover
    }))
  })

  return contents
}

export const buildRecommends = function (rawData: Recommends): QTWaterfallSection[] {
  const contents: QTWaterfallSection[] = []

  // 常规板块
  if (rawData.items.length > 0) {
    contents.push({
      _id: 'r1',
      type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_FLEX,
      style: { width: 1920 },
      decoration: { left: 80, bottom: 40 },
      title: '',
      itemList: rawData.items.map((item, index) => ({
        _id: `r1-${index}`,
        type: 2,
        style: { width: 260, height: 414 },
        decoration: { top: 40, right: 40 },
        title: item.title,
        cover: item.cover
      }))
    })
  }

  return contents
}
