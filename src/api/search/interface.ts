export interface SearchApi {
  // 获取搜索建议
  getSuggestions(type: 'hot' | 'guess' | 'all'): Promise<Suggestions>
  // 获取搜索内容
  getContents(query?: string, page?: number, limit?: number): Promise<Contents>
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
