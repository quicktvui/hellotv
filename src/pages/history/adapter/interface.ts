import { QTListViewItemDecoration } from '@quicktvui/quicktvui3'

export enum ContentType {
  // 常规
  Normal = 1,
  // 到底提示
  End = 1002
}

export interface Content {
  type: ContentType
  itemSize: number
  title?: string
  progress?: string
  image?: string
  decoration?: QTListViewItemDecoration
}
