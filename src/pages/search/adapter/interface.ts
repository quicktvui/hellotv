import { QTWaterfallFlexStyle, QTListViewItemDecoration } from '@quicktvui/quicktvui3'

/**
 * 关键词类型
 */
export enum KeywordType {
  // 标题
  TITLE = 1003,
  // 文本
  TEXT = 2
}

/**
 * 关键词
 */
export interface Keyword {
  type: KeywordType
  text: string
  jumpId?: string
  decoration?: QTListViewItemDecoration
}

export enum TabItemType {
  // 文本
  TEXT = 1
}

/**
 * QTTab组件中Tab子项
 */
export interface TabItem {
  type: TabItemType
  text: string
  titleSize: number
  decoration?: QTListViewItemDecoration
}

export enum ContentType {
  // 横图
  HORIZONTAL = 1,
  // 竖图
  VERTICAL = 2
}

/**
 * 搜索内容
 */
export interface Content {
  _id: string
  type: ContentType
  style: QTWaterfallFlexStyle
  decoration?: QTListViewItemDecoration
  id: string
  title: string
}

export interface SearchApi {
  // 获取搜索建议
  getSuggestions(type: 'hot' | 'guess' | 'all', keyword?: string, page?: number, limit?: number): Promise<Suggestions>
  // 获取搜索内容
  getContents(query?: string, page?: number, limit?: number): Promise<Contents>
  // 后去热门推荐
  getHotRecommends(page?: number, limit?: number): Promise<Recommends>
}

export interface Suggestions {
  // 热门搜索
  hotKeywords: {
    id: string
    keyword: string
  }[]
  // 猜你想搜
  guessKeywords: {
    id: string
    keyword: string
  }[]
}

export interface Contents {
  total: number
  items: Content[]
  recommends?: Content[]
}

export interface Recommends {
  total: number
  items: Content[]
}

export interface Content {
  id: string
  title: string
  cover: string
  description: string
  tags: string
  actors: string
  score: number
  offLine: boolean
  vipType: number
  episodes: number
  episodesId: string
  jumpParams: {
    type: number
    options: object
  }
}
