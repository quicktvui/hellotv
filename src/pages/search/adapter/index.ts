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
export const buildKeywords = function (rawData: Suggestions, mode: 'hot' | 'guess' | 'all', pageNo?: number): Keyword[] {
  const keywords: Keyword[] = []

  switch (mode) {
    case 'hot':
      const colorMap = {
        0: ['#F33628', '#F33628'],
        1: ['#FC5E1B', '#FC5E1B'],
        2: ['#FECB04', '#FECB04']
      }

      rawData.hotKeywords.forEach((item, index) => {
        const colors = (pageNo === 1 && colorMap[index]) || ['#80FFFFFF', '#80FFFFFF']

        keywords.push({
          type: KeywordType.TEXT,
          text: item.keyword,
          flexStyle: { marginLeft: 106 },
          gradientBackground: {
            colors: colors,
            cornerRadius: 50
          }
        })
      })
      break
    case 'guess':
      rawData.guessKeywords.forEach((item) => {
        keywords.push({ type: KeywordType.TEXT, text: item.keyword, flexStyle: { marginLeft: 80 } })
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
      decoration: { left: 80, top: curPage === 1 ? 200 : 0 },
      title: '',
      itemList: rawData.items.map((item, index) => ({
        _id: `ss-${index}`,
        type: ContentType.HORIZONTAL,
        style: { width: 410, height: 276 },
        decoration: { right: 40, bottom: 40 },
        id: item.id,
        title: item.title,
        cover: item.image,
        score: item.score.toFixed(1),
        showRating: true
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
 * 构建搜索内容板块
 * @param rawData 接口数据
 * @param spanCount 每行展示个数, 也是每个板块Item个数, 优化页面速度, 将每行展示个数设为一个板块
 * @returns
 */
export const buildContentSections = function (rawData: Contents, spanCount: number): QTWaterfallSection[] {
  return Array.from({ length: Math.ceil(rawData.items.length / spanCount) }, (_, i) => ({
    type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_FLEX,
    style: { width: 1920 },
    decoration: { left: 80 },
    title: '',
    itemList: rawData.items.slice(i * spanCount, (i + 1) * spanCount).map((item) => ({
      type: ContentType.HORIZONTAL,
      style: { width: 410, height: 276 },
      decoration: { right: 40, top: 40 },
      title: item.title,
      cover: item.image,
      score: item.score.toFixed(1),
      showRating: true
    }))
  }))
}

/**
 * 构建搜索推荐板块
 * @param rawData 接口数据
 * @param spanCount 每行展示个数, 也是每个板块Item个数
 * @param isShowTitle 是否展示板块标题
 * @param isShowTips 是否展示搜索提示词
 * @returns
 */
export const buildRecommendSections = function (
  rawData: Recommends,
  spanCount: number,
  isShowTitle: boolean,
  isShowTips: boolean
): QTWaterfallSection[] {
  // i 定位是否为第一个板块
  return Array.from({ length: Math.ceil(rawData.items.length / spanCount) }, (_, i) => ({
    type: QTWaterfallSectionType.QT_WATERFALL_SECTION_TYPE_FLEX,
    style: { width: 1920 },
    decoration: { left: 80, top: !isShowTips && isShowTitle && i === 0 ? 65 : isShowTitle && isShowTips && i === 0 ? 40 : 0, bottom: 40 }, // 页面第一板块为推荐第一板块时, 顶部间距为65; 推荐第一板块为非页面第一个板块时, 顶部间距为40; 其余板块, 顶部间距为0
    title: isShowTitle && i === 0 ? '大家都在搜' : '',
    titleStyle: i === 0 ? { height: 50, fontSize: 40 } : {},
    titleTypeface: 'bold',
    itemList: rawData.items.slice(i * spanCount, (i + 1) * spanCount).map((item) => ({
      type: ContentType.VERTICAL,
      style: { width: 260, height: 414 },
      decoration: { right: 40, top: (!isShowTitle && i === 0) || i > 0 ? 0 : 40 }, // 第一个板块且不展示标题、或者不是第一个板块时, 顶部间距为0；第一个板块且展示标题时, 顶部间距为40
      id: item.id,
      title: item.title,
      cover: item.image,
      score: item.score.toFixed(1),
      showRating: true
    }))
  }))
}

/**
 * 构建加载中板块
 * @returns
 */
export const buildLoadingSection = function (): QTWaterfallSection {
  return {
    type: -10008,
    style: { width: 1920, height: 100 },
    decoration: { top: 20, bottom: 20 },
    title: '',
    itemList: []
  }
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
    decoration: { top: 20, bottom: 40 },
    title: '已经到底啦，按【返回键】回到顶部',
    titleStyle: { fontSize: 28 },
    itemList: []
  }
}
