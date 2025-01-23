export interface SearchApi {
  // 获取搜索建议
  getSuggestions(type: 'hot' | 'guess' | 'all', keyword?: string, page?: number, limit?: number): Promise<Suggestions>
  // 获取搜索内容
  getContents(query?: string, page?: number, limit?: number): Promise<Contents>
  // 获取搜索Tabs
  getTabs(query: string): Promise<Tab[]>
  // 获取搜索Tab内容
  getTabContents(query: string, tabId: string, page?: number, limit?: number): Promise<Contents>
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

export interface Tab {
  id: string
  name: string
}

export interface Recommends {
  total: number
  items: Content[]
}

export interface Content {
  id: string
  title: string
  image: string
  score: number
  jumpParams: {
    type: number
    options: object
  }
}
