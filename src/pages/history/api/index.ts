import { replacePlaceholders } from '../../../tools/common'
import { HistoryApi, Records } from './interface'
import { DelHistoryRecordsUrl, historyRecordsUrl } from './request-url'
import requestManager from '../../../tools/request'

class HistoryManager implements HistoryApi {
  // 获取历史/收藏列表
  getRecords(deviceId: string, type: 'history' | 'favorite', page?: number, limit?: number): Promise<Records> {
    return requestManager.get(
      replacePlaceholders(historyRecordsUrl, {
        deviceId,
        type,
        page,
        limit
      })
    )
  }
  // 删除/清空历史、收藏记录
  delRecords(deviceId: string, type: 'history' | 'favorite', recordId?: string): Promise<any> {
    return requestManager.delete(
      replacePlaceholders(DelHistoryRecordsUrl, {
        deviceId,
        type,
        recordId
      })
    )
  }
}

const historyManager = new HistoryManager()
export default historyManager
