import { QTWaterfallFlexStyle, QTListViewItemDecoration } from '@quicktvui/quicktvui3'

export interface Keyword {
  type: 1 | 2
  text: string
  jumpId?: string
  decoration?: QTListViewItemDecoration
}

export interface TabItem {
  type: number
  text: string
  titleSize: number
  decoration?: QTListViewItemDecoration
}

export interface Content {
  _id: string
  type: number
  style: QTWaterfallFlexStyle
  decoration?: QTListViewItemDecoration
  title: string
}
