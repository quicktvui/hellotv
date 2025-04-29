export interface Item {
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

  // 内部私有
  _timestamp: number
  _type?: 'history' | 'favorite'
  _action?: 'add' | 'del'
  _delOptions?: { platformId: string; metaId: string; assetLongId: string }
}

export interface Records {
  total: number
  items: Item[]
}

export interface HistoryApi {
  // 获取历史/收藏列表
  getRecords(deviceId: string, type: 'history' | 'favorite', page?: number, limit?: number): Promise<Records>
  // 删除/清空历史、收藏记录
  delRecords(deviceId: string, type: 'history' | 'favorite', recordId?: string): Promise<any>
}
