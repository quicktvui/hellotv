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
