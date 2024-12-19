import { QTListViewItemDecoration } from '@quicktvui/quicktvui3'

// 一级筛选项
export interface primary {
  type: number
  id: string
  name: string
}

// 二级筛选项
export interface secondary {
  type: number
  id: string
  name: string
}

// 三级筛选项
export interface tertiary {
  type: number
  groupKey: string // 接口筛选参数
  groupName: string // 分组展示名称
  list: listItem[] // 子列表数据
  defaultSelectedPos: number // 默认选中
}

export interface listItem {
  type: number
  id: string
  name: string
}

export interface gridContent {
  type: number
  decoration: QTListViewItemDecoration
  title: string
  cover: string
  jumpParams: any
}
