export interface HistoryApi {
  // 获取历史/收藏列表
  getRecords(deviceId: string, type: 'history' | 'favorite', page?: number, limit?: number): Promise<Records>
  // 删除/清空历史、收藏记录
  delRecords(deviceId: string, type: 'history' | 'favorite', recordId?: string): Promise<any>
}

export interface Records {
  total: number
  items: {
    id: string
    title: string
    coverH: string
    coverV: string
    episodeId: string
    episode: number
    totalDuration: number
    viewedDuration: number
    jumpParams: {
      type: number
      options: object
    }
  }[]
}
