import { QTListViewItemDecoration } from '@quicktvui/quicktvui3'

export enum ContentType {
  // 横图
  HORIZONTAL = 1,
  // 竖图
  VERTICAL = 2,
  // 到底提示
  End = 1003
}

export interface Content {
  type: ContentType
  itemSize: number
  id: string
  title?: string
  progress?: string
  image?: string
  showDeleteCover?: boolean
  decoration?: QTListViewItemDecoration
}
