import { QTListViewItemDecoration } from '@quicktvui/quicktvui3'

/**
 * 一级筛选项类型
 */
export enum PrimaryType {
  // 文本
  TEXT = 1
}

/**
 * 一级筛选项
 */
export interface Primary {
  type: PrimaryType
  id: string
  name: string
}

/**
 * 二级筛选项类型
 */
export enum SecondaryType {
  // 标题
  TITLE = 1,
  // 两栏筛选项
  FILTER = 2,
  // 三栏筛选项
  FILTER_TITLE = 3,
  // 文本
  TEXT = 9,
  // 横线
  LINE = 10
}

/**
 * 二级筛选项
 */
export interface Secondary {
  type: SecondaryType
  id: string
  name: string
  icon?: {
    normal: string
    focused: string
    selected: string
  }
}

/**
 * 三级筛选项类型
 */
export enum TertiaryType {
  // 列表
  LIST = 1
}

/**
 * 三级筛选项
 */
export interface Tertiary {
  type: TertiaryType
  groupKey: string // 接口筛选参数
  groupName: string // 分组展示名称
  list: ListItem[] // 子列表数据
  defaultSelectedPos: number // 默认选中
}

/**
 * 筛选子列表项类型
 */
export enum ListItemType {
  // 文本
  TEXT = 1
}

/**
 * 三级筛选项子列表项类型
 */
export interface ListItem {
  type: ListItemType
  id: string
  name: string
  sid?: string
}

/**
 * 筛选内容类型
 */
export enum GridContentType {
  // 横图
  HORIZONTAL = 1,
  // 竖图
  VERTICAL = 2
}

/**
 * 筛选内容
 */
export interface GridContent {
  type: GridContentType
  decoration: QTListViewItemDecoration
  id: string
  title: string
  cover: string
  jumpParams: any
}

export interface FilterApi {
  // 获取筛选项列表
  getFilters(primaryId: string, secondaryId: string): Promise<Filters>
  // 获取筛选内容
  getContents(primaryId: string, query?: string, page?: number, limit?: number): Promise<Contents>
}

export interface Filters {
  primary: Tag[] // 一级筛选项
  secondary: Tag[] // 二级筛选项
  tertiary: Tertiary[] // 三级筛选项
}

export interface Tertiary {
  groupKey: string
  groupName: string
  tags: Tag[]
}

export interface Tag {
  id: string
  name: string
}

export interface Contents {
  total: number
  items: {
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
  }[]
}
