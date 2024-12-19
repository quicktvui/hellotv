export interface FilterApi {
  // 获取筛选项列表
  getFilters(primaryId: string, secondaryId: string): Promise<Filters>
  // 获取筛选内容
  getContents(query?: string, page?: number, limit?: number): Promise<Contents>
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
      options: Object
    }
  }[]
}
