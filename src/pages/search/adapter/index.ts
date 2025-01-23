import { QTTab, QTTabPageData, QTWaterfallSection, QTWaterfallSectionType } from '@quicktvui/quicktvui3'
import { Suggestions, Contents, Tab, Recommends } from '../api/interface'
import { Keyword, KeywordType, TabItemType, ContentType } from './interface'
import config from '../config'

/**
 * 构造关键词列表数据
 * @param rawData 原始数据
 * @param mode 数据模式, hot 热门搜索、guess 猜你想搜、all 返回所有
 * @returns
 */
export const buildKeywords = function (rawData: Suggestions, mode: 'hot' | 'guess' | 'all'): Keyword[] {
  const keywords: Keyword[] = []

  switch (mode) {
    case 'hot':
      rawData.hotKeywords.forEach((item) => {
        keywords.push({ type: KeywordType.TEXT, text: item.keyword })
      })
      break
    case 'guess':
      rawData.guessKeywords.forEach((item) => {
        keywords.push({ type: KeywordType.TEXT, text: item.keyword })
      })
      break
    case 'all':
      keywords.push({ type: KeywordType.TITLE, text: '猜你想搜' })
      rawData.guessKeywords.forEach((item) => {
        keywords.push({ type: KeywordType.TEXT, text: item.keyword, jumpId: item.id })
      })

      keywords.push({ type: KeywordType.TITLE, text: '热门搜索', decoration: { top: 40 } })
      rawData.hotKeywords.forEach((item) => {
        keywords.push({ type: KeywordType.TEXT, text: item.keyword, jumpId: item.id })
      })
      break
  }

  return keywords
}

/**
 * 构造QTTab组件Tab默认列表
 * @param rawData 原始数据
 * @returns
 */
export const buildTab = function (rawData?: Tab[]): QTTab {
  return {
    defaultIndex: 0,
    defaultFocusIndex: -1,
    itemList:
      rawData && rawData.length > 1
        ? rawData.map((item, index) => ({
            type: TabItemType.TEXT,
            text: item.name,
            titleSize: 36,
            decoration: { left: index === 0 ? 56 : 0 }
          }))
        : [{ type: TabItemType.TEXT, text: '全部', titleSize: 36, decoration: { left: 62 } }]
  }
}

/**
 * 构造搜索结果板块数据
 * @param rawData 原始数据
 * @returns
 */
export const buildContents = function (rawData: Contents): QTWaterfallSection[] {
  const contents: QTWaterfallSection[] = []

  // 常规板块
  if (rawData.items.length > 0) {
    contents.push({
      _id: 't1',
      type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_FLEX,
      style: { width: 1920 },
      decoration: { left: 80, top: 40 },
      title: '',
      itemList: rawData.items.map((item, index) => ({
        _id: `t1-${index}`,
        type: ContentType.HORIZONTAL,
        style: { width: 410, height: 276 },
        decoration: { right: 40, bottom: 40 },
        id: item.id,
        title: item.title,
        cover: item.image
      }))
    })
  }

  // 相关推荐
  contents.push({
    _id: 't2',
    type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_FLEX,
    style: { width: 1920 },
    decoration: { left: 80, top: contents.length === 1 ? 0 : 75, bottom: 40 },
    title: '大家都在搜',
    titleStyle: { height: 50, fontSize: 40 },
    itemList: rawData.recommends!.map((item, index) => ({
      _id: `t2-${index}`,
      type: ContentType.VERTICAL,
      style: { width: 260, height: 414 },
      decoration: { top: 40, right: 40 },
      id: item.id,
      title: item.title,
      cover: item.image
    }))
  })

  // 到底提示
  contents.push(buildEndSection())

  return contents
}

/**
 * 构建两栏布局Tab页面数据
 * @param rawData 原始数据
 * @param curPage 当前页码
 * @returns
 */
export const buildTabContents = function (rawData: Contents, curPage: number): QTTabPageData {
  const tabPage: QTTabPageData = {
    data: [],
    stopping: false
  }

  if (rawData.items.length > 0) {
    const section = {
      _id: 's' + Math.random(),
      type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_FLEX,
      style: { width: 1920 },
      decoration: { left: 80, top: curPage === 1 ? 160 : 0 },
      title: '',
      itemList: rawData.items.map((item, index) => ({
        _id: `ss-${index}`,
        type: ContentType.HORIZONTAL,
        style: { width: 410, height: 276 },
        decoration: { right: 40, bottom: 40 },
        id: item.id,
        title: item.title,
        cover: item.image
      }))
    }

    const itemLen = section.itemList.length
    if (itemLen) {
      tabPage.data = [section]
      // 条件一: 仅一页
      // 条件二: 有多页, 但当前是最后一页
      if (curPage === 1 && itemLen < config.gridContentsLimit) {
        tabPage.stopping = true
        // 返回数据大于一屏展示个数
        if (itemLen > 8) tabPage.data.push(buildEndSection())
      } else if (curPage > 1 && itemLen < config.gridContentsLimit) {
        tabPage.stopPaging = true
        tabPage.data.push(buildEndSection())
      }
    } else if (curPage > 0) {
      // 非首次搜索时, 组件会返回页码加一, 搜索结果刚好跟分页大小一致
      tabPage.stopPaging = true
      // 第二页开始才添加结束标志
      if (curPage > 2) tabPage.data.push(buildEndSection())
    }
  }

  return tabPage
}

/**
 * 构造推荐内容板块数据
 * @param rawData 原始数据
 * @returns
 */
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
        type: ContentType.VERTICAL,
        style: { width: 260, height: 414 },
        decoration: { top: 40, right: 40 },
        id: item.id,
        title: item.title,
        cover: item.image
      }))
    })
  }

  return contents
}

/**
 * 构建到底提示板块
 * @returns
 */
export const buildEndSection = function (): QTWaterfallSection {
  return {
    _id: 'e1',
    type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_END,
    style: { width: 1920, height: 100 },
    decoration: { bottom: 40 },
    title: '已经到底啦，按【返回键】回到顶部',
    titleStyle: { fontSize: 28 },
    itemList: []
  }
}
